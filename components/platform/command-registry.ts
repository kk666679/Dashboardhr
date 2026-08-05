"use client";

import type { ComponentType } from "react";
import { useEffect, useSyncExternalStore } from "react";

export type CommandCategory =
  | "Pages"
  | "Actions"
  | "People"
  | "Settings"
  | "AI"
  | "Navigation"
  | "Recently Viewed"
  | "Dashboards"
  | "Reports";

export interface RegisteredCommandItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: ComponentType<{ className?: string }>;
  keywords?: string[];
  category: CommandCategory;
  shortcut?: string;
  action: () => void;
}

export interface RegisteredCommandGroup {
  id: string;
  category: CommandCategory;
  items: RegisteredCommandItem[];
}

type Listener = () => void;

const groups = new Map<string, RegisteredCommandGroup>();
const listeners = new Set<Listener>();
const emptyGroups: RegisteredCommandGroup[] = [];
let groupsSnapshot: RegisteredCommandGroup[] = emptyGroups;

function emit() {
  groupsSnapshot = Array.from(groups.values());
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function snapshot() {
  return groupsSnapshot;
}

/** Registers a domain command group and returns an unregister callback. */
export function registerCommandGroup(group: RegisteredCommandGroup) {
  groups.set(group.id, group);
  emit();
  return () => {
    if (groups.delete(group.id)) emit();
  };
}

/**
 * Registers commands for a mounted domain. Command ids must be globally unique;
 * a later registration with the same group id replaces the earlier one.
 */
export function useCommandGroup(group?: RegisteredCommandGroup) {
  useEffect(() => {
    if (!group) return;
    return registerCommandGroup(group);
  }, [group]);
}

export function useRegisteredCommandGroups() {
  return useSyncExternalStore(subscribe, snapshot, () => emptyGroups);
}
