import { useState, type FormEvent } from "react";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { utangSchema } from "../../utils/validation";

export function UtangForm({
  onSubmit,
  onClose,
}: {
  onSubmit: (amount: number, description: string | null) => Promise<void>;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const result = utangSchema.safeParse({ amount, description: description || null });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onSubmit(result.data.amount, result.data.description);
      onClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Amount (₱)"
        type="number"
        inputMode="decimal"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        error={error ?? undefined}
      />
      <Input
        label="What for?"
        placeholder="Optional, e.g. rice, sardines"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {submitError && <p className="text-lg text-red-600">{submitError}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Add Utang"}
      </Button>
    </form>
  );
}
