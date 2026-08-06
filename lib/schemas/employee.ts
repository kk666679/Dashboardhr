/**
 * lib/schemas/employee.ts
 * Employee, worker, FWMS core, permits, medical, accommodation, levy schemas.
 */
import { z } from "zod";
import { PayrollAllowanceSchema, PayrollDeductionSchema } from "./payroll";

// ── Personal / Employment ─────────────────────────────────────────────────────

export const PersonalInfoSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  nationality: z.string().optional(),
  country: z.string().optional(),
});

export const EmploymentInfoSchema = z.object({
  position: z.string().optional(),
  department: z.string().optional(),
  hireDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  isForeign: z.boolean().default(false),
});

export const CreateEmployeeSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  nationality: z.string().optional(),
  country: z.string().optional(),
  position: z.string().optional(),
  department: z.string().optional(),
  hireDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  isForeign: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

export const EmployeeFiltersSchema = z.object({
  department: z.string().optional(),
  isForeign: z.boolean().optional(),
  position: z.string().optional(),
});

export const EmployeeRowSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  position: z.string().optional(),
  department: z.string().optional(),
  isForeign: z.boolean(),
  hireDate: z.string().optional(),
  createdAt: z.string(),
});

export const WorkerSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  nationality: z.string().optional(),
  country: z.string().optional(),
  isForeign: z.boolean(),
  position: z.string().optional(),
  department: z.string().optional(),
  hireDate: z.string().optional(),
  tags: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const WorkerCreateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  nationality: z.string().optional(),
  country: z.string().optional(),
  position: z.string().optional(),
  department: z.string().optional(),
  hireDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  isForeign: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

export const WorkerStatusSchema = z.enum(["ACTIVE", "INACTIVE", "TERMINATED"]);

// ── Permits & Medical ─────────────────────────────────────────────────────────

export const PermitSchema = z.object({
  id: z.string(),
  workerId: z.string(),
  type: z.string(),
  number: z.string(),
  issueDate: z.string(),
  expiryDate: z.string(),
  status: z.string(),
});

export const PermitTypeSchema = z.enum(["PLKS", "MMP", "EP", "DP", "VP", "PVP"]);
export const PermitStatusSchema = z.enum(["ACTIVE", "EXPIRED", "PENDING", "REJECTED"]);

export const MedicalRecordSchema = z.object({
  id: z.string(),
  workerId: z.string(),
  examinationDate: z.string(),
  doctorName: z.string(),
  hospitalName: z.string(),
  result: z.enum(["PASS", "FAIL", "PENDING"]),
  notes: z.string().optional(),
});

export const ComplianceAlertSchema = z.object({
  id: z.string(),
  workerId: z.string(),
  type: z.enum(["VISA_EXPIRING", "MEDICAL_DUE", "PERMIT_RENEWAL"]),
  message: z.string(),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  dueDate: z.string(),
  resolved: z.boolean().default(false),
});

// ── Termination ───────────────────────────────────────────────────────────────

export const TerminationCreateSchema = z.object({
  employeeId: z.string(),
  terminationType: z.enum([
    "RESIGNATION",
    "VOLUNTARY",
    "REDUNDANCY",
    "DISCIPLINARY",
    "RETIREMENT",
    "CONTRACT_END",
  ]),
  lastWorkingDay: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string(),
  noticePeriodServed: z.boolean().default(false),
  finalSalaryAmount: z.number().default(0),
  pendingLeave: z.number().optional(),
  otherPayments: z.number().optional(),
  exitInterviewNotes: z.string().optional(),
  handoverStatus: z
    .enum(["COMPLETE", "IN_PROGRESS", "PENDING"])
    .default("PENDING"),
});

export const TerminationFiltersSchema = z.object({
  status: z.string().optional(),
});

export type TerminationCreate = z.infer<typeof TerminationCreateSchema>;
export type TerminationFilters = z.infer<typeof TerminationFiltersSchema>;

// ── Payroll (employee perspective) ────────────────────────────────────────────

export { CreatePayrollSchema } from "./payroll";

// ── Emergency Contact & Documents ─────────────────────────────────────────────

