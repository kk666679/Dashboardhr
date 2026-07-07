// Foreign Worker Management System (FWMS) Core Types

export type AgentOutput = {
  type: string;
  message: string;
  source?: string;
};

export interface HRAgentResult {
  raw: AgentOutput[];
  final: string;
}

export type HRToolName =
  | "PAYROLL"
  | "LEAVE"
  | "IMMIGRATION"
  | "AI_SEARCH"
  | "AI_REASON"
  | "SYSTEM";

export interface Worker {
  id: string;
  passportNumber: string;
  personalInfo: PersonalInfo;
  employmentInfo: EmploymentInfo;
  documents: WorkerDocument[];
  permits: Permit[];
  medicalRecords: MedicalRecord[];
  accommodationId?: string;
  status: WorkerStatus;
  biometricData?: BiometricData;
  performanceRecords: PerformanceRecord[];
  attendanceRecords: AttendanceRecord[];
  complianceAlerts: ComplianceAlert[];
  createdAt: string;
  updatedAt: string;
}

export interface PersonalInfo {
  fullName: string;
  nameInPassport: string;
  dateOfBirth: string;
  nationality: string;
  gender: "male" | "female";
  maritalStatus: "single" | "married" | "divorced" | "widowed";
  religion?: string;
  emergencyContact: EmergencyContact;
  homeAddress: Address;
  malaysianAddress?: Address;
  phoneNumber: string;
  email?: string;
  educationLevel: string;
  languages: string[];
  skills: string[];
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
  address: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface EmploymentInfo {
  employerId: string;
  employerName: string;
  jobTitle: string;
  department: string;
  sector: string;
  salaryAmount: number;
  salaryCurrency: "MYR";
  contractStartDate: string;
  contractEndDate: string;
  workingHours: string;
  workLocation: string;
  supervisorId?: string;
  recruitmentAgency?: string;
  levyAmount: number;
  levyPaidUntil: string;
}

export interface WorkerDocument {
  id: string;
  type: DocumentType;
  documentNumber: string;
  issueDate: string;
  expiryDate: string;
  issuingAuthority: string;
  filePath: string;
  status: "valid" | "expired" | "expiring_soon" | "pending_renewal";
  verificationStatus: "verified" | "pending" | "rejected";
  notes?: string;
  uploadedAt: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export type DocumentType =
  | "passport"
  | "work_permit"
  | "visa"
  | "employment_contract"
  | "medical_certificate"
  | "insurance_policy"
  | "training_certificate"
  | "police_clearance"
  | "educational_certificate"
  | "other";

export interface Permit {
  id: string;
  type: PermitType;
  permitNumber: string;
  applicationDate: string;
  approvalDate?: string;
  issueDate?: string;
  expiryDate: string;
  status: PermitStatus;
  issuingAuthority: string;
  levyAmount: number;
  levyPaidAmount: number;
  levyDueDate: string;
  renewalApplicationDate?: string;
  rejectionReason?: string;
  conditions?: string[];
  filePath?: string;
  createdAt: string;
  updatedAt: string;
}

export type PermitType =
  | "plks"
  | "eval"
  | "visa_with_reference"
  | "special_pass"
  | "temporary_employment_pass"
  | "work_permit_renewal";

export type PermitStatus =
  | "pending_application"
  | "under_review"
  | "approved"
  | "rejected"
  | "issued"
  | "expired"
  | "cancelled"
  | "renewal_required";

export interface MedicalRecord {
  id: string;
  examType: "pre_employment" | "periodic" | "special" | "exit";
  examDate: string;
  clinicName: string;
  clinicCode: string;
  doctorName: string;
  fomemaStatus: FomemaStatus;
  fomemaTransactionId?: string;
  results: MedicalResult[];
  overallStatus: "fit" | "unfit" | "pending" | "referred";
  nextExamDue?: string;
  certificateNumber?: string;
  filePath?: string;
  cost: number;
  paidBy: "employer" | "worker";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type FomemaStatus =
  | "pending_registration"
  | "registered"
  | "exam_scheduled"
  | "exam_completed"
  | "results_pending"
  | "fit"
  | "unfit"
  | "referred"
  | "cancelled";

export interface MedicalResult {
  testType: string;
  result: "normal" | "abnormal" | "positive" | "negative" | "pending";
  value?: string;
  referenceRange?: string;
  notes?: string;
}

export interface Accommodation {
  id: string;
  name: string;
  type: "hostel" | "apartment" | "house" | "dormitory";
  address: Address;
  capacity: number;
  currentOccupancy: number;
  facilities: string[];
  safetyFeatures: string[];
  complianceStatus: ComplianceStatus;
  lastInspectionDate?: string;
  nextInspectionDue?: string;
  inspectionReports: InspectionReport[];
  monthlyRent: number;
  utilities: UtilityInfo[];
  managerId?: string;
  rules: string[];
  emergencyContacts: EmergencyContact[];
  createdAt: string;
  updatedAt: string;
}

export interface InspectionReport {
  id: string;
  inspectionDate: string;
  inspectorName: string;
  inspectorId?: string;
  type: "routine" | "complaint" | "compliance" | "safety";
  overallRating: number;
  findings: InspectionFinding[];
  recommendations: string[];
  followUpRequired: boolean;
  followUpDate?: string;
  status: "pending" | "completed" | "follow_up_required";
  filePath?: string;
  createdAt: string;
}

export interface InspectionFinding {
  category: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "resolved" | "in_progress";
  resolvedDate?: string;
  photos?: string[];
}

export interface UtilityInfo {
  type: "electricity" | "water" | "gas" | "internet" | "maintenance";
  provider: string;
  accountNumber: string;
  monthlyAmount: number;
  includedInRent: boolean;
}

export interface BiometricData {
  fingerprintHash?: string;
  faceRecognitionHash?: string;
  enrollmentDate: string;
  lastVerificationDate?: string;
  verificationCount: number;
}

export interface PerformanceRecord {
  id: string;
  evaluationDate: string;
  evaluatorId: string;
  evaluatorName: string;
  period: string;
  overallRating: number;
  categories: PerformanceCategory[];
  strengths: string[];
  areasForImprovement: string[];
  goals: string[];
  comments: string;
  status: "draft" | "completed" | "acknowledged";
  workerAcknowledgment?: string;
  acknowledgedAt?: string;
  createdAt: string;
}

export interface PerformanceCategory {
  name: string;
  rating: number;
  weight: number;
  comments?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  breakStart?: string;
  breakEnd?: string;
  totalHours: number;
  overtimeHours: number;
  status:
    | "present"
    | "absent"
    | "late"
    | "half_day"
    | "sick_leave"
    | "annual_leave";
  location?: string;
  notes?: string;
  approvedBy?: string;
  createdAt: string;
}

export interface ComplianceAlert {
  id: string;
  type: AlertType;
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  dueDate?: string;
  status: "active" | "resolved" | "dismissed" | "overdue";
  actionRequired: string;
  assignedTo?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
}

export type AlertType =
  | "document_expiry"
  | "permit_renewal"
  | "medical_exam_due"
  | "levy_payment_due"
  | "compliance_violation"
  | "accommodation_issue"
  | "performance_issue"
  | "attendance_issue";

export type WorkerStatus =
  | "active"
  | "inactive"
  | "terminated"
  | "suspended"
  | "on_leave"
  | "pending_approval"
  | "blacklisted";

export type ComplianceStatus =
  | "compliant"
  | "non_compliant"
  | "pending_review"
  | "requires_action";

// Government Integration Types
export interface GovernmentSubmission {
  id: string;
  type: "immigration" | "jtk" | "fomema" | "myeg" | "kwsp" | "perkeso";
  workerId: string;
  submissionDate: string;
  status: "pending" | "submitted" | "approved" | "rejected" | "processing";
  referenceNumber?: string;
  responseData?: any;
  errorMessage?: string;
  retryCount: number;
  nextRetryDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Levy and Payment Types
export interface LevyPayment {
  id: string;
  workerId: string;
  permitId: string;
  amount: number;
  currency: "MYR";
  paymentDate: string;
  dueDate: string;
  status: "pending" | "paid" | "overdue" | "cancelled";
  paymentMethod?: string;
  transactionId?: string;
  receiptNumber?: string;
  notes?: string;
  createdAt: string;
}

// Reporting Types
export interface ComplianceReport {
  id: string;
  reportType: "monthly" | "quarterly" | "annual" | "ad_hoc";
  period: string;
  generatedDate: string;
  generatedBy: string;
  data: {
    totalWorkers: number;
    activeWorkers: number;
    complianceRate: number;
    expiringDocuments: number;
    overduePayments: number;
    medicalExamsDue: number;
    accommodationIssues: number;
  };
  filePath?: string;
  submittedToAuthorities: string[];
  status: "draft" | "completed" | "submitted";
}

export interface WorkerAnalytics {
  totalWorkers: number;
  activeWorkers: number;
  workersByNationality: Record<string, number>;
  workersBySector: Record<string, number>;
  complianceRate: number;
  averageStayDuration: number;
  turnoverRate: number;
  monthlyTrends: {
    month: string;
    newHires: number;
    terminations: number;
    complianceIssues: number;
  }[];
}
