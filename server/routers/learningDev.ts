/**
 * Learning & Development tRPC Router
 * Courses, learning paths, assessments, certifications.
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { guardedProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";

const courseRouter = router({
  getAll: guardedProcedure
    .input(z.object({ status: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return (prisma as any).course.findMany({
        where: { tenantId: ctx.tenantId, ...(input?.status ? { status: input.status } : {}) },
        orderBy: { title: "asc" },
      });
    }),
  getById: guardedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const r = await (prisma as any).course.findFirst({ where: { id: input.id, tenantId: ctx.tenantId } });
      if (!r) throw new TRPCError({ code: "NOT_FOUND" });
      return r;
    }),
  save: guardedProcedure
    .input(z.object({
      id:              z.string().optional(),
      title:           z.string().min(1),
      description:     z.string().optional(),
      category:        z.string().min(1),
      duration:        z.string().min(1),
      status:          z.string().default("Draft"),
      instructor:      z.string().optional(),
      maxParticipants: z.number().int().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      if (id) {
        await (prisma as any).course.updateMany({ where: { id, tenantId: ctx.tenantId }, data });
        return (prisma as any).course.findFirst({ where: { id, tenantId: ctx.tenantId } });
      }
      return (prisma as any).course.create({ data: { tenantId: ctx.tenantId, ...data } });
    }),
});

const learningPathRouter = router({
  getAll: guardedProcedure.query(async ({ ctx }) => {
    return (prisma as any).learningPath.findMany({ where: { tenantId: ctx.tenantId } });
  }),
  getById: guardedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return (prisma as any).learningPath.findFirst({ where: { id: input.id, tenantId: ctx.tenantId } });
    }),
  save: guardedProcedure
    .input(z.object({
      id:          z.string().optional(),
      name:        z.string().min(1),
      description: z.string().optional(),
      courseIds:   z.array(z.string()).default([]),
      targetRole:  z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, courseIds, ...data } = input;
      if (id) {
        await (prisma as any).learningPath.updateMany({ where: { id, tenantId: ctx.tenantId }, data: { ...data, courseIds: JSON.stringify(courseIds) } });
        return (prisma as any).learningPath.findFirst({ where: { id, tenantId: ctx.tenantId } });
      }
      return (prisma as any).learningPath.create({ data: { tenantId: ctx.tenantId, ...data, courseIds: JSON.stringify(courseIds) } });
    }),
});

const assessmentRouter = router({
  getAll: guardedProcedure.query(async ({ ctx }) => {
    return (prisma as any).assessment.findMany({ where: { tenantId: ctx.tenantId } });
  }),
  getById: guardedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return (prisma as any).assessment.findFirst({ where: { id: input.id, tenantId: ctx.tenantId } });
    }),
  save: guardedProcedure
    .input(z.object({
      id:          z.string().optional(),
      title:       z.string().min(1),
      courseId:    z.string().optional(),
      type:        z.string().default("QUIZ"),
      description: z.string().optional(),
      passMark:    z.number().min(0).max(100).default(60),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      if (id) {
        await (prisma as any).assessment.updateMany({ where: { id, tenantId: ctx.tenantId }, data });
        return (prisma as any).assessment.findFirst({ where: { id, tenantId: ctx.tenantId } });
      }
      return (prisma as any).assessment.create({ data: { tenantId: ctx.tenantId, ...data } });
    }),
});

const certificationRouter = router({
  getAll: guardedProcedure.query(async ({ ctx }) => {
    return (prisma as any).certification.findMany({ where: { tenantId: ctx.tenantId } });
  }),
  getById: guardedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return (prisma as any).certification.findFirst({ where: { id: input.id, tenantId: ctx.tenantId } });
    }),
  save: guardedProcedure
    .input(z.object({
      id:          z.string().optional(),
      name:        z.string().min(1),
      issuingBody: z.string().optional(),
      validityYears: z.number().int().min(0).optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      if (id) {
        await (prisma as any).certification.updateMany({ where: { id, tenantId: ctx.tenantId }, data });
        return (prisma as any).certification.findFirst({ where: { id, tenantId: ctx.tenantId } });
      }
      return (prisma as any).certification.create({ data: { tenantId: ctx.tenantId, ...data } });
    }),
});

// Namespace the sub-routers under trpc.learning.*
export const learningRouter = router({
  course:        courseRouter,
  learningPath:  learningPathRouter,
  assessment:    assessmentRouter,
  certification: certificationRouter,
});
