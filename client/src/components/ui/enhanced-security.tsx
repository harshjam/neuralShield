import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Fingerprint, Camera, Brain, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface EnhancedSecurityProps {
  isOpen: boolean;
  onVerify: () => void;
  onCancel: () => void;
}

export default function EnhancedSecurity({
  isOpen,
  onVerify,
  onCancel,
}: EnhancedSecurityProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [fraudScore, setFraudScore] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStatus, setCameraStatus] = useState("");

  const steps = [
    {
      title: "Biometric Verification",
      icon: Fingerprint,
      message: "Place your finger on the Touch ID sensor...",
      duration: 1500,
    },
    {
      title: "Camera Verification",
      icon: Camera,
      message: "Capturing facial features for verification...",
      duration: 4000, // Increased duration for camera capture
    },
    {
      title: "Fraud Detection",
      icon: Brain,
      message: "Running ML-based fraud detection...",
      duration: 2500,
    },
  ];

  const simulateStep = async () => {
    const step = steps[currentStep];

    // Reset progress for new step
    setProgress(0);

    // Special handling for camera step
    if (currentStep === 1) {
      setShowCamera(true);
      setCameraStatus("Initializing camera...");
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Camera capture sequence
      setCameraStatus("Looking for face...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setCameraStatus("Face detected - Capturing...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setCameraStatus("Running ML analysis...");
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setShowCamera(false);
    }

    // Simulate progress
    const interval = step.duration / 20;
    for (let i = 0; i <= 100; i += 5) {
      setProgress(i);
      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    // Special handling for fraud detection step
    if (currentStep === 2) {
      // Generate random fraud score (0-100)
      const score = Math.floor(Math.random() * 100);
      setFraudScore(score);

      // If fraud score is too high, don't proceed
      if (score > 70) {
        return;
      }
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      await new Promise((resolve) => setTimeout(resolve, 500));
      onVerify();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enhanced Security Verification</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {fraudScore > 70 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                High fraud risk detected (Score: {fraudScore}). Transaction blocked.
              </AlertDescription>
            </Alert>
          )}

          {showCamera && (
            <div className="relative w-full aspect-video bg-black rounded-lg mb-4 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="w-16 h-16 text-white animate-pulse" />
              </div>
              <div className="absolute top-4 left-4">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </div>
              <div className="absolute inset-0 border-2 border-white/20">
                {/* Face detection frame */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-green-400/50 rounded-full" />
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
                {cameraStatus}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center space-x-4 p-4 rounded-lg ${
                  index === currentStep
                    ? "bg-primary/10"
                    : index < currentStep
                    ? "bg-green-50"
                    : "bg-gray-50"
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <step.icon
                    className={`h-6 w-6 ${
                      index === currentStep ? "text-primary" : "text-gray-400"
                    }`}
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium">{step.title}</p>
                  {index === currentStep && (
                    <p className="text-sm text-muted-foreground">
                      {step.message}
                    </p>
                  )}
                </div>
                {index === currentStep && (
                  <Progress value={progress} className="w-[100px]" />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              onClick={simulateStep}
              disabled={fraudScore > 70 || progress > 0}
            >
              {currentStep === steps.length - 1 ? "Complete" : "Next"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}