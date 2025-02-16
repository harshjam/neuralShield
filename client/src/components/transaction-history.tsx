import { Transaction, User } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

export default function TransactionHistory({ transactions }: { transactions: Transaction[] }) {
  const { user } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-lg bg-white"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.senderId === user?.id
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {transaction.senderId === user?.id ? "-" : "+"}
                </div>
                <div>
                  <p className="font-medium">
                    {transaction.senderId === user?.id ? "Sent" : "Received"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  ₹{transaction.amount.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground capitalize">
                  {transaction.status}
                </p>
              </div>
            </div>
          ))}
          {transactions.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              No transactions yet
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
