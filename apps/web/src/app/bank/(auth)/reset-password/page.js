"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordFormSchema } from "@/lib/validation/authSchemas";
import { useResetPasswordMutation } from "@/lib/redux/authApi";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { ApiErrorBanner } from "@/components/ui/ApiErrorBanner";

export default function BankResetPasswordPage() {
  const router = useRouter();
  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resetPasswordFormSchema) });

  async function onSubmitResetPasswordForm(resetDetails) {
    const { confirmNewPassword: _confirmNewPassword, ...backendPayload } = resetDetails;
    await resetPassword(backendPayload).unwrap();
    router.push("/bank/login");
  }

  return (
    <div className="mx-auto max-w-[480px]">
      <Card>
        <p className="font-heading text-[11px] uppercase tracking-[0.12em] text-neutral-600">Account recovery</p>
        <h2 className="mt-1 text-[26px]">Choose a new password</h2>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit(onSubmitResetPasswordForm)} noValidate>
          <ApiErrorBanner error={error} />

          <FormField
            label="Reset token"
            htmlFor="resetToken"
            hint="Paste the token that was logged for your account by the password-reset request."
            error={errors.resetToken?.message}
          >
            <Input id="resetToken" {...register("resetToken")} />
          </FormField>

          <FormField label="New password" htmlFor="newPassword" error={errors.newPassword?.message}>
            <Input id="newPassword" type="password" autoComplete="new-password" {...register("newPassword")} />
          </FormField>

          <FormField
            label="Confirm new password"
            htmlFor="confirmNewPassword"
            error={errors.confirmNewPassword?.message}
          >
            <Input
              id="confirmNewPassword"
              type="password"
              autoComplete="new-password"
              {...register("confirmNewPassword")}
            />
          </FormField>

          <Button type="submit" className="w-full py-3" disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset password"}
          </Button>
        </form>

        <p className="mt-6 text-[13px] text-neutral-700">
          <Link href="/bank/login" className="text-accent-700">
            Back to sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
