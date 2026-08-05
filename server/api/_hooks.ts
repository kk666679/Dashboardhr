"use client";

import { useState, useEffect, useCallback } from "react";

export function useQuery<T>(url: string) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetch(url)
      .then((r) => r.json())
      .then((d) => { if (!cancelled) { setData(d); setIsLoading(false); } })
      .catch((e) => { if (!cancelled) { setError(e); setIsLoading(false); } });
    return () => { cancelled = true; };
  }, [url, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);
  return { data, isLoading, error, refetch };
}

export function useMutation<TResult, TArg>(
  buildRequest: (arg: TArg) => { url: string; method: string; body?: unknown }
) {
  const [isLoading, setIsLoading] = useState(false);
  const trigger = useCallback((arg: TArg) => {
    const promise = (async () => {
      setIsLoading(true);
      try {
        const { url, method, body } = buildRequest(arg);
        const res = await fetch(url, {
          method,
          headers: body instanceof FormData ? undefined : { "Content-Type": "application/json" },
          body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json() as Promise<TResult>;
      } finally {
        setIsLoading(false);
      }
    })();
    return Object.assign(promise, { unwrap: () => promise });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [trigger, { isLoading }] as const;
}

export function buildQs(params: Record<string, unknown>): string {
  const qs = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null)
    ) as Record<string, string>
  ).toString();
  return qs ? `?${qs}` : "";
}
