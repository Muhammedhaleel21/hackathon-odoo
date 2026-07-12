"use client";

import { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Button from "@/app/components/ui/Button";
import ConfirmDialog from "@/app/components/ui/ConfirmDialog";
import Modal from "@/app/components/ui/Modal";
import RoleBadge from "@/app/components/ui/RoleBadge";
import { formatDate } from "@/lib/utils";
import { User } from "@/app/types/user.types";
import { useDeleteUser } from "@/app/hooks/useUsers";

interface UserActionsProps {
  user: User;
  onEdit: (user: User) => void;
}

export default function UserActions({ user, onEdit }: UserActionsProps) {
  const [showView, setShowView] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const deleteUser = useDeleteUser();

  async function handleDelete() {
    await deleteUser.mutateAsync(user.id);
    setShowDelete(false);
  }

  return (
    <>
      <div className="flex items-center gap-1">
        {/* View */}
        <Button
          variant="ghost"
          size="icon"
          title="View details"
          onClick={() => setShowView(true)}
          aria-label={`View ${user.name}`}
        >
          <Eye className="h-4 w-4" />
        </Button>

        {/* Edit */}
        <Button
          variant="ghost"
          size="icon"
          title="Edit employee"
          onClick={() => onEdit(user)}
          aria-label={`Edit ${user.name}`}
        >
          <Pencil className="h-4 w-4" />
        </Button>

        {/* Delete */}
        <Button
          variant="ghost"
          size="icon"
          title="Delete employee"
          onClick={() => setShowDelete(true)}
          aria-label={`Delete ${user.name}`}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* View Modal */}
      <Modal
        open={showView}
        onClose={() => setShowView(false)}
        title="Employee Details"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-600">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-lg">{user.name}</p>
              <RoleBadge role={user.role} />
            </div>
          </div>
          <dl className="grid gap-3 text-sm">
            {[
              { label: "User ID", value: user.userId },
              { label: "Email", value: user.email },
              { label: "Phone", value: user.phone },
              { label: "Created", value: formatDate(user.createdAt) },
              { label: "Last Updated", value: formatDate(user.updatedAt) },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-3 py-2 border-b border-slate-50 last:border-0">
                <dt className="w-28 shrink-0 text-slate-500 font-medium">{label}</dt>
                <dd className="text-slate-900 font-mono text-xs break-all">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Employee?"
        description={`"${user.name}" will be permanently removed from the system. This cannot be undone.`}
        confirmLabel="Delete Employee"
        loading={deleteUser.isPending}
      />
    </>
  );
}
