import { UserNav } from "@/components/layout/user-nav";

export function Topbar({ email }: { email: string }) {
  return (
    <header className="flex h-16 items-center justify-end border-b bg-background px-4 md:px-8">
      <UserNav email={email} />
    </header>
  );
}
