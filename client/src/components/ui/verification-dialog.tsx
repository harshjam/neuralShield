import { Dialog, DialogContent } from "@/components/ui/dialog";
import OTPVerification from "./otp-verification";
import EnhancedSecurity from "./enhanced-security";

interface VerificationDialogProps {
  isOpen: boolean;
  amount: number;
  onVerify: () => void;
  onCancel: () => void;
}

export default function VerificationDialog({
  isOpen,
  amount,
  onVerify,
  onCancel,
}: VerificationDialogProps) {
  const requiresEnhancedSecurity = amount >= 100000; // 1 lakh

  if (!requiresEnhancedSecurity) {
    return (
      <OTPVerification
        isOpen={isOpen}
        onVerify={onVerify}
        onCancel={onCancel}
      />
    );
  }

  return (
    <EnhancedSecurity
      isOpen={isOpen}
      onVerify={onVerify}
      onCancel={onCancel}
    />
  );
}
