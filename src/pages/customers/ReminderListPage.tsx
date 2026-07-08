import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BellRing } from "lucide-react";
import { AppLayout } from "../../components/layout/AppLayout";
import { PageHeader } from "../../components/common/PageHeader";
import { Spinner } from "../../components/common/Spinner";
import { EmptyState } from "../../components/common/EmptyState";
import { CustomerCard } from "../../components/customers/CustomerCard";
import { useCustomers } from "../../hooks/useCustomers";
import { daysAgo } from "../../utils/date";
import { ROUTES } from "../../lib/routes";

export function ReminderListPage() {
  const navigate = useNavigate();
  const { customers, loading } = useCustomers();

  const withBalance = useMemo(
    () =>
      customers
        .filter((c) => c.balance > 0)
        .sort((a, b) => {
          const aDays = a.oldestChargeDate ? daysAgo(a.oldestChargeDate) : 0;
          const bDays = b.oldestChargeDate ? daysAgo(b.oldestChargeDate) : 0;
          return bDays - aDays;
        }),
    [customers]
  );

  return (
    <AppLayout>
      <PageHeader title="Reminders" onBack />

      {loading ? (
        <Spinner />
      ) : withBalance.length === 0 ? (
        <EmptyState icon={BellRing} title="No outstanding balances" description="Everyone is paid up!" />
      ) : (
        <div className="flex flex-col gap-3">
          {withBalance.map(({ customer, balance, oldestChargeDate }) => (
            <div key={customer.id}>
              <CustomerCard
                customer={customer}
                balance={balance}
                onClick={() => navigate(ROUTES.customerDetail(customer.id))}
              />
              {oldestChargeDate && (
                <p className="mt-1 pl-2 text-base text-neutral-500">
                  Oldest utang: {daysAgo(oldestChargeDate)} days ago
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
