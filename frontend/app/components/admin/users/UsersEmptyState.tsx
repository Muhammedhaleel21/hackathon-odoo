"use client";

import { UserX, UserPlus } from "lucide-react";
import Button from "@/app/components/ui/Button";

interface UsersEmptyStateProps {
  hasSearch?: boolean;
  onCreateClick: () => void;
}

export default function UsersEmptyState({
  hasSearch = false,
  onCreateClick,
}: UsersEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 mb-4">
        <UserX className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">
        {hasSearch ? "No employees found" : "No employees yet"}
      </h3>
      <p className="text-sm text-slate-500 max-w-xs mb-6">
        {hasSearch
          ? "Try adjusting your search query."
          : "Get started by adding your first employee to the fleet management system."}
      </p>
      {!hasSearch && (
        <Button
          variant="primary"
          onClick={onCreateClick}
          leftIcon={<UserPlus className="h-4 w-4" />}
        >
          Add First Employee
        </Button>
      )}
    </div>
  );
}
