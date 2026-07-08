import { Package } from "lucide-react";
import { AppLayout } from "../../components/layout/AppLayout";
import { PageHeader } from "../../components/common/PageHeader";
import { Spinner } from "../../components/common/Spinner";
import { EmptyState } from "../../components/common/EmptyState";
import { Card } from "../../components/common/Card";
import { AdminTabs } from "../../components/admin/AdminTabs";
import { useAdminProducts } from "../../hooks/useAdminData";
import { formatPeso } from "../../utils/currency";

export function AdminInventoryPage() {
  const { products, loading, storeNameFor } = useAdminProducts();

  return (
    <AppLayout>
      <PageHeader title="Admin: Inventory" onBack />
      <AdminTabs />

      {loading ? (
        <Spinner />
      ) : products.length === 0 ? (
        <EmptyState icon={Package} title="No products across any store" />
      ) : (
        <div className="flex flex-col gap-3">
          {products.map((product) => (
            <Card key={product.id} className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-semibold text-neutral-900">{product.name}</p>
                <p className="truncate text-base text-neutral-500">
                  {storeNameFor(product.user_id)}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-lg font-semibold text-neutral-900">
                  {formatPeso(product.selling_price)}
                </p>
                <p className="text-base text-neutral-500">{product.current_stock} in stock</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
