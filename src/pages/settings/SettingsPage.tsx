import { useNavigate } from "react-router-dom";
import { UserCog, QrCode, LogOut, ShieldCheck } from "lucide-react";
import { AppLayout } from "../../components/layout/AppLayout";
import { PageHeader } from "../../components/common/PageHeader";
import { CardButton } from "../../components/common/Card";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../lib/routes";

export function SettingsPage() {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate(ROUTES.login, { replace: true });
  };

  return (
    <AppLayout>
      <PageHeader title="Settings" onBack />

      <div className="flex flex-col gap-4">
        <CardButton
          onClick={() => navigate(ROUTES.settingsProfile)}
          className="flex items-center gap-4"
        >
          <UserCog className="h-9 w-9 text-sky-600" />
          <span className="text-xl font-semibold text-neutral-900">Edit Store Profile</span>
        </CardButton>

        <CardButton
          onClick={() => navigate(ROUTES.settingsGcashQr)}
          className="flex items-center gap-4"
        >
          <QrCode className="h-9 w-9 text-emerald-600" />
          <span className="text-xl font-semibold text-neutral-900">GCash QR Code</span>
        </CardButton>

        {profile?.is_admin && (
          <CardButton
            onClick={() => navigate(ROUTES.adminUsers)}
            className="flex items-center gap-4"
          >
            <ShieldCheck className="h-9 w-9 text-purple-600" />
            <span className="text-xl font-semibold text-neutral-900">Admin Panel</span>
          </CardButton>
        )}

        <CardButton onClick={handleLogout} className="flex items-center gap-4">
          <LogOut className="h-9 w-9 text-red-600" />
          <span className="text-xl font-semibold text-neutral-900">Log Out</span>
        </CardButton>
      </div>
    </AppLayout>
  );
}
