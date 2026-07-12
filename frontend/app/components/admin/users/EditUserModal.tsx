"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import Modal from "@/app/components/ui/Modal";
import Input from "@/app/components/ui/Input";
import Select from "@/app/components/ui/Select";
import Button from "@/app/components/ui/Button";
import { User as UserIcon, Phone, ShieldCheck } from "lucide-react";
import { UpdateUserFormValues, updateUserSchema } from "@/app/schemas/user.schema";
import { User } from "@/app/types/user.types";
import { useUpdateUser } from "@/app/hooks/useUsers";

const ROLE_OPTIONS = [
  { value: "driver", label: "Driver" },
  { value: "fleet_manager", label: "Fleet Manager" },
  { value: "admin", label: "Admin" },
];

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

export default function EditUserModal({ open, onClose, user }: EditUserModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
  });

  const updateUser = useUpdateUser({ onSuccess: handleClose });

  // Populate form when user changes
  useEffect(() => {
    if (user) {
      reset({ name: user.name, phone: user.phone, role: user.role });
    }
  }, [user, reset]);

  function handleClose() {
    reset();
    onClose();
  }

  async function onSubmit(values: UpdateUserFormValues) {
    if (!user) return;
    await updateUser.mutateAsync({ id: user.id, payload: values });
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Edit Employee"
      description={user ? `Editing ${user.name}` : ""}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input
          label="Full Name"
          placeholder="e.g. John Doe"
          required
          leftIcon={<UserIcon className="h-4 w-4" />}
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Phone Number"
          type="tel"
          placeholder="1234567890"
          required
          leftIcon={<Phone className="h-4 w-4" />}
          hint="Digits only, 7–15 characters"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <Select
          label="Role"
          required
          options={ROLE_OPTIONS}
          leftIcon={<ShieldCheck className="h-4 w-4" />}
          error={errors.role?.message}
          {...register("role")}
        />

        <div className="pt-2 flex justify-end gap-3 border-t border-slate-100 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={updateUser.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={updateUser.isPending || isSubmitting}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
