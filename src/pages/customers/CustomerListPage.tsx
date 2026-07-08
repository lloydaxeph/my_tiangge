import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Users, BellRing } from "lucide-react";
import { AppLayout } from "../../components/layout/AppLayout";
import { PageHeader } from "../../components/common/PageHeader";
import { SearchBar } from "../../components/common/SearchBar";
import { Button } from "../../components/common/Button";
import { Spinner } from "../../components/common/Spinner";
import { EmptyState } from "../../components/common/EmptyState";
import { Modal } from "../../components/common/Modal";
import { CustomerCard } from "../../components/customers/CustomerCard";
import { CustomerForm } from "../../components/customers/CustomerForm";
import { useCustomers } from "../../hooks/useCustomers";
import { useAuth } from "../../hooks/useAuth";
import { createCustomer } from "../../services/customers.service";
import { ROUTES } from "../../lib/routes";

export function CustomerListPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { customers, loading, refresh } = useCustomers();
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(
    () => customers.filter((c) => c.customer.name.toLowerCase().includes(search.toLowerCase())),
    [customers, search]
  );

  const handleAddCustomer = async (name: string, phone: string | null) => {
    if (!session) return;
    await createCustomer(session.user.id, name, phone);
    await refresh();
    setAddOpen(false);
  };

  return (
    <AppLayout>
      <PageHeader
        title="Customers"
        onBack
        action={
          <button
            type="button"
            onClick={() => navigate(ROUTES.customerReminders)}
            aria-label="Reminders"
            className="flex h-12 w-12 items-center justify-center rounded-full active:bg-neutral-200"
          >
            <BellRing className="h-7 w-7 text-amber-600" />
          </button>
        }
      />

      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search customers" />
      </div>

      {loading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No customers yet"
          description="Tap Add Customer to start tracking utang."
        />
      ) : (
        <div className="mb-24 flex flex-col gap-3">
          {filtered.map(({ customer, balance }) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              balance={balance}
              onClick={() => navigate(ROUTES.customerDetail(customer.id))}
            />
          ))}
        </div>
      )}

      <div className="fixed bottom-6 left-1/2 w-full max-w-md -translate-x-1/2 px-4">
        <Button onClick={() => setAddOpen(true)} className="flex items-center justify-center gap-2">
          <Plus className="h-6 w-6" /> Add Customer
        </Button>
      </div>

      {addOpen && (
        <Modal title="Add Customer" onClose={() => setAddOpen(false)}>
          <CustomerForm onSubmit={handleAddCustomer} />
        </Modal>
      )}
    </AppLayout>
  );
}
