"use client";

import { createContext, useContext, useMemo, useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type FlagVariant = "default" | "pill" | "badge" | "minimal";

export interface FeatureFlagConfig {
  /** Unique flag key (e.g., "new-onboarding-flow") */
  key: string;
  /** Human-readable name */
  name: string;
  /** Description of what this flag controls */
  description?: string;
  /** Whether the flag is enabled */
  enabled: boolean;
  /** Optional rollout percentage (0-100) */
  rolloutPercentage?: number;
  /** Optional tenant IDs this flag is limited to */
  tenantIds?: string[];
  /** Flag owner/team */
  owner?: string;
  /** When the flag was created */
  createdAt?: string;
  /** When the flag was last updated */
  updatedAt?: string;
}

export interface FeatureFlagContextValue {
  flags: Record<string, FeatureFlagConfig>;
  isEnabled: (key: string, context?: { tenantId?: string; userId?: string }) => boolean;
  setFlag: (key: string, enabled: boolean) => void;
  getFlag: (key: string) => FeatureFlagConfig | undefined;
  getAllFlags: () => FeatureFlagConfig[];
}

// ─── Context ──────────────────────────────────────────────────────────────────

const FeatureFlagContext = createContext<FeatureFlagContextValue | null>(null);

export function useFeatureFlags(): FeatureFlagContextValue {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error(
      "useFeatureFlags must be used within a FeatureFlagProvider"
    );
  }
  return context;
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface FeatureFlagProviderProps {
  /** Initial flag configurations */
  initialFlags?: FeatureFlagConfig[];
  /** Children */
  children: ReactNode;
  /** Current tenant ID for tenant-scoped flags */
  tenantId?: string;
  /** Current user ID for user-scoped evaluation */
  userId?: string;
}

export interface FeatureFlagProps {
  /** Flag key to check */
  name: string;
  /** Fallback content when flag is disabled */
  fallback?: ReactNode;
  /** Children to render when flag is enabled */
  children: ReactNode;
  /** Whether to show the fallback in disabled state */
  showFallback?: boolean;
}

export interface FeatureFlagBadgeProps {
  /** Flag key to display status for */
  name: string;
  /** Visual variant */
  variant?: FlagVariant;
  /** Whether to show the full config name */
  showName?: boolean;
  className?: string;
}

// ─── Simple in-memory store for client-side overrides ─────────────────────────

function createFlagStore(initial: FeatureFlagConfig[]) {
  const store = new Map<string, FeatureFlagConfig>();
  initial.forEach((f) => store.set(f.key, { ...f }));

  return {
    get: (key: string) => store.get(key),
    set: (key: string, config: Partial<FeatureFlagConfig>) => {
      const existing = store.get(key);
      if (existing) {
        store.set(key, { ...existing, ...config });
      }
    },
    getAll: () => Array.from(store.values()),
    isEnabled: (
      key: string,
      context?: { tenantId?: string; userId?: string; currentTenantId?: string }
    ) => {
      const flag = store.get(key);
      if (!flag) return false;

      // Check if explicitly disabled
      if (!flag.enabled) return false;

      // Check tenant restrictions
      if (flag.tenantIds && flag.tenantIds.length > 0 && context?.currentTenantId) {
        if (!flag.tenantIds.includes(context.currentTenantId)) return false;
      }

      // Check rollout percentage
      if (
        flag.rolloutPercentage !== undefined &&
        flag.rolloutPercentage < 100 &&
        context?.userId
      ) {
        // Consistent hash-based rollout
        const hash = simpleHash(`${key}:${context.userId}`);
        if (hash > flag.rolloutPercentage) return false;
      }

      return true;
    },
  };
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash) % 100;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function FeatureFlagProvider({
  initialFlags = [],
  children,
  tenantId,
  userId,
}: FeatureFlagProviderProps) {
  const store = useMemo(() => createFlagStore(initialFlags), [initialFlags]);
  const [revision, setRevision] = useState(0);

  const isEnabled = useCallback(
    (key: string, context?: { tenantId?: string; userId?: string }) => {
      return store.isEnabled(key, {
        ...context,
        currentTenantId: tenantId,
        userId: context?.userId || userId,
      });
    },
    [store, tenantId, userId]
  );

  const setFlag = useCallback(
    (key: string, enabled: boolean) => {
      store.set(key, { enabled });
      setRevision((revision) => revision + 1);
    },
    [store]
  );

  const getFlag = useCallback(
    (key: string) => store.get(key),
    [store]
  );

  const getAllFlags = useCallback(() => store.getAll(), [store]);

  const contextValue = useMemo<FeatureFlagContextValue>(
    () => ({ flags: Object.fromEntries(store.getAll().map((flag) => [flag.key, flag])), isEnabled, setFlag, getFlag, getAllFlags }),
    [store, revision, isEnabled, setFlag, getFlag, getAllFlags]
  );

  return (
    <FeatureFlagContext.Provider value={contextValue}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

// ─── FeatureFlag Wrapper Component ────────────────────────────────────────────

/**
 * Wraps content that should only render when a feature flag is enabled.
 *
 * @example
 * <FeatureFlag name="new-onboarding-flow" fallback={<OldOnboardingFlow />}>
 *   <NewOnboardingFlow />
 * </FeatureFlag>
 */
export function FeatureFlag({
  name,
  fallback = null,
  children,
  showFallback = true,
}: FeatureFlagProps) {
  const { isEnabled } = useFeatureFlags();
  const enabled = isEnabled(name);

  if (enabled) return <>{children}</>;
  if (showFallback) return <>{fallback}</>;
  return null;
}

// ─── FeatureFlagBadge ─────────────────────────────────────────────────────────

/**
 * Displays the current status of a feature flag as a visual badge.
 */
export function FeatureFlagBadge({
  name,
  variant = "badge",
  showName = false,
  className,
}: FeatureFlagBadgeProps) {
  const { isEnabled, getFlag } = useFeatureFlags();
  const enabled = isEnabled(name);
  const flag = getFlag(name);

  if (variant === "minimal") {
    return (
      <span
        className={cn(
          "inline-block size-2 rounded-full",
          enabled ? "bg-green-500" : "bg-muted-foreground/30",
          className
        )}
        aria-label={`Flag ${name}: ${enabled ? "enabled" : "disabled"}`}
      />
    );
  }

  if (variant === "pill") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
          enabled
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : "bg-muted text-muted-foreground",
          className
        )}
      >
        <span
          className={cn(
            "size-1.5 rounded-full",
            enabled ? "bg-green-500" : "bg-muted-foreground/50"
          )}
        />
        {showName && (flag?.name || name)}
        {!showName && (enabled ? "On" : "Off")}
      </span>
    );
  }

  // Default badge variant
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
        enabled
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-muted text-muted-foreground",
        className
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          enabled ? "bg-green-500" : "bg-muted-foreground/50"
        )}
      />
      {showName ? (flag?.name || name) : name}
      {showName && (
        <span className="text-[10px] opacity-70">
          ({enabled ? "on" : "off"})
        </span>
      )}
    </span>
  );
}

