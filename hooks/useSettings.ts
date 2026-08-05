import { trpc } from "@/lib/trpc";

export function useSettings() {
  // No dedicated settings router yet — map to closest available procedures
  const general = {
    get: trpc.notificationCenter.getPreferences.useQuery,
    update: trpc.notificationCenter.setPreference.useMutation,
  };

  const email = {
    get: trpc.notificationCenter.listTemplates.useQuery,
    update: trpc.notificationCenter.upsertTemplate.useMutation,
  };

  const security = {
    get: trpc.security.getDashboard.useQuery,
    update: trpc.security.changePassword.useMutation,
  };

  const notification = {
    get: trpc.notificationCenter.getPreferences.useQuery,
    update: trpc.notificationCenter.setPreference.useMutation,
  };

  return { general, email, security, notification };
}
