"use client";

import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react";
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
import { Mic, MicOff, Plus } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { PAYMENT_METHODS } from "@/lib/payment-methods";
import { parseTransactionFromSpeech } from "@/lib/speech/parse-transaction";
import { createTransaction, updateTransaction } from "@/lib/actions/transactions";
import type {
  PaymentMethod,
  Transaction,
  TransactionInput,
  TransactionType,
} from "@/lib/types";

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
    payment_method: "outros",
  };
}

function subscribeNoop() {
  return () => {};
}

function getSpeechSupported() {
  return !!(window.SpeechRecognition ?? window.webkitSpeechRecognition);
}

function getSpeechSupportedServer() {
  return false;
}

function formFromTransaction(transaction: Transaction): TransactionInput {
  return {
    description: transaction.description,
    amount: transaction.amount,
    date: transaction.date,
    type: transaction.type,
    category: transaction.category,
    payment_method: transaction.payment_method,
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
    transaction ? formFromTransaction(transaction) : emptyForm()
  );
  const [isPending, startTransition] = useTransition();
  const [isListening, setIsListening] = useState(false);
  const speechSupported = useSyncExternalStore(
    subscribeNoop,
    getSpeechSupported,
    getSpeechSupportedServer
  );
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      recognitionRef.current?.stop();
    }
    if (next) {
      setForm(
        transaction ? formFromTransaction(transaction) : emptyForm()
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

  function handleVoiceInput() {
    const SpeechRecognitionCtor =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      toast.error("Reconhecimento de voz não é suportado neste navegador.");
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "pt-BR";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error === "no-speech") {
        toast.error("Não entendi o áudio. Tente novamente.");
      } else if (event.error === "not-allowed") {
        toast.error("Permissão de microfone negada.");
      } else {
        toast.error("Não foi possível reconhecer o áudio.");
      }
    };
    recognition.onresult = (event) => {
      const transcript = event.results.item(0)?.item(0)?.transcript ?? "";
      if (!transcript.trim()) return;

      const parsed = parseTransactionFromSpeech(transcript, form.type);
      setForm((f) => ({
        description: parsed.description || f.description,
        amount: parsed.amount ?? f.amount,
        date: parsed.date ?? f.date,
        type: parsed.type,
        category: parsed.category ?? f.category,
        payment_method: parsed.payment_method ?? f.payment_method,
      }));
      toast.success("Áudio transcrito. Revise os campos antes de salvar.");
    };

    recognitionRef.current = recognition;
    recognition.start();
  }

  function stopVoiceInput() {
    recognitionRef.current?.stop();
  }

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
          {speechSupported && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={isListening ? stopVoiceInput : handleVoiceInput}
            >
              {isListening ? (
                <>
                  <MicOff className="h-4 w-4" />
                  Ouvindo... toque para parar
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" />
                  Adicionar por áudio
                </>
              )}
            </Button>
          )}

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

          <div className="flex flex-col gap-2">
            <Label htmlFor="payment_method">Forma de pagamento</Label>
            <Select
              value={form.payment_method}
              onValueChange={(v) =>
                v &&
                setForm((f) => ({ ...f, payment_method: v as PaymentMethod }))
              }
            >
              <SelectTrigger id="payment_method" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
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
