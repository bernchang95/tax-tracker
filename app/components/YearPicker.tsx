"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function YearPicker({ years, year }: { years: number[]; year: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-neutral-500">Year</label>
      <select
        className="border border-neutral-300 rounded px-2 py-1.5 text-sm bg-white"
        value={year}
        onChange={(e) => handleChange(e.target.value)}
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}
