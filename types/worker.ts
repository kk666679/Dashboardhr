export interface Worker {
  id: string;
  name: string;
  nationality: string;
  passportNo: string;
  permitNo: string;
  permitStatus: "active" | "pending" | "expiring" | "expired" | "suspended";
  medicalStatus: "valid" | "pending" | "expired";
  employer: string;
  position: string;
  joinDate: string;
  permitExpiry: string;
  contactInfo: {
    phone?: string;
    email?: string;
    address?: string;
  };
  documents: {
    passport: boolean;
    visa: boolean;
    workPermit: boolean;
    medicalCert: boolean;
  };
  personalInfo: {
    dateOfBirth: string;
    gender: "male" | "female";
    maritalStatus: "single" | "married" | "divorced" | "widowed";
    religion?: string;
    emergencyContact?: {
      name: string;
      relationship: string;
      phone: string;
      address: string;
    };
  };
  employmentInfo: {
    sector: string;
    skillLevel: "skilled" | "semiskilled" | "unskilled";
    salary: number;
    contractStartDate: string;
    contractEndDate: string;
    workLocation: string;
  };
  accommodationInfo?: {
    type: "company_provided" | "own_arrangement";
    address?: string;
    monthlyRent?: number;
    facilities?: string[];
  };
}

export interface WorkerStats {
  total: number;
  active: number;
  pending: number;
  expiring: number;
  expired: number;
  byNationality: Record<string, number>;
  bySector: Record<string, number>;
  bySkillLevel: Record<string, number>;
}

export interface PermitApplication {
  id: string;
  workerId: string;
  applicationDate: string;
  status:
    | "submitted"
    | "under_review"
    | "approved"
    | "rejected"
    | "pending_documents";
  permitType: "new" | "renewal" | "replacement";
  documents: {
    form8: boolean;
    passportCopy: boolean;
    photo: boolean;
    medicalReport: boolean;
    insuranceCert: boolean;
  };
  fees: {
    levy: number;
    processingFee: number;
    serviceFee: number;
    total: number;
  };
  approvalDate?: string;
  rejectionReason?: string;
  notes?: string;
}
