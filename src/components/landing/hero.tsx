import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-24 text-center sm:py-32">
      <span className="rounded-full border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
        Controle financeiro pessoal, simples e visual
      </span>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Organize suas finanças em um só lugar
      </h1>
      <p className="max-w-2xl text-lg text-muted-foreground">
        Registre receitas e despesas, acompanhe seu saldo em tempo real e
        entenda para onde vai seu dinheiro com gráficos claros por categoria.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button render={<Link href="/signup" />} size="lg">
          Começar gratuitamente
        </Button>
        <Button render={<Link href="/login" />} variant="outline" size="lg">
          Já tenho conta
        </Button>
      </div>
    </section>
  );
}
