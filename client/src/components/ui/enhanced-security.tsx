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

  const steps = [
    {
      title: "Biometric Verification",
      icon: Fingerprint,
      message: "Scanning fingerprint via Touch ID...",
      duration: 1500,
    },
    {
      title: "Camera Verification",
      icon: Camera,
      message: "Capturing and analyzing facial features...",
      duration: 2000,
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