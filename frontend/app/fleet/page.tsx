"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { MOCK_FLEET, FleetVehicle, VehicleStatus, STATUS_LABELS, STATUS_COLORS } from "./data";
import VehicleCard from "./VehicleCard";
import VehicleDetailPanel from "./VehicleDetailPanel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  SlidersHorizontal,
  Truck,
  Activity,
  CheckCircle,
  Wrench,
  AlertTriangle,
  LayoutDashboard,
  Map,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Dynamically import the map to avoid SSR issues with maplibre-gl
const FleetMap = dynamic(() => import("./FleetMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-muted/30 rounded-xl">
      <div className="flex flex-col items-center gap-3">
        <div className="size-8 animate-spin rounded-full border-2 border-border border-t-foreground" />
        <p className="text-sm text-muted-foreground">Loading map…</p>
      </div>
    </div>
  ),
});

const STATUS_FILTERS: { value: VehicleStatus | "all"; label: string; icon: React.ElementType }[] = [
  { value: "all", label: "All", icon: LayoutDashboard },
  { value: "on_trip", label: "On Trip", icon: Activity },
  { value: "available", label: "Available", icon: CheckCircle },
  { value: "on_maintenance", label: "Maintenance", icon: Wrench },
  { value: "in_shop", label: "In Shop", icon: AlertTriangle },
];

function StatCard({
  label,
  value,
  icon: Icon,
  colorClass,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  colorClass: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 ring-1 ring-foreground/5">
      <div className={cn("flex size-9 items-center justify-center rounded-lg", colorClass)}>
        <Icon size={16} className="text-current" />
      </div>
      <div>
        <p className="text-xl font-bold text-foreground leading-none">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function FleetPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | "all">("all");
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(
    MOCK_FLEET[0] ?? null
  );

  const stats = useMemo(
    () => ({
      total: MOCK_FLEET.length,
      onTrip: MOCK_FLEET.filter((v) => v.status === "on_trip").length,
      available: MOCK_FLEET.filter((v) => v.status === "available").length,
      maintenance: MOCK_FLEET.filter(
        (v) => v.status === "on_maintenance" || v.status === "in_shop"
      ).length,
    }),
    []
  );

  const filteredVehicles = useMemo(() => {
    return MOCK_FLEET.filter((v) => {
      const matchesStatus = statusFilter === "all" || v.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        v.name.toLowerCase().includes(q) ||
        v.registrationNumber.toLowerCase().includes(q) ||
        v.driver?.name.toLowerCase().includes(q) ||
        v.activeTrip?.destination.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [searchQuery, statusFilter]);

  return (
    <div className="flex h-screen w-full flex-col bg-background overflow-hidden">
      {/* Top header */}
      <header className="flex items-center justify-between gap-4 border-b border-border bg-card px-6 py-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-foreground/5">
            <Map size={16} className="text-foreground" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground leading-tight">Fleet Tracking</h1>
            <p className="text-xs text-muted-foreground">
              {stats.total} vehicles · {stats.onTrip} active
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="hidden lg:flex items-center gap-3">
          <StatCard
            label="On Trip"
            value={stats.onTrip}
            icon={Activity}
            colorClass="bg-blue-500/10 text-blue-600"
          />
          <StatCard
            label="Available"
            value={stats.available}
            icon={CheckCircle}
            colorClass="bg-emerald-500/10 text-emerald-600"
          />
          <StatCard
            label="In Service"
            value={stats.maintenance}
            icon={Wrench}
            colorClass="bg-amber-500/10 text-amber-600"
          />
        </div>

        <Button variant="outline" size="sm" className="gap-1.5 hidden sm:inline-flex">
          <SlidersHorizontal size={14} />
          Manage Fleet
        </Button>
      </header>

      {/* Main content */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* LEFT: Vehicle List Panel */}
        <aside className="flex w-80 flex-shrink-0 flex-col border-r border-border bg-card">
          {/* Search */}
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <Input
                placeholder="Search vehicles, drivers…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-border overflow-x-auto no-scrollbar">
            {STATUS_FILTERS.map(({ value, label, icon: Icon }) => {
              const count =
                value === "all"
                  ? MOCK_FLEET.length
                  : MOCK_FLEET.filter((v) => v.status === value).length;
              return (
                <button
                  key={value}
                  onClick={() => setStatusFilter(value)}
                  className={cn(
                    "flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-all flex-shrink-0",
                    statusFilter === value
                      ? "bg-foreground text-background border-foreground"
                      : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                  )}
                >
                  <Icon size={11} />
                  {label}
                  <span
                    className={cn(
                      "ml-0.5 rounded-full px-1 py-px text-[9px] font-bold",
                      statusFilter === value ? "bg-background/20 text-background" : "bg-muted"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Vehicle count */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-border/50">
            <p className="text-xs text-muted-foreground font-medium">
              {filteredVehicles.length} vehicle{filteredVehicles.length !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-1">
              <div className="size-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] text-muted-foreground">Live</span>
            </div>
          </div>

          {/* Vehicle List */}
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-2 p-3">
              {filteredVehicles.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                  <Truck size={24} className="text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">No vehicles found</p>
                  <p className="text-xs text-muted-foreground/60">Try adjusting your filters</p>
                </div>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    isSelected={selectedVehicle?.id === vehicle.id}
                    onClick={() => setSelectedVehicle(vehicle)}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </aside>

        {/* RIGHT: Map + Detail Panel */}
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          {/* Map area - takes up the top portion */}
          <div className="relative flex-1 min-h-0">
            <FleetMap
              vehicles={MOCK_FLEET}
              selectedVehicle={selectedVehicle}
              onVehicleSelect={setSelectedVehicle}
            />

            {/* Map overlay: Legend */}
            <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 rounded-xl bg-card/90 backdrop-blur-sm px-3 py-2.5 shadow-lg ring-1 ring-foreground/10">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                Legend
              </p>
              {[
                { status: "on_trip" as VehicleStatus, color: "bg-blue-500" },
                { status: "available" as VehicleStatus, color: "bg-emerald-500" },
                { status: "on_maintenance" as VehicleStatus, color: "bg-amber-500" },
                { status: "in_shop" as VehicleStatus, color: "bg-red-500" },
              ].map(({ status, color }) => (
                <div key={status} className="flex items-center gap-2">
                  <div className={cn("size-2.5 rounded-full flex-shrink-0", color)} />
                  <span className="text-xs text-foreground font-medium">
                    {STATUS_LABELS[status]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Detail Panel - bottom section */}
          {selectedVehicle && (
            <div className="flex-shrink-0 border-t border-border" style={{ height: "280px" }}>
              <VehicleDetailPanel vehicle={selectedVehicle} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
