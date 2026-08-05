"use client";

import { trpc } from "@/lib/trpc";
import { useMemo } from "react";

/**
 * Learning & Development data access hook.
 * Server router key: `learning`
 * Sub‑routers: course, learningPath, assessment, certification
 *
 * @see server/routers/learningDev.ts
 */
export function useLearningDev() {
  const utils = trpc.useUtils();

  // ─── Courses ─────────────────────────────────────────────────────────────
  const coursesList = trpc.learning.course.getAll.useQuery(undefined, {
    staleTime: 60_000,
  });
  const courseGet = (id: string) =>
    trpc.learning.course.getById.useQuery({ id }, {
      staleTime: 60_000,
      enabled: !!id,
    });
  const courseSave = trpc.learning.course.save.useMutation({
    onSuccess: () => utils.learning.course.getAll.invalidate(),
  });

  // ─── Learning Paths ──────────────────────────────────────────────────────
  const pathsList = trpc.learning.learningPath.getAll.useQuery(undefined, {
    staleTime: 60_000,
  });
  const pathGet = (id: string) =>
    trpc.learning.learningPath.getById.useQuery({ id }, {
      staleTime: 60_000,
      enabled: !!id,
    });
  const pathSave = trpc.learning.learningPath.save.useMutation({
    onSuccess: () => utils.learning.learningPath.getAll.invalidate(),
  });

  // ─── Assessments ──────────────────────────────────────────────────────────
  const assessmentsList = trpc.learning.assessment.getAll.useQuery(undefined, {
    staleTime: 60_000,
  });
  const assessmentGet = (id: string) =>
    trpc.learning.assessment.getById.useQuery({ id }, {
      staleTime: 60_000,
      enabled: !!id,
    });
  const assessmentSave = trpc.learning.assessment.save.useMutation({
    onSuccess: () => utils.learning.assessment.getAll.invalidate(),
  });

  // ─── Certifications ──────────────────────────────────────────────────────
  const certsList = trpc.learning.certification.getAll.useQuery(undefined, {
    staleTime: 60_000,
  });
  const certGet = (id: string) =>
    trpc.learning.certification.getById.useQuery({ id }, {
      staleTime: 60_000,
      enabled: !!id,
    });
  const certSave = trpc.learning.certification.save.useMutation({
    onSuccess: () => utils.learning.certification.getAll.invalidate(),
  });

  return useMemo(() => ({
    courses: {
      list: coursesList,
      get: courseGet,
      save: courseSave,
    },
    learningPaths: {
      list: pathsList,
      get: pathGet,
      save: pathSave,
    },
    assessments: {
      list: assessmentsList,
      get: assessmentGet,
      save: assessmentSave,
    },
    certifications: {
      list: certsList,
      get: certGet,
      save: certSave,
    },
    utils,
  }), [
    coursesList.data, coursesList.isLoading, courseSave.isPending,
    pathsList.data, pathsList.isLoading, pathSave.isPending,
    assessmentsList.data, assessmentsList.isLoading, assessmentSave.isPending,
    certsList.data, certsList.isLoading, certSave.isPending,
    utils,
  ]);
}