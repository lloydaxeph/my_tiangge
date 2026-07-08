import { Loader2 } from "lucide-react";
import clsx from "clsx";

export function Spinner({ className }: { className?: string }) {
  return (
    <div className="flex w-full items-center justify-center py-10">
      <Loader2 className={clsx("h-10 w-10 animate-spin text-emerald-600", className)} />
    </div>
  );
}
