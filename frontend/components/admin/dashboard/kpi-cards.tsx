"use client";

import {
  Route,
  Clock,
  Truck,
  Users,
  Wrench,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type KpiItem = {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  sparklineColor: string;
  sparklineData: number[];
};

const kpiItems: KpiItem[] = [
  {
    title: "Ongoing Trips",
    value: "24",
    change: "+3 since morning",
    trend: "up",
    icon: <Route className="size-4" />,
    iconBg: "bg-blue-50 dark:bg-blue-950/40",
    iconColor: "text-blue-600 dark:text-blue-400",
    sparklineColor: "stroke-blue-500",
    sparklineData: [12, 15, 18, 14, 20, 22, 24],
  },
  {
    title: "Pending Trips",
    value: "8",
    change: "Awaiting dispatch",
    trend: "neutral",
    icon: <Clock className="size-4" />,
    iconBg: "bg-violet-50 dark:bg-violet-950/40",
    iconColor: "text-violet-600 dark:text-violet-400",
    sparklineColor: "stroke-violet-500",
    sparklineData: [4, 6, 5, 8, 7, 9, 8],
  },
  {
    title: "Available Vehicles",
    value: "18",
    change: "Ready to dispatch",
    trend: "neutral",
    icon: <Truck className="size-4" />,
    iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    sparklineColor: "stroke-emerald-500",
    sparklineData: [15, 16, 14, 18, 17, 19, 18],
  },
  {
    title: "Available Drivers",
    value: "12",
    change: "Ready to assign",
    trend: "neutral",
    icon: <Users className="size-4" />,
    iconBg: "bg-teal-50 dark:bg-teal-950/40",
    iconColor: "text-teal-600 dark:text-teal-400",
    sparklineColor: "stroke-teal-500",
    sparklineData: [10, 11, 9, 13, 11, 14, 12],
  },
  {
    title: "Vehicles Under Maintenance",
    value: "6",
    change: "-1 from yesterday",
    trend: "down",
    icon: <Wrench className="size-4" />,
    iconBg: "bg-amber-50 dark:bg-amber-950/40",
    iconColor: "text-amber-600 dark:text-amber-400",
    sparklineColor: "stroke-amber-500",
    sparklineData: [8, 7, 7, 6, 7, 5, 6],
  },
];

function MiniSparkline({ data, strokeClass }: { data: number[]; strokeClass: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 24;
  const padding = 1;

  const points = data
    .map((value, index) => {
      const x = padding + (index / (data.length - 1)) * (width - padding * 2);
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline
        points={points}
        fill="none"
        className={strokeClass}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function KpiCards() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {kpiItems.map((item) => (
        <Card
          key={item.title}
          className="cursor-pointer transition-all hover:shadow-sm hover:border-muted-foreground/30 group/kpi"
        >
          <CardContent className="flex flex-col gap-2.5 p-4">
            <div className="flex items-center justify-between">
              <span className={`flex size-8 items-center justify-center rounded-lg ${item.iconBg} ${item.iconColor} transition-transform group-hover/kpi:scale-105`}>
                {item.icon}
              </span>
              <MiniSparkline data={item.sparklineData} strokeClass={item.sparklineColor} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-medium text-muted-foreground truncate">
                {item.title}
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xl font-semibold tracking-tight tabular-nums">
                  {item.value}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  {item.change}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
