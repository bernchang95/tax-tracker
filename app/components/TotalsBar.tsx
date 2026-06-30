import { formatMYR } from "@/lib/format";

export default function TotalsBar({
  grossIncome,
  totalExpenses,
}: {
  grossIncome: number;
  totalExpenses: number;
}) {
  const netProfit = grossIncome - totalExpenses;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="rounded-lg border border-neutral-200 p-4">
        <div className="text-xs font-medium text-neutral-500">Gross Income</div>
        <div className="text-2xl font-bold text-green-700">{formatMYR(grossIncome)}</div>
      </div>
      <div className="rounded-lg border border-neutral-200 p-4">
        <div className="text-xs font-medium text-neutral-500">Total Expenses</div>
        <div className="text-2xl font-bold text-red-700">{formatMYR(totalExpenses)}</div>
      </div>
      <div className="rounded-lg border border-neutral-200 p-4">
        <div className="text-xs font-medium text-neutral-500">Net Profit</div>
        <div className={`text-2xl font-bold ${netProfit >= 0 ? "text-neutral-900" : "text-red-700"}`}>
          {formatMYR(netProfit)}
        </div>
      </div>
    </div>
  );
}
