"use client";

import { useState, useTransition } from "react";
import { deleteTransaction } from "@/app/actions";

export default function DeleteTransactionButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (confirming) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="text-neutral-600">Delete?</span>
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const result = await deleteTransaction(id);
              if (result.error) setError(result.error);
            })
          }
          className="text-red-600 font-medium hover:underline disabled:opacity-50"
        >
          {pending ? "Deleting…" : "Confirm"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="text-neutral-500 hover:underline"
        >
          Cancel
        </button>
        {error && <span className="text-red-600">{error}</span>}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="text-sm text-red-600 hover:underline"
    >
      Delete
    </button>
  );
}
