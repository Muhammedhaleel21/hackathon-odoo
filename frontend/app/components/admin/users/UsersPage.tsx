"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { UserPlus, Users, RefreshCw } from "lucide-react";
import Button from "@/app/components/ui/Button";
import UsersEmptyState from "../../../components/admin/users/UsersEmptyState";
import CreateUserModal from "../../../components/admin/users/CreateUserModal";
import { useUsers } from "@/app/hooks/useUsers";
import UsersSearchBar from "./UsersSearchBar";
import UsersTable from "./UsersTable";

// Skeleton row loader
function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="h-10 bg-slate-50 border-b border-slate-100" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-4 py-3.5 border-b border-slate-50 last:border-0"
        >
          <div className="h-3 w-28 rounded-full bg-slate-100 animate-pulse" />
          <div className="flex items-center gap-3 flex-1">
            <div className="h-8 w-8 rounded-full bg-slate-100 animate-pulse shrink-0" />
            <div className="h-3 w-32 rounded-full bg-slate-100 animate-pulse" />
          </div>
          <div className="h-3 w-44 rounded-full bg-slate-100 animate-pulse" />
          <div className="h-3 w-24 rounded-full bg-slate-100 animate-pulse" />
          <div className="h-5 w-20 rounded-full bg-slate-100 animate-pulse" />
          <div className="h-3 w-32 rounded-full bg-slate-100 animate-pulse" />
          <div className="flex gap-1">
            {[1, 2, 3].map((j) => (
              <div key={j} className="h-8 w-8 rounded-lg bg-slate-100 animate-pulse" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const { data: users, isLoading, isError, refetch, isFetching } = useUsers();

  // Client-side filtering
  const filtered = useMemo(() => {
    if (!users) return [];
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q) ||
        u.userId.toLowerCase().includes(q)
    );
  }, [users, search]);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-1"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100">
            <Users className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Employees
            </h1>
            <p className="text-sm text-slate-500">
              {users
                ? `${users.length} total employee${users.length !== 1 ? "s" : ""}`
                : "Manage your fleet team members"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="flex flex-col sm:flex-row gap-3 items-start sm:items-center"
      >
        <UsersSearchBar
          value={search}
          onChange={setSearch}
          className="w-full sm:max-w-sm"
        />
        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => refetch()}
            loading={isFetching && !isLoading}
            title="Refresh"
            aria-label="Refresh employees list"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="primary"
            onClick={() => setCreateOpen(true)}
            leftIcon={<UserPlus className="h-4 w-4" />}
            id="create-user-btn"
          >
            Add Employee
          </Button>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {isLoading ? (
          <TableSkeleton />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-red-100 bg-red-50 text-center px-6">
            <p className="text-sm font-semibold text-red-700 mb-1">Failed to load employees</p>
            <p className="text-xs text-red-500 mb-4">
              Check that the backend is running and you are authenticated.
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <UsersEmptyState
            hasSearch={!!search.trim()}
            onCreateClick={() => setCreateOpen(true)}
          />
        ) : (
          <UsersTable users={filtered} />
        )}
      </motion.div>

      {/* Stats bar */}
      {filtered.length > 0 && (
        <p className="text-xs text-slate-400 text-right">
          Showing {filtered.length} of {users?.length ?? 0} employees
        </p>
      )}

      {/* Create modal */}
      <CreateUserModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
