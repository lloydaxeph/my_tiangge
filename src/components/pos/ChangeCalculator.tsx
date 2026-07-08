import { Input } from "../common/Input";
import { formatPeso } from "../../utils/currency";

export function ChangeCalculator({
  total,
  amountTendered,
  onChange,
}: {
  total: number;
  amountTendered: string;
  onChange: (value: string) => void;
}) {
  const tendered = Number(amountTendered) || 0;
  const change = tendered - total;

  return (
    <div className="flex flex-col gap-2">
      <Input
        label="Cash Received (₱)"
        type="number"
        inputMode="decimal"
        placeholder="0"
        value={amountTendered}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="flex items-center justify-between rounded-xl bg-neutral-100 px-4 py-3">
        <span className="text-lg font-medium text-neutral-700">Change</span>
        <span className={`text-xl font-bold ${change < 0 ? "text-red-600" : "text-emerald-700"}`}>
          {formatPeso(Math.max(change, 0))}
        </span>
      </div>
    </div>
  );
}
