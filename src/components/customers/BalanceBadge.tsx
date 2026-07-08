import { formatPeso } from "../../utils/currency";

export function BalanceBadge({ balance }: { balance: number }) {
  if (balance <= 0) {
    return (
      <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-base font-semibold text-emerald-700">
        Paid up
      </span>
    );
  }

  return (
    <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-base font-semibold text-amber-800">
      Owes {formatPeso(balance)}
    </span>
  );
}
