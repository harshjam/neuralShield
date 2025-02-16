import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transferSchema, type TransferData } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import VerificationDialog from "@/components/ui/verification-dialog";

interface VerificationResult {
  biometricVerified: boolean;
  faceImage?: string;
}

export default function SendMoney() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [showVerification, setShowVerification] = useState(false);
  const [pendingTransfer, setPendingTransfer] = useState<TransferData | null>(null);

  const form = useForm<TransferData>({
    resolver: zodResolver(
      transferSchema.extend({
        amount: transferSchema.shape.amount.max(
          user?.balance || 0,
          "Amount exceeds available balance"
        ),
      })
    ),
    defaultValues: {
      receiverUsername: "",
      amount: 0,
    },
  });

  const transferMutation = useMutation({
    mutationFn: async (data: { transfer: TransferData; verification?: VerificationResult }) => {
      const res = await apiRequest("POST", "/api/transfer", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Transfer successful",
        description: "Money has been sent successfully",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Transfer failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TransferData) => {
    // Check if amount requires verification (>= 1 lakh)
    if (data.amount >= 100000) {
      setPendingTransfer(data);
      setShowVerification(true);
    } else {
      // For smaller amounts, proceed without verification
      transferMutation.mutate({ transfer: data });
    }
  };

  const handleVerificationComplete = (verificationResult: VerificationResult) => {
    if (pendingTransfer && verificationResult.biometricVerified) {
      transferMutation.mutate({
        transfer: pendingTransfer,
        verification: verificationResult
      });
    }
    setShowVerification(false);
    setPendingTransfer(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto p-4">
        <Button
          variant="ghost"
          className="mb-8"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Send Money</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="receiverUsername"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipient Username</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount (₹)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={transferMutation.isPending}
                  >
                    Send Money
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <VerificationDialog
          isOpen={showVerification}
          amount={pendingTransfer?.amount || 0}
          onVerify={handleVerificationComplete}
          onCancel={() => {
            setShowVerification(false);
            setPendingTransfer(null);
          }}
        />
      </div>
    </div>
  );
}