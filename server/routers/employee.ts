import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import {
  getEmployeesByTenant,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "@/components/features/employee/employee-service";
import { CreateEmployeeSchema, EmployeeFiltersSchema } from "@/lib/schemas";

export const employeeRouter = router({
  list: protectedProcedure
    .input(EmployeeFiltersSchema.optional())
    .query(({ ctx, input }) => getEmployeesByTenant(ctx.tenantId, input)),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => getEmployeeById(input.id, ctx.tenantId)),

  // ESS Profile (compat with UI)
  getProfile: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const employee = await getEmployeeById(input.id, ctx.tenantId);
      if (!employee) return null;

      return {
        id: employee.id,
        name: (employee as any).name ?? "",
        email: (employee as any).email ?? "",
        phone: (employee as any).phone ?? null,
        dateOfBirth: (employee as any).dateOfBirth ?? null,
        nationality: (employee as any).nationality ?? "",
        position: (employee as any).position ?? "",
        department: (employee as any).department ?? "",
        hireDate: (employee as any).hireDate ?? new Date().toISOString(),
        address: (employee as any).address ?? null,
        profilePhoto: null,
        employeeCode: (employee as any).employeeCode ?? null,
        employmentStatus: "ACTIVE",
        lastUpdated: new Date().toISOString(),
      };
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        data: z
          .record(z.any())
          .optional()
          .default({}),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // For now we persist into the existing employee model.
      // updateEmployee signature expects (id, tenantId, data)
      await updateEmployee(input.id, ctx.tenantId, input.data as any);
      return { success: true };
    }),



  create: protectedProcedure
    .input(CreateEmployeeSchema)
    .mutation(({ ctx, input }) => createEmployee(ctx.tenantId, input)),

  update: protectedProcedure
    .input(z.object({ id: z.string(), data: CreateEmployeeSchema.partial() }))
    .mutation(({ ctx, input }) =>
      updateEmployee(input.id, ctx.tenantId, input.data),
    ),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => deleteEmployee(input.id, ctx.tenantId)),
});

