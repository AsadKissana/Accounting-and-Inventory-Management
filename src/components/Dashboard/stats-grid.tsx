import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { TrendingUp, TrendingDown, Package, DollarSign } from "lucide-react";

const stats = [
  { title: "Total Revenue", value: "$128,430", change: "+12.5%", trend: "up", icon: DollarSign },
  { title: "Net Profit", value: "$42,150", change: "+8.2%", trend: "up", icon: TrendingUp },
  { title: "Inventory Value", value: "$84,200", change: "-2.4%", trend: "down", icon: Package },
  { title: "Operating Costs", value: "$34,120", change: "+4.1%", trend: "down", icon: TrendingDown },
];

export function StatsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-card/50 border-none backdrop-blur-sm hover:bg-card transition-all">
          <CardHeader className="flex justify-between items-center">
            <CardTitle>{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className={`text-xs mt-1 font-medium ${stat.trend === "up" ? "text-emerald-600" : "text-rose-600"}`}>
              {stat.change} <span className="text-muted-foreground font-normal ml-1">vs last month</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
