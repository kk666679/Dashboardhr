import { trpc } from "@/lib/trpc";

export function useNotification() {
  const notifications = {
    getAll: trpc.notifications.list.useQuery,
    getUnread: trpc.notifications.list.useQuery,
    markAsRead: trpc.notifications.markRead.useMutation,
    markAllAsRead: trpc.notifications.markAllRead.useMutation,
    delete: trpc.notifications.markAllRead.useMutation,
  };

  const preferences = {
    get: trpc.notificationCenter.getPreferences.useQuery,
    update: trpc.notificationCenter.setPreference.useMutation,
  };

  return { notifications, preferences };
}
