"use client";

import {
  Truck,
  Route,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const actions = [
  { label: "Add Vehicle", icon: Truck },
  { label: "Add Driver", icon: UserPlus },
  { label: "Schedule Trip", icon: Route },
];

export function QuickActions() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {actions.map((action) => (
        <Button
          key={action.label}
          variant="outline"
          size="sm"
          className="gap-1.5 cursor-pointer"
        >
          <action.icon className="size-3.5" />
          {action.label}
        </Button>
      ))}
    </div>
  );
}
