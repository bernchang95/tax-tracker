import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TransactionForm from "@/app/components/TransactionForm";
import Nav from "@/app/components/Nav";
import { Category, Transaction } from "@/lib/types";

export default async function EditTransactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: transaction }, { data: categories }] = await Promise.all([
    supabase.from("transactions").select("*").eq("id", id).maybeSingle(),
    supabase.from("categories").select("*").order("name"),
  ]);

  if (!transaction) notFound();

  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Edit Transaction</h1>
        <TransactionForm
          categories={(categories ?? []) as Category[]}
          transaction={transaction as Transaction}
        />
      </main>
    </>
  );
}
