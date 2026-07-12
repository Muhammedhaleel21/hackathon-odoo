"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress";

type FleetMetric = {
  label: string;
  value: string;
  percent: number;
  color: string;
  subText: string;
};

const fleetMetrics: FleetMetric[] = [
  {
    label: "Fleet Utilization",
    value: "81%",
    percent: 81,
    color: "bg-blue-500 dark:bg-blue-400",
    subText: "Active vs Idle capacity",
  },
  {
    label: "Fuel Efficiency",
    value: "8.4 km/l",
    percent: 88, // relative to goal of 9.5 km/l
    color: "bg-emerald-500 dark:bg-emerald-400",
    subText: "+0.3 km/l from last week",
  },
  {
    label: "Vehicle ROI",
    value: "14.2%",
    percent: 71, // relative to goal of 20%
    color: "bg-purple-500 dark:bg-purple-400",
    subText: "Net yield / acquisition cost",
  },
];

export function FleetStatus() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Fleet Performance & ROI</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          {fleetMetrics.map((metric) => (
            <div key={metric.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-muted-foreground">{metric.label}</span>
                <span className="font-semibold text-foreground">{metric.value}</span>
              </div>
              <Progress value={metric.percent} className="gap-0">
                <ProgressTrack className="h-2">
                  <ProgressIndicator className={metric.color} />
                </ProgressTrack>
              </Progress>
              <p className="text-[10px] text-muted-foreground">{metric.subText}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border/50 bg-muted/20 p-3.5 dark:bg-muted/10 mt-2 space-y-1.5">
          <p className="text-[11px] font-semibold text-foreground">Top Costliest Vehicles</p>
          <div className="space-y-2">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-medium">
                <span className="font-mono">TRUCK-11</span>
                <span>₹18,400 <span className="text-muted-foreground">(Maint + Fuel)</span></span>
              </div>
              <Progress value={92} className="gap-0">
                <ProgressTrack className="h-1">
                  <ProgressIndicator className="bg-red-500 dark:bg-red-400" />
                </ProgressTrack>
              </Progress>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-medium">
                <span className="font-mono">MINI-03</span>
                <span>₹12,100 <span className="text-muted-foreground">(Maint + Fuel)</span></span>
              </div>
              <Progress value={61} className="gap-0">
                <ProgressTrack className="h-1">
                  <ProgressIndicator className="bg-amber-500 dark:bg-amber-400" />
                </ProgressTrack>
              </Progress>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-medium">
                <span className="font-mono">VAN-05</span>
                <span>₹4,200 <span className="text-muted-foreground">(Maint + Fuel)</span></span>
              </div>
              <Progress value={21} className="gap-0">
                <ProgressTrack className="h-1">
                  <ProgressIndicator className="bg-blue-500 dark:bg-blue-400" />
                </ProgressTrack>
              </Progress>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
