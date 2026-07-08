import { Minus, Plus, X } from "lucide-react";
import { formatPeso } from "../../utils/currency";
import type { CartItem } from "../../types/domain";

export function CartLine({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-lg font-semibold text-neutral-900">{item.product.name}</p>
        <p className="text-base text-neutral-500">
          {formatPeso(item.product.selling_price)} each
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDecrement}
          aria-label="Decrease quantity"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 active:bg-neutral-200"
        >
          <Minus className="h-5 w-5" />
        </button>
        <span className="w-8 text-center text-lg font-semibold">{item.quantity}</span>
        <button
          type="button"
          onClick={onIncrement}
          aria-label="Increase quantity"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 active:bg-emerald-200"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <p className="w-20 shrink-0 text-right text-lg font-bold text-neutral-900">
        {formatPeso(item.product.selling_price * item.quantity)}
      </p>

      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove item"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-red-50"
      >
        <X className="h-5 w-5 text-red-500" />
      </button>
    </div>
  );
}
