import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Nav from "@/app/components/Nav";
import FilterBar from "@/app/components/FilterBar";
import TotalsBar from "@/app/components/TotalsBar";
import DeleteTransactionButton from "@/app/components/DeleteTransactionButton";
import { Category, Transaction } from "@/lib/types";
import { formatMYR } from "@/lib/format";

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string; type?: string; category?: string }>;
}) {
  const { year, month, type, category } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("transactions")
    .select("*, category:categories(*)")
    .order("txn_date", { ascending: false });

  if (month && year) {
    const m = month.padStart(2, "0");
    const lastDay = new Date(Number(year), Number(month), 0).getDate();
    query = query.gte("txn_date", `${year}-${m}-01`).lte("txn_date", `${year}-${m}-${String(lastDay).padStart(2, "0")}`);
  } else if (year) {
    query = query.gte("txn_date", `${year}-01-01`).lte("txn_date", `${year}-12-31`);
  }
  if (type === "income" || type === "expense") {
    query = query.eq("type", type);
  }
  if (category) {
    query = query.eq("category_id", category);
  }

  const [{ data: transactions, error }, { data: categories }, { data: allTxnDates }] =
    await Promise.all([
      query,
      supabase.from("categories").select("*").order("name"),
      supabase.from("transactions").select("txn_date"),
    ]);

  const years = Array.from(
    new Set((allTxnDates ?? []).map((t) => new Date(t.txn_date).getFullYear())),
  ).sort((a, b) => b - a);

  const rows = (transactions ?? []) as Transaction[];
  const grossIncome = rows.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
  const totalExpenses = rows.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);

  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <div className="flex gap-3">
            <a
              href={`/api/export/transactions?${new URLSearchParams({
                ...(year ? { year } : {}),
                ...(month ? { month } : {}),
                ...(type ? { type } : {}),
                ...(category ? { category } : {}),
              }).toString()}`}
              className="text-sm font-medium border border-neutral-300 rounded px-4 py-2 hover:bg-neutral-50"
            >
              Export CSV
            </a>
            <Link
              href="/transactions/new"
              className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700"
            >
              + Add Transaction
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-3 py-2">
            Failed to load transactions: {error.message}
          </div>
        )}

        <FilterBar categories={(categories ?? []) as Category[]} years={years} />

        <TotalsBar grossIncome={grossIncome} totalExpenses={totalExpenses} />

        {rows.length === 0 ? (
          <div className="text-center py-16 text-neutral-500 border border-dashed border-neutral-300 rounded-lg">
            {year || month || type || category
              ? "No transactions for this period."
              : "No transactions yet — add your first one."}
          </div>
        ) : (
          <div className="overflow-x-auto border border-neutral-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase">
                <tr>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Description</th>
                  <th className="px-3 py-2">Category</th>
                  <th className="px-3 py-2">Customer/Vendor</th>
                  <th className="px-3 py-2 text-right">Amount</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {rows.map((t) => (
                  <tr key={t.id} className="hover:bg-neutral-50">
                    <td className="px-3 py-2 whitespace-nowrap">{t.txn_date}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          t.type === "income"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {t.type}
                      </span>
                    </td>
                    <td className="px-3 py-2">{t.description}</td>
                    <td className="px-3 py-2">{t.category?.name ?? "Uncategorised"}</td>
                    <td className="px-3 py-2">{t.customer_vendor ?? "—"}</td>
                    <td className="px-3 py-2 text-right font-medium whitespace-nowrap">
                      {formatMYR(Number(t.amount))}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/transactions/${t.id}/edit`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <DeleteTransactionButton id={t.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
