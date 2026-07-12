import { cn } from "@/lib/utils";

type Role = "admin" | "fleet_manager" | "driver";

const roleConfig: Record<Role, { label: string; className: string }> = {
  admin: {
    label: "Admin",
    className: "bg-purple-100 text-purple-700 ring-1 ring-purple-200",
  },
  fleet_manager: {
    label: "Fleet Manager",
    className: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
  },
  driver: {
    label: "Driver",
    className: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  },
};

interface RoleBadgeProps {
  role: Role | string;
  className?: string;
}

export default function RoleBadge({ role, className }: RoleBadgeProps) {
  const config = roleConfig[role as Role] ?? {
    label: role,
    className: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
