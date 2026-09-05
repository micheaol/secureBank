"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useGetMySupportTicketByIdQuery, useAddSupportMessageMutation } from "@/lib/redux/supportApi";
import { useGetCurrentUserQuery } from "@/lib/redux/authApi";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cx } from "@/components/ui/cx";

export default function SupportTicketDetailPage() {
  const { ticketId } = useParams();
  const { data: ticket, isLoading } = useGetMySupportTicketByIdQuery(ticketId);
  const { data: currentUser } = useGetCurrentUserQuery();
  const [addMessage, { isLoading: isSending }] = useAddSupportMessageMutation();
  const [messageText, setMessageText] = useState("");

  async function handleSendMessage(event) {
    event.preventDefault();
    if (!messageText.trim()) return;
    await addMessage({ ticketId, message: messageText });
    setMessageText("");
  }

  if (isLoading || !ticket) {
    return <p className="py-8 text-[15px] text-neutral-700">Loading case...</p>;
  }

  return (
    <div className="mx-auto max-w-[720px] py-8">
      <p className="font-heading text-[11px] uppercase tracking-[0.12em] text-neutral-600">{ticket.category}</p>
      <h1 className="mt-1 text-[30px]">{ticket.subject}</h1>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-neutral-600">{ticket.status}</p>

      <div className="mt-8 flex flex-col gap-4 border-t border-divider pt-6">
        {ticket.messages.map((message) => {
          const isMine = message.senderId === currentUser?.user?.id;
          return (
            <div key={message.id} className={cx("max-w-[80%]", isMine ? "self-end text-right" : "self-start")}>
              <p className="font-heading text-[11px] uppercase tracking-[0.12em] text-neutral-600">
                {isMine ? "You" : message.sender.fullName}
              </p>
              <p className="mt-1 text-[15px]">{message.message}</p>
            </div>
          );
        })}
      </div>

      <form className="mt-8 flex gap-3 border-t border-divider pt-6" onSubmit={handleSendMessage}>
        <Input
          className="flex-1"
          placeholder="Type a message..."
          value={messageText}
          onChange={(event) => setMessageText(event.target.value)}
        />
        <Button type="submit" disabled={isSending}>
          Send
        </Button>
      </form>
    </div>
  );
}
