export type TransactionType = "income" | "expense";

export type PaymentMethod = "pix" | "debito" | "credito" | "outros";

export interface Transaction {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  date: string; // ISO date (yyyy-MM-dd)
  type: TransactionType;
  category: string;
  payment_method: PaymentMethod;
  created_at: string;
}

export type TransactionInput = Omit<
  Transaction,
  "id" | "user_id" | "created_at"
>;
