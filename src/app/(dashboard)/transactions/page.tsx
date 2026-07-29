import { createClient } from "@/lib/supabase/server";
import { getMonthRange, parseMonthYear, MONTH_NAMES } from "@/lib/date-range";
import { MonthSelector } from "@/components/layout/month-selector";
import { TransactionsView } from "@/components/transactions/transactions-view";
import type { Transaction } from "@/lib/types";

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const params = await searchParams;
  const { month, year } = parseMonthYear(params.month, params.year);
  const { start, end } = getMonthRange(year, month);

  const supabase = await createClient();
  const { data } = await supabase
    .from("transactions")
    .select("*")
    .gte("date", start)
    .lte("date", end)
    .order("date", { ascending: false });

  const transactions = (data ?? []) as Transaction[];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Transações</h1>
          <p className="text-sm text-muted-foreground">
            {MONTH_NAMES[month - 1]} de {year}
          </p>
        </div>
        <MonthSelector month={month} year={year} />
      </div>

      <TransactionsView transactions={transactions} />
    </div>
  );
}
