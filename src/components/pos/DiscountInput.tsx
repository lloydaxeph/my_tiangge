import { Input } from "../common/Input";

export function DiscountInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Input
      label="Discount (₱)"
      type="number"
      inputMode="decimal"
      placeholder="0"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
