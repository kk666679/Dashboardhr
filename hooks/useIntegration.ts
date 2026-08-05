import { trpc } from "@/lib/trpc";

interface IntegrationInput {
  name: string;
  provider: string;
  config: Record<string, unknown>;
  isActive?: boolean;
}

export function useIntegration() {
  const api = trpc as any;
  const utils = trpc.useUtils();

  const integrations = {
    getAll: api.integrations?.list?.useQuery ?? (() => ({ data: [], isLoading: false })),
  };

  const createIntegration = async (input: IntegrationInput) => {
    try {
      const mutation = api.integrations?.create?.useMutation?.();
      const result = mutation ? await mutation.mutateAsync(input) : null;
      await utils.integrations?.list?.invalidate?.();
      return result;
    } catch (error) {
      console.error("Failed to create integration:", error);
      throw error;
    }
  };

  const updateIntegration = async (id: string, data: Record<string, unknown>) => {
    try {
      const mutation = api.integrations?.update?.useMutation?.();
      const result = mutation ? await mutation.mutateAsync({ id, ...data }) : null;
      await utils.integrations?.list?.invalidate?.();
      return result;
    } catch (error) {
      console.error("Failed to update integration:", error);
      throw error;
    }
  };

  const deleteIntegration = async (id: string) => {
    try {
      const mutation = api.integrations?.delete?.useMutation?.();
      if (mutation) await mutation.mutateAsync({ id });
      await utils.integrations?.list?.invalidate?.();
    } catch (error) {
      console.error("Failed to delete integration:", error);
      throw error;
    }
  };

  const syncIntegration = async (id: string) => {
    try {
      const mutation = api.integrations?.sync?.useMutation?.();
      return mutation ? await mutation.mutateAsync({ id }) : null;
    } catch (error) {
      console.error("Failed to sync integration:", error);
      throw error;
    }
  };

  return {
    integrations,
    createIntegration,
    updateIntegration,
    deleteIntegration,
    syncIntegration,
  };
}

