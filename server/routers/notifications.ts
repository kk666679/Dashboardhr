import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  notifyExpiryAlerts,
} from "@/components/features/notifications/notification-service";

export const notificationsRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        unreadOnly: z.boolean().default(false),
        limit: z.number().int().min(1).max(100).default(20),
      }),
    )
    .query(({ ctx, input }) =>
      getNotifications(ctx.userId, {
        unreadOnly: input.unreadOnly,
        limit: input.limit,
      }),
    ),

  markRead: protectedProcedure
    .input(z.object({ notificationId: z.string() }))
    .mutation(({ input }) => markAsRead(input.notificationId)),

  markAllRead: protectedProcedure.mutation(({ ctx }) =>
    markAllAsRead(ctx.userId),
  ),

  notifyExpiry: protectedProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            recipientId: z.string(),
            itemType: z.string(),
            itemName: z.string(),
            daysUntilExpiry: z.number().int(),
          }),
        ),
      }),
    )
    .mutation(({ ctx, input }) =>
      notifyExpiryAlerts(ctx.tenantId, input.items),
    ),
});
