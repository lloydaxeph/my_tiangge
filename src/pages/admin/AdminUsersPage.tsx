import { AppLayout } from "../../components/layout/AppLayout";
import { PageHeader } from "../../components/common/PageHeader";
import { Spinner } from "../../components/common/Spinner";
import { EmptyState } from "../../components/common/EmptyState";
import { AdminTabs } from "../../components/admin/AdminTabs";
import { UserCard } from "../../components/admin/UserCard";
import { useAdminUsers } from "../../hooks/useAdminData";
import { Users } from "lucide-react";

export function AdminUsersPage() {
  const { users, loading, toggleDisabled } = useAdminUsers();

  return (
    <AppLayout>
      <PageHeader title="Admin: Users" onBack />
      <AdminTabs />

      {loading ? (
        <Spinner />
      ) : users.length === 0 ? (
        <EmptyState icon={Users} title="No registered users" />
      ) : (
        <div className="flex flex-col gap-3">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onToggleDisabled={(disabled) => toggleDisabled(user.id, disabled)}
            />
          ))}
        </div>
      )}
    </AppLayout>
  );
}
