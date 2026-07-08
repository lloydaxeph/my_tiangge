import { ShoppingCart } from "lucide-react";
import { AppLayout } from "../../components/layout/AppLayout";
import { PageHeader } from "../../components/common/PageHeader";
import { Spinner } from "../../components/common/Spinner";
import { EmptyState } from "../../components/common/EmptyState";
import { Card } from "../../components/common/Card";
import { AdminTabs } from "../../components/admin/AdminTabs";
import { useAdminSales } from "../../hooks/useAdminData";
import { formatPeso } from "../../utils/currency";
import { formatDateTime } from "../../utils/date";

export function AdminSalesPage() {
  const { sales, loading, storeNameFor } = useAdminSales();

  return (
    <AppLayout>
      <PageHeader title="Admin: Sales" onBack />
      <AdminTabs />

      {loading ? (
        <Spinner />
      ) : sales.length === 0 ? (
        <EmptyState icon={ShoppingCart} title="No sales across any store" />
      ) : (
        <div className="flex flex-col gap-3">
          {sales.map((sale) => (
            <Card key={sale.id} className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-semibold text-neutral-900">
                  {storeNameFor(sale.user_id)}
                </p>
                <p className="text-base text-neutral-500">{formatDateTime(sale.created_at)}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-lg font-bold text-neutral-900">{formatPeso(sale.total)}</p>
                <p className="text-base capitalize text-neutral-500">{sale.payment_method}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
