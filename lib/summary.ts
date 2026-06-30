import { MONTH_NAMES } from "@/lib/format";
import { Transaction } from "@/lib/types";

export type CategoryBreakdown = { categoryId: string | null; name: string; total: number };
export type MonthlyBreakdown = { month: number; monthName: string; income: number; expenses: number; net: number };

export type AnnualSummary = {
  year: number;
  grossIncome: number;
  totalExpenses: number;
  netProfit: number;
  expensesByCategory: CategoryBreakdown[];
  monthlyBreakdown: MonthlyBreakdown[];
};

export function buildAnnualSummary(year: number, transactions: Transaction[]): AnnualSummary {
  const grossIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + Number(t.amount), 0);

  const expenseTotalsByCategory = new Map<string, { name: string; total: number }>();
  for (const t of transactions) {
    if (t.type !== "expense") continue;
    const key = t.category_id ?? "uncategorised";
    const name = t.category?.name ?? "Uncategorised";
    const existing = expenseTotalsByCategory.get(key);
    if (existing) {
      existing.total += Number(t.amount);
    } else {
      expenseTotalsByCategory.set(key, { name, total: Number(t.amount) });
    }
  }
  const expensesByCategory: CategoryBreakdown[] = Array.from(
    expenseTotalsByCategory.entries(),
  )
    .map(([categoryId, v]) => ({
      categoryId: categoryId === "uncategorised" ? null : categoryId,
      name: v.name,
      total: v.total,
    }))
    .sort((a, b) => b.total - a.total);

  const monthlyBreakdown: MonthlyBreakdown[] = MONTH_NAMES.map((name, i) => {
    const monthTxns = transactions.filter((t) => new Date(t.txn_date).getUTCMonth() === i);
    const income = monthTxns.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
    const expenses = monthTxns.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
    return { month: i + 1, monthName: name, income, expenses, net: income - expenses };
  });

  return {
    year,
    grossIncome,
    totalExpenses,
    netProfit: grossIncome - totalExpenses,
    expensesByCategory,
    monthlyBreakdown,
  };
}
