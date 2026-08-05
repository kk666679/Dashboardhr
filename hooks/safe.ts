"use client";

/**
 * @deprecated This utility is deprecated. Use direct tRPC hooks instead.
 *
 * Migrate from `safeQuery`, `safeQueryArray`, and `safeMutation` to calling
 * tRPC procedures directly via `trpc.*.*.useQuery()` / `useMutation()`.
 *
 * ✅ Direct pattern (preferred):
 *   const { data, isLoading } = trpc.employee.list.useQuery()
 *   const { mutate } = trpc.employee.create.useMutation()
 *
 * ❌ Legacy pattern (deprecated):
 *   const { employees } = useEmployee()
 *   employees.getAll() // returns wrapped safeQuery result
 *
 * See the refactored hooks in /hooks/*.ts for reference.
 *
 * @see /docs/ARCHITECTURE.md — State Management Architecture
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...args: any[]) => any;

// Mutation hook from tRPC v11 / React Query v5 returns isPending, not isLoading
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TRPCMutationHook = (...args: any[]) => any;

export type QueryResult<T> = {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
};

export type QueryResultArray<T> = {
  data: T[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
};

export type MutationResult<TInput, TOutput> = {
  mutate: (input: TInput) => void;
  mutateAsync: (input: TInput) => Promise<TOutput>;
  isPending: boolean;
  isError: boolean;
  error: unknown;
  reset: () => void;
};

export function safeQuery<T>(
  queryFn: ((...args: any[]) => any) | null | undefined,
  defaultValue: T | null = null
): () => QueryResult<T> {
  return () => {
    try {
      const result = queryFn ? queryFn() : null;
      return {
        data: result?.data ?? defaultValue,
        isLoading: result?.isLoading ?? false,
        isError: result?.isError ?? false,
        error: result?.error ?? null,
        refetch: result?.refetch ?? (() => {}),
      };
    } catch {
      return {
        data: defaultValue,
        isLoading: false,
        isError: true,
        error: new Error("Router not available"),
        refetch: () => {},
      };
    }
  };
}

export function safeQueryArray<T>(
  queryFn: ((...args: any[]) => any) | null | undefined,
  defaultValue: T[] = []
): () => QueryResultArray<T> {
  return () => {
    try {
      const result = queryFn ? queryFn() : null;
      return {
        data: result?.data ?? defaultValue,
        isLoading: result?.isLoading ?? false,
        isError: result?.isError ?? false,
        error: result?.error ?? null,
        refetch: result?.refetch ?? (() => {}),
      };
    } catch {
      return {
        data: defaultValue,
        isLoading: false,
        isError: true,
        error: new Error("Router not available"),
        refetch: () => {},
      };
    }
  };
}

function callMutationHook<TInput, TOutput>(
  hook: TRPCMutationHook | null | undefined
): { mutate: (input: TInput) => void; mutateAsync: (input: TInput) => Promise<TOutput>; isPending: boolean; isError: boolean; error: unknown; reset: () => void } {
  try {
    const result = hook ? (hook() as any) : null;
    return {
      mutate: (result?.mutate ?? (() => {})) as (input: TInput) => void,
      mutateAsync: (result?.mutateAsync ?? (async () => ({} as TOutput))) as (input: TInput) => Promise<TOutput>,
      isPending: result?.isPending ?? false,
      isError: result?.isError ?? false,
      error: result?.error ?? null,
      reset: result?.reset ?? (() => {}),
    };
  } catch {
    return {
      mutate: () => {},
      mutateAsync: async () => ({} as TOutput),
      isPending: false,
      isError: true,
      error: new Error("Router not available"),
      reset: () => {},
    };
  }
}

export function safeMutation<TInput, TOutput>(
  mutationHook: TRPCMutationHook | null | undefined
): MutationResult<TInput, TOutput> {
  const result = callMutationHook<TInput, TOutput>(mutationHook);
  return result;
}
