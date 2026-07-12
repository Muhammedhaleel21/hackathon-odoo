"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  Wrench,
  Fuel,
  BarChart3,
  Settings,
  Search,
  Bell,
  ChevronDown,
  User,
  LogOut,
  CalendarDays,
  Clock,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const mainNavItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Fleet", href: "/admin/fleet", icon: Truck },
  { title: "Drivers", href: "/admin/drivers", icon: Users },
  { title: "Trips", href: "/admin/trips", icon: Route },
  { title: "Maintenance", href: "/admin/maintenance", icon: Wrench },
  { title: "Fuel & Expenses", href: "/admin/fuel", icon: Fuel },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="[--sidebar-width:18rem] [--sidebar-width-icon:4rem]">
      <SidebarHeader className="px-3 py-5 overflow-hidden">
        <Link href="/admin" className="flex items-center gap-3 px-1">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-foreground text-background">
            <Truck className="size-5" />
          </div>
          <span className="text-lg font-bold tracking-tight whitespace-nowrap group-data-[collapsible=icon]:hidden">
            TransitOps
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      size="lg"
                      render={<Link href={item.href} />}
                      className="gap-3 px-3"
                    >
                      <item.icon className="size-5!" />
                      <span className="text-[0.9rem] whitespace-nowrap">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto px-3 pb-4">
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={pathname === "/admin/settings"}
              tooltip="Settings"
              size="lg"
              render={<Link href="/admin/settings" />}
              className="gap-3 px-3"
            >
              <Settings className="size-5!" />
              <span className="text-[0.9rem] whitespace-nowrap">Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function LiveClock() {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
      <Clock className="size-3.5" />
      <span>{formattedTime}</span>
    </div>
  );
}

function DatePicker() {
  const [date, setDate] = React.useState<Date>(new Date());

  const formattedDate = date.toLocaleDateString("en-IN", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Popover>
      <PopoverTrigger className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer">
        <CalendarDays className="size-3.5" />
        <span>{formattedDate}</span>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => d && setDate(d)}
          className="rounded-lg"
        />
      </PopoverContent>
    </Popover>
  );
}

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-muted outline-none cursor-pointer">
        <Avatar className="size-7">
          <AvatarFallback className="bg-foreground text-background text-xs font-semibold">
            JD
          </AvatarFallback>
        </Avatar>
        <div className="hidden flex-col items-start md:flex">
          <span className="text-sm font-medium leading-none">John Doe</span>
          <span className="text-[11px] text-muted-foreground">
            Administrator
          </span>
        </div>
        <ChevronDown className="hidden size-3 text-muted-foreground md:block" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">admin@transitops.io</p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 cursor-pointer">
          <User className="size-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 text-destructive cursor-pointer">
          <LogOut className="size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TopNav() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex-1"></div>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden items-center gap-3 md:flex">
          <DatePicker />
          <Separator orientation="vertical" className="h-4" />
          <LiveClock />
        </div>

        <Separator orientation="vertical" className="h-5" />

        <Button variant="ghost" size="icon-sm" className="relative">
          <Bell className="size-4" />
          <span className="absolute -top-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">
            3
          </span>
        </Button>

        <Separator orientation="vertical" className="h-5" />

        <UserMenu />
      </div>
    </header>
  );
}

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <TopNav />
        <div className="flex-1 overflow-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
