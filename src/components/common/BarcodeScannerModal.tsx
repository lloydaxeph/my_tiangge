import { useState } from "react";
import { X } from "lucide-react";
import { useBarcodeScanner } from "../../hooks/useBarcodeScanner";
import { Input } from "./Input";
import { Button } from "./Button";

export function BarcodeScannerModal({
  onDetected,
  onClose,
}: {
  onDetected: (code: string) => void;
  onClose: () => void;
}) {
  const [manualCode, setManualCode] = useState("");
  const { videoRef, error } = useBarcodeScanner(onDetected, true);

  const handleManualSubmit = () => {
    if (manualCode.trim()) onDetected(manualCode.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-xl font-semibold text-white">Scan Barcode</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex h-12 w-12 items-center justify-center rounded-full active:bg-white/10"
        >
          <X className="h-7 w-7 text-white" />
        </button>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
      </div>

      <div className="flex flex-col gap-3 bg-white p-4">
        {error && (
          <p className="text-base text-red-600">
            Camera unavailable: {error}. You can type the barcode instead.
          </p>
        )}
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Or type barcode here"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
            />
          </div>
          <Button variant="secondary" fullWidth={false} onClick={handleManualSubmit} className="px-5">
            Use
          </Button>
        </div>
      </div>
    </div>
  );
}