export const EmergencyContactSchema = z.object({
  name: z.string(),
  relationship: z.string(),
  phoneNumber: z.string(),
  address: z.string(),
});

export const WorkerDocumentSchema = z.object({
  id: z.string(),
  type: z.union([
    z.literal("passport"),
    z.literal("work_permit"),
    z.literal("visa"),
    z.literal("employment_contract"),
    z.literal("medical_certificate"),
    z.literal("insurance_policy"),
    z.literal("training_certificate"),
    z.literal("police_clearance"),
    z.literal("educational_certificate"),
    z.literal("other"),
  ]),
  documentNumber: z.string(),
  issueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  expiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  issuingAuthority: z.string(),
  filePath: z.string(),
  status: z.enum(["valid", "expired", "expiring_soon", "pending_renewal"]),
  verificationStatus: z.enum(["verified", "pending", "rejected"]),
  notes: z.string().optional(),
  uploadedAt: z.string(),
  verifiedBy: z.string().optional(),
  verifiedAt: z.string().optional(),
});

export const BiometricDataSchema = z.object({
  fingerprintHash: z.string().optional(),
  faceRecognitionHash: z.string().optional(),
  enrollmentDate: z.string(),
  lastVerificationDate: z.string().optional(),
  verificationCount: z.number().int().nonnegative(),
});

export const PerformanceCategorySchema = z.object({
  name: z.string(),
  rating: z.number().min(0).max(5),
  weight: z.number().positive(),
  comments: z.string().optional(),
});

export const PerformanceRecordSchema = z.object({
  id: z.string(),
  evaluationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  evaluatorId: z.string(),
  evaluatorName: z.string(),
  period: z.string(),
  overallRating: z.number().min(0).max(5),
  categories: z.array(PerformanceCategorySchema),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  goals: z.array(z.string()),
  comments: z.string(),
  status: z.enum(["draft", "completed", "acknowledged"]),
  workerAcknowledgment: z.string().optional(),
  acknowledgedAt: z.string().optional(),
  createdAt: z.string(),
});

export const AttendanceRecordSchema = z.object({
  id: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  breakStart: z.string().optional(),
  breakEnd: z.string().optional(),
  totalHours: z.number().nonnegative(),
  overtimeHours: z.number().nonnegative(),
  status: z.enum([
    "present",
    "absent",
    "late",
    "half_day",
    "sick_leave",
    "annual_leave",
  ]),
  location: z.string().optional(),
  notes: z.string().optional(),
  approvedBy: z.string().optional(),
  createdAt: z.string(),
});

// ── Accommodation ─────────────────────────────────────────────────────────────

export const InspectionFindingSchema = z.object({
  category: z.string(),
  description: z.string(),
  severity: z.enum(["low", "medium", "high", "critical"]),
  status: z.enum(["open", "resolved", "in_progress"]),
  resolvedDate: z.string().optional(),
  photos: z.array(z.string()).optional(),
});

export const InspectionReportSchema = z.object({
  id: z.string(),
  inspectionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  inspectorName: z.string(),
  inspectorId: z.string().optional(),
  type: z.enum(["routine", "complaint", "compliance", "safety"]),
  overallRating: z.number().min(0).max(5),
  findings: z.array(InspectionFindingSchema),
  recommendations: z.array(z.string()),
  followUpRequired: z.boolean(),
  followUpDate: z.string().optional(),
  status: z.enum(["pending", "completed", "follow_up_required"]),
  filePath: z.string().optional(),
  createdAt: z.string(),
});

export const UtilityInfoSchema = z.object({
  type: z.enum(["electricity", "water", "gas", "internet", "maintenance"]),
  provider: z.string(),
  accountNumber: z.string(),
  monthlyAmount: z.number().nonnegative(),
  includedInRent: z.boolean(),
});

export const AddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  country: z.string(),
});

