import type { PaymentMethod, TransactionType } from "@/lib/types";

export interface ParsedTransactionSpeech {
  description: string;
  amount?: number;
  type: TransactionType;
  category?: string;
  payment_method?: PaymentMethod;
  date?: string;
}

const INCOME_KEYWORDS = ["recebi", "ganhei", "caiu", "entrou", "me pagaram", "recebimento"];
const EXPENSE_KEYWORDS = ["gastei", "paguei", "comprei", "saiu", "gasto", "compra"];

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  alimentacao: ["mercado", "supermercado", "restaurante", "comida", "lanche", "almoco", "jantar", "ifood", "padaria"],
  transporte: ["uber", "gasolina", "combustivel", "onibus", "taxi", "transporte", "estacionamento"],
  moradia: ["aluguel", "condominio", "luz", "energia", "agua", "internet", "gas", "moradia"],
  lazer: ["cinema", "show", "viagem", "lazer", "bar", "festa", "streaming"],
  saude: ["farmacia", "remedio", "medico", "consulta", "saude", "dentista", "academia"],
  educacao: ["curso", "escola", "faculdade", "livro", "educacao", "mensalidade"],
  salario: ["salario"],
  freelance: ["freelance", "freela", "projeto"],
};

function stripAccents(text: string): string {
  return text.normalize("NFD").replace(/\p{Mn}/gu, "");
}

function capitalize(text: string): string {
  return text.length === 0 ? text : text.charAt(0).toUpperCase() + text.slice(1);
}

interface AmountMatch {
  value: number;
  raw: string;
}

const AMOUNT_LEAD_IN = "(?:no valor de|valor de|no valor|por|de)\\s+";

function extractAmount(lowered: string): AmountMatch | undefined {
  const match =
    lowered.match(new RegExp(`(?:${AMOUNT_LEAD_IN})?r\\$\\s*(\\d+(?:[.,]\\d{1,2})?)`)) ??
    lowered.match(new RegExp(`(?:${AMOUNT_LEAD_IN})?(\\d+(?:[.,]\\d{1,2})?)\\s*(?:reais|real)\\b`)) ??
    lowered.match(/\b(\d+(?:[.,]\d{1,2})?)\b/);
  if (!match) return undefined;
  const value = Number(match[1].replace(",", "."));
  if (!Number.isFinite(value) || value <= 0) return undefined;
  return { value, raw: match[0] };
}

function buildDescription(transcript: string, lowered: string, amountRaw?: string): string {
  const cutIndex = amountRaw ? lowered.indexOf(amountRaw) : -1;
  const truncated = cutIndex >= 0 ? transcript.slice(0, cutIndex) : transcript;
  return capitalize(truncated.replace(/\s{2,}/g, " ").trim());
}

function extractType(normalized: string, fallback: TransactionType): TransactionType {
  if (INCOME_KEYWORDS.some((k) => normalized.includes(k))) return "income";
  if (EXPENSE_KEYWORDS.some((k) => normalized.includes(k))) return "expense";
  return fallback;
}

function extractPaymentMethod(normalized: string): PaymentMethod | undefined {
  if (/\bpix\b/.test(normalized)) return "pix";
  if (/\bdebito\b/.test(normalized)) return "debito";
  if (/\bcredito\b/.test(normalized)) return "credito";
  if (/\bdinheiro\b|\bespecie\b|\bboleto\b|\btransferencia\b/.test(normalized)) return "outros";
  return undefined;
}

function extractCategory(normalized: string): string | undefined {
  for (const [value, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((k) => normalized.includes(k))) return value;
  }
  return undefined;
}

function extractDate(normalized: string): string | undefined {
  const today = new Date();
  if (/\banteontem\b/.test(normalized)) {
    today.setDate(today.getDate() - 2);
    return today.toISOString().slice(0, 10);
  }
  if (/\bontem\b/.test(normalized)) {
    today.setDate(today.getDate() - 1);
    return today.toISOString().slice(0, 10);
  }
  return undefined;
}

export function parseTransactionFromSpeech(
  transcript: string,
  currentType: TransactionType
): ParsedTransactionSpeech {
  const lowered = transcript.toLowerCase();
  const normalized = stripAccents(lowered);
  const amount = extractAmount(lowered);
  return {
    description: buildDescription(transcript, lowered, amount?.raw),
    amount: amount?.value,
    type: extractType(normalized, currentType),
    category: extractCategory(normalized),
    payment_method: extractPaymentMethod(normalized),
    date: extractDate(normalized),
  };
}
