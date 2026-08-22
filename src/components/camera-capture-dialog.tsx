import React, { useEffect, useRef, useState } from "react";
import { Camera, Check, RefreshCw, SwitchCamera, X, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useT } from "@/components/language-context";

interface CameraCaptureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCapture: (file: File) => void;
}

export function CameraCaptureDialog({
  open,
  onOpenChange,
  onCapture,
}: CameraCaptureDialogProps) {
  const t = useT();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Start camera stream whenever dialog opens or facingMode changes
  useEffect(() => {
    if (!open) {
      stopStream();
      setCapturedUrl(null);
      setCapturedBlob(null);
      setError(null);
      return;
    }

    let isMounted = true;
    async function startCamera() {
      setLoading(true);
      setError(null);
      stopStream();

      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Camera API is not supported in this browser.");
        }

        const newStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });

        if (!isMounted) {
          newStream.getTracks().forEach((track) => track.stop());
          return;
        }

        setStream(newStream);
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
          videoRef.current.play().catch(() => {});
        }
      } catch (err: unknown) {
        console.warn("Camera start error:", err);
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to access camera. Please check permissions."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    startCamera();

    return () => {
      isMounted = false;
      stopStream();
    };
  }, [open, facingMode]);

  function stopStream() {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  }

  function toggleFacingMode() {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  }

  function handleTakePhoto() {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          setCapturedBlob(blob);
          const url = URL.createObjectURL(blob);
          setCapturedUrl(url);
        }
      },
      "image/jpeg",
      0.85
    );
  }

  function handleRetake() {
    if (capturedUrl) {
      URL.revokeObjectURL(capturedUrl);
    }
    setCapturedUrl(null);
    setCapturedBlob(null);
  }

  function handleConfirmPhoto() {
    if (!capturedBlob) return;
    const filename = `camera-capture-${Date.now()}.jpg`;
    const file = new File([capturedBlob], filename, { type: "image/jpeg" });
    onCapture(file);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg overflow-hidden rounded-3xl border-border bg-card p-0 shadow-2xl">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-border px-5 py-4">
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
            <Camera className="size-5 text-primary" aria-hidden="true" />
            {t.raise.takePhoto}
          </DialogTitle>
        </DialogHeader>

        <div className="relative aspect-4/3 w-full overflow-hidden bg-black">
          {error ? (
            <div className="flex size-full flex-col items-center justify-center gap-3 p-6 text-center text-white">
              <AlertCircle className="size-10 text-destructive" />
              <p className="text-sm font-semibold">{error}</p>
              <p className="text-xs text-white/70">
                Please allow camera access in browser settings or use the file browser button.
              </p>
            </div>
          ) : capturedUrl ? (
            <img
              src={capturedUrl}
              alt="Captured"
              className="size-full object-cover"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="size-full object-cover"
              />
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white">
                  <RefreshCw className="size-8 animate-spin text-primary" />
                </div>
              )}
            </>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Action controls footer */}
        <div className="flex items-center justify-between bg-card p-4">
          {capturedUrl ? (
            <div className="flex w-full items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleRetake}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                <RefreshCw className="size-4" />
                Retake
              </button>
              <button
                type="button"
                onClick={handleConfirmPhoto}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary/90"
              >
                <Check className="size-4" />
                Use Photo
              </button>
            </div>
          ) : (
            <div className="flex w-full items-center justify-between">
              <button
                type="button"
                onClick={toggleFacingMode}
                disabled={Boolean(error || loading)}
                className="grid size-11 place-items-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/80 disabled:opacity-50"
                title="Switch Camera"
              >
                <SwitchCamera className="size-5" />
              </button>

              <button
                type="button"
                onClick={handleTakePhoto}
                disabled={Boolean(error || loading)}
                className="grid size-14 place-items-center rounded-full border-4 border-primary bg-primary/20 transition-transform active:scale-95 disabled:opacity-50"
                title="Capture Photo"
              >
                <span className="size-9 rounded-full bg-primary" />
              </button>

              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="grid size-11 place-items-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/80"
                title="Cancel"
              >
                <X className="size-5" />
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
