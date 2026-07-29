export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  date: string; // ISO date (yyyy-MM-dd)
  type: TransactionType;
  category: string;
  created_at: string;
}

export type TransactionInput = Omit<
  Transaction,
  "id" | "user_id" | "created_at"
>;
