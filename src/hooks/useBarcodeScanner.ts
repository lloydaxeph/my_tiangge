import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import type { IScannerControls } from "@zxing/browser";

export function useBarcodeScanner(onDetected: (text: string) => void, active: boolean) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!active || !videoRef.current) return;

    const reader = new BrowserMultiFormatReader();
    let cancelled = false;
    let controls: IScannerControls | null = null;

    (async () => {
      try {
        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        const rearCamera = devices.find((d) => /back|rear|environment/i.test(d.label));
        const deviceId = rearCamera?.deviceId ?? devices[0]?.deviceId;

        controls = await reader.decodeFromVideoDevice(deviceId, videoRef.current!, (result, err) => {
          if (cancelled) return;
          if (result) onDetected(result.getText());
          // NotFoundException fires continuously while no code is in view -- not a real error.
          if (err && err.name !== "NotFoundException") setError(err.message);
        });
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not access camera");
        }
      }
    })();

    return () => {
      cancelled = true;
      controls?.stop();
    };
  }, [active, onDetected]);

  return { videoRef, error };
}
