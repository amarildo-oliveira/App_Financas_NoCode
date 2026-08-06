import type { PaymentMethod } from "@/lib/types";

export interface PaymentMethodDef {
  value: PaymentMethod;
  label: string;
}

export const PAYMENT_METHODS: PaymentMethodDef[] = [
  { value: "pix", label: "Pix" },
  { value: "debito", label: "Débito" },
  { value: "credito", label: "Crédito" },
  { value: "outros", label: "Outros" },
];

export function getPaymentMethodLabel(value: string): string {
  return PAYMENT_METHODS.find((p) => p.value === value)?.label ?? value;
}
