import Link from "next/link";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function LandingHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Wallet className="h-5 w-5 text-primary" />
          Finanças Pessoais
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button render={<Link href="/login" />} nativeButton={false} variant="ghost">
            Entrar
          </Button>
          <Button render={<Link href="/signup" />} nativeButton={false}>
            Cadastrar
          </Button>
        </div>
      </div>
    </header>
  );
}
