import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Plus, Minus, Receipt } from "lucide-react";
import { AppLayout } from "../../components/layout/AppLayout";
import { PageHeader } from "../../components/common/PageHeader";
import { Spinner } from "../../components/common/Spinner";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { EmptyState } from "../../components/common/EmptyState";
import { BalanceBadge } from "../../components/customers/BalanceBadge";
import { UtangForm } from "../../components/customers/UtangForm";
import { PaymentForm } from "../../components/customers/PaymentForm";
import { useAuth } from "../../hooks/useAuth";
import { getCustomer } from "../../services/customers.service";
import { addUtang, addPayment, getCustomerBalance, getLedger, type LedgerEntry } from "../../services/utang.service";
import { formatDate } from "../../utils/date";
import { formatPeso } from "../../utils/currency";
import type { Customer } from "../../types/domain";

export function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { session } = useAuth();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [balance, setBalance] = useState(0);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [utangOpen, setUtangOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [c, b, l] = await Promise.all([getCustomer(id), getCustomerBalance(id), getLedger(id)]);
      setCustomer(c);
      setBalance(b);
      setLedger(l);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <AppLayout>
        <Spinner />
      </AppLayout>
    );
  }

  if (!customer || !id || !session) {
    return (
      <AppLayout>
        <PageHeader title="Customer not found" onBack />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader title={customer.name} onBack />

      <Card className="mb-4 flex flex-col items-center gap-2 py-6 text-center">
        <p className="text-lg text-neutral-500">Current Balance</p>
        <BalanceBadge balance={balance} />
      </Card>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <Button
          onClick={() => setUtangOpen(true)}
          className="flex items-center justify-center gap-2"
        >
          <Plus className="h-5 w-5" /> Add Utang
        </Button>
        <Button
          variant="secondary"
          onClick={() => setPaymentOpen(true)}
          disabled={balance <= 0}
          className="flex items-center justify-center gap-2"
        >
          <Minus className="h-5 w-5" /> Add Payment
        </Button>
      </div>

      <h2 className="mb-2 text-xl font-semibold text-neutral-900">History</h2>
      {ledger.length === 0 ? (
        <EmptyState icon={Receipt} title="No history yet" description="Add the first utang above." />
      ) : (
        <div className="flex flex-col gap-2">
          {ledger.map((entry) => (
            <Card key={`${entry.type}-${entry.id}`} className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-neutral-900">
                  {entry.type === "charge" ? entry.note || "Utang" : entry.note || "Payment"}
                </p>
                <p className="text-base text-neutral-500">{formatDate(entry.createdAt)}</p>
              </div>
              <span
                className={`text-lg font-bold ${
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

      {utangOpen && (
        <Modal title="Add Utang" onClose={() => setUtangOpen(false)}>
          <UtangForm
            onClose={() => setUtangOpen(false)}
            onSubmit={async (amount, description) => {
              await addUtang(session.user.id, id, amount, description);
              await load();
            }}
          />
        </Modal>
      )}

      {paymentOpen && (
        <Modal title="Add Payment" onClose={() => setPaymentOpen(false)}>
          <PaymentForm
            maxAmount={balance}
            onClose={() => setPaymentOpen(false)}
            onSubmit={async (amount, note) => {
              await addPayment(session.user.id, id, amount, note);
              await load();
            }}
          />
        </Modal>
      )}
    </AppLayout>
  );
}
