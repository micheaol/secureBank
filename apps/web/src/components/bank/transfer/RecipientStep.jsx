import { Button } from "../../ui/Button";

export function RecipientStep({ beneficiaries, otherOwnAccounts, onSelectBeneficiary, onSelectAccount, onAddBeneficiary }) {
  return (
    <div>
      {otherOwnAccounts.length > 0 ? (
        <>
          <p className="font-heading text-[11px] uppercase tracking-[0.12em] text-neutral-600">
            Between your accounts
          </p>
          <div className="mt-2 divide-y divide-divider">
            {otherOwnAccounts.map((account) => (
              <button
                key={account.id}
                type="button"
                onClick={() => onSelectAccount(account)}
                className="flex w-full items-center justify-between py-[11px] text-left hover:bg-neutral-200"
              >
                <span className="text-[17px]">{account.accountType === "CURRENT" ? "Current account" : "Savings account"}</span>
                <span className="font-mono text-[12px] text-neutral-700">{account.accountNumber}</span>
              </button>
            ))}
          </div>
        </>
      ) : null}

      <p className="mt-8 font-heading text-[11px] uppercase tracking-[0.12em] text-neutral-600">Beneficiaries</p>
      {beneficiaries.length > 0 ? (
        <div className="mt-2 divide-y divide-divider">
          {beneficiaries.map((beneficiary) => (
            <button
              key={beneficiary.id}
              type="button"
              onClick={() => onSelectBeneficiary(beneficiary)}
              className="flex w-full items-center justify-between py-[11px] text-left hover:bg-neutral-200"
            >
              <span className="text-[17px]">{beneficiary.nickname || beneficiary.accountName}</span>
              <span className="font-mono text-[12px] text-neutral-700">{beneficiary.accountNumber}</span>
              <span className="text-[13px] text-neutral-700">{beneficiary.bankName}</span>
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-[15px] text-neutral-700">No saved beneficiaries yet.</p>
      )}

      <Button variant="ghost" className="mt-6" onClick={onAddBeneficiary}>
        Add a new beneficiary
      </Button>
    </div>
  );
}
