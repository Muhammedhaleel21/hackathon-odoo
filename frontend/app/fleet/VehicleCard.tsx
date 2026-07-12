"use client";

import React from "react";
import { FleetVehicle, STATUS_LABELS, STATUS_COLORS } from "../data";
import { Truck, User, MapPin, Gauge, Weight } from "lucide-react";
import { cn } from "@/lib/utils";

interface VehicleCardProps {
  vehicle: FleetVehicle;
  isSelected: boolean;
  onClick: () => void;
}

export default function VehicleCard({ vehicle, isSelected, onClick }: VehicleCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-xl border p-4 transition-all duration-200 hover:border-foreground/20 hover:shadow-sm",
        isSelected
          ? "border-foreground/30 bg-muted/60 shadow-sm"
          : "border-border bg-card hover:bg-muted/30"
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={cn(
              "flex size-8 flex-shrink-0 items-center justify-center rounded-lg",
              vehicle.status === "on_trip" && "bg-blue-500/10",
              vehicle.status === "available" && "bg-emerald-500/10",
              vehicle.status === "on_maintenance" && "bg-amber-500/10",
              vehicle.status === "in_shop" && "bg-red-500/10"
            )}
          >
            <Truck
              size={15}
              className={cn(
                vehicle.status === "on_trip" && "text-blue-600",
                vehicle.status === "available" && "text-emerald-600",
                vehicle.status === "on_maintenance" && "text-amber-600",
                vehicle.status === "in_shop" && "text-red-600"
              )}
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{vehicle.name}</p>
            <p className="text-xs text-muted-foreground font-medium">{vehicle.registrationNumber}</p>
          </div>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold flex-shrink-0",
            STATUS_COLORS[vehicle.status]
          )}
        >
          {vehicle.status === "on_trip" && (
            <span className="relative inline-flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 bg-current" />
              <span className="relative inline-flex size-1.5 rounded-full bg-current" />
            </span>
          )}
          {STATUS_LABELS[vehicle.status]}
        </span>
      </div>

      {/* Type tag */}
      <p className="text-xs text-muted-foreground mb-3">{vehicle.type}</p>

      {/* Trip info */}
      {vehicle.activeTrip && (
        <div className="mb-3 rounded-lg bg-muted/50 p-2.5 border border-border/50">
          <div className="flex items-start gap-1.5">
            <MapPin size={11} className="text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground truncate">{vehicle.activeTrip.source}</p>
              <p className="text-xs font-medium text-foreground truncate mt-0.5">
                → {vehicle.activeTrip.destination}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Gauge size={11} />
          <span>{vehicle.odometer.toLocaleString()} km</span>
        </div>
        {vehicle.driver && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <User size={11} />
            <span className="truncate max-w-[90px]">{vehicle.driver.name}</span>
          </div>
        )}
        {vehicle.activeTrip && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-auto">
            <Weight size={11} />
            <span>{(vehicle.activeTrip.cargoWeight / 1000).toFixed(1)}t</span>
          </div>
        )}
      </div>
    </button>
  );
}