// ─── FeatureFlagList ──────────────────────────────────────────────────────────

export interface FeatureFlagListProps {
  className?: string;
  /** Optional filter by search term */
  search?: string;
  /** Optional filter by enabled/disabled */
  filter?: "all" | "enabled" | "disabled";
  /** Called when a flag is toggled */
  onToggle?: (key: string, enabled: boolean) => void;
}

/**
 * Admin UI component for listing and managing feature flags.
 */
export function FeatureFlagList({
  className,
  search,
  filter = "all",
  onToggle,
}: FeatureFlagListProps) {
  const { getAllFlags, setFlag, isEnabled } = useFeatureFlags();
  const flags = getAllFlags();

  const filteredFlags = useMemo(() => {
    return flags.filter((flag) => {
      // Search filter
      if (search) {
        const q = search.toLowerCase();
        if (
          !flag.key.toLowerCase().includes(q) &&
          !flag.name.toLowerCase().includes(q) &&
          !flag.description?.toLowerCase().includes(q)
        ) {
          return false;
        }
      }

      // Enablement filter
      if (filter === "enabled" && !flag.enabled) return false;
      if (filter === "disabled" && flag.enabled) return false;

      return true;
    });
  }, [flags, search, filter]);

  if (filteredFlags.length === 0) {
    return (
      <div className={cn("flex flex-col items-center gap-2 py-12 text-center", className)}>
        <p className="text-sm text-muted-foreground">No feature flags found</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      {filteredFlags.map((flag) => (
        <div
          key={flag.key}
          className="flex items-center justify-between gap-4 rounded-md border px-4 py-3 transition-colors hover:bg-muted/50"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{flag.name}</span>
              <code className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                {flag.key}
              </code>
            </div>
            {flag.description && (
              <p className="text-xs text-muted-foreground/70 mt-0.5">
                {flag.description}
              </p>
            )}
            {flag.owner && (
              <p className="text-[10px] text-muted-foreground/50 mt-1">
                Owner: {flag.owner}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <FeatureFlagBadge name={flag.key} variant="pill" />
            <button
              onClick={() => {
                const next = !isEnabled(flag.key);
                setFlag(flag.key, next);
                onToggle?.(flag.key, next);
              }}
              className={cn(
                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50",
                isEnabled(flag.key) ? "bg-primary" : "bg-input"
              )}
              role="switch"
              aria-checked={isEnabled(flag.key)}
              aria-label={`Toggle ${flag.name}`}
            >
              <span
                className={cn(
                  "pointer-events-none block size-4 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200",
                  isEnabled(flag.key) ? "translate-x-4" : "translate-x-0"
                )}
              />
            </button>
          </div>
        </div>
      ))}
      {filteredFlags.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No flags match your search
        </p>
      )}
    </div>
  );
}

// ─── Default flags configuration ──────────────────────────────────────────────

export const DEFAULT_FEATURE_FLAGS: FeatureFlagConfig[] = [
  {
    key: "new-onboarding-flow",
    name: "New Onboarding Flow",
    description: "Enable the enhanced onboarding wizard with dynamic checklist",
    enabled: false,
    owner: "Platform Team",
  },
  {
    key: "ai-hr-assistant",
    name: "AI HR Assistant",
    description: "Enable AI-powered HR assistant across the platform",
    enabled: true,
    owner: "AI Team",
  },
  {
    key: "advanced-analytics",
    name: "Advanced Analytics",
    description: "Show advanced analytics and reporting features",
    enabled: false,
    owner: "Product Team",
  },
  {
    key: "dark-mode",
    name: "Dark Mode",
    description: "Enable dark mode theme toggle",
    enabled: true,
    owner: "Platform Team",
  },
  {
    key: "multi-language",
    name: "Multi-Language Support",
    description: "Enable i18n and locale switching",
    enabled: true,
    owner: "Platform Team",
  },
  {
    key: "new-dashboard",
    name: "New Dashboard Layout",
    description: "Use the redesigned executive dashboard",
    enabled: false,
    owner: "Product Team",
    rolloutPercentage: 25,
  },
  {
    key: "offboarding-workflow",
    name: "Offboarding Workflow",
    description: "Enable the new offboarding clearance workflow",
    enabled: false,
    owner: "HR Team",
  },
  {
    key: "plugin-registry",
    name: "Plugin Registry",
    description: "Enable the plugin/extensions marketplace",
    enabled: false,
    owner: "Platform Team",
  },
];
