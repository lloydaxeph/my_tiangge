import { Package } from "lucide-react";
import { formatPeso } from "../../utils/currency";
import type { Product } from "../../types/domain";

export function ProductGridButton({ product, onClick }: { product: Product; onClick: () => void }) {
  const outOfStock = product.current_stock <= 0;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={outOfStock}
      className="flex flex-col items-center gap-1 rounded-2xl border border-neutral-200 bg-white p-3 text-center shadow-sm active:bg-neutral-50 disabled:opacity-40"
    >
      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-neutral-100">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <Package className="h-9 w-9 text-neutral-400" />
        )}
      </div>
      <p className="line-clamp-2 text-base font-semibold text-neutral-900">{product.name}</p>
      <p className="text-base font-medium text-emerald-700">{formatPeso(product.selling_price)}</p>
      {outOfStock && <p className="text-sm font-semibold text-red-600">Out of stock</p>}
    </button>
  );
}
