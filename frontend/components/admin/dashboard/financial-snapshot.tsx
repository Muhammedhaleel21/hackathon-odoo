"use client";

import {
  Fuel,
  Wrench,
  Receipt,
  Calculator,
  TrendingUp,
  ThumbsUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FinancialItem = {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
};

const mainFinancials: FinancialItem[] = [
  {
    title: "Total Operational Cost",
    value: "₹69,250",
    subtitle: "Today",
    icon: <Calculator className="size-4" />,
    iconBg: "bg-neutral-100 dark:bg-neutral-800",
    iconColor: "text-neutral-800 dark:text-neutral-200",
  },
  {
    title: "Fuel Cost",
    value: "₹12,450",
    subtitle: "Today",
    icon: <Fuel className="size-4" />,
    iconBg: "bg-blue-50 dark:bg-blue-950/40",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Maintenance Cost",
    value: "₹48,200",
    subtitle: "This month",
    icon: <Wrench className="size-4" />,
    iconBg: "bg-amber-50 dark:bg-amber-950/40",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    title: "Other Expenses",
    value: "₹8,300",
    subtitle: "This month",
    icon: <Receipt className="size-4" />,
    iconBg: "bg-purple-50 dark:bg-purple-950/40",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
];

const sparklineData = [9800, 11200, 10500, 12100, 11800, 13200, 12450];

function Sparkline({ data, color = "currentColor" }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 160;
  const height = 40;
  const padding = 4;

  const points = data
    .map((value, index) => {
      const x = padding + (index / (data.length - 1)) * (width - padding * 2);
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FinancialSnapshot() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Main Stats Card */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {mainFinancials.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/20 p-4 dark:bg-muted/10"
              >
                <span className={`flex size-9 items-center justify-center rounded-lg ${item.iconBg} ${item.iconColor}`}>
                  {item.icon}
                </span>
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground">{item.title}</p>
                  <p className="text-lg font-semibold tabular-nums mt-0.5">{item.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fuel Performance Card */}
      <Card>
        <CardHeader>
          <CardTitle>Fuel Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="text-[11px] font-medium text-muted-foreground">Most Efficient Vehicle</span>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="flex size-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                <ThumbsUp className="size-4" />
              </span>
              <div>
                <p className="text-xs font-semibold">KA-06-KL-2345</p>
                <p className="text-[10px] text-muted-foreground">Heavy Truck · 8.4 km/l</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border/50 bg-muted/20 p-3 dark:bg-muted/10 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-muted-foreground">Fuel Cost Trend</p>
                <p className="text-sm font-semibold tabular-nums mt-0.5">₹12,450</p>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                <TrendingUp className="size-3" />
                <span>+8%</span>
              </div>
            </div>
            <div className="h-10 text-blue-500">
              <Sparkline data={sparklineData} color="currentColor" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
