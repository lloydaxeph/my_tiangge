import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Store } from "lucide-react";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { signIn } from "../../services/auth.service";
import { loginSchema } from "../../utils/validation";
import { ROUTES } from "../../lib/routes";

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const disabledNotice = searchParams.get("disabled") === "1";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await signIn(form.email, form.password);
      navigate(ROUTES.home, { replace: true });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-col justify-center px-4 py-10">
      <div className="mb-6 flex flex-col items-center gap-2">
        <Store className="h-14 w-14 text-emerald-600" />
        <h1 className="text-3xl font-bold text-neutral-900">MyTiangge</h1>
        <p className="text-lg text-neutral-500">Your store, in your pocket</p>
      </div>

      {disabledNotice && (
        <div className="mb-4 rounded-xl bg-red-50 p-4 text-lg text-red-700">
          Your account has been disabled. Please contact the administrator.
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Your password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={errors.password}
        />

        {submitError && <p className="text-lg text-red-600">{submitError}</p>}

        <div className="text-right">
          <Link to={ROUTES.forgotPassword} className="text-lg font-semibold text-emerald-700 underline">
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </Button>
      </form>

      <p className="mt-6 text-center text-lg text-neutral-600">
        Don&apos;t have an account?{" "}
        <Link to={ROUTES.signup} className="font-semibold text-emerald-700 underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
