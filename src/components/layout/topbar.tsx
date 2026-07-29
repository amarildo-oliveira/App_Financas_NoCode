import { UserNav } from "@/components/layout/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";

export function Topbar({ email }: { email: string }) {
  return (
    <header className="flex h-16 items-center justify-end gap-2 border-b bg-background px-4 md:px-8">
      <ThemeToggle />
      <UserNav email={email} />
    </header>
  );
}
