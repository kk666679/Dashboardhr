"use client";

import { useSearchParams as useNextSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

/**
 * URL search params hook for managing filter/pagination state in the URL.
 *
 * Keeps UI state (filters, page, sort) synchronised with the URL query string,
 * enabling shareable URLs and browser back/forward navigation.
 *
 * @example
 * ```tsx
 * const { params, setParam, setParams, resetParams } = useSearchParams()
 *
 * // Read current filter
 * const page = params.get('page') ?? '1'
 * const search = params.get('search') ?? ''
 *
 * // Update single param
 * setParam('page', '2')
 *
 * // Update multiple params at once
 * setParams({ page: '1', search: 'john' })
 *
 * // Reset all params
 * resetParams()
 * ```
 */
export function useSearchParams() {
  const searchParams = useNextSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  /**
   * Current search params as a URLSearchParams instance.
   */
  const params = useMemo(() => searchParams, [searchParams]);

  /**
   * Build a new URLSearchParams string, preserving or overriding values.
   */
  const buildParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const newParams = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === "") {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      }
      return newParams.toString();
    },
    [searchParams],
  );

  /**
   * Set a single search param and update the URL.
   */
  const setParam = useCallback(
    (key: string, value: string | undefined) => {
      const newParams = buildParams({ [key]: value });
      router.push(`${pathname}?${newParams}`, { scroll: false });
    },
    [buildParams, pathname, router],
  );

  /**
   * Set multiple search params at once and update the URL.
   */
  const setParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const newParams = buildParams(updates);
      router.push(`${pathname}?${newParams}`, { scroll: false });
    },
    [buildParams, pathname, router],
  );

  /**
   * Reset all search params.
   */
  const resetParams = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  /**
   * Get a specific param value with optional default.
   */
  const getParam = useCallback(
    (key: string, defaultValue?: string) => {
      return searchParams.get(key) ?? defaultValue ?? null;
    },
    [searchParams],
  );

  /**
   * Check if a param exists.
   */
  const hasParam = useCallback(
    (key: string) => {
      return searchParams.has(key);
    },
    [searchParams],
  );

  /**
   * Pagination helper: get current page and setter.
   */
  const pagination = useMemo(() => {
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") ?? "10", 10);
    return {
      page: isNaN(page) ? 1 : page,
      pageSize: isNaN(pageSize) ? 10 : pageSize,
      setPage: (p: number) => setParam("page", p.toString()),
      setPageSize: (s: number) => setParams({ page: "1", pageSize: s.toString() }),
    };
  }, [searchParams, setParam, setParams]);

  /**
   * Sort helper.
   */
  const sorting = useMemo(() => {
    const sortBy = searchParams.get("sortBy") ?? undefined;
    const sortOrder = (searchParams.get("sortOrder") ?? "asc") as "asc" | "desc";
    return {
      sortBy,
      sortOrder,
      setSorting: (field: string, order?: "asc" | "desc") =>
        setParams({ sortBy: field, sortOrder: order ?? sortOrder }),
      toggleSort: (field: string) =>
        setParams({
          sortBy: field,
          sortOrder: sortBy === field && sortOrder === "asc" ? "desc" : "asc",
        }),
    };
  }, [searchParams, setParams]);

  /**
   * Filter helper.
   */
  const filters = useMemo(() => ({
    get: (key: string, defaultValue?: string) => getParam(`filter_${key}`, defaultValue),
    set: (key: string, value: string | undefined) => setParam(`filter_${key}`, value),
    clear: (key: string) => setParam(`filter_${key}`, undefined),
    clearAll: () => {
      const newParams = new URLSearchParams();
      const page = searchParams.get("page");
      const pageSize = searchParams.get("pageSize");
      if (page) newParams.set("page", page);
      if (pageSize) newParams.set("pageSize", pageSize);
      router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
    },
  }), [getParam, setParam, router, pathname, searchParams]);

  return {
    params,
    setParam,
    setParams,
    resetParams,
    getParam,
    hasParam,
    pagination,
    sorting,
    filters,
  };
}
