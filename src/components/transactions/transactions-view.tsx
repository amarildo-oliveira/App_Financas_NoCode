"use client";

import { useMemo, useState } from "react";
import { Filters } from "@/components/transactions/filters";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { ExportCsvButton } from "@/components/transactions/export-csv-button";
import type { Transaction } from "@/lib/types";

export function TransactionsView({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchesCategory = category === "all" || t.category === category;
      const matchesSearch = t.description
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [transactions, category, search]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <Filters
          category={category}
          onCategoryChange={setCategory}
          search={search}
          onSearchChange={setSearch}
        />
        <div className="flex gap-2">
          <ExportCsvButton transactions={filtered} />
          <TransactionForm />
        </div>
      </div>

      <TransactionsTable transactions={filtered} />
    </div>
  );
}
