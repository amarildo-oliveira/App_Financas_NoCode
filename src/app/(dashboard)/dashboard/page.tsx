import { createClient } from "@/lib/supabase/server";
import { getMonthRange, parseMonthYear, MONTH_NAMES } from "@/lib/date-range";
import { MonthSelector } from "@/components/layout/month-selector";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { CategoryPieChart } from "@/components/dashboard/category-pie-chart";
import type { Transaction } from "@/lib/types";

export default async function DashboardPage({
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
    .lte("date", end);

  const transactions = (data ?? []) as Transaction[];

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expensesByCategory = new Map<string, number>();
  for (const t of transactions) {
    if (t.type !== "expense") continue;
    expensesByCategory.set(
      t.category,
      (expensesByCategory.get(t.category) ?? 0) + Number(t.amount)
    );
  }
  const categoryData = Array.from(expensesByCategory.entries()).map(
    ([category, total]) => ({ category, total })
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Resumo de {MONTH_NAMES[month - 1]} de {year}
          </p>
        </div>
        <MonthSelector month={month} year={year} />
      </div>

      <SummaryCards totalIncome={totalIncome} totalExpense={totalExpense} />

      <CategoryPieChart data={categoryData} />
    </div>
  );
}
