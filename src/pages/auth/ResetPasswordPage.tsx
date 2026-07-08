import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { updatePassword } from "../../services/auth.service";
import { resetPasswordSchema } from "../../utils/validation";
import { supabase } from "../../lib/supabaseClient";
import { ROUTES } from "../../lib/routes";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Supabase JS parses the recovery token from the URL and fires this event.
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    // If a session already exists (e.g. link opened in the same tab that
    // triggered the reset), the event may have already fired before mount.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const result = resetPasswordSchema.safeParse({ password });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await updatePassword(password);
      setSuccess(true);
      setTimeout(() => navigate(ROUTES.home, { replace: true }), 1500);
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
        <h1 className="text-2xl font-bold text-neutral-900">Set a new password</h1>
      </div>

      {success ? (
        <p className="text-center text-lg text-emerald-700">Password updated! Redirecting...</p>
      ) : !ready ? (
        <p className="text-center text-lg text-neutral-500">
          Open this page from the reset link in your email.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="New Password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error ?? undefined}
          />
          {submitError && <p className="text-lg text-red-600">{submitError}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Password"}
          </Button>
        </form>
      )}
    </div>
  );
}
