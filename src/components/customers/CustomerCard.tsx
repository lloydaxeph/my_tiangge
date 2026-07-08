import { User } from "lucide-react";
import { CardButton } from "../common/Card";
import { BalanceBadge } from "./BalanceBadge";
import type { Customer } from "../../types/domain";

export function CustomerCard({
  customer,
  balance,
  onClick,
}: {
  customer: Customer;
  balance: number;
  onClick: () => void;
}) {
  return (
    <CardButton onClick={onClick} className="flex items-center gap-4">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-neutral-100">
        <User className="h-7 w-7 text-neutral-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xl font-semibold text-neutral-900">{customer.name}</p>
        {customer.phone && <p className="text-lg text-neutral-500">{customer.phone}</p>}
      </div>
      <BalanceBadge balance={balance} />
    </CardButton>
  );
}
