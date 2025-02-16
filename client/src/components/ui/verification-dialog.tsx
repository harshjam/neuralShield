import { Dialog, DialogContent } from "@/components/ui/dialog";
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

  // For amounts under 1 lakh, directly verify
  if (!requiresEnhancedSecurity) {
    if (isOpen) {
      onVerify();
    }
    return null;
  }

  // For amounts over 1 lakh, show enhanced security
  return (
    <EnhancedSecurity
      isOpen={isOpen}
      onVerify={onVerify}
      onCancel={onCancel}
    />
  );
}