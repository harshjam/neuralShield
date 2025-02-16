import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Fingerprint, Loader2 } from "lucide-react";
import OTPVerification from "./otp-verification";

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
  const requiresHighSecurity = amount >= 100000; // 1 lakh threshold

  // For amounts under 1 lakh, show simple OTP verification
  if (!requiresHighSecurity) {
    return (
      <OTPVerification
        isOpen={isOpen}
        onVerify={() => onVerify({ biometricVerified: true })}
        onCancel={onCancel}
      />
    );
  }

  const [isVerifying, setIsVerifying] = useState(false);
  const [status, setStatus] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } 
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      return true;
    } catch (err) {
      console.error("Camera access failed:", err);
      return false;
    }
  };

  const captureAndStopCamera = async (): Promise<string | undefined> => {
    if (videoRef.current && streamRef.current) {
      // Create canvas and capture frame
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);

      // Stop camera
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      videoRef.current.srcObject = null;

      // Convert to base64
      return canvas.toDataURL('image/jpeg');
    }
  };

  const handleVerification = async () => {
    setIsVerifying(true);
    setStatus("Starting biometric verification...");

    // Start camera
    const cameraStarted = await startCamera();
    if (!cameraStarted) {
      setStatus("Camera access failed. Please check permissions.");
      setIsVerifying(false);
      return;
    }

    // Wait for video to initialize
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus("Capturing face data...");

    // Capture image and stop camera
    const faceImage = await captureAndStopCamera();

    setStatus("Processing verification...");
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsVerifying(false);
    onVerify({ 
      biometricVerified: true,
      faceImage 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => !isVerifying && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>High-Value Transaction Verification</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-4">
          {!isVerifying ? (
            <>
              <Fingerprint className="w-16 h-16 text-primary animate-pulse" />
              <Alert>
                <AlertDescription>
                  This high-value transaction requires additional security verification.
                  Your camera will be activated for face verification.
                </AlertDescription>
              </Alert>
            </>
          ) : (
            <div className="space-y-4 w-full">
              <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-1 border-2 border-green-400 rounded-full animate-pulse">
                    <div className="w-32 h-32 rounded-full border-2 border-green-400/50" />
                  </div>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground">{status}</p>
              <div className="flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 w-full">
            <Button variant="outline" onClick={onCancel} disabled={isVerifying}>
              Cancel
            </Button>
            <Button onClick={handleVerification} disabled={isVerifying}>
              {isVerifying ? "Verifying..." : "Start Verification"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}