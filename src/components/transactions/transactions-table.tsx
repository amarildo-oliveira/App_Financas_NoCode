"use client";

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { DeleteTransactionButton } from "@/components/transactions/delete-transaction-button";
import { getCategoryLabel } from "@/lib/categories";
import { getPaymentMethodLabel } from "@/lib/payment-methods";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { Transaction } from "@/lib/types";

export function TransactionsTable({
  transactions,
}: {
  transactions: Transaction[];
}) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-md border p-10 text-center text-sm text-muted-foreground">
        Nenhuma transação encontrada.
      </div>
    );
  }

  return (
    <>
      <div className="hidden rounded-md border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="w-24 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="whitespace-nowrap">
                  {formatDate(t.date)}
                </TableCell>
                <TableCell>{t.description}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{getCategoryLabel(t.category)}</Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {getPaymentMethodLabel(t.payment_method)}
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right font-medium whitespace-nowrap",
                    t.type === "income" ? "text-emerald-600" : "text-red-600"
                  )}
                >
                  {t.type === "income" ? "+" : "-"} {formatCurrency(t.amount)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <TransactionForm
                      transaction={t}
                      trigger={
                        <Button variant="ghost" size="icon" aria-label="Editar transação">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <DeleteTransactionButton id={t.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {transactions.map((t) => (
          <div key={t.id} className="rounded-md border p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium">{t.description}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(t.date)}
                </p>
              </div>
              <div
                className={cn(
                  "font-medium whitespace-nowrap",
                  t.type === "income" ? "text-emerald-600" : "text-red-600"
                )}
              >
                {t.type === "income" ? "+" : "-"} {formatCurrency(t.amount)}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{getCategoryLabel(t.category)}</Badge>
                <span className="text-xs text-muted-foreground">
                  {getPaymentMethodLabel(t.payment_method)}
                </span>
              </div>
              <div className="flex gap-1">
                <TransactionForm
                  transaction={t}
                  trigger={
                    <Button variant="ghost" size="icon" aria-label="Editar transação">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  }
                />
                <DeleteTransactionButton id={t.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
