// hooks/useAutomation.ts (with optimistic updates)
import { useTRPC } from "@/lib/trpc";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Automation, AutomationInput, AutomationUpdateInput } from "@/lib/automation";

// ─── Type Definitions ────────────────────────────────────────────────────────

interface AutomationFilters {
  status?: string;
  search?: string;
  category?: string;
  limit?: number;
  offset?: number;
}

interface UseAutomationOptions {
  enabled?: boolean;
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
  retry?: number;
  retryDelay?: number;
}

// ─── Hooks with Optimistic Updates ──────────────────────────────────────────

/**
 * Fetch all automations with optional filters.
 */
export function useAutomations(
  filters?: AutomationFilters,
  options?: UseAutomationOptions
) {
  const trpc = useTRPC();

  return useQuery({
    ...(trpc as any).automation.list.queryOptions(filters),
    ...options,
  });
}

/**
 * Fetch a single automation by ID.
 */
export function useAutomation(
  id: string,
  options?: UseAutomationOptions
) {
  const trpc = useTRPC();

  if (!id) {
    throw new Error("Automation ID is required");
  }

  return useQuery({
    ...(trpc as any).automation.get.queryOptions({ id }),
    ...options,
    enabled: options?.enabled !== undefined ? options.enabled : !!id,
  });
}

/**
 * Create a new automation with optimistic update.
 */
export function useCreateAutomation() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...(trpc as any).automation.create.useMutation({
      onMutate: async (newAutomation: AutomationInput) => {
        await queryClient.cancelQueries({
          queryKey: (trpc as any).automation.list.getQueryKey()
        });

        const previousAutomations = queryClient.getQueryData<Automation[]>(
          (trpc as any).automation.list.getQueryKey()
        );

        if (previousAutomations) {
          const optimisticAutomation: Automation = {
            id: `temp-${Date.now()}`,
            ...newAutomation,
            createdAt: new Date(),
            updatedAt: new Date(),
            status: "draft",
          };
          queryClient.setQueryData(
            (trpc as any).automation.list.getQueryKey(),
            [...previousAutomations, optimisticAutomation]
          );
        }

        return { previousAutomations };
      },
      onSuccess: (data: Automation) => {
        queryClient.setQueryData(
          (trpc as any).automation.get.getQueryKey({ id: data.id }),
          data
        );

        queryClient.invalidateQueries({
          queryKey: (trpc as any).automation.list.getQueryKey()
        });
      },
      onError: (_error: unknown, _variables: AutomationInput, context: any) => {
        if (context?.previousAutomations) {
          queryClient.setQueryData(
            (trpc as any).automation.list.getQueryKey(),
            context.previousAutomations
          );
        }
      },
    }),
  });
}

/**
 * Update an existing automation with optimistic update.
 */
export function useUpdateAutomation() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...(trpc as any).automation.update.useMutation({
      onMutate: async (updatedAutomation: { id: string } & AutomationUpdateInput) => {
        await queryClient.cancelQueries({
          queryKey: (trpc as any).automation.get.getQueryKey({ id: updatedAutomation.id })
        });

        const previousAutomation = queryClient.getQueryData<Automation>(
          (trpc as any).automation.get.getQueryKey({ id: updatedAutomation.id })
        );

        if (previousAutomation) {
          queryClient.setQueryData(
            (trpc as any).automation.get.getQueryKey({ id: updatedAutomation.id }),
            { ...previousAutomation, ...updatedAutomation, updatedAt: new Date().toISOString() }
          );
        }

        return { previousAutomation };
      },
      onSuccess: (data: Automation) => {
        queryClient.setQueryData(
          (trpc as any).automation.get.getQueryKey({ id: data.id }),
          data
        );
        queryClient.invalidateQueries({
          queryKey: (trpc as any).automation.list.getQueryKey()
        });
      },
      onError: (_error: unknown, variables: { id: string }, context: any) => {
        if (context?.previousAutomation) {
          queryClient.setQueryData(
            (trpc as any).automation.get.getQueryKey({ id: variables.id }),
            context.previousAutomation
          );
        }
      },
    }),
  });
}

