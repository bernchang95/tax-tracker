import { createClient } from "@/lib/supabase/server";
import TransactionForm from "@/app/components/TransactionForm";
import Nav from "@/app/components/Nav";
import { Category } from "@/lib/types";

export default async function NewTransactionPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Add Transaction</h1>
        <TransactionForm categories={(categories ?? []) as Category[]} />
      </main>
    </>
  );
}