export const AccommodationSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["hostel", "apartment", "house", "dormitory"]),
  address: AddressSchema,
  capacity: z.number().positive(),
  currentOccupancy: z.number().int().min(0),
  facilities: z.array(z.string()),
  safetyFeatures: z.array(z.string()),
  complianceStatus: z.enum([
    "compliant",
    "non_compliant",
    "pending_review",
    "requires_action",
  ]),
  lastInspectionDate: z.string().optional(),
  nextInspectionDue: z.string().optional(),
  inspectionReports: z.array(InspectionReportSchema),
  monthlyRent: z.number().nonnegative(),
  utilities: z.array(UtilityInfoSchema),
  managerId: z.string().optional(),
  rules: z.array(z.string()),
  emergencyContacts: z.array(EmergencyContactSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const GovernmentSubmissionFwmsSchema = z.object({
  id: z.string(),
  type: z.enum(["immigration", "jtk", "fomema", "myeg", "kwsp", "perkeso"]),
  workerId: z.string(),
  submissionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum([
    "pending",
    "submitted",
    "approved",
    "rejected",
    "processing",
  ]),
  referenceNumber: z.string().optional(),
  responseData: z.record(z.string(), z.any()).optional(),
  errorMessage: z.string().optional(),
  retryCount: z.number().int().nonnegative(),
  nextRetryDate: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const LevyPaymentSchema = z.object({
  id: z.string(),
  workerId: z.string(),
  permitId: z.string(),
  amount: z.number().positive(),
  currency: z.literal("MYR"),
  paymentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(["pending", "paid", "overdue", "cancelled"]),
  paymentMethod: z.string().optional(),
  transactionId: z.string().optional(),
  receiptNumber: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.string(),
});

// ── Worker (full profile) ─────────────────────────────────────────────────────

export const WorkerSimpleSchema = z.object({
  id: z.string(),
  name: z.string(),
  nationality: z.string(),
  passportNo: z.string(),
  permitNo: z.string(),
  permitStatus: z.enum([
    "active",
    "pending",
    "expiring",
    "expired",
    "suspended",
  ]),
  medicalStatus: z.enum(["valid", "pending", "expired"]),
  employer: z.string(),
  position: z.string(),
  joinDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  permitExpiry: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  contactInfo: z.object({
    phone: z.string().optional(),
    email: z.string().email().optional(),
    address: z.string().optional(),
  }),
  documents: z.object({
    passport: z.boolean(),
    visa: z.boolean(),
    workPermit: z.boolean(),
    medicalCert: z.boolean(),
  }),
  personalInfo: z.object({
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    gender: z.enum(["male", "female"]),
    maritalStatus: z.enum(["single", "married", "divorced", "widowed"]),
    religion: z.string().optional(),
    emergencyContact: EmergencyContactSchema.optional(),
  }),
  employmentInfo: z.object({
    sector: z.string(),
    skillLevel: z.enum(["skilled", "semiskilled", "unskilled"]),
    salary: z.number().positive(),
    contractStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    contractEndDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    workLocation: z.string(),
  }),
  accommodationInfo: z
    .object({
      type: z.enum(["company_provided", "own_arrangement"]),
      address: z.string().optional(),
      monthlyRent: z.number().optional(),
      facilities: z.array(z.string()).optional(),
    })
    .optional(),
});

export const WorkerStatsSchema = z.object({
  total: z.number().int().nonnegative(),
  active: z.number().int().nonnegative(),
  pending: z.number().int().nonnegative(),
  expiring: z.number().int().nonnegative(),
  expired: z.number().int().nonnegative(),
  byNationality: z.record(z.string(), z.number().int().nonnegative()),
  bySector: z.record(z.string(), z.number().int().nonnegative()),
  bySkillLevel: z.record(z.string(), z.number().int().nonnegative()),
});

export const PermitApplicationSchema = z.object({
  id: z.string(),
  workerId: z.string(),
  applicationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum([
    "submitted",
    "under_review",
    "approved",
    "rejected",
    "pending_documents",
  ]),
  permitType: z.enum(["new", "renewal", "replacement"]),
  documents: z.object({
    form8: z.boolean(),
    passportCopy: z.boolean(),
    photo: z.boolean(),
    medicalReport: z.boolean(),
    insuranceCert: z.boolean(),
  }),
  fees: z.object({
    levy: z.number().nonnegative(),
    processingFee: z.number().nonnegative(),
    serviceFee: z.number().nonnegative(),
    total: z.number().nonnegative(),
  }),
  approvalDate: z.string().optional(),
  rejectionReason: z.string().optional(),
  notes: z.string().optional(),
});
