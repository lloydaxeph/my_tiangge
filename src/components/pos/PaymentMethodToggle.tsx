import { Banknote, Smartphone } from "lucide-react";
import clsx from "clsx";
import type { PaymentMethod } from "../../types/domain";

export function PaymentMethodToggle({
  value,
  onChange,
}: {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => onChange("cash")}
        className={clsx(
          "flex flex-col items-center gap-1 rounded-2xl border-2 p-4",
          value === "cash" ? "border-emerald-600 bg-emerald-50" : "border-neutral-200 bg-white"
        )}
      >
        <Banknote className="h-8 w-8 text-emerald-700" />
        <span className="text-lg font-semibold text-neutral-900">Cash</span>
      </button>
      <button
        type="button"
        onClick={() => onChange("gcash")}
        className={clsx(
          "flex flex-col items-center gap-1 rounded-2xl border-2 p-4",
          value === "gcash" ? "border-sky-600 bg-sky-50" : "border-neutral-200 bg-white"
        )}
      >
        <Smartphone className="h-8 w-8 text-sky-700" />
        <span className="text-lg font-semibold text-neutral-900">GCash</span>
      </button>
    </div>
  );
}
