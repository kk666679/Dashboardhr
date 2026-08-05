/**
 * AHROS Artifact Registry — Central registry for managing artifact lifecycle.
 *
 * Handles:
 *  - CRUD operations for artifacts
 *  - Versioning and history tracking
 *  - Checksum validation
 *  - Synchronization status
 *  - Integration with event bus
 */

import { v4 as uuidv4 } from "uuid";
import type { ArtifactRecord, ArtifactMeta, ArtifactType } from "./types";
import { getEventBus } from "./event-bus";

export interface ArtifactRegistryOptions {
  maxVersions?: number;
  enableChecksum?: boolean;
  autoSync?: boolean;
}

/**
 * Manages artifact lifecycle — CRUD, versioning, sync.
 */
export class ArtifactRegistry {
  private artifacts: Map<string, ArtifactRecord> = new Map();
  private maxVersions: number;
  private enableChecksum: boolean;
  private autoSync: boolean;

  constructor(options: ArtifactRegistryOptions = {}) {
    this.maxVersions = options.maxVersions ?? 10;
    this.enableChecksum = options.enableChecksum ?? true;
    this.autoSync = options.autoSync ?? true;
  }

  /**
   * Create a new artifact.
   */
  create<T>(
    type: ArtifactType,
    title: string,
    data: T,
    options?: {
      description?: string;
      parentId?: string;
      tags?: string[];
      createdBy?: string;
    },
  ): ArtifactRecord<T> {
    const now = new Date();
    const meta: ArtifactMeta = {
      id: uuidv4(),
      type,
      title,
      description: options?.description,
      status: "pending",
      version: 1,
      parentId: options?.parentId,
      tags: options?.tags,
      createdAt: now,
      updatedAt: now,
      createdBy: options?.createdBy,
      syncStatus: "dirty",
    };

    const record: ArtifactRecord<T> = {
      meta: meta as unknown as ArtifactMeta,
      data,
      checksum: this.enableChecksum ? this.computeChecksum(data) : undefined,
    };

    this.artifacts.set(meta.id, record as unknown as ArtifactRecord);

    if (this.autoSync) {
      const bus = getEventBus();
      bus.publish({
        type: "ARTIFACT_CREATED",
        artifactId: meta.id,
        artifactType: type,
        payload: { meta: record.meta },
        source: "artifact-registry",
      });
    }

    return record;
  }

