import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import {
  requestLeave,
  getLeaveBalance,
  getLeaveRequests,
  approveLeaveRequest,
  cancelLeaveRequest,
} from "@/components/features/employee/ess/ess-service";

const LeaveTypeSchema = z.enum([
  "ANNUAL",
  "SICK",
  "PERSONAL",
  "EMERGENCY",
  "UNPAID",
  "MEDICAL",
  "HOSPITALIZATION",
  "COMPASSIONATE",
  "MARRIAGE",
  "MATERNITY",
  "PATERNITY",
  "REPLACEMENT",
]);

export const leaveRouter = router({
  balance: protectedProcedure
    .input(z.object({ employeeId: z.string(), year: z.number().int().optional() }))
    .query(({ input }) => getLeaveBalance(input.employeeId, input.year)),

  list: protectedProcedure
    .input(
      z.object({
        employeeId: z.string(),
        status: z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED"]).optional(),
        limit: z.number().int().min(1).max(100).optional(),
      })
    )
    .query(({ input }) =>
      getLeaveRequests(input.employeeId, input.status as any, input.limit)
    ),

  // Legacy alias used by some pages
  request: protectedProcedure
    .input(
      z.object({
        employeeId: z.string(),
        leaveType: LeaveTypeSchema,
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
        reason: z.string().min(1),
      })
    )
    .mutation(({ ctx, input }) =>
      requestLeave({ ...input, tenantId: ctx.tenantId })
    ),

  submitApplication: protectedProcedure
    .input(
      z.object({
        employeeId: z.string(),
        leaveType: LeaveTypeSchema,
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
        reason: z.string().optional(),
        overlapConfirmed: z.boolean().optional(),
      })
    )
    .mutation(({ ctx, input }) =>
      requestLeave({ ...input, tenantId: ctx.tenantId })
    ),

  cancelApplication: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) =>
      cancelLeaveRequest(input.id, ctx.userId)
    ),

  approve: protectedProcedure
    .input(z.object({ leaveId: z.string() }))
    .mutation(({ ctx, input }) =>
      approveLeaveRequest(input.leaveId, ctx.userId)
    ),
});
