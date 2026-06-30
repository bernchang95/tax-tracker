import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Nav from "@/app/components/Nav";
import YearPicker from "@/app/components/YearPicker";
import { Transaction } from "@/lib/types";
import { buildAnnualSummary } from "@/lib/summary";
import { formatMYR } from "@/lib/format";

export default async function SummaryPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>;
}) {
  const { year: yearParam } = await searchParams;
  const supabase = await createClient();

  const { data: allTxnDates } = await supabase.from("transactions").select("txn_date");
  const years = Array.from(
    new Set((allTxnDates ?? []).map((t) => new Date(t.txn_date).getUTCFullYear())),
  ).sort((a, b) => b - a);

  const currentYear = new Date().getUTCFullYear();
  const year = yearParam ? Number(yearParam) : years[0] ?? currentYear;
  const yearOptions = years.includes(year) ? years : [year, ...years];

  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("*, category:categories(*)")
    .gte("txn_date", `${year}-01-01`)
    .lte("txn_date", `${year}-12-31`);

  const summary = buildAnnualSummary(year, (transactions ?? []) as Transaction[]);

  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Annual Summary</h1>
          <a
            href={`/api/export/summary?year=${year}`}
            className="text-sm font-medium border border-neutral-300 rounded px-4 py-2 hover:bg-neutral-50"
          >
            Export CSV
          </a>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-3 py-2">
            Failed to load summary: {error.message}
          </div>
        )}

        <YearPicker years={yearOptions} year={year} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-lg border border-neutral-200 p-4">
            <div className="text-xs font-medium text-neutral-500">Gross Income</div>
            <div className="text-2xl font-bold text-green-700">{formatMYR(summary.grossIncome)}</div>
          </div>
          <div className="rounded-lg border border-neutral-200 p-4">
            <div className="text-xs font-medium text-neutral-500">Total Expenses</div>
            <div className="text-2xl font-bold text-red-700">{formatMYR(summary.totalExpenses)}</div>
          </div>
          <div className="rounded-lg border border-neutral-200 p-4">
            <div className="text-xs font-medium text-neutral-500">Net Profit</div>
            <div
              className={`text-2xl font-bold ${summary.netProfit >= 0 ? "text-neutral-900" : "text-red-700"}`}
            >
              {formatMYR(summary.netProfit)}
            </div>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Expenses by Category</h2>
          {summary.expensesByCategory.length === 0 ? (
            <p className="text-sm text-neutral-500">No expenses recorded for {year}.</p>
          ) : (
            <div className="overflow-x-auto border border-neutral-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase">
                  <tr>
                    <th className="px-3 py-2">Category</th>
                    <th className="px-3 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {summary.expensesByCategory.map((c) => (
                    <tr key={c.categoryId ?? "uncategorised"}>
                      <td className="px-3 py-2">{c.name}</td>
                      <td className="px-3 py-2 text-right font-medium">{formatMYR(c.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Monthly Breakdown</h2>
          <div className="overflow-x-auto border border-neutral-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase">
                <tr>
                  <th className="px-3 py-2">Month</th>
                  <th className="px-3 py-2 text-right">Income</th>
                  <th className="px-3 py-2 text-right">Expenses</th>
                  <th className="px-3 py-2 text-right">Net</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {summary.monthlyBreakdown.map((m) => (
                  <tr key={m.month}>
                    <td className="px-3 py-2">{m.monthName}</td>
                    <td className="px-3 py-2 text-right">{formatMYR(m.income)}</td>
                    <td className="px-3 py-2 text-right">{formatMYR(m.expenses)}</td>
                    <td className={`px-3 py-2 text-right font-medium ${m.net < 0 ? "text-red-700" : ""}`}>
                      {formatMYR(m.net)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <Link href="/" className="inline-block text-sm text-blue-600 hover:underline">
          ← Back to transactions
        </Link>
      </main>
    </>
  );
}
