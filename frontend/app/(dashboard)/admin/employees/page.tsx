import UsersPage from "@/app/components/admin/users/UsersPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employees — FleetOps",
  description: "Manage fleet employees and their roles",
};

export default function EmployeesPage() {
  return <UsersPage />;
}
