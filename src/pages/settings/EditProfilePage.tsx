import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../../components/layout/AppLayout";
import { PageHeader } from "../../components/common/PageHeader";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";
import { updateProfile } from "../../services/profile.service";
import { profileSchema } from "../../utils/validation";
import { ROUTES } from "../../lib/routes";

export function EditProfilePage() {
  const navigate = useNavigate();
  const { profile, session, refreshProfile } = useAuth();
  const [storeName, setStoreName] = useState(profile?.store_name ?? "");
  const [ownerName, setOwnerName] = useState(profile?.owner_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!session) return;

    const result = profileSchema.safeParse({ storeName, ownerName, phone: phone || null });
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
      await updateProfile(session.user.id, result.data);
      await refreshProfile();
      navigate(ROUTES.settings, { replace: true });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader title="Edit Store Profile" onBack />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Store Name"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          error={errors.storeName}
        />
        <Input
          label="Your Name"
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
          error={errors.ownerName}
        />
        <Input
          label="Phone Number"
          placeholder="Optional"
          value={phone ?? ""}
          onChange={(e) => setPhone(e.target.value)}
        />
        {submitError && <p className="text-lg text-red-600">{submitError}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </AppLayout>
  );
}
