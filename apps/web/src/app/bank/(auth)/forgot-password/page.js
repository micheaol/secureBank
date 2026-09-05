"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordFormSchema } from "@/lib/validation/authSchemas";
import { useRequestPasswordResetMutation } from "@/lib/redux/authApi";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { ApiErrorBanner } from "@/components/ui/ApiErrorBanner";

export default function BankForgotPasswordPage() {
  const [confirmationMessage, setConfirmationMessage] = useState(null);
  const [requestPasswordReset, { isLoading, error }] = useRequestPasswordResetMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotPasswordFormSchema) });

  async function onSubmitForgotPasswordForm(emailDetails) {
    const result = await requestPasswordReset(emailDetails).unwrap();
    setConfirmationMessage(result.message);
  }

  return (
    <div className="mx-auto max-w-[480px]">
      <Card>
        <p className="font-heading text-[11px] uppercase tracking-[0.12em] text-neutral-600">Account recovery</p>
        <h2 className="mt-1 text-[26px]">Reset your password</h2>

        {confirmationMessage ? (
          <p className="mt-6 text-[15px] text-neutral-800">{confirmationMessage}</p>
        ) : (
          <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit(onSubmitForgotPasswordForm)} noValidate>
            <ApiErrorBanner error={error} />

            <FormField label="Email address" htmlFor="email" error={errors.email?.message}>
              <Input id="email" type="email" autoComplete="email" {...register("email")} />
            </FormField>

            <Button type="submit" className="w-full py-3" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send reset instructions"}
            </Button>
          </form>
        )}

        <p className="mt-6 text-[13px] text-neutral-700">
          <Link href="/bank/login" className="text-accent-700">
            Back to sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
