"use client";

import React from "react";
import { FleetVehicle, STATUS_LABELS, STATUS_COLORS } from "../data";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Truck,
  User,
  MapPin,
  Phone,
  Mail,
  Shield,
  Calendar,
  Gauge,
  Weight,
  Route,
  ClipboardList,
  Star,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VehicleDetailPanelProps {
  vehicle: FleetVehicle;
}

function InfoRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
        {label}
      </span>
      <div className="flex items-center gap-1.5">
        {Icon && <Icon size={12} className="text-muted-foreground flex-shrink-0" />}
        <span className="text-sm font-semibold text-foreground">{value}</span>
      </div>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 90
      ? "text-emerald-600 bg-emerald-500/10"
      : score >= 75
      ? "text-amber-600 bg-amber-500/10"
      : "text-red-600 bg-red-500/10";

  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold", color)}>
      <Star size={10} />
      {score}/100
    </span>
  );
}

export default function VehicleDetailPanel({ vehicle }: VehicleDetailPanelProps) {
  return (
    <div className="flex flex-col h-full bg-card rounded-xl ring-1 ring-foreground/10 overflow-hidden">
      {/* Panel Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={cn(
              "flex size-9 flex-shrink-0 items-center justify-center rounded-lg",
              vehicle.status === "on_trip" && "bg-blue-500/10",
              vehicle.status === "available" && "bg-emerald-500/10",
              vehicle.status === "on_maintenance" && "bg-amber-500/10",
              vehicle.status === "in_shop" && "bg-red-500/10"
            )}
          >
            <Truck
              size={16}
              className={cn(
                vehicle.status === "on_trip" && "text-blue-600",
                vehicle.status === "available" && "text-emerald-600",
                vehicle.status === "on_maintenance" && "text-amber-600",
                vehicle.status === "in_shop" && "text-red-600"
              )}
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground truncate">{vehicle.name}</p>
            <p className="text-xs text-muted-foreground font-medium">{vehicle.registrationNumber}</p>
          </div>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold flex-shrink-0",
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

      {/* Current Location strip */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/20 border-b border-border">
        <MapPin size={12} className="text-muted-foreground flex-shrink-0" />
        <p className="text-xs text-muted-foreground truncate">{vehicle.location.address}</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="trip" className="flex flex-col flex-1 min-h-0">
        <TabsList
          variant="line"
          className="w-full px-4 rounded-none border-b border-border bg-transparent h-auto py-0 justify-start gap-0"
        >
          {vehicle.activeTrip && (
            <TabsTrigger value="trip" className="px-4 py-2.5 text-xs rounded-none border-b-2 border-b-transparent data-active:border-b-foreground">
              Trip Details
            </TabsTrigger>
          )}
          <TabsTrigger value="vehicle" className="px-4 py-2.5 text-xs rounded-none border-b-2 border-b-transparent data-active:border-b-foreground">
            Vehicle
          </TabsTrigger>
          {vehicle.driver && (
            <TabsTrigger value="driver" className="px-4 py-2.5 text-xs rounded-none border-b-2 border-b-transparent data-active:border-b-foreground">
              Driver
            </TabsTrigger>
          )}
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          {/* Trip Details Tab */}
          {vehicle.activeTrip && (
            <TabsContent value="trip" className="px-4 py-4 m-0">
              <div className="space-y-4">
                {/* Route */}
                <div className="rounded-xl border border-border bg-muted/20 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Route size={13} className="text-muted-foreground" />
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Route</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="flex flex-col items-center gap-1 mt-0.5">
                        <div className="size-2 rounded-full bg-foreground/60" />
                        <div className="w-px h-6 bg-border" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-muted-foreground font-medium tracking-wide">Origin</p>
                        <p className="text-sm font-semibold text-foreground">{vehicle.activeTrip.source}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="flex flex-col items-center">
                        <div className="size-2.5 rounded-full bg-foreground" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-muted-foreground font-medium tracking-wide">Destination</p>
                        <p className="text-sm font-semibold text-foreground">{vehicle.activeTrip.destination}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trip Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <InfoRow
                    label="Distance"
                    value={`${vehicle.activeTrip.plannedDistance} km`}
                    icon={Route}
                  />
                  <InfoRow
                    label="Cargo Weight"
                    value={`${(vehicle.activeTrip.cargoWeight / 1000).toFixed(1)} t`}
                    icon={Weight}
                  />
                  <InfoRow
                    label="Trip ID"
                    value={`#${vehicle.activeTrip.id.slice(-4).toUpperCase()}`}
                    icon={ClipboardList}
                  />
                </div>

                <Separator />

                <div>
                  <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-1.5">
                    Cargo Utilization
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-foreground/70 transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            (vehicle.activeTrip.cargoWeight / vehicle.maxLoadCapacity) * 100
                          ).toFixed(0)}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold text-foreground tabular-nums">
                      {Math.min(
                        100,
                        Math.round(
                          (vehicle.activeTrip.cargoWeight / vehicle.maxLoadCapacity) * 100
                        )
                      )}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {vehicle.activeTrip.cargoWeight.toLocaleString()} kg of{" "}
                    {vehicle.maxLoadCapacity.toLocaleString()} kg max
                  </p>
                </div>
              </div>
            </TabsContent>
          )}

          {/* Vehicle Tab */}
          <TabsContent value="vehicle" className="px-4 py-4 m-0">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InfoRow label="Type" value={vehicle.type} icon={Truck} />
                <InfoRow
                  label="Odometer"
                  value={`${vehicle.odometer.toLocaleString()} km`}
                  icon={Gauge}
                />
                <InfoRow
                  label="Max Load"
                  value={`${(vehicle.maxLoadCapacity / 1000).toFixed(0)} t`}
                  icon={Weight}
                />
                <InfoRow
                  label="Capacity"
                  value={`${vehicle.capacity} m³`}
                  icon={Wrench}
                />
              </div>

              <Separator />

              <div className="rounded-xl border border-border bg-muted/20 p-3">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Vehicle Condition</p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {["Engine", "Tyres", "Brakes"].map((part, i) => (
                    <div key={part} className="flex flex-col items-center gap-1">
                      <div
                        className={cn(
                          "text-xs font-bold px-2 py-0.5 rounded-md",
                          i === 0
                            ? "bg-emerald-500/10 text-emerald-600"
                            : i === 1
                            ? "bg-amber-500/10 text-amber-600"
                            : "bg-emerald-500/10 text-emerald-600"
                        )}
                      >
                        {i === 1 ? "Fair" : "Good"}
                      </div>
                      <p className="text-[10px] text-muted-foreground">{part}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Driver Tab */}
          {vehicle.driver && (
            <TabsContent value="driver" className="px-4 py-4 m-0">
              <div className="space-y-4">
                {/* Driver header */}
                <div className="flex items-center gap-3">
                  <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-muted border border-border">
                    <User size={18} className="text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground">{vehicle.driver.name}</p>
                    <p className="text-xs text-muted-foreground">Driver</p>
                  </div>
                  <div className="ml-auto flex-shrink-0">
                    <ScoreBadge score={vehicle.driver.safetyScore} />
                  </div>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center gap-2 rounded-lg bg-muted/30 px-3 py-2">
                    <Phone size={12} className="text-muted-foreground flex-shrink-0" />
                    <span className="text-xs font-medium text-foreground">{vehicle.driver.phone}</span>
                    <Button variant="ghost" size="xs" className="ml-auto h-6 text-xs">
                      Call
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-muted/30 px-3 py-2">
                    <Mail size={12} className="text-muted-foreground flex-shrink-0" />
                    <span className="text-xs font-medium text-foreground truncate">
                      {vehicle.driver.email}
                    </span>
                  </div>
                </div>

                <Separator />

                {/* License & Details */}
                <div className="grid grid-cols-2 gap-3">
                  <InfoRow
                    label="License No."
                    value={vehicle.driver.licenseNumber.slice(-8)}
                    icon={Shield}
                  />
                  <InfoRow
                    label="Category"
                    value={vehicle.driver.licenseCategory}
                    icon={ClipboardList}
                  />
                  <InfoRow
                    label="Expiry"
                    value={new Date(vehicle.driver.licenseExpiryDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                    icon={Calendar}
                  />
                  <InfoRow
                    label="Experience"
                    value={`${vehicle.driver.experience} yrs`}
                    icon={Star}
                  />
                </div>
              </div>
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  );
}
