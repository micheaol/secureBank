"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerFormSchema } from "@/lib/validation/authSchemas";
import { useRegisterAccountMutation } from "@/lib/redux/authApi";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { ApiErrorBanner } from "@/components/ui/ApiErrorBanner";

export default function BankRegisterPage() {
  const router = useRouter();
  const [registerAccount, { isLoading, error }] = useRegisterAccountMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerFormSchema) });

  async function onSubmitRegisterForm(registrationDetails) {
    const { confirmPassword: _confirmPassword, ...accountDetails } = registrationDetails;
    await registerAccount(accountDetails).unwrap();
    router.push("/bank/dashboard");
  }

  return (
    <div className="mx-auto max-w-[480px]">
      <Card>
        <p className="font-heading text-[11px] uppercase tracking-[0.12em] text-neutral-600">Create account</p>
        <h2 className="mt-1 text-[26px]">Open a SecureBank account</h2>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit(onSubmitRegisterForm)} noValidate>
          <ApiErrorBanner error={error} />

          <FormField label="Full name" htmlFor="fullName" error={errors.fullName?.message}>
            <Input id="fullName" autoComplete="name" {...register("fullName")} />
          </FormField>

          <FormField label="Email address" htmlFor="email" error={errors.email?.message}>
            <Input id="email" type="email" autoComplete="email" {...register("email")} />
          </FormField>

          <FormField label="Phone number (optional)" htmlFor="phoneNumber" error={errors.phoneNumber?.message}>
            <Input id="phoneNumber" type="tel" autoComplete="tel" {...register("phoneNumber")} />
          </FormField>

          <FormField label="Password" htmlFor="password" error={errors.password?.message}>
            <Input id="password" type="password" autoComplete="new-password" {...register("password")} />
          </FormField>

          <FormField
            label="Confirm password"
            htmlFor="confirmPassword"
            error={errors.confirmPassword?.message}
          >
            <Input id="confirmPassword" type="password" autoComplete="new-password" {...register("confirmPassword")} />
          </FormField>

          <Button type="submit" className="w-full py-3" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </Button>

          <p className="text-[13px] text-neutral-700">
            Already have an account?{" "}
            <Link href="/bank/login" className="text-accent-700">
              Sign in
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