  /**
   * Update an existing artifact's data (creates a new version).
   */
  update<T>(
    id: string,
    newData: T,
    options?: {
      title?: string;
      description?: string;
      tags?: string[];
    },
  ): ArtifactRecord<T> | null {
    const existing = this.artifacts.get(id);
    if (!existing) return null;

    // Save previous version using spread copy
    const currentVersion = existing.meta.version;
    const prevVersions: { version: number; data: unknown; timestamp: Date }[] =
      existing.previousVersions
        ? [...existing.previousVersions]
        : [];

    prevVersions.push({
      version: currentVersion,
      data: existing.data,
      timestamp: existing.meta.updatedAt,
    });

    // Trim to max versions
    while (prevVersions.length > this.maxVersions) {
      prevVersions.shift();
    }

    const now = new Date();
    const newVersion = currentVersion + 1;

    const updatedMeta: ArtifactMeta = {
      ...existing.meta,
      title: options?.title ?? existing.meta.title,
      description: options?.description ?? existing.meta.description,
      tags: options?.tags ?? existing.meta.tags,
      version: newVersion,
      updatedAt: now,
      syncStatus: "dirty",
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedRecord: ArtifactRecord<T> = {
      meta: updatedMeta as unknown as ArtifactMeta,
      data: newData,
      previousVersions: prevVersions as unknown as {
        version: number;
        data: T;
        timestamp: Date;
      }[],
      checksum: this.enableChecksum ? this.computeChecksum(newData) : undefined,
    };

    this.artifacts.set(id, updatedRecord as unknown as ArtifactRecord);

    if (this.autoSync) {
      const bus = getEventBus();
      bus.publish({
        type: "ARTIFACT_UPDATED",
        artifactId: id,
        artifactType: existing.meta.type,
        payload: {
          version: newVersion,
          changes: {
            title: options?.title !== undefined,
            description: options?.description !== undefined,
            tags: options?.tags !== undefined,
            data: true,
          },
        },
        source: "artifact-registry",
      });
    }

    return updatedRecord;
  }

  /**
   * Get an artifact by ID.
   */
  get<T = unknown>(id: string): ArtifactRecord<T> | undefined {
    return this.artifacts.get(id) as unknown as ArtifactRecord<T> | undefined;
  }

  /**
   * Get all artifacts of a specific type.
   */
  getByType<T = unknown>(type: ArtifactType): ArtifactRecord<T>[] {
    return Array.from(this.artifacts.values()).filter(
      (a) => a.meta.type === type,
    ) as unknown as ArtifactRecord<T>[];
  }

  /**
   * Get all artifacts.
   */
  getAll<T = unknown>(): ArtifactRecord<T>[] {
    return Array.from(this.artifacts.values()) as unknown as ArtifactRecord<T>[];
  }

  /**
   * Get a specific version of an artifact.
   */
  getVersion<T = unknown>(
    id: string,
    version: number,
  ): { data: T; timestamp: Date } | null {
    const record = this.artifacts.get(id);
    if (!record) return null;

    // If it's the current version
    if (record.meta.version === version) {
      return { data: record.data as T, timestamp: record.meta.updatedAt };
    }

    // Search previous versions
    if (record.previousVersions) {
      const prev = record.previousVersions.find(
        (v) => v.version === version,
      );
      if (prev) return { data: prev.data as T, timestamp: prev.timestamp };
    }

    return null;
  }

  /**
   * Rollback an artifact to a previous version.
   */
  rollback<T = unknown>(
    id: string,
    version: number,
  ): ArtifactRecord<T> | null {
    const record = this.artifacts.get(id);
    if (!record) return null;

    const versionData = this.getVersion<T>(id, version);
    if (!versionData) return null;

    return this.update<T>(id, versionData.data, {
      title: `${record.meta.title} (rolled back to v${version})`,
    });
  }

  /**
   * Archive an artifact.
   */
  archive(id: string): boolean {
    const record = this.artifacts.get(id);
    if (!record) return false;

    record.meta.status = "archived";
    record.meta.updatedAt = new Date();
    record.meta.syncStatus = "dirty";

    if (this.autoSync) {
      const bus = getEventBus();
      bus.publish({
        type: "ARTIFACT_ARCHIVED",
        artifactId: id,
        artifactType: record.meta.type,
        source: "artifact-registry",
      });
    }

    return true;
  }

  /**
   * Mark artifact sync status.
   */
  markSyncStatus(
    id: string,
    status: ArtifactMeta["syncStatus"],
  ): boolean {
    const record = this.artifacts.get(id);
    if (!record) return false;

    record.meta.syncStatus = status;
    record.meta.updatedAt = new Date();

    if (this.autoSync && status === "synced") {
      const bus = getEventBus();
      bus.publish({
        type: "ARTIFACT_SYNC_COMPLETE",
        artifactId: id,
        artifactType: record.meta.type,
        source: "artifact-registry",
      });
    }

    return true;
  }

  /**
   * Delete an artifact from the registry.
   */
  delete(id: string): boolean {
    return this.artifacts.delete(id);
  }

  /**
   * Search artifacts by title, description, or tags.
   */
  search(query: string): ArtifactRecord[] {
    const lower = query.toLowerCase();
    return Array.from(this.artifacts.values()).filter(
      (a) =>
        a.meta.title.toLowerCase().includes(lower) ||
        a.meta.description?.toLowerCase().includes(lower) ||
        a.meta.tags?.some((t) => t.toLowerCase().includes(lower)),
    );
  }

  /**
   * Get the total count of artifacts.
   */
  get count(): number {
    return this.artifacts.size;
  }

  /**
   * Compute a simple checksum for data integrity.
   */
  private computeChecksum(data: unknown): string {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, "0");
  }
}

// Singleton
let globalRegistry: ArtifactRegistry | null = null;

/**
 * Get or create the global Artifact Registry instance.
 */
export function getArtifactRegistry(
  options?: ArtifactRegistryOptions,
): ArtifactRegistry {
  if (!globalRegistry) {
    globalRegistry = new ArtifactRegistry(options);
  }
  return globalRegistry;
}

/**
 * Reset the global registry (useful for testing).
 */
export function resetArtifactRegistry(): void {
  globalRegistry = null;
}
