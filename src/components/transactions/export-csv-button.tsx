"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadCsv, transactionsToCsv } from "@/lib/csv";
import type { Transaction } from "@/lib/types";

export function ExportCsvButton({
  transactions,
}: {
  transactions: Transaction[];
}) {
  function handleExport() {
    const csv = transactionsToCsv(transactions);
    const filename = `transacoes-${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCsv(filename, csv);
  }

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={transactions.length === 0}
    >
      <Download className="h-4 w-4" />
      Exportar CSV
    </Button>
  );
}
