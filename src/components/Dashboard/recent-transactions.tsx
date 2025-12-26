import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const transactions = [
  { name: "Alex Johnson", email: "alex@example.com", amount: "+$1,999.00", initials: "AJ" },
  { name: "Sarah Williams", email: "sarah@example.com", amount: "+$350.00", initials: "SW" },
  { name: "Supply Co.", email: "billing@supply.com", amount: "-$12,000.00", initials: "SC" },
  { name: "Tech Solutions", email: "contact@tech.io", amount: "-$450.00", initials: "TS" },
];

export function RecentTransactions() {
  return (
    <Card className="bg-card/50 border-none backdrop-blur-sm h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest financial movements.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((t, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="font-semibold">{t.name}</span>
                <span className="text-xs text-muted-foreground">{t.email}</span>
              </div>
              <span className={`${t.amount.startsWith("+") ? "text-emerald-600" : "text-rose-600"} font-bold`}>
                {t.amount}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
