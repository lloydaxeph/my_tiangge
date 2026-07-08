import { useState, type FormEvent } from "react";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { customerSchema } from "../../utils/validation";

export function CustomerForm({
  onSubmit,
}: {
  onSubmit: (name: string, phone: string | null) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const result = customerSchema.safeParse({ name, phone: phone || null });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onSubmit(result.data.name, result.data.phone);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Customer Name" value={name} onChange={(e) => setName(e.target.value)} error={error ?? undefined} />
      <Input
        label="Phone Number"
        placeholder="Optional"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      {submitError && <p className="text-lg text-red-600">{submitError}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Add Customer"}
      </Button>
    </form>
  );
}
