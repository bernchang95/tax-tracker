"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Category } from "@/lib/types";
import { MONTH_NAMES } from "@/lib/format";

export default function FilterBar({
  categories,
  years,
}: {
  categories: Category[];
  years: number[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  const year = searchParams.get("year") ?? "";
  const month = searchParams.get("month") ?? "";
  const type = searchParams.get("type") ?? "";
  const category = searchParams.get("category") ?? "";
  const hasFilters = year || month || type || category;

  return (
    <div className="flex flex-wrap items-end gap-3 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-neutral-500">Year</label>
        <select
          className="border border-neutral-300 rounded px-2 py-1.5 text-sm bg-white"
          value={year}
          onChange={(e) => setParam("year", e.target.value)}
        >
          <option value="">All years</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-neutral-500">Month</label>
        <select
          className="border border-neutral-300 rounded px-2 py-1.5 text-sm bg-white"
          value={month}
          onChange={(e) => setParam("month", e.target.value)}
        >
          <option value="">All months</option>
          {MONTH_NAMES.map((m, i) => (
            <option key={m} value={i + 1}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-neutral-500">Type</label>
        <select
          className="border border-neutral-300 rounded px-2 py-1.5 text-sm bg-white"
          value={type}
          onChange={(e) => setParam("type", e.target.value)}
        >
          <option value="">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-neutral-500">Category</label>
        <select
          className="border border-neutral-300 rounded px-2 py-1.5 text-sm bg-white"
          value={category}
          onChange={(e) => setParam("category", e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={() => router.push(pathname)}
          className="text-sm text-blue-600 hover:underline px-2 py-1.5"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
