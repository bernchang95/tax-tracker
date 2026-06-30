export type TxnType = "income" | "expense";

export type Category = {
  id: string;
  user_id: string | null;
  name: string;
  type: TxnType;
  lhdn_code: string | null;
  created_at: string;
};

export type Transaction = {
  id: string;
  user_id: string | null;
  txn_date: string;
  type: TxnType;
  amount: number;
  description: string;
  category_id: string | null;
  customer_vendor: string | null;
  payment_method: string | null;
  reference_number: string | null;
  notes: string | null;
  receipt_url: string | null;
  created_at: string;
  category?: Category | null;
};

export const PAYMENT_METHODS = [
  "Bank Transfer",
  "Cash",
  "Credit Card",
  "e-Wallet",
  "Online Banking",
  "Cheque",
  "Other",
];
