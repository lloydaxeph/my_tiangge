import { useNavigate } from "react-router-dom";
import { ShoppingCart, Package, Users, Settings } from "lucide-react";
import { AppLayout } from "../components/layout/AppLayout";
import { CardButton } from "../components/common/Card";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../lib/routes";

const HOME_BUTTONS = [
  { label: "New Sale", icon: ShoppingCart, to: ROUTES.pos, color: "text-emerald-600" },
  { label: "Inventory", icon: Package, to: ROUTES.inventory, color: "text-sky-600" },
  { label: "Customers (Utang)", icon: Users, to: ROUTES.customers, color: "text-amber-600" },
  { label: "Settings", icon: Settings, to: ROUTES.settings, color: "text-neutral-600" },
];

export function HomePage() {
  const navigate = useNavigate();
  const { profile } = useAuth();

  return (
    <AppLayout>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-neutral-900">
          {profile?.store_name || "My Store"}
        </h1>
        <p className="text-lg text-neutral-500">Hi, {profile?.owner_name || "there"}!</p>
      </div>

      <div className="flex flex-col gap-4">
        {HOME_BUTTONS.map(({ label, icon: Icon, to, color }) => (
          <CardButton
            key={label}
            onClick={() => navigate(to)}
            className="flex min-h-28 items-center gap-5"
          >
            <Icon className={`h-12 w-12 shrink-0 ${color}`} />
            <span className="text-2xl font-semibold text-neutral-900">{label}</span>
          </CardButton>
        ))}
      </div>
    </AppLayout>
  );
}
