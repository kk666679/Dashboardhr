import { trpc } from "@/lib/trpc";
import { useCallback } from "react";

// ─── Type Definitions ────────────────────────────────────────────────────────

interface SwapRequestInput {
  employeeId: string;
  shiftId: string;
  targetEmployeeId: string;
  targetShiftId?: string;
  reason?: string;
}

interface RotationGenerateInput {
  name: string;
  description?: string;
  groupId: string;
  patternIds: string[];
  startDate: Date | string;
  cycleLength: number;
  endDate?: Date | string;
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useScheduling() {
  const api = trpc as any;
  const utils = trpc.useUtils();

  const shiftPatterns = {
    getAll: api.shiftPattern.getAll.useQuery,
    getById: api.shiftPattern.getById.useQuery,
    create: api.shiftPattern.create.useMutation,
    update: api.shiftPattern.update.useMutation,
    delete: api.shiftPattern.delete.useMutation,
  };

  const rotations = {
    getAll: api.rotation.getByGroup.useQuery,
    create: api.rotation.generate.useMutation,
    update: api.rotation.generate.useMutation,
    delete: api.rotation.generate.useMutation,
    generate: api.rotation.generate.useMutation,
  };

  const swaps = {
    getAll: api.swap.getAll.useQuery,
    create: api.swap.request.useMutation,
    approve: api.swap.approve.useMutation,
    reject: api.swap.reject.useMutation,
  };

  const requestSwap = useCallback(async (input: SwapRequestInput) => {
    try {
      const mutation = api.swap.request.useMutation();
      const result = await mutation.mutateAsync(input);
      await utils.swap.getAll.invalidate();
      return result;
    } catch (error) {
      console.error("Failed to request swap:", error);
      throw error;
    }
  }, [api, utils]);

  const approveSwap = useCallback(async (swapId: string, comment?: string) => {
    try {
      const mutation = api.swap.approve.useMutation();
      const result = await mutation.mutateAsync({ id: swapId, comment });
      await utils.swap.getAll.invalidate();
      return result;
    } catch (error) {
      console.error("Failed to approve swap:", error);
      throw error;
    }
  }, [api, utils]);

  const rejectSwap = useCallback(async (swapId: string, reason?: string) => {
    try {
      const mutation = api.swap.reject.useMutation();
      const result = await mutation.mutateAsync({ id: swapId, reason });
      await utils.swap.getAll.invalidate();
      return result;
    } catch (error) {
      console.error("Failed to reject swap:", error);
      throw error;
    }
  }, [api, utils]);

  const generateRotation = useCallback(async (input: RotationGenerateInput) => {
    try {
      const mutation = api.rotation.generate.useMutation();
      const result = await mutation.mutateAsync({
        patternId: input.patternIds[0],
        employeeIds: [input.groupId],
        startDate: input.startDate,
        weeks: input.cycleLength,
      });
      await utils.rotation.getByGroup.invalidate();
      return result;
    } catch (error) {
      console.error("Failed to generate rotation:", error);
      throw error;
    }
  }, [api, utils]);

  return {
    shiftPatterns,
    rotations,
    swaps,
    requestSwap,
    approveSwap,
    rejectSwap,
    generateRotation,
  };
}

