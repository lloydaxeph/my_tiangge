import { useNavigate, useLocation } from "react-router-dom";
import clsx from "clsx";
import { ROUTES } from "../../lib/routes";

const TABS = [
  { label: "Users", to: ROUTES.adminUsers },
  { label: "Inventory", to: ROUTES.adminInventory },
  { label: "Utang", to: ROUTES.adminUtang },
  { label: "Sales", to: ROUTES.adminSales },
];

export function AdminTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
      {TABS.map((tab) => (
        <button
          key={tab.to}
          type="button"
          onClick={() => navigate(tab.to)}
          className={clsx(
            "shrink-0 rounded-full px-4 py-2 text-base font-semibold",
            location.pathname === tab.to
              ? "bg-purple-600 text-white"
              : "bg-neutral-200 text-neutral-700"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
