"use client";

import { useToast } from "@/hooks/use-toast";
import { trpc } from "@/lib/trpc";
import { useCallback } from "react";

type EmployeeCreateInput = { name: string; email: string; phone?: string; address?: string; dateOfBirth?: string; nationality?: string; country?: string; position?: string; department?: string; hireDate?: string; isForeign?: boolean; tags?: string[] };
type EmployeeUpdateInput = { id: string; data: { name?: string; email?: string; phone?: string; address?: string; dateOfBirth?: string; nationality?: string; country?: string; position?: string; department?: string; hireDate?: string; isForeign?: boolean; tags?: string[] } };

export function useFormMutation() {
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const createMutation = trpc.employee.create.useMutation({
    onSuccess: () => {
      toast({ title: "Employee created" });
      utils.employee.list.invalidate();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create employee", variant: "destructive" });
    },
  });

  const updateMutation = trpc.employee.update.useMutation({
    onSuccess: () => {
      toast({ title: "Employee updated" });
      utils.employee.list.invalidate();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update employee", variant: "destructive" });
    },
  });

  const deleteMutation = trpc.employee.delete.useMutation({
    onSuccess: () => {
      toast({ title: "Employee deleted" });
      utils.employee.list.invalidate();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete employee", variant: "destructive" });
    },
  });

  const createEmployee = useCallback(
    async (data: EmployeeCreateInput) => {
      try {
        const result = await createMutation.mutateAsync(data as unknown as void as any);
        return result;
      } catch (error) {
        throw error;
      }
    },
    [createMutation]
  );

  const updateEmployee = useCallback(
    async (data: EmployeeUpdateInput) => {
      try {
        const result = await updateMutation.mutateAsync(data as unknown as void as any);
        return result;
      } catch (error) {
        throw error;
      }
    },
    [updateMutation]
  );

  const deleteEmployee = useCallback(
    async (id: string) => {
      try {
        await deleteMutation.mutateAsync({ id } as unknown as void as any);
      } catch (error) {
        throw error;
      }
    },
    [deleteMutation]
  );

  return {
    createEmployee,
    updateEmployee,
    deleteEmployee,
  };
}

