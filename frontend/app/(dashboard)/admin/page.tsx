import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — FleetOps",
};

export default function AdminDashboard() {
  // For now redirect to employees; can build a proper dashboard later
  redirect("/admin/employees");
}
