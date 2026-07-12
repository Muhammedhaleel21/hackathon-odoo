"use client";

import Link from "next/link";
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

type FinalStatus = "Completed" | "Delayed" | "Cancelled";

type RecentTrip = {
  id: string;
  driver: string;
  vehicle: string;
  distance: string;
  fuelUsed: string;
  tripCost: string;
  endTime: string;
  status: FinalStatus;
};

const statusStyles: Record<FinalStatus, string> = {
  Completed: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  Delayed: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  Cancelled: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
};

const mockRecentTrips: RecentTrip[] = [
  {
    id: "TRP-1020",
    driver: "Manoj Das",
    vehicle: "KA-06-KL-2345",
    distance: "342 km",
    fuelUsed: "48 L",
    tripCost: "₹4,820",
    endTime: "11:45 AM",
    status: "Completed",
  },
  {
    id: "TRP-1019",
    driver: "Sanjay Gupta",
    vehicle: "KA-07-MN-6789",
    distance: "156 km",
    fuelUsed: "22 L",
    tripCost: "₹2,340",
    endTime: "10:30 AM",
    status: "Completed",
  },
  {
    id: "TRP-1018",
    driver: "Rajesh Pillai",
    vehicle: "KA-08-OP-1234",
    distance: "280 km",
    fuelUsed: "41 L",
    tripCost: "₹3,960",
    endTime: "09:15 AM",
    status: "Delayed",
  },
  {
    id: "TRP-1017",
    driver: "Ahmed Khan",
    vehicle: "KA-09-QR-5678",
    distance: "—",
    fuelUsed: "—",
    tripCost: "—",
    endTime: "08:00 AM",
    status: "Cancelled",
  },
  {
    id: "TRP-1016",
    driver: "Deepak Verma",
    vehicle: "KA-10-ST-9012",
    distance: "410 km",
    fuelUsed: "58 L",
    tripCost: "₹5,640",
    endTime: "Yesterday",
    status: "Completed",
  },
];

export function RecentTrips() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Recent Trip Activity</CardTitle>
        <CardAction>
          <Button render={<Link href="/admin/fleet" />} nativeButton={false} variant="ghost" size="sm" className="text-xs text-muted-foreground cursor-pointer">
            View All
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0 flex-1 overflow-y-auto max-h-[500px] scrollbar-thin">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Trip ID</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Distance</TableHead>
              <TableHead>Fuel Used</TableHead>
              <TableHead>Trip Cost</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead className="pr-6">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockRecentTrips.map((trip) => (
              <TableRow key={trip.id} className="cursor-pointer">
                <TableCell className="pl-6 font-medium">{trip.id}</TableCell>
                <TableCell>{trip.driver}</TableCell>
                <TableCell className="font-mono text-xs">{trip.vehicle}</TableCell>
                <TableCell className="tabular-nums">{trip.distance}</TableCell>
                <TableCell className="tabular-nums">{trip.fuelUsed}</TableCell>
                <TableCell className="tabular-nums font-medium">{trip.tripCost}</TableCell>
                <TableCell className="text-muted-foreground">{trip.endTime}</TableCell>
                <TableCell className="pr-6">
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${statusStyles[trip.status]}`}
                  >
                    {trip.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
