"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  createUserSchema,
  updateUserSchema,
  type CreateUserFormValues,
  type UpdateUserFormValues,
} from "@/schemas/user.schema";

import {
  useCreateUser,
  useUpdateUser,
} from "@/hooks/useUsers";

import { ApiRequestError } from "@/lib/api/client";

import type { AdminUser } from "@/types";

import { UserCreateForm } from "./CreateUserForm";
import { UserEditForm } from "./UserEditForm";

export function UserFormDialog({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: AdminUser | null;
}) {
  const t = useTranslations("user");
  const tCommon = useTranslations("common");

  const isEdit = Boolean(user);

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending;

  const createForm = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      role: "STAFF",
    },
  });

  const editForm = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      role: "STAFF",
      isActive: true,
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  useEffect(() => {
    if (!open) return;

    if (user) {
      editForm.reset({
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        newPassword: "",
        confirmNewPassword: "",
      });
    } else {
      createForm.reset({
        name: "",
        username: "",
        password: "",
        role: "STAFF",
      });
    }
  }, [open, user, createForm, editForm]);

  const onError = (error: unknown) => {
    const message =
      error instanceof ApiRequestError
        ? error.message
        : tCommon("somethingWentWrong");

    toast.error(message);
  };

  const onCreate = (values: CreateUserFormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        toast.success(t("createdSuccessfully"));
        onOpenChange(false);
      },
      onError,
    });
  };

  const onEdit = (values: UpdateUserFormValues) => {
    if (!user) return;

    const payload: UpdateUserFormValues = {
      ...values,
    };

    if (!payload.newPassword) {
      delete payload.newPassword;
      delete payload.confirmNewPassword;
    }

    updateMutation.mutate(
      {
        id: user.id,
        payload,
      },
      {
        onSuccess: () => {
          toast.success(t("updatedSuccessfully"));
          onOpenChange(false);
        },
        onError,
      }
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? t("title")
              : t("createAccount")}
          </DialogTitle>
        </DialogHeader>

        {isEdit ? (
          <UserEditForm
            form={editForm}
            isPending={isPending}
            onSubmit={onEdit}
            onCancel={() => onOpenChange(false)}
          />
        ) : (
          <UserCreateForm
            form={createForm}
            isPending={isPending}
            onSubmit={onCreate}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}