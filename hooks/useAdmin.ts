import { trpc } from "@/lib/trpc";

export function useAdmin() {
  const utils = trpc.useUtils();

  const users = {
    getAll: trpc.admin.user.getAll.useQuery,
    getById: trpc.admin.user.getById.useQuery,
    create: trpc.admin.user.create.useMutation(),
    update: trpc.admin.user.update.useMutation(),
    delete: trpc.admin.user.delete.useMutation(),
  };

  const roles = {
    getAll: trpc.admin.role.getAll.useQuery,
    getById: trpc.admin.role.getById.useQuery,
    create: trpc.admin.role.create.useMutation(),
    update: trpc.admin.role.update.useMutation(),
    delete: trpc.admin.role.delete.useMutation(),
  };

  const permissions = {
    getAll: trpc.admin.permission.getAll.useQuery,
    toggle: trpc.admin.permission.toggle.useMutation(),
  };

  const auditLogs = {
    getAll: trpc.admin.audit.getAll.useQuery,
    getById: trpc.admin.audit.getById.useQuery,
  };

  const backups = {
    getAll: trpc.admin.backup.getAll.useQuery,
    create: trpc.admin.backup.create.useMutation(),
    restore: trpc.admin.backup.restore.useMutation(),
    delete: trpc.admin.backup.delete.useMutation(),
  };

  const integrations = {
    getAll: trpc.admin.integration.getAll.useQuery,
    create: trpc.admin.integration.create.useMutation(),
    update: trpc.admin.integration.update.useMutation(),
    delete: trpc.admin.integration.delete.useMutation(),
    sync: trpc.admin.integration.sync.useMutation(),
  };

  const systemStatus = {
    get: trpc.admin.system.getStatus.useQuery,
  };

  const invalidate = {
    users: () => utils.admin.user.getAll.invalidate(),
    roles: () => utils.admin.role.getAll.invalidate(),
    permissions: () => utils.admin.permission.getAll.invalidate(),
    auditLogs: () => utils.admin.audit.getAll.invalidate(),
    backups: () => utils.admin.backup.getAll.invalidate(),
    integrations: () => utils.admin.integration.getAll.invalidate(),
    systemStatus: () => utils.admin.system.getStatus.invalidate(),

    all: async () => {
      await Promise.all([
        utils.admin.user.getAll.invalidate(),
        utils.admin.role.getAll.invalidate(),
        utils.admin.permission.getAll.invalidate(),
        utils.admin.audit.getAll.invalidate(),
        utils.admin.backup.getAll.invalidate(),
        utils.admin.integration.getAll.invalidate(),
        utils.admin.system.getStatus.invalidate(),
      ]);
    },
  };

  const prefetch = {
    users: () => utils.admin.user.getAll.prefetch(),
    roles: () => utils.admin.role.getAll.prefetch(),
    permissions: () => utils.admin.permission.getAll.prefetch(),
    auditLogs: () => utils.admin.audit.getAll.prefetch(),
    backups: () => utils.admin.backup.getAll.prefetch(),
    integrations: () => utils.admin.integration.getAll.prefetch(),
    systemStatus: () => utils.admin.system.getStatus.prefetch(),
  };

  return {
    users,
    roles,
    permissions,
    auditLogs,
    backups,
    integrations,
    systemStatus,
    invalidate,
    prefetch,
    utils,
  };
}
