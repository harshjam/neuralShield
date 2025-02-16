import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Transaction } from "@shared/schema";
import { Link } from "wouter";
import { ArrowRight, LogOut } from "lucide-react";
import TransactionHistory from "@/components/transaction-history";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const { data: transactions } = useQuery<Transaction[]>({ queryKey: ["/api/transactions"] });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">SecureBank</h1>
          <Button variant="ghost" onClick={() => logoutMutation.mutate()}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {user?.username}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{user?.balance?.toLocaleString()}</div>
              <p className="text-muted-foreground">Available Balance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/send">
                <Button className="w-full">
                  Send Money
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <TransactionHistory transactions={transactions || []} />
      </div>
    </div>
  );
}
