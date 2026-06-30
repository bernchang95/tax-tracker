"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Category, Transaction, PAYMENT_METHODS } from "@/lib/types";
import { createTransaction, updateTransaction } from "@/app/actions";

export default function TransactionForm({
  categories,
  transaction,
}: {
  categories: Category[];
  transaction?: Transaction;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<"income" | "expense">(transaction?.type ?? "income");

  const filteredCategories = categories.filter((c) => c.type === type);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = transaction
        ? await updateTransaction(transaction.id, formData)
        : await createTransaction(formData);
      if (result.error) setError(result.error);
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4 max-w-2xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-3 py-2">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Date" required>
          <input
            type="date"
            name="txn_date"
            required
            defaultValue={transaction?.txn_date ?? new Date().toISOString().slice(0, 10)}
            className="input"
          />
        </Field>

        <Field label="Type" required>
          <select
            name="type"
            required
            value={type}
            onChange={(e) => setType(e.target.value as "income" | "expense")}
            className="input"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </Field>

        <Field label="Amount (RM)" required>
          <input
            type="number"
            name="amount"
            step="0.01"
            min="0.01"
            required
            defaultValue={transaction?.amount}
            className="input"
          />
        </Field>

        <Field label="Category">
          <select name="category_id" defaultValue={transaction?.category_id ?? ""} className="input">
            <option value="">Uncategorised</option>
            {filteredCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Description" required full>
          <input
            type="text"
            name="description"
            required
            defaultValue={transaction?.description}
            className="input"
          />
        </Field>

        <Field label="Customer / Vendor">
          <input
            type="text"
            name="customer_vendor"
            defaultValue={transaction?.customer_vendor ?? ""}
            className="input"
          />
        </Field>

        <Field label="Payment Method">
          <select
            name="payment_method"
            defaultValue={transaction?.payment_method ?? ""}
            className="input"
          >
            <option value="">Select…</option>
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Reference Number">
          <input
            type="text"
            name="reference_number"
            defaultValue={transaction?.reference_number ?? ""}
            className="input"
          />
        </Field>

        <Field label="Receipt URL">
          <input
            type="url"
            name="receipt_url"
            defaultValue={transaction?.receipt_url ?? ""}
            className="input"
          />
        </Field>

        <Field label="Notes" full>
          <textarea
            name="notes"
            rows={3}
            defaultValue={transaction?.notes ?? ""}
            className="input"
          />
        </Field>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="text-sm text-neutral-600 hover:underline px-4 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  full,
  children,
}: {
  label: string;
  required?: boolean;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-1 ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-sm font-medium text-neutral-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </label>
  );
}
