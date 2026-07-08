import { Package } from "lucide-react";
import { CardButton } from "../common/Card";
import { formatPeso } from "../../utils/currency";
import type { Product } from "../../types/domain";

export function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  const outOfStock = product.current_stock <= 0;

  return (
    <CardButton onClick={onClick} className="flex items-center gap-4">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-100">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <Package className="h-8 w-8 text-neutral-400" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xl font-semibold text-neutral-900">{product.name}</p>
        <p className="text-lg text-neutral-500">{formatPeso(product.selling_price)}</p>
      </div>
      <span
        className={`shrink-0 rounded-full px-3 py-1 text-base font-semibold ${
          outOfStock ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
        }`}
      >
        {outOfStock ? "Out of stock" : `${product.current_stock} left`}
      </span>
    </CardButton>
  );
}
