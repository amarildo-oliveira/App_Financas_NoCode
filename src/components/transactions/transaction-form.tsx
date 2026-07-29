"use client";

import { cloneElement, isValidElement, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { createTransaction, updateTransaction } from "@/lib/actions/transactions";
import type { Transaction, TransactionInput, TransactionType } from "@/lib/types";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function emptyForm(): TransactionInput {
  return {
    description: "",
    amount: 0,
    date: todayIso(),
    type: "expense",
    category: CATEGORIES[0].value,
  };
}

export function TransactionForm({
  transaction,
  trigger,
}: {
  transaction?: Transaction;
  trigger?: React.ReactNode;
}) {
  const isEditing = !!transaction;
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState<TransactionInput>(
    transaction
      ? {
          description: transaction.description,
          amount: transaction.amount,
          date: transaction.date,
          type: transaction.type,
          category: transaction.category,
        }
      : emptyForm()
  );
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setForm(
        transaction
          ? {
              description: transaction.description,
              amount: transaction.amount,
              date: transaction.date,
              type: transaction.type,
              category: transaction.category,
            }
          : emptyForm()
      );
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = isEditing
        ? await updateTransaction(transaction.id, form)
        : await createTransaction(form);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(isEditing ? "Transação atualizada." : "Transação criada.");
      setOpen(false);
    });
  }

  const openDialog = () => handleOpenChange(true);

  return (
    <>
      {trigger !== undefined && isValidElement(trigger) ? (
        cloneElement(trigger as React.ReactElement<{ onClick?: () => void }>, {
          onClick: openDialog,
        })
      ) : !isEditing ? (
        <Button onClick={openDialog}>
          <Plus className="h-4 w-4" />
          Nova transação
        </Button>
      ) : null}
      <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar transação" : "Nova transação"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Tabs
            value={form.type}
            onValueChange={(v) =>
              setForm((f) => ({ ...f, type: v as TransactionType }))
            }
          >
            <TabsList className="w-full">
              <TabsTrigger value="expense" className="flex-1">
                Despesa
              </TabsTrigger>
              <TabsTrigger value="income" className="flex-1">
                Receita
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={form.amount || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: Number(e.target.value) }))
                }
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={form.category}
              onValueChange={(v) => v && setForm((f) => ({ ...f, category: v }))}
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
      </Dialog>
    </>
  );
}
