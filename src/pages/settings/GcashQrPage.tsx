import { useRef, useState } from "react";
import { QrCode, Upload } from "lucide-react";
import { AppLayout } from "../../components/layout/AppLayout";
import { PageHeader } from "../../components/common/PageHeader";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { useAuth } from "../../hooks/useAuth";
import { uploadGcashQr } from "../../services/profile.service";

export function GcashQrPage() {
  const { profile, session, refreshProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session) return;
    setError(null);
    setUploading(true);
    try {
      await uploadGcashQr(session.user.id, file);
      await refreshProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader title="GCash QR Code" onBack />

      <Card className="flex flex-col items-center gap-4 py-10">
        {profile?.gcash_qr_image_url ? (
          <img
            src={profile.gcash_qr_image_url}
            alt="GCash QR Code"
            className="h-72 w-72 rounded-2xl border border-neutral-200 object-contain p-2"
          />
        ) : (
          <div className="flex h-72 w-72 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-neutral-300 text-neutral-400">
            <QrCode className="h-16 w-16" />
            <p className="text-lg">No QR code uploaded yet</p>
          </div>
        )}

        <p className="text-center text-lg text-neutral-500">
          Show this screen to customers so they can scan and pay you via GCash.
        </p>

        {error && <p className="text-lg text-red-600">{error}</p>}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center justify-center gap-2"
        >
          <Upload className="h-5 w-5" />
          {uploading ? "Uploading..." : profile?.gcash_qr_image_url ? "Replace QR Code" : "Upload QR Code"}
        </Button>
      </Card>
    </AppLayout>
  );
}
