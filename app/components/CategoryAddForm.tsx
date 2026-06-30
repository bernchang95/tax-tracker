"use client";

import { useRef, useState, useTransition } from "react";
import { createCategory } from "@/app/actions";

export default function CategoryAddForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createCategory(formData);
      if (result.error) {
        setError(result.error);
      } else {
        formRef.current?.reset();
      }
    });
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="flex flex-wrap items-end gap-3 p-4 bg-neutral-50 rounded-lg border border-neutral-200"
    >
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-neutral-500">Name</span>
        <input type="text" name="name" required className="input" />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-neutral-500">Type</span>
        <select name="type" required defaultValue="income" className="input">
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-neutral-500">LHDN Code</span>
        <input type="text" name="lhdn_code" className="input" placeholder="optional" />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? "Adding…" : "Add Category"}
      </button>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </form>
  );
}
