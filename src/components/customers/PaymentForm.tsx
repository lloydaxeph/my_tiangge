import { useState, type FormEvent } from "react";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { paymentSchema } from "../../utils/validation";

export function PaymentForm({
  maxAmount,
  onSubmit,
  onClose,
}: {
  maxAmount: number;
  onSubmit: (amount: number, note: string | null) => Promise<void>;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const result = paymentSchema.safeParse({ amount, note: note || null });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onSubmit(result.data.amount, result.data.note);
      onClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-lg text-neutral-600">Current balance: ₱{maxAmount.toFixed(2)}</p>
      <Input
        label="Payment Amount (₱)"
        type="number"
        inputMode="decimal"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        error={error ?? undefined}
      />
      <Input
        label="Note"
        placeholder="Optional"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      {submitError && <p className="text-lg text-red-600">{submitError}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Record Payment"}
      </Button>
    </form>
  );
}
