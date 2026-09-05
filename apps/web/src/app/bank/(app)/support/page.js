"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetMySupportTicketsQuery, useCreateSupportTicketMutation } from "@/lib/redux/supportApi";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { ApiErrorBanner } from "@/components/ui/ApiErrorBanner";
import { cx } from "@/components/ui/cx";

const createTicketFormSchema = z.object({
  subject: z.string().trim().min(4, "Give your case a short subject."),
  category: z.string().trim().min(2, "Choose a category."),
});

export default function SupportPage() {
  const { data: tickets, isLoading } = useGetMySupportTicketsQuery();
  const [createTicket, { isLoading: isCreating, error }] = useCreateSupportTicketMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(createTicketFormSchema) });

  async function onSubmitCreateTicketForm(ticketDetails) {
    await createTicket(ticketDetails).unwrap();
    reset();
  }

  return (
    <div className="py-8">
      <h1 className="text-[34px]">Support</h1>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          {isLoading ? (
            <p className="text-[15px] text-neutral-700">Loading your cases...</p>
          ) : tickets && tickets.length > 0 ? (
            <div className="divide-y divide-divider">
              {tickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/bank/support/${ticket.id}`}
                  className="flex items-center justify-between py-[11px] hover:bg-neutral-200"
                >
                  <div>
                    <p className="text-[17px]">{ticket.subject}</p>
                    <p className="text-[13px] text-neutral-700">{ticket.category}</p>
                  </div>
                  <span
                    className={cx(
                      "font-mono text-[11px] uppercase tracking-[0.08em]",
                      ticket.status === "RESOLVED" || ticket.status === "CLOSED"
                        ? "text-accent-700"
                        : "text-neutral-600"
                    )}
                  >
                    {ticket.status}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-[15px] text-neutral-700">You have no support cases yet.</p>
          )}
        </div>

        <Card>
          <p className="font-heading text-[11px] uppercase tracking-[0.12em] text-neutral-600">Open a case</p>
          <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit(onSubmitCreateTicketForm)} noValidate>
            <ApiErrorBanner error={error} />
            <FormField label="Subject" htmlFor="subject" error={errors.subject?.message}>
              <Input id="subject" {...register("subject")} />
            </FormField>
            <FormField label="Category" htmlFor="category" error={errors.category?.message}>
              <Input id="category" placeholder="Account, Transfer, Card..." {...register("category")} />
            </FormField>
            <Button type="submit" className="w-full py-3" disabled={isCreating}>
              {isCreating ? "Submitting..." : "Submit case"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
