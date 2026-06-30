import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Transaction } from "@/lib/types";
import { buildAnnualSummary } from "@/lib/summary";
import { toCsv } from "@/lib/csv";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const year = Number(searchParams.get("year")) || new Date().getUTCFullYear();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*, category:categories(*)")
    .gte("txn_date", `${year}-01-01`)
    .lte("txn_date", `${year}-12-31`);

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  const summary = buildAnnualSummary(year, (data ?? []) as Transaction[]);

  const lines: string[] = [];
  lines.push(toCsv(["Annual Summary", String(year)], []));
  lines.push("");
  lines.push(toCsv(["Metric", "Amount (RM)"], [
    ["Gross Income", summary.grossIncome.toFixed(2)],
    ["Total Expenses", summary.totalExpenses.toFixed(2)],
    ["Net Profit", summary.netProfit.toFixed(2)],
  ]));
  lines.push("");
  lines.push(toCsv(
    ["Expense Category", "Total (RM)"],
    summary.expensesByCategory.map((c) => [c.name, c.total.toFixed(2)]),
  ));
  lines.push("");
  lines.push(toCsv(
    ["Month", "Income (RM)", "Expenses (RM)", "Net (RM)"],
    summary.monthlyBreakdown.map((m) => [m.monthName, m.income.toFixed(2), m.expenses.toFixed(2), m.net.toFixed(2)]),
  ));

  const csv = lines.join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="annual-summary-${year}.csv"`,
    },
  });
}
