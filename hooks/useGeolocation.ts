"use client";

import { trpc } from "@/lib/trpc";
import { useCallback, useMemo } from "react";
import type {
  LocationData,
  LocationHistoryFilters,
  LocationHistoryResponse,
  LocationUpdateInput,
  Geofence,
  GeofenceCreateInput,
  GeofenceUpdateInput,
  GeofenceFilters,
  GeofenceAlert,
  AlertFilters,
  AlertListResponse,
  ActiveUser,
  LiveLocation,
  TrackingResponse,
} from "@/types/geolocation";

/**
 * Geolocation domain hooks — fully implemented with tRPC.
 *
 * Provides:
 * - Queries: current location, history, geofences, alerts, active users, live location
 * - Mutations: update location, CRUD geofences, acknowledge/resolve alerts
 * - Invalidations & prefetching for optimistic updates
 * - Real-time analytics stats
 */
export function useGeolocation() {
  const utils = trpc.useUtils();

  // ─── Queries ────────────────────────────────────────────────────────────

  /** Get latest location for a specific user */
  const useCurrentLocation = (employeeId?: string) =>
    trpc.geolocation.location.getCurrent.useQuery(
      { employeeId },
      { enabled: !!employeeId, refetchInterval: 30000 }
    );

  /** Get location history with filters */
  const useLocationHistory = (filters: LocationHistoryFilters) =>
    trpc.geolocation.location.getHistory.useQuery(
      {
        employeeId: filters.userId,
        startDate: filters.startDate instanceof Date
          ? filters.startDate.toISOString()
          : filters.startDate as string | undefined,
        endDate: filters.endDate instanceof Date
          ? filters.endDate.toISOString()
          : filters.endDate as string | undefined,
        limit: filters.limit ?? 100,
        offset: filters.offset ?? 0,
      },
      { enabled: !!filters.userId }
    );

  /** Get all geofences for the tenant */
  const useGeofences = (filters?: GeofenceFilters) =>
    trpc.geolocation.geofence.getAll.useQuery(
      { isActive: filters?.isActive },
      { refetchInterval: 60000 }
    );

  /** Get alerts with filters */
  const useAlerts = (filters?: AlertFilters) =>
    trpc.geolocation.alert.getAll.useQuery(
      {
        employeeId: filters?.userId,
        isResolved: filters?.status === "RESOLVED" ? true : filters?.status === "PENDING" ? false : undefined,
        severity: filters?.severity as any,
        type: filters?.type as any,
        limit: filters?.limit ?? 50,
        offset: filters?.offset ?? 0,
      },
      { refetchInterval: 15000 }
    );

  /** Get active users (location update in last 5 min) */
  const useActiveUsers = () =>
    trpc.geolocation.tracking.getActiveUsers.useQuery(
      undefined,
      { refetchInterval: 10000 }
    );

  /** Get live location for a specific user */
  const useLiveLocation = (employeeId: string) =>
    trpc.geolocation.tracking.getLiveLocation.useQuery(
      { employeeId },
      { enabled: !!employeeId, refetchInterval: 5000 }
    );

  /** Get dashboard analytics stats */
  const useAnalyticsStats = () =>
    trpc.geolocation.analytics.getStats.useQuery(
      undefined,
      { refetchInterval: 30000 }
    );

  /** Get location settings for current user */
  const useSettings = () =>
    trpc.geolocation.settings.getMy.useQuery();

  // ─── Mutations ──────────────────────────────────────────────────────────

  /** Update current user's location */
  const updateLocationMutation = trpc.geolocation.location.update.useMutation({
    onSuccess: () => {
      utils.geolocation.location.getCurrent.invalidate();
      utils.geolocation.analytics.getStats.invalidate();
    },
  });

  /** Create a new geofence */
  const createGeofenceMutation = trpc.geolocation.geofence.create.useMutation({
    onSuccess: () => {
      utils.geolocation.geofence.getAll.invalidate();
    },
  });

  /** Update a geofence */
  const updateGeofenceMutation = trpc.geolocation.geofence.update.useMutation({
    onSuccess: () => {
      utils.geolocation.geofence.getAll.invalidate();
    },
  });

  /** Delete a geofence */
  const deleteGeofenceMutation = trpc.geolocation.geofence.delete.useMutation({
    onSuccess: () => {
      utils.geolocation.geofence.getAll.invalidate();
    },
  });

  /** Toggle a geofence active/inactive */
  const toggleGeofenceMutation = trpc.geolocation.geofence.toggle.useMutation({
    onSuccess: () => {
      utils.geolocation.geofence.getAll.invalidate();
    },
  });

  /** Acknowledge an alert */
  const acknowledgeAlertMutation = trpc.geolocation.alert.acknowledge.useMutation({
    onSuccess: () => {
      utils.geolocation.alert.getAll.invalidate();
    },
  });

  /** Resolve an alert */
  const resolveAlertMutation = trpc.geolocation.alert.resolve.useMutation({
    onSuccess: () => {
      utils.geolocation.alert.getAll.invalidate();
    },
  });

  /** Trigger emergency alert */
  const triggerEmergencyMutation = trpc.geolocation.emergency.trigger.useMutation();

  /** Acknowledge emergency alert */
  const acknowledgeEmergencyMutation = trpc.geolocation.emergency.acknowledge.useMutation();

  /** Update location settings */
  const updateSettingsMutation = trpc.geolocation.settings.update.useMutation();

  // ─── Convenience Functions ──────────────────────────────────────────────

  const updateLocation = useCallback(
    async (input: LocationUpdateInput) => {
      return updateLocationMutation.mutateAsync({
        latitude: input.latitude,
        longitude: input.longitude,
        accuracy: input.accuracy,
        altitude: input.altitude,
        speed: input.speed,
        heading: input.heading,
        source: (input as any).source ?? "GPS",
        batteryLevel: (input as any).batteryLevel,
        isEmergency: input.isEmergency,
      });
    },
    [updateLocationMutation]
  );

  const createGeofence = useCallback(
    async (input: GeofenceCreateInput) => {
      return createGeofenceMutation.mutateAsync({
        name: input.name,
        type: input.type as any,
        coordinates: input.coordinates?.map((c) => [c.longitude, c.latitude] as [number, number]) ?? [],
        radius: input.radius,
        alertOnEntry: input.isRestricted ?? false,
        alertOnExit: !input.isRestricted,
      });
    },
    [createGeofenceMutation]
  );

  const updateGeofence = useCallback(
    async (input: GeofenceUpdateInput) => {
      return updateGeofenceMutation.mutateAsync({
        id: input.id,
        data: {
          name: input.name,
          type: input.type as any,
          coordinates: input.coordinates?.map((c) => [c.longitude, c.latitude] as [number, number]),
          radius: input.radius,
          isActive: input.isActive,
        },
      });
    },
    [updateGeofenceMutation]
  );

  const deleteGeofence = useCallback(
    async (id: string) => {
      await deleteGeofenceMutation.mutateAsync({ id });
    },
    [deleteGeofenceMutation]
  );

  const toggleGeofence = useCallback(
    async (id: string) => {
      await toggleGeofenceMutation.mutateAsync({ id });
    },
    [toggleGeofenceMutation]
  );

  const acknowledgeAlert = useCallback(
    async (alertId: string) => {
      return acknowledgeAlertMutation.mutateAsync({ id: alertId });
    },
    [acknowledgeAlertMutation]
  );

  const resolveAlert = useCallback(
    async (alertId: string, notes?: string) => {
      return resolveAlertMutation.mutateAsync({ id: alertId, notes });
    },
    [resolveAlertMutation]
  );

  // ─── Invalidations ──────────────────────────────────────────────────────

  const invalidate = useMemo(
    () => ({
      currentLocation: (_userId?: string) => {
        utils.geolocation.location.getCurrent.invalidate();
      },
      locationHistory: (_filters?: LocationHistoryFilters) => {
        utils.geolocation.location.getHistory.invalidate();
      },
      geofences: () => {
        utils.geolocation.geofence.getAll.invalidate();
      },
      alerts: (_filters?: AlertFilters) => {
        utils.geolocation.alert.getAll.invalidate();
      },
      activeUsers: () => {
        utils.geolocation.tracking.getActiveUsers.invalidate();
      },
      liveLocation: (_userId: string) => {
        utils.geolocation.tracking.getLiveLocation.invalidate();
      },
      all: async () => {
        await Promise.all([
          utils.geolocation.location.getCurrent.invalidate(),
          utils.geolocation.location.getHistory.invalidate(),
          utils.geolocation.geofence.getAll.invalidate(),
          utils.geolocation.alert.getAll.invalidate(),
          utils.geolocation.tracking.getActiveUsers.invalidate(),
          utils.geolocation.analytics.getStats.invalidate(),
        ]);
      },
    }),
    [utils]
  );

  // ─── Prefetching ────────────────────────────────────────────────────────

  const prefetch = useMemo(
    () => ({
      currentLocation: async (employeeId?: string) => {
        await utils.geolocation.location.getCurrent.prefetch({ employeeId });
      },
      locationHistory: async (filters?: LocationHistoryFilters) => {
        await utils.geolocation.location.getHistory.prefetch({
          employeeId: filters?.userId,
          startDate: filters?.startDate as string | undefined,
          endDate: filters?.endDate as string | undefined,
          limit: filters?.limit ?? 100,
          offset: filters?.offset ?? 0,
        });
      },
      geofences: async () => {
        await utils.geolocation.geofence.getAll.prefetch();
      },
      alerts: async (filters?: AlertFilters) => {
        await utils.geolocation.alert.getAll.prefetch({
          employeeId: filters?.userId,
          isResolved: filters?.status === "RESOLVED" ? true : undefined,
          severity: filters?.severity as any,
          type: filters?.type as any,
          limit: filters?.limit ?? 50,
          offset: filters?.offset ?? 0,
        });
      },
      activeUsers: async () => {
        await utils.geolocation.tracking.getActiveUsers.prefetch();
      },
      liveLocation: async (employeeId: string) => {
        await utils.geolocation.tracking.getLiveLocation.prefetch({ employeeId });
      },
    }),
    [utils]
  );

  // ─── Optimistic Update ──────────────────────────────────────────────────

  const updateLocationWithOptimistic = useCallback(
    async (input: LocationUpdateInput) => {
      // Get previous location data for potential rollback
      const previousData = utils.geolocation.location.getCurrent.getData();

      // Cancel outgoing queries
      await utils.geolocation.location.getCurrent.cancel();

      // Optimistically set the new data
      utils.geolocation.location.getCurrent.setData(
        { employeeId: input.userId },
        {
          id: "optimistic",
          employeeId: input.userId,
          userId: input.userId,
          latitude: input.latitude,
          longitude: input.longitude,
          accuracy: input.accuracy,
          altitude: input.altitude,
          speed: input.speed,
          heading: input.heading,
          source: (input as any).source ?? "GPS",
          timestamp: new Date().toISOString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      );

      // Send the mutation
      try {
        await updateLocation(input);
      } catch {
        // Rollback on error
        utils.geolocation.location.getCurrent.setData(
          { employeeId: input.userId },
          previousData ?? null
        );
      }

      return { previousLocation: previousData as any };
    },
    [utils, updateLocation]
  );

  // ─── Return ─────────────────────────────────────────────────────────────

  return {
    // Queries (React hooks)
    useCurrentLocation,
    useLocationHistory,
    useGeofences,
    useAlerts,
    useActiveUsers,
    useLiveLocation,
    useAnalyticsStats,
    useSettings,

    // Mutation hooks (raw access)
    updateLocationMutation,
    createGeofenceMutation,
    updateGeofenceMutation,
    deleteGeofenceMutation,
    toggleGeofenceMutation,
    acknowledgeAlertMutation,
    resolveAlertMutation,
    triggerEmergencyMutation,
    acknowledgeEmergencyMutation,
    updateSettingsMutation,

    // Convenience functions (wrap mutations)
    updateLocation,
    createGeofence,
    updateGeofence,
    deleteGeofence,
    toggleGeofence,
    acknowledgeAlert,
    resolveAlert,

    // Utilities
    invalidate,
    prefetch,
    updateLocationWithOptimistic,
    utils,
  };
}

export type {
  LocationData,
  LocationHistoryFilters,
  LocationHistoryResponse,
  LocationUpdateInput,
  Geofence,
  GeofenceCreateInput,
  GeofenceUpdateInput,
  GeofenceFilters,
  GeofenceAlert,
  AlertFilters,
  AlertListResponse,
  ActiveUser,
  LiveLocation,
  TrackingResponse,
};

