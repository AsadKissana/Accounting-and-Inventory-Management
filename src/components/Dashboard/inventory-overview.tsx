import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";

const data = [
  { name: "Mon", stock: 2400 },
  { name: "Tue", stock: 1398 },
  { name: "Wed", stock: 9800 },
  { name: "Thu", stock: 3908 },
  { name: "Fri", stock: 4800 },
  { name: "Sat", stock: 3800 },
  { name: "Sun", stock: 4300 },
];

export function InventoryOverview() {
  return (
    <Card className="bg-card/50 border-none backdrop-blur-sm">
      <CardHeader>
        <div>
          <CardTitle>Inventory Flux</CardTitle>
          <CardDescription>Daily inventory movement tracking.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="h-[300px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#888888" tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" tickLine={false} axisLine={false} />
            <Tooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} />
            <Bar dataKey="stock" radius={[6, 6, 0, 0]}>
              {data.map((_, index) => (
                <Cell key={index} fill={index === 2 ? "var(--color-primary)" : "var(--color-muted-foreground)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
