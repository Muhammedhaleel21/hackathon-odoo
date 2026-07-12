"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import RoleBadge from "@/app/components/ui/RoleBadge";
import UserActions from "./UserActions";
import type { User, SortField, SortDir } from "../../../types/user.types";
import { formatDate, truncate, cn } from "@/lib/utils";
import EditUserModal from "./EditUserModal";

interface UsersTableProps {
  users: User[];
}

type SortState = { field: SortField; dir: SortDir };

const COLUMNS: { key: SortField | null; label: string; sortable: boolean }[] = [
  { key: "id", label: "User ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: null, label: "Email", sortable: false },
  { key: null, label: "Phone", sortable: false },
  { key: null, label: "Role", sortable: false },
  { key: "createdAt", label: "Created At", sortable: true },
  { key: null, label: "Actions", sortable: false },
];

function SortIcon({ field, sort }: { field: SortField; sort: SortState }) {
  if (sort.field !== field) return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />;
  return sort.dir === "asc"
    ? <ArrowUp className="h-3.5 w-3.5 text-indigo-600" />
    : <ArrowDown className="h-3.5 w-3.5 text-indigo-600" />;
}

export default function UsersTable({ users }: UsersTableProps) {
  const [sort, setSort] = useState<SortState>({ field: "createdAt", dir: "desc" });
  const [editUser, setEditUser] = useState<User | null>(null);

  function toggleSort(field: SortField) {
    setSort((prev) =>
      prev.field === field
        ? { field, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { field, dir: "asc" }
    );
  }

  const sorted = [...users].sort((a, b) => {
    const mult = sort.dir === "asc" ? 1 : -1;
    const av = a[sort.field] ?? "";
    const bv = b[sort.field] ?? "";
    return av < bv ? -mult : av > bv ? mult : 0;
  });

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-100 text-sm" role="table">
          <thead>
            <tr className="bg-slate-50">
              {COLUMNS.map(({ key, label, sortable }) => (
                <th
                  key={label}
                  scope="col"
                  className={cn(
                    "px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap",
                    sortable && "cursor-pointer select-none hover:text-slate-800 transition-colors",
                    key === "id" && "w-36"
                  )}
                  onClick={sortable && key ? () => toggleSort(key as SortField) : undefined}
                  aria-sort={
                    sortable && key === sort.field
                      ? sort.dir === "asc"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                >
                  <span className="flex items-center gap-1.5">
                    {label}
                    {sortable && key && (
                      <SortIcon field={key as SortField} sort={sort} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <AnimatePresence initial={false}>
              {sorted.map((user, idx) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.15, delay: idx * 0.02 }}
                  className="group hover:bg-slate-50/80 transition-colors"
                >
                  {/* User ID */}
                  <td className="px-4 py-3 font-mono text-xs text-slate-700 w-36 font-semibold">
                    <span
                      title={user.userId}
                      className="inline-block max-w-[120px] truncate"
                    >
                      {user.userId}
                    </span>
                  </td>

                  {/* Name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-900">{user.name}</span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-4 py-3 text-slate-600">{user.email}</td>

                  {/* Phone */}
                  <td className="px-4 py-3 text-slate-600 tabular-nums">{user.phone}</td>

                  {/* Role */}
                  <td className="px-4 py-3">
                    <RoleBadge role={user.role} />
                  </td>

                  {/* Created At */}
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap tabular-nums text-xs">
                    {formatDate(user.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <UserActions user={user} onEdit={setEditUser} />
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Edit modal driven from table */}
      <EditUserModal
        open={!!editUser}
        onClose={() => setEditUser(null)}
        user={editUser}
      />
    </>
  );
}
