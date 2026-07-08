import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { sendPasswordResetEmail } from "../../services/auth.service";
import { forgotPasswordSchema } from "../../utils/validation";
import { ROUTES } from "../../lib/routes";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await sendPasswordResetEmail(email);
      setSent(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-col justify-center px-4 py-10">
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <KeyRound className="h-14 w-14 text-emerald-600" />
        <h1 className="text-2xl font-bold text-neutral-900">Reset your password</h1>
        <p className="text-lg text-neutral-500">
          Enter your email and we&apos;ll send you a link to reset it.
        </p>
      </div>

      {sent ? (
        <p className="text-center text-lg text-neutral-700">
          Check your email ({email}) for the reset link.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error ?? undefined}
          />
          {submitError && <p className="text-lg text-red-600">{submitError}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-lg text-neutral-600">
        <Link to={ROUTES.login} className="font-semibold text-emerald-700 underline">
          Back to Login
        </Link>
      </p>
    </div>
  );
}
