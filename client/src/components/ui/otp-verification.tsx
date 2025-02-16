import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export interface OTPVerificationProps {
  isOpen: boolean;
  onVerify: () => void;
  onCancel: () => void;
}

export default function OTPVerification({
  isOpen,
  onVerify,
  onCancel,
}: OTPVerificationProps) {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    setIsVerifying(true);
    // Simulate OTP verification delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsVerifying(false);
    onVerify();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => !isVerifying && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter OTP</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert>
            <AlertDescription>
              A one-time password has been sent to your registered mobile number
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onCancel} disabled={isVerifying}>
              Cancel
            </Button>
            <Button
              onClick={handleVerify}
              disabled={otp.length !== 6 || isVerifying}
            >
              {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify OTP
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
