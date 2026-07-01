"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TxnType } from "@/lib/types";

export type ActionResult = { error: string } | { error: null };

function parseTransactionForm(formData: FormData) {
  const txn_date = String(formData.get("txn_date") ?? "").trim();
  const type = String(formData.get("type") ?? "") as TxnType;
  const amountRaw = String(formData.get("amount") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category_id = String(formData.get("category_id") ?? "").trim() || null;
  const customer_vendor = String(formData.get("customer_vendor") ?? "").trim() || null;
  const payment_method = String(formData.get("payment_method") ?? "").trim() || null;
  const reference_number = String(formData.get("reference_number") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const receipt_url = String(formData.get("receipt_url") ?? "").trim() || null;

  const amount = Number(amountRaw);

  if (!txn_date) return { error: "Date is required." } as const;
  if (type !== "income" && type !== "expense") return { error: "Type must be income or expense." } as const;
  if (!amountRaw || Number.isNaN(amount) || amount <= 0) return { error: "Amount must be a number greater than 0." } as const;
  if (!description) return { error: "Description is required." } as const;

  return {
    error: null,
    data: {
      txn_date,
      type,
      amount,
      description,
      category_id,
      customer_vendor,
      payment_method,
      reference_number,
      notes,
      receipt_url,
    },
  } as const;
}

export async function createTransaction(formData: FormData): Promise<ActionResult> {
  const parsed = parseTransactionForm(formData);
  if (parsed.error) return { error: parsed.error };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase.from("transactions").insert({ ...parsed.data, user_id: user.id });
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/summary");
  redirect("/");
}

export async function updateTransaction(id: string, formData: FormData): Promise<ActionResult> {
  const parsed = parseTransactionForm(formData);
  if (parsed.error) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase.from("transactions").update(parsed.data).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/summary");
  redirect("/");
}

export async function deleteTransaction(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/summary");
  return { error: null };
}

function parseCategoryForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "") as TxnType;
  const lhdn_code = String(formData.get("lhdn_code") ?? "").trim() || null;

  if (!name) return { error: "Name is required." } as const;
  if (type !== "income" && type !== "expense") return { error: "Type must be income or expense." } as const;

  return { error: null, data: { name, type, lhdn_code } } as const;
}

export async function createCategory(formData: FormData): Promise<ActionResult> {
  const parsed = parseCategoryForm(formData);
  if (parsed.error) return { error: parsed.error };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase.from("categories").insert({ ...parsed.data, user_id: user.id });
  if (error) return { error: error.message };

  revalidatePath("/categories");
  revalidatePath("/");
  revalidatePath("/summary");
  return { error: null };
}

export async function updateCategory(id: string, formData: FormData): Promise<ActionResult> {
  const parsed = parseCategoryForm(formData);
  if (parsed.error) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase.from("categories").update(parsed.data).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/categories");
  revalidatePath("/");
  revalidatePath("/summary");
  return { error: null };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/categories");
  revalidatePath("/");
  revalidatePath("/summary");
  return { error: null };
}
