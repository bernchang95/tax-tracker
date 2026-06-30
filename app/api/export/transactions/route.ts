import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Transaction } from "@/lib/types";
import { toCsv } from "@/lib/csv";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");
  const month = searchParams.get("month");
  const type = searchParams.get("type");
  const category = searchParams.get("category");

  const supabase = await createClient();
  let query = supabase
    .from("transactions")
    .select("*, category:categories(*)")
    .order("txn_date", { ascending: false });

  if (year) {
    query = query.gte("txn_date", `${year}-01-01`).lte("txn_date", `${year}-12-31`);
  }
  if (month && year) {
    const m = month.padStart(2, "0");
    const lastDay = new Date(Number(year), Number(month), 0).getDate();
    query = query.gte("txn_date", `${year}-${m}-01`).lte("txn_date", `${year}-${m}-${lastDay}`);
  }
  if (type === "income" || type === "expense") {
    query = query.eq("type", type);
  }
  if (category) {
    query = query.eq("category_id", category);
  }

  const { data, error } = await query;
  if (error) {
    return new Response(error.message, { status: 500 });
  }

  const rows = (data ?? []) as Transaction[];
  const csv = toCsv(
    [
      "Date",
      "Type",
      "Amount",
      "Description",
      "Category",
      "Customer/Vendor",
      "Payment Method",
      "Reference Number",
      "Notes",
      "Receipt URL",
    ],
    rows.map((t) => [
      t.txn_date,
      t.type,
      Number(t.amount).toFixed(2),
      t.description,
      t.category?.name ?? "Uncategorised",
      t.customer_vendor ?? "",
      t.payment_method ?? "",
      t.reference_number ?? "",
      t.notes ?? "",
      t.receipt_url ?? "",
    ]),
  );

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="transactions.csv"`,
    },
  });
}
