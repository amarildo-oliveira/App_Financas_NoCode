import type { Transaction } from "@/lib/types";
import { getCategoryLabel } from "@/lib/categories";

function escapeCsvField(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function transactionsToCsv(transactions: Transaction[]): string {
  const header = ["Data", "Descrição", "Categoria", "Tipo", "Valor"];
  const rows = transactions.map((t) => [
    t.date,
    t.description,
    getCategoryLabel(t.category),
    t.type === "income" ? "Receita" : "Despesa",
    t.amount.toFixed(2).replace(".", ","),
  ]);

  return [header, ...rows]
    .map((row) => row.map((field) => escapeCsvField(String(field))).join(";"))
    .join("\n");
}

export function downloadCsv(filename: string, csvContent: string): void {
  const blob = new Blob([`﻿${csvContent}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
