import { trpc } from "@/lib/trpc";

export function useDocument() {
  const utils = trpc.useUtils();

  const documents = {
    getAll: trpc.document.list.useQuery,
    create: trpc.document.create.useMutation,
    update: trpc.document.update.useMutation,
    validate: trpc.document.validate.useMutation,
  };

  return {
    documents,
  };
}
