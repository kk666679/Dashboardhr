// components/features/ess/ess-service.ts

import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";
import { getRequiredServerEnv } from "@/config/server-env";

// ============================================================================
// TYPES
// ============================================================================

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: "ANNUAL" | "SICK" | "PERSONAL" | "EMERGENCY" | "UNPAID";
  startDate: Date;
  endDate: Date;
  numberOfDays: number;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
}

export interface LeaveBalance {
  employeeId: string;
  leaveType: string;
  totalAllowed: number;
  used: number;
  pending: number;
  available: number;
  year: number;
}

export interface DocumentUpload {
  id: string;
  employeeId: string;
  documentType: string;
  fileName: string;
  fileSize: number;
  uploadedAt: Date;
  expiryDate?: Date;
  status: "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED";
  reviewedBy?: string;
  reviewedAt?: Date;
}

export interface EmployeeProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  nationality: string;
  position: string;
  department: string;
  hireDate: Date;
  address?: string;
  profilePhoto?: string;
  lastUpdated: Date;
}

export interface ESNotification {
  id: string;
  employeeId: string;
  type: "LEAVE_REQUEST" | "DOCUMENT_REVIEW" | "PAYSLIP" | "ALERT" | "INFO";
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Date;
}

// ============================================================================
// LEAVE MANAGEMENT
// ============================================================================

/**
 * Submit a new leave request.
 * @returns The created LeaveRequest object (mock for now).
 */
export async function requestLeave(data: {
  employeeId: string;
  tenantId: string;
  leaveType: "ANNUAL" | "SICK" | "PERSONAL" | "EMERGENCY" | "UNPAID";
  startDate: Date;
  endDate: Date;
  reason: string;
}): Promise<LeaveRequest> {
  const numberOfDays =
    Math.ceil(
      (data.endDate.getTime() - data.startDate.getTime()) /
        (1000 * 60 * 60 * 24),
    ) + 1;

  return {
    id: `leave_${Date.now()}`,
    employeeId: data.employeeId,
    leaveType: data.leaveType,
    startDate: data.startDate,
    endDate: data.endDate,
    numberOfDays,
    reason: data.reason,
    status: "PENDING",
    createdAt: new Date(),
  };
}

export async function getLeaveBalance(
  employeeId: string,
  year: number = new Date().getFullYear(),
): Promise<LeaveBalance[]> {
  const leaveTypes = ["ANNUAL", "SICK", "PERSONAL"];

  return leaveTypes
    .map((leaveType) => ({
      employeeId,
      leaveType,
      totalAllowed: leaveType === "ANNUAL" ? 20 : leaveType === "SICK" ? 10 : 3,
      used: Math.floor(Math.random() * 5),
      pending: Math.floor(Math.random() * 2),
      available: 0,
      year,
    }))
    .map((lb) => ({
      ...lb,
      available: lb.totalAllowed - lb.used - lb.pending,
    }));
}

export async function getLeaveRequests(
  employeeId: string,
  status?: "PENDING" | "APPROVED" | "REJECTED",
): Promise<LeaveRequest[]> {
  // TODO: Connect to database
  return [];
}

export async function approveLeaveRequest(
  leaveId: string,
  approvedBy: string,
): Promise<LeaveRequest | null> {
  // TODO: Update database
  return {
    id: leaveId,
    employeeId: "",
    leaveType: "ANNUAL",
    startDate: new Date(),
    endDate: new Date(),
    numberOfDays: 5,
    reason: "",
    status: "APPROVED",
    approvedBy,
    approvedAt: new Date(),
    createdAt: new Date(),
  };
}

// ============================================================================
// DOCUMENT UPLOAD & MANAGEMENT
// ============================================================================

/**
 * Upload a document for an employee.
 * Stores the file in Vercel Blob and persists metadata to the `documents` table.
 */
