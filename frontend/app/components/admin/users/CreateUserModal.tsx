"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import Modal from "@/app/components/ui/Modal";
import Input from "@/app/components/ui/Input";
import Select from "@/app/components/ui/Select";
import Button from "@/app/components/ui/Button";
import { createUserSchema, type CreateUserFormValues } from "../../../schemas/user.schema";
import { User, Lock, Phone, Mail, ShieldCheck, Hash } from "lucide-react";
import { useCreateUser } from "@/app/hooks/useUsers";

const ROLE_OPTIONS = [
  { value: "driver", label: "Driver" },
  { value: "fleet_manager", label: "Fleet Manager" },
  { value: "admin", label: "Admin" },
];

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateUserModal({ open, onClose }: CreateUserModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { role: "driver" },
  });

  const createUser = useCreateUser({ onSuccess: handleClose });

  function handleClose() {
    reset();
    onClose();
  }

  // Reset form when modal closes
  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  async function onSubmit(values: CreateUserFormValues) {
    await createUser.mutateAsync(values);
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add New Employee"
      description="Fill in the details below to create a new employee account."
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* User ID */}
        <Input
          label="User ID"
          placeholder="e.g. EMP001"
          required
          leftIcon={<Hash className="h-4 w-4" />}
          error={errors.userId?.message}
          {...register("userId")}
        />

        {/* Full Name */}
        <Input
          label="Full Name"
          placeholder="e.g. John Doe"
          required
          autoComplete="name"
          leftIcon={<User className="h-4 w-4" />}
          error={errors.name?.message}
          {...register("name")}
        />

        {/* Email */}
        <Input
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          required
          autoComplete="email"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email")}
        />

        {/* Phone */}
        <Input
          label="Phone Number"
          type="tel"
          placeholder="1234567890"
          required
          autoComplete="tel"
          leftIcon={<Phone className="h-4 w-4" />}
          hint="Digits only, 7–15 characters"
          error={errors.phone?.message}
          {...register("phone")}
        />

        {/* Password */}
        <Input
          label="Password"
          type="password"
          placeholder="Min. 8 characters"
          required
          autoComplete="new-password"
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.password?.message}
          {...register("password")}
        />

        {/* Role */}
        <Select
          label="Role"
          required
          options={ROLE_OPTIONS}
          leftIcon={<ShieldCheck className="h-4 w-4" />}
          error={errors.role?.message}
          {...register("role")}
        />

        {/* Actions */}
        <div className="pt-2 flex justify-end gap-3 border-t border-slate-100 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={createUser.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={createUser.isPending || isSubmitting}
          >
            Create Employee
          </Button>
        </div>
      </form>
    </Modal>
  );
}
