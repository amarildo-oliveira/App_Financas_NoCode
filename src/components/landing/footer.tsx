import { Wallet } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2 font-medium text-foreground">
          <Wallet className="h-4 w-4 text-primary" />
          Finanças Pessoais
        </div>
        <p>Projeto de estudo — controle financeiro pessoal.</p>
      </div>
    </footer>
  );
}
