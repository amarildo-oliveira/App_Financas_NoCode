import type { TransactionType } from "@/lib/types";

export interface CategoryDef {
  value: string;
  label: string;
  color: string;
  defaultType: TransactionType;
}

export const CATEGORIES: CategoryDef[] = [
  { value: "alimentacao", label: "Alimentação", color: "#f97316", defaultType: "expense" },
  { value: "transporte", label: "Transporte", color: "#3b82f6", defaultType: "expense" },
  { value: "moradia", label: "Moradia", color: "#8b5cf6", defaultType: "expense" },
  { value: "lazer", label: "Lazer", color: "#ec4899", defaultType: "expense" },
  { value: "saude", label: "Saúde", color: "#ef4444", defaultType: "expense" },
  { value: "educacao", label: "Educação", color: "#eab308", defaultType: "expense" },
  { value: "salario", label: "Salário", color: "#22c55e", defaultType: "income" },
  { value: "freelance", label: "Freelance", color: "#14b8a6", defaultType: "income" },
  { value: "outros", label: "Outros", color: "#64748b", defaultType: "expense" },
];

export function getCategoryLabel(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export function getCategoryColor(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.color ?? "#64748b";
}
