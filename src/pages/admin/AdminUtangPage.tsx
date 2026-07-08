import { Receipt } from "lucide-react";
import { AppLayout } from "../../components/layout/AppLayout";
import { PageHeader } from "../../components/common/PageHeader";
import { Spinner } from "../../components/common/Spinner";
import { EmptyState } from "../../components/common/EmptyState";
import { Card } from "../../components/common/Card";
import { AdminTabs } from "../../components/admin/AdminTabs";
import { useAdminUtang } from "../../hooks/useAdminData";
import { formatPeso } from "../../utils/currency";
import { formatDate } from "../../utils/date";

export function AdminUtangPage() {
  const { entries, loading, storeNameFor } = useAdminUtang();

  return (
    <AppLayout>
      <PageHeader title="Admin: Utang" onBack />
      <AdminTabs />

      {loading ? (
        <Spinner />
      ) : entries.length === 0 ? (
        <EmptyState icon={Receipt} title="No utang records across any store" />
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((entry) => (
            <Card key={`${entry.type}-${entry.id}`} className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-semibold text-neutral-900">
                  {storeNameFor(entry.user_id)}
                </p>
                <p className="text-base text-neutral-500">{formatDate(entry.created_at)}</p>
              </div>
              <span
                className={`shrink-0 text-lg font-bold ${
                  entry.type === "charge" ? "text-amber-700" : "text-emerald-700"
                }`}
              >
                {entry.type === "charge" ? "+" : "-"}
                {formatPeso(entry.amount)}
              </span>
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
