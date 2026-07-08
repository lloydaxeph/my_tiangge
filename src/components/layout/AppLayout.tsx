import type { ReactNode } from "react";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-svh w-full max-w-md bg-neutral-50 px-4 pb-10 pt-6">
      {children}
    </div>
  );
}
