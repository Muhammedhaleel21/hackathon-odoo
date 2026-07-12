"use client";

import {
  AlertTriangle,
  Wrench,
  Fuel,
  FileWarning,
  Siren,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type AlertPriority = "critical" | "warning" | "info";

type Alert = {
  id: string;
  type: string;
  vehicle: string;
  driver: string;
  vehicleType: string;
  time: string;
  description: string;
  priority: AlertPriority;
  icon: React.ReactNode;
};

const priorityStyles: Record<
  AlertPriority,
  { dot: string; bg: string; border: string }
> = {
  critical: {
    dot: "bg-red-500",
    bg: "bg-red-50/40 dark:bg-red-950/20",
    border: "border-red-100 dark:border-red-900/30",
  },
  warning: {
    dot: "bg-amber-500",
    bg: "bg-amber-50/40 dark:bg-amber-950/20",
    border: "border-amber-100 dark:border-amber-900/30",
  },
  info: {
    dot: "bg-blue-500",
    bg: "bg-blue-50/40 dark:bg-blue-950/20",
    border: "border-blue-100 dark:border-blue-900/30",
  },
};

const mockAlerts: Alert[] = [
  {
    id: "ALT-001",
    type: "Accident Reported",
    vehicle: "KA-04-GH-3456",
    driver: "Vijay Reddy",
    vehicleType: "Heavy Truck",
    time: "12 min ago",
    description: "Minor collision reported on NH-44 near Anantapur. Driver safe.",
    priority: "critical",
    icon: <Siren className="size-4" />,
  },
  {
    id: "ALT-002",
    type: "Low Fuel",
    vehicle: "KA-03-EF-9012",
    driver: "Anil Sharma",
    vehicleType: "Container",
    time: "25 min ago",
    description: "Fuel level below 15%. Nearest fuel station 12 km ahead.",
    priority: "warning",
    icon: <Fuel className="size-4" />,
  },
  {
    id: "ALT-003",
    type: "Maintenance Request",
    vehicle: "KA-11-UV-3456",
    driver: "Kiran Rao",
    vehicleType: "Mini Van",
    time: "1 hr ago",
    description: "Brake pad replacement due. Scheduled for tomorrow.",
    priority: "info",
    icon: <Wrench className="size-4" />,
  },
  {
    id: "ALT-004",
    type: "Vehicle Breakdown",
    vehicle: "KA-12-WX-7890",
    driver: "Naveen Joshi",
    vehicleType: "Lorry",
    time: "2 hr ago",
    description: "Engine overheating. Vehicle pulled over on NH-48.",
    priority: "critical",
    icon: <AlertTriangle className="size-4" />,
  },
  {
    id: "ALT-005",
    type: "Inspection Due",
    vehicle: "KA-06-KL-2345",
    driver: "Manoj Das",
    vehicleType: "Heavy Truck",
    time: "3 hr ago",
    description: "Annual vehicle inspection due in 3 days.",
    priority: "info",
    icon: <FileWarning className="size-4" />,
  },
];

export function AlertsPanel() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Alerts</CardTitle>
        <CardAction>
          <div className="flex items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-700 dark:bg-red-900/50 dark:text-red-300">
              {mockAlerts.filter((a) => a.priority === "critical").length}
            </span>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              View All
            </Button>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3 overflow-y-auto pr-1 flex-1 max-h-[500px] scrollbar-thin">
        {mockAlerts.map((alert) => {
          const style = priorityStyles[alert.priority];
          return (
            <div
              key={alert.id}
              className={`flex items-start gap-3 rounded-lg border p-3 transition-colors hover:shadow-sm ${style.bg} ${style.border}`}
            >
              <div className="mt-0.5 flex items-center gap-2">
                <span className={`size-2 rounded-full ${style.dot}`} />
                <span className="text-muted-foreground">{alert.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold truncate text-foreground">{alert.type}</p>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {alert.time}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="font-mono bg-muted/60 dark:bg-muted/30 px-1 rounded text-foreground font-medium">{alert.vehicle}</span>
                  <span>·</span>
                  <span className="text-foreground/80">{alert.driver}</span>
                  <span>·</span>
                  <span className="italic">{alert.vehicleType}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {alert.description}
                </p>
              </div>
              <Button variant="ghost" size="icon-xs" className="shrink-0 mt-0.5">
                <Eye className="size-3.5" />
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
