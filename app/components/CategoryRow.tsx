"use client";

import { useState, useTransition } from "react";
import { Category } from "@/lib/types";
import { updateCategory, deleteCategory } from "@/app/actions";

export default function CategoryRow({ category }: { category: Category }) {
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (editing) {
    return (
      <tr className="bg-blue-50/50">
        <td colSpan={4} className="px-3 py-2">
          <form
            action={(formData) =>
              startTransition(async () => {
                const result = await updateCategory(category.id, formData);
                if (result.error) setError(result.error);
                else setEditing(false);
              })
            }
            className="flex flex-wrap items-end gap-3"
          >
            <input type="text" name="name" required defaultValue={category.name} className="input max-w-[200px]" />
            <select name="type" required defaultValue={category.type} className="input max-w-[140px]">
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <input
              type="text"
              name="lhdn_code"
              defaultValue={category.lhdn_code ?? ""}
              placeholder="LHDN code"
              className="input max-w-[140px]"
            />
            <button
              type="submit"
              disabled={pending}
              className="text-sm font-medium text-blue-600 hover:underline disabled:opacity-50"
            >
              {pending ? "Saving…" : "Save"}
            </button>
            <button type="button" onClick={() => setEditing(false)} className="text-sm text-neutral-500 hover:underline">
              Cancel
            </button>
            {error && <span className="text-sm text-red-600">{error}</span>}
          </form>
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-neutral-50">
      <td className="px-3 py-2">{category.name}</td>
      <td className="px-3 py-2">
        <span
          className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
            category.type === "income" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {category.type}
        </span>
      </td>
      <td className="px-3 py-2">{category.lhdn_code ?? "—"}</td>
      <td className="px-3 py-2 text-right">
        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={() => setEditing(true)} className="text-sm text-blue-600 hover:underline">
            Edit
          </button>
          {confirmingDelete ? (
            <span className="flex items-center gap-2 text-xs">
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    const result = await deleteCategory(category.id);
                    if (result.error) setError(result.error);
                  })
                }
                className="text-red-600 font-medium hover:underline disabled:opacity-50"
              >
                {pending ? "Deleting…" : "Confirm"}
              </button>
              <button type="button" onClick={() => setConfirmingDelete(false)} className="text-neutral-500 hover:underline">
                Cancel
              </button>
            </span>
          ) : (
            <button type="button" onClick={() => setConfirmingDelete(true)} className="text-sm text-red-600 hover:underline">
              Delete
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
