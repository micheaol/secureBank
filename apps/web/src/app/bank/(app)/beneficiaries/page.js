"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useGetMyBeneficiariesQuery,
  useAddBeneficiaryMutation,
  useRemoveBeneficiaryMutation,
} from "@/lib/redux/beneficiariesApi";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { ApiErrorBanner } from "@/components/ui/ApiErrorBanner";

const addBeneficiaryFormSchema = z.object({
  accountName: z.string().trim().min(2, "Enter the account holder's name."),
  accountNumber: z.string().trim().regex(/^\d{10}$/, "Enter a valid 10-digit account number."),
  bankName: z.string().trim().min(2, "Enter the bank name."),
  nickname: z.string().trim().optional(),
});

export default function BeneficiariesPage() {
  const { data: beneficiaries, isLoading } = useGetMyBeneficiariesQuery();
  const [addBeneficiary, { isLoading: isAdding, error: addError }] = useAddBeneficiaryMutation();
  const [removeBeneficiary] = useRemoveBeneficiaryMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(addBeneficiaryFormSchema) });

  async function onSubmitAddBeneficiaryForm(beneficiaryDetails) {
    await addBeneficiary(beneficiaryDetails).unwrap();
    reset();
  }

  return (
    <div className="py-8">
      <h1 className="text-[34px]">Beneficiaries</h1>
      <p className="mt-2 max-w-[58ch] text-[15px] text-neutral-700">
        Save the people and businesses you pay often so transfers are faster next time.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          {isLoading ? (
            <p className="text-[15px] text-neutral-700">Loading beneficiaries...</p>
          ) : beneficiaries && beneficiaries.length > 0 ? (
            <div className="divide-y divide-divider">
              {beneficiaries.map((beneficiary) => (
                <div key={beneficiary.id} className="flex items-center justify-between py-[11px]">
                  <div>
                    <p className="text-[17px]">{beneficiary.nickname || beneficiary.accountName}</p>
                    <p className="font-mono text-[12px] text-neutral-700">{beneficiary.accountNumber}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[13px] text-neutral-700">{beneficiary.bankName}</span>
                    <Button variant="ghost" destructive onClick={() => removeBeneficiary(beneficiary.id)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[15px] text-neutral-700">You haven&apos;t added any beneficiaries yet.</p>
          )}
        </div>

        <Card>
          <p className="font-heading text-[11px] uppercase tracking-[0.12em] text-neutral-600">Add a beneficiary</p>
          <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit(onSubmitAddBeneficiaryForm)} noValidate>
            <ApiErrorBanner error={addError} />

            <FormField label="Nickname (optional)" htmlFor="nickname">
              <Input id="nickname" {...register("nickname")} />
            </FormField>
            <FormField label="Account name" htmlFor="accountName" error={errors.accountName?.message}>
              <Input id="accountName" {...register("accountName")} />
            </FormField>
            <FormField label="Account number" htmlFor="accountNumber" error={errors.accountNumber?.message}>
              <Input id="accountNumber" {...register("accountNumber")} />
            </FormField>
            <FormField label="Bank name" htmlFor="bankName" error={errors.bankName?.message}>
              <Input id="bankName" {...register("bankName")} />
            </FormField>

            <Button type="submit" className="w-full py-3" disabled={isAdding}>
              {isAdding ? "Adding..." : "Add beneficiary"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
