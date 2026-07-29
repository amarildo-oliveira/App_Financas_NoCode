import Link from "next/link";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Wallet className="h-5 w-5 text-primary" />
          Finanças Pessoais
        </Link>
        <div className="flex items-center gap-2">
          <Button render={<Link href="/login" />} variant="ghost">
            Entrar
          </Button>
          <Button render={<Link href="/signup" />}>Cadastrar</Button>
        </div>
      </div>
    </header>
  );
}
