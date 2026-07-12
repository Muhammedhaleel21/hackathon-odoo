"use client";

import * as React from "react";
import { MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";

type TripStatus = "On Trip" | "Dispatched" | "Loading" | "Delayed";

type OngoingTrip = {
  id: string;
  vehicle: string;
  vehicleType: string;
  driver: string;
  route: string;
  region: string;
  status: TripStatus;
  startTime: string;
  eta: string;
};

const statusStyles: Record<TripStatus, string> = {
  "On Trip": "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  Dispatched: "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  Loading: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  Delayed: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
};

const mockTrips: OngoingTrip[] = [
  {
    id: "TRP-1024",
    vehicle: "KA-01-AB-1234",
    vehicleType: "Heavy Truck",
    driver: "Ramesh Kumar",
    route: "Bangalore → Chennai",
    region: "South",
    status: "On Trip",
    startTime: "06:30 AM",
    eta: "02:15 PM",
  },
  {
    id: "TRP-1025",
    vehicle: "KA-02-CD-5678",
    vehicleType: "Container",
    driver: "Suresh Nair",
    route: "Bangalore → Mysore",
    region: "South",
    status: "Loading",
    startTime: "08:00 AM",
    eta: "11:30 AM",
  },
  {
    id: "TRP-1026",
    vehicle: "KA-03-EF-9012",
    vehicleType: "Mini Van",
    driver: "Anil Sharma",
    route: "Mumbai → Pune",
    region: "West",
    status: "Dispatched",
    startTime: "07:15 AM",
    eta: "10:45 AM",
  },
  {
    id: "TRP-1027",
    vehicle: "KA-04-GH-3456",
    vehicleType: "Lorry",
    driver: "Vijay Reddy",
    route: "Hyderabad → Vijayawada",
    region: "South",
    status: "Delayed",
    startTime: "05:00 AM",
    eta: "01:30 PM",
  },
  {
    id: "TRP-1028",
    vehicle: "KA-05-IJ-7890",
    vehicleType: "Heavy Truck",
    driver: "Pradeep Singh",
    route: "Delhi → Jaipur",
    region: "North",
    status: "On Trip",
    startTime: "04:30 AM",
    eta: "11:00 AM",
  },
];

export function OngoingOperations() {
  const [regionFilter, setRegionFilter] = React.useState("All");
  const [vehicleTypeFilter, setVehicleTypeFilter] = React.useState("All");
  const [statusFilter, setStatusFilter] = React.useState("All");

  const filteredTrips = mockTrips.filter((trip) => {
    if (regionFilter !== "All" && trip.region !== regionFilter) return false;
    if (vehicleTypeFilter !== "All" && trip.vehicleType !== vehicleTypeFilter) return false;
    if (statusFilter !== "All" && trip.status !== statusFilter) return false;
    return true;
  });

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
          <CardTitle>Ongoing Fleet Operations</CardTitle>
          {/* Inline filters */}
          <div className="flex flex-wrap items-center gap-2">
            <NativeSelect
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="h-7 text-xs py-0"
            >
              <option value="All">All Regions</option>
              <option value="South">South</option>
              <option value="West">West</option>
              <option value="North">North</option>
            </NativeSelect>
            <NativeSelect
              value={vehicleTypeFilter}
              onChange={(e) => setVehicleTypeFilter(e.target.value)}
              className="h-7 text-xs py-0"
            >
              <option value="All">All Types</option>
              <option value="Heavy Truck">Heavy Truck</option>
              <option value="Container">Container</option>
              <option value="Mini Van">Mini Van</option>
              <option value="Lorry">Lorry</option>
            </NativeSelect>
            <NativeSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-7 text-xs py-0"
            >
              <option value="All">All Statuses</option>
              <option value="On Trip">On Trip</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Loading">Loading</option>
              <option value="Delayed">Delayed</option>
            </NativeSelect>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0 flex-1 overflow-y-auto max-h-[500px] scrollbar-thin">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Trip ID</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>ETA</TableHead>
              <TableHead className="pr-6 text-right w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTrips.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                  No active trips matching the filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredTrips.map((trip) => (
                <TableRow key={trip.id} className="cursor-pointer">
                  <TableCell className="pl-6 font-medium">{trip.id}</TableCell>
                  <TableCell className="font-mono text-xs">{trip.vehicle}</TableCell>
                  <TableCell className="text-xs">{trip.vehicleType}</TableCell>
                  <TableCell>{trip.driver}</TableCell>
                  <TableCell className="text-muted-foreground">{trip.route}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{trip.region}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${statusStyles[trip.status]}`}
                    >
                      {trip.status}
                    </span>
                  </TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">
                    {trip.startTime}
                  </TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">
                    {trip.eta}
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button variant="ghost" size="icon-xs" className="hover:bg-muted">
                      <MoreHorizontal className="size-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
