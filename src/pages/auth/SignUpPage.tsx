import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "lucide-react";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { signUp } from "../../services/auth.service";
import { signUpSchema } from "../../utils/validation";
import { ROUTES } from "../../lib/routes";

export function SignUpPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ storeName: "", ownerName: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const result = signUpSchema.safeParse(form);
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
      const data = await signUp(form.email, form.password, form.storeName, form.ownerName);
      if (data.session) {
        navigate(ROUTES.home, { replace: true });
      } else {
        setConfirmationSent(true);
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (confirmationSent) {
    return (
      <div className="mx-auto flex min-h-svh w-full max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
        <Store className="h-16 w-16 text-emerald-600" />
        <h1 className="text-2xl font-bold text-neutral-900">Check your email</h1>
        <p className="text-lg text-neutral-600">
          We sent a confirmation link to {form.email}. Open it to activate your account.
        </p>
        <Link to={ROUTES.login} className="text-lg font-semibold text-emerald-700 underline">
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-col justify-center px-4 py-10">
      <div className="mb-6 flex flex-col items-center gap-2">
        <Store className="h-14 w-14 text-emerald-600" />
        <h1 className="text-3xl font-bold text-neutral-900">Create your store</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Store Name"
          name="storeName"
          placeholder="e.g. Aling Nena Store"
          value={form.storeName}
          onChange={(e) => setForm({ ...form, storeName: e.target.value })}
          error={errors.storeName}
        />
        <Input
          label="Your Name"
          name="ownerName"
          placeholder="e.g. Nena Santos"
          value={form.ownerName}
          onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
          error={errors.ownerName}
        />
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
          placeholder="At least 6 characters"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={errors.password}
        />

        {submitError && <p className="text-lg text-red-600">{submitError}</p>}

        <Button type="submit" disabled={loading} className="mt-2">
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>

      <p className="mt-6 text-center text-lg text-neutral-600">
        Already have an account?{" "}
        <Link to={ROUTES.login} className="font-semibold text-emerald-700 underline">
          Log In
        </Link>
      </p>
    </div>
  );
}
