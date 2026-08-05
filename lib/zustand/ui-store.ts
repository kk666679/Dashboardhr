/**
 * UI Client State — lightweight Zustand store for ephemeral UI state only.
 *
 * DO NOT store server data (employees, payroll, leave, etc.) in this store.
 * Server state belongs in TanStack Query cache, sourced from tRPC.
 *
 * @see /docs/ARCHITECTURE.md — State Management Architecture
 */

import { create } from "zustand";

// ─── Sidebar ─────────────────────────────────────────────────────────────────

interface SidebarState {
  isCollapsed: boolean;
  isMobile: boolean;
  toggle: () => void;
  setCollapsed: (collapsed: boolean) => void;
  setMobile: (mobile: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isCollapsed: false,
  isMobile: false,
  toggle: () => set((s) => ({ isCollapsed: !s.isCollapsed })),
  setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
  setMobile: (mobile) => set({ isMobile: mobile, isCollapsed: mobile }),
}));

// ─── Theme ────────────────────────────────────────────────────────────────────

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "dark",
  setTheme: (theme) => set({ theme }),
}));

// ─── Modals ───────────────────────────────────────────────────────────────────

interface ModalState {
  activeModal: string | null;
  modalData: Record<string, unknown> | null;
  openModal: (modal: string, data?: Record<string, unknown>) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  activeModal: null,
  modalData: null,
  openModal: (modal, data?: Record<string, unknown>) => set({ activeModal: modal, modalData: data ?? null }),
  closeModal: () => set({ activeModal: null, modalData: null }),
}));

// ─── Table Preferences ────────────────────────────────────────────────────────

interface TableColumn {
  id: string;
  visible: boolean;
  order: number;
}

interface TablePreferencesState {
  preferences: Record<string, { columns: TableColumn[]; pageSize: number }>;
  setColumnVisibility: (tableId: string, columnId: string, visible: boolean) => void;
  setColumnOrder: (tableId: string, columnId: string, order: number) => void;
  setPageSize: (tableId: string, pageSize: number) => void;
}

export const useTablePreferencesStore = create<TablePreferencesState>((set) => ({
  preferences: {},
  setColumnVisibility: (tableId, columnId, visible) =>
    set((s) => ({
      preferences: {
        ...s.preferences,
        [tableId]: {
          ...s.preferences[tableId],
          columns: (s.preferences[tableId]?.columns ?? []).map((c) =>
            c.id === columnId ? { ...c, visible } : c,
          ),
        },
      },
    })),
  setColumnOrder: (tableId, columnId, order) =>
    set((s) => ({
      preferences: {
        ...s.preferences,
        [tableId]: {
          ...s.preferences[tableId],
          columns: (s.preferences[tableId]?.columns ?? []).map((c) =>
            c.id === columnId ? { ...c, order } : c,
          ),
        },
      },
    })),
  setPageSize: (tableId, pageSize) =>
    set((s) => ({
      preferences: {
        ...s.preferences,
        [tableId]: { ...s.preferences[tableId], pageSize },
      },
    })),
}));

// ─── Notifications (UI-only: toast queue) ─────────────────────────────────────

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

interface NotificationUIState {
  toasts: Toast[];
  addToast: (toast: Toast) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useNotificationUIStore = create<NotificationUIState>((set) => ({
  toasts: [],
  addToast: (toast) => set((s) => ({ toasts: [...s.toasts, toast] })),
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  clearToasts: () => set({ toasts: [] }),
}));