export async function uploadDocument(data: {
  employeeId: string;
  tenantId: string;
  documentType: string;
  file: File;
  expiryDate?: Date;
}): Promise<DocumentUpload> {
  const allowedTypes = [
    "PASSPORT",
    "VISA",
    "CONTRACT",
    "PERMIT",
    "CERTIFICATE",
  ] as const;

  const normalizedType = data.documentType.toUpperCase();

  const documentType: (typeof allowedTypes)[number] = allowedTypes.includes(
    normalizedType as (typeof allowedTypes)[number],
  )
    ? (normalizedType as (typeof allowedTypes)[number])
    : "CERTIFICATE";

  // Store the file in Vercel Blob (private access; served via /api/blob with auth).
  let fileUrl = "";
  try {
    const blob = await put(
      `documents/${data.tenantId}/${data.employeeId}/${Date.now()}-${data.file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`,
      data.file,
      {
        access: "private",
        token: getRequiredServerEnv("BLOB_READ_WRITE_TOKEN"),
      },
    );
    fileUrl = blob.url;
  } catch (error) {
    // If blob storage is unavailable (e.g., local dev without token), fall back
    // to a relative path so the record still persists.
    console.warn("[ess-service] Blob upload failed, falling back:", error);
    fileUrl = `/api/blob?pathname=documents/${data.tenantId}/${data.employeeId}/${encodeURIComponent(data.file.name)}`;
  }

  const doc = await prisma.document.create({
    data: {
      employeeId: data.employeeId,
      tenantId: data.tenantId,
      type: documentType as any,
      fileUrl,
      expiryDate: data.expiryDate ?? null,
      status: "PENDING",
      contentText: data.file.name,
      tags: [],
    },
  });

  return {
    id: doc.id,
    employeeId: doc.employeeId,
    documentType: doc.type as string,
    fileName: data.file.name,
    fileSize: data.file.size,
    uploadedAt: doc.createdAt,
    expiryDate: doc.expiryDate ?? undefined,
    status: (doc.status as DocumentUpload["status"]) ?? "PENDING",
    reviewedBy: doc.reviewedBy ?? undefined,
    reviewedAt: doc.reviewedAt ?? undefined,
  };
}

export async function getUploadedDocuments(
  employeeId: string,
): Promise<DocumentUpload[]> {
  const docs = await prisma.document.findMany({
    where: { employeeId },
    orderBy: { createdAt: "desc" },
  });

  return docs.map((doc: any) => ({
    id: doc.id,
    employeeId: doc.employeeId,
    documentType: doc.type as string,
    fileName: doc.contentText ?? doc.fileUrl.split("/").pop() ?? "document",
    fileSize: 0,
    uploadedAt: doc.createdAt,
    expiryDate: doc.expiryDate ?? undefined,
    status: (doc.status as DocumentUpload["status"]) ?? "PENDING",
    reviewedBy: doc.reviewedBy ?? undefined,
    reviewedAt: doc.reviewedAt ?? undefined,
  }));
}

export async function downloadPayslip(
  payrollId: string,
): Promise<{ url: string; fileName: string }> {
  return {
    url: `/api/payslips/${payrollId}/download`,
    fileName: `payslip_${payrollId}.pdf`,
  };
}

// ============================================================================
// PROFILE MANAGEMENT
// ============================================================================

export async function getEmployeeProfile(
  employeeId: string,
): Promise<EmployeeProfile | null> {
  // TODO: Fetch from database
  return null;
}

export async function updateEmployeeProfile(
  employeeId: string,
  data: Partial<EmployeeProfile>,
): Promise<EmployeeProfile | null> {
  // TODO: Update database
  return null;
}

export async function uploadProfilePhoto(
  employeeId: string,
  file: File,
): Promise<{ url: string; fileName: string }> {
  return {
    url: `/api/profiles/${employeeId}/photo`,
    fileName: file.name,
  };
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export async function getEmployeeNotifications(
  employeeId: string,
  limit: number = 20,
): Promise<ESNotification[]> {
  // TODO: Fetch from database
  return [];
}

export async function markNotificationAsRead(
  notificationId: string,
): Promise<void> {
  // TODO: Update database
}

export async function markAllNotificationsAsRead(
  employeeId: string,
): Promise<void> {
  // TODO: Update database
}

// ============================================================================
// DEFAULT EXPORT (for convenience)
// ============================================================================

const ESService = {
  requestLeave,
  getLeaveBalance,
  getLeaveRequests,
  approveLeaveRequest,
  uploadDocument,
  getUploadedDocuments,
  downloadPayslip,
  getEmployeeProfile,
  updateEmployeeProfile,
  uploadProfilePhoto,
  getEmployeeNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};

export default ESService;