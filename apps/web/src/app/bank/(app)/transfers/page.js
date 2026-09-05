"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetMyAccountsQuery } from "@/lib/redux/accountsApi";
import { useGetMyBeneficiariesQuery } from "@/lib/redux/beneficiariesApi";
import { useInitiateTransferMutation, useConfirmTransferMutation } from "@/lib/redux/transfersApi";
import { TransferStepIndicator } from "@/components/bank/TransferStepIndicator";
import { RecipientStep } from "@/components/bank/transfer/RecipientStep";
import { AmountStep } from "@/components/bank/transfer/AmountStep";
import { ReviewStep } from "@/components/bank/transfer/ReviewStep";
import { AuthorizeStep } from "@/components/bank/transfer/AuthorizeStep";
import { SuccessStep } from "@/components/bank/transfer/SuccessStep";

function describeAccount(account) {
  return `${account.accountType === "CURRENT" ? "Current" : "Savings"} · ${account.accountNumber}`;
}

export default function TransferPage() {
  const router = useRouter();
  const { data: accounts = [] } = useGetMyAccountsQuery();
  const { data: beneficiaries = [] } = useGetMyBeneficiariesQuery();
  const [initiateTransfer, { isLoading: isInitiating, error: initiateError }] = useInitiateTransferMutation();
  const [confirmTransfer, { isLoading: isConfirming, error: confirmError }] = useConfirmTransferMutation();

  const [step, setStep] = useState(1);
  const [recipient, setRecipient] = useState(null);
  const [sourceAccountId, setSourceAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [pendingTransfer, setPendingTransfer] = useState(null);
  const [otp, setOtp] = useState("");
  const [completedTransfer, setCompletedTransfer] = useState(null);

  const availableSourceAccounts = useMemo(
    () => accounts.filter((account) => !(recipient?.type === "account" && account.id === recipient.id)),
    [accounts, recipient]
  );

  function handleSelectBeneficiary(beneficiary) {
    setRecipient({
      type: "beneficiary",
      id: beneficiary.id,
      displayName: beneficiary.nickname || beneficiary.accountName,
      displayDetail: `${beneficiary.accountNumber} · ${beneficiary.bankName}`,
    });
    setSourceAccountId(accounts.find((account) => account.accountType === "CURRENT")?.id ?? accounts[0]?.id ?? "");
    setStep(2);
  }

  function handleSelectAccount(account) {
    setRecipient({
      type: "account",
      id: account.id,
      displayName: describeAccount(account),
      displayDetail: account.accountNumber,
    });
    setSourceAccountId(accounts.find((candidate) => candidate.id !== account.id)?.id ?? "");
    setStep(2);
  }

  const sourceAccount = accounts.find((account) => account.id === sourceAccountId);
  const fee = recipient?.type === "beneficiary" ? 26.88 : 0;

  async function handleAuthorize() {
    const transferPayload = {
      sourceAccountId,
      amount: Number(amount),
      description: description || undefined,
      ...(recipient.type === "account"
        ? { destinationAccountId: recipient.id }
        : { beneficiaryId: recipient.id }),
    };

    const result = await initiateTransfer(transferPayload).unwrap();
    setPendingTransfer(result);
    setStep(4);
  }

  async function handleConfirm() {
    const result = await confirmTransfer({ transferId: pendingTransfer.id, otpCode: otp }).unwrap();
    setCompletedTransfer(result);
    setStep(5);
  }

  function resetWizard() {
    setStep(1);
    setRecipient(null);
    setSourceAccountId("");
    setAmount("");
    setDescription("");
    setPendingTransfer(null);
    setOtp("");
    setCompletedTransfer(null);
  }

  return (
    <div className="mx-auto max-w-[620px] py-8">
      <h1 className="text-[34px]">Send money</h1>
      <div className="mt-6">
        <TransferStepIndicator currentStep={step} />
      </div>

      <div className="mt-8">
        {step === 1 && (
          <RecipientStep
            beneficiaries={beneficiaries}
            otherOwnAccounts={accounts}
            onSelectBeneficiary={handleSelectBeneficiary}
            onSelectAccount={handleSelectAccount}
            onAddBeneficiary={() => router.push("/bank/beneficiaries")}
          />
        )}

        {step === 2 && recipient && (
          <AmountStep
            recipientLabel={recipient.displayName}
            accounts={availableSourceAccounts}
            sourceAccountId={sourceAccountId}
            onChangeSourceAccountId={setSourceAccountId}
            amount={amount}
            onChangeAmount={setAmount}
            description={description}
            onChangeDescription={setDescription}
            onContinue={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && recipient && sourceAccount && (
          <ReviewStep
            recipientLabel={recipient.displayName}
            recipientDetail={recipient.displayDetail}
            fee={fee}
            amount={Number(amount)}
            description={description}
            sourceAccountLabel={describeAccount(sourceAccount)}
            onAuthorize={handleAuthorize}
            onBack={() => setStep(2)}
            isSubmitting={isInitiating}
            error={initiateError}
          />
        )}

        {step === 4 && pendingTransfer && (
          <AuthorizeStep
            otp={otp}
            onChangeOtp={setOtp}
            onConfirm={handleConfirm}
            onBack={() => setStep(3)}
            isConfirming={isConfirming}
            error={confirmError}
          />
        )}

        {step === 5 && completedTransfer && recipient && (
          <SuccessStep
            transfer={completedTransfer}
            recipientLabel={recipient.displayName}
            onDone={() => router.push("/bank/dashboard")}
            onSendAnother={resetWizard}
          />
        )}
      </div>
    </div>
  );
}
