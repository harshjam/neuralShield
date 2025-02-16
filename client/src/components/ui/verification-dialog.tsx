import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Fingerprint, Loader2 } from "lucide-react";

interface VerificationResult {
  biometricVerified: boolean;
  faceImage?: string;
}

interface VerificationDialogProps {
  isOpen: boolean;
  amount: number;
  onVerify: (verificationData: VerificationResult) => void;
  onCancel: () => void;
}

export default function VerificationDialog({
  isOpen,
  amount,
  onVerify,
  onCancel,
}: VerificationDialogProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [status, setStatus] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureImage = async (): Promise<string | undefined> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } 
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        // Wait for video to be ready
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = resolve;
          }
        });

        // Create canvas and capture frame
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(videoRef.current, 0, 0);

        // Stop camera
        stream.getTracks().forEach(track => track.stop());

        // Convert to base64
        return canvas.toDataURL('image/jpeg');
      }
    } catch (err) {
      console.error("Camera access failed:", err);
      return undefined;
    }
  };

  const handleVerification = async () => {
    setIsVerifying(true);
    setStatus("Starting biometric verification...");

    // Simulate biometric verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStatus("Performing security checks...");

    // Capture face image in background
    const faceImage = await captureImage();

    // Simulate final verification
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsVerifying(false);
    onVerify({ 
      biometricVerified: true,
      faceImage 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => !isVerifying && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center space-y-4 py-4">
          {!isVerifying ? (
            <>
              <Fingerprint className="w-16 h-16 text-primary animate-pulse" />
              <h3 className="text-lg font-semibold text-center">
                High-Value Transaction Verification Required
              </h3>
              <Alert>
                <AlertDescription>
                  This transaction requires additional security verification.
                  Please verify your identity to proceed.
                </AlertDescription>
              </Alert>
              <video ref={videoRef} className="hidden" autoPlay playsInline muted />
            </>
          ) : (
            <div className="text-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              <p className="text-sm text-muted-foreground">{status}</p>
            </div>
          )}

          <div className="flex justify-end space-x-2 w-full">
            <Button variant="outline" onClick={onCancel} disabled={isVerifying}>
              Cancel
            </Button>
            <Button onClick={handleVerification} disabled={isVerifying}>
              {isVerifying ? "Verifying..." : "Verify Identity"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}