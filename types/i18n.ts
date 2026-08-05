// ============================================================
// Typed i18n Translation Keys & Structures
// ============================================================

/** Union of all supported locales (normalized BCP-47-like codes) */
export type LocaleCode =
  | "en"  // English
  | "ms"  // Malay
  | "bn"  // Bengali
  | "ne"  // Nepali
  | "zh"  // Chinese
  | "es"  // Spanish
  | "id"  // Indonesian
  | "th"  // Thai
  | "ph"  // Filipino
  | "vt"  // Vietnamese
  | "ar"; // Arabic

/** Text direction supported by the locale */
export type TextDirection = "ltr" | "rtl";

/** Available translation namespaces */
export type Namespace =
  | "common"
  | "validation"
  | "errors"
  | "notifications"
  | "email";

// ============================================================
// Main translation structure — mirrors common.json keys
// ============================================================

export interface AppTranslations {
  title: string;
  description: string;
  welcome: string;
  version: string;
  copyright: string;
  support: string;
  shortName?: string;
  companyFullName?: string;
}

export interface NavTranslations {
  dashboard: string;
  employees: string;
  payroll: string;
  leave: string;
  attendance: string;
  reports: string;
  settings: string;
  admin: string;
  logout: string;
  profile: string;
  onboarding: string;
  offboarding: string;
  compensation: string;
  benefits: string;
  talent: string;
  learning: string;
  compliance: string;
  termination: string;
  zakat: string;
  scheduling: string;
  succession: string;
  company: string;
  notifications?: string;
  calendar?: string;
  help?: string;
  feedback?: string;
}

export interface AuthTranslations {
  login: string;
  register: string;
  email: string;
  password: string;
  forgotPassword: string;
  resetPassword: string;
  signIn: string;
  signUp: string;
  confirmPassword: string;
  rememberMe: string;
  invalidCredentials: string;
  passwordMismatch: string;
  logoutSuccess: string;
  loginSuccess?: string;
  registerSuccess?: string;
  resetLinkSent?: string;
  passwordChanged?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
  passwordStrength?: string;
  weak?: string;
  medium?: string;
  strong?: string;
  emailRequired?: string;
  passwordRequired?: string;
  emailInvalid?: string;
  passwordMinLength?: string;
  sessionExpired?: string;
  unauthorized?: string;
}

export interface CommonTranslations {
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  view: string;
  search: string;
  filter: string;
  export: string;
  import: string;
  refresh: string;
  loading: string;
  noData: string;
  error: string;
  success: string;
  confirm: string;
  close: string;
  back: string;
  next: string;
  finish: string;
  submit: string;
  reset: string;
  download: string;
  upload: string;
  print: string;
  yes: string;
  no: string;
  status: string;
  actions: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  department: string;
  position: string;
  type: string;
  description: string;
  startDate: string;
  endDate: string;
  date: string;
  time: string;
  amount: string;
  currency: string;
  comment: string;
  notes: string;
  id?: string;
  name?: string;
  title?: string;
  code?: string;
  active?: string;
  inactive?: string;
  all?: string;
  none?: string;
  required?: string;
  minLength?: string;
  maxLength?: string;
  minValue?: string;
  maxValue?: string;
  patternMismatch?: string;
  duplicate?: string;
  notFound?: string;
  forbidden?: string;
  timeout?: string;
  networkError?: string;
  serverError?: string;
  unknownError?: string;
  retry?: string;
  tryAgain?: string;
  contactSupport?: string;
  page?: string;
  pageSize?: string;
  totalItems?: string;
  first?: string;
  last?: string;
  previous?: string;
  nextPage?: string;
  sortAsc?: string;
  sortDesc?: string;
  selectAll?: string;
  deselectAll?: string;
  clear?: string;
  apply?: string;
  more?: string;
  less?: string;
  expand?: string;
  collapse?: string;
  show?: string;
  hide?: string;
  enable?: string;
  disable?: string;
  approve?: string;
  reject?: string;
  validate?: string;
  invalid?: string;
  unique?: string;
  notAllowed?: string;
  copy?: string;
  paste?: string;
  cut?: string;
  undo?: string;
  redo?: string;
  draft?: string;
  published?: string;
  archived?: string;
  deleted?: string;
  pending?: string;
  processing?: string;
  completed?: string;
  failed?: string;
  cancelled?: string;
}

export interface EmployeeTranslations {
  title: string;
  list: string;
  add: string;
  edit: string;
  details: string;
  name: string;
  email: string;
  department: string;
  position: string;
  status: string;
  id: string;
  phone: string;
  address: string;
  gender: string;
  dob: string;
  nationality: string;
  maritalStatus: string;
  emergencyContact: string;
  hireDate: string;
  terminationDate: string;
  active: string;
  inactive: string;
  suspended?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  jobTitle?: string;
  reportTo?: string;
  workEmail?: string;
  personalEmail?: string;
  mobile?: string;
  workPhone?: string;
  homeAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  nationalId?: string;
  passport?: string;
  visa?: string;
  visaExpiry?: string;
  emergencyPhone?: string;
  emergencyRelation?: string;
  bloodType?: string;
  religion?: string;
  ethnicity?: string;
  languages?: string;
  skills?: string;
  certifications?: string;
  education?: string;
  experience?: string;
  bankAccount?: string;
  taxId?: string;
  socialSecurity?: string;
  workPermit?: string;
  workPermitExpiry?: string;
  probationEnd?: string;
  contractStart?: string;
  contractEnd?: string;
  employmentType?: string;
  fullTime?: string;
  partTime?: string;
  contractor?: string;
  intern?: string;
  uploadPhoto?: string;
  uploadDocuments?: string;
  employeeProfile?: string;
}

export interface DashboardTranslations {
  title: string;
  overview: string;
  totalEmployees: string;
  totalDepartments: string;
  activeEmployees: string;
  pendingLeave: string;
  upcomingHolidays: string;
  newHires: string;
  terminations: string;
  attendanceRate: string;
  averageSalary: string;
  totalPayroll?: string;
  leaveBalance?: string;
  overtimeHours?: string;
  birthdays?: string;
  anniversaries?: string;
  complianceStatus?: string;
  headcountTrend?: string;
  departmentDistribution?: string;
  genderRatio?: string;
  ageDistribution?: string;
  tenure?: string;
}

export interface PayrollTranslations {
  title: string;
  runPayroll: string;
  payrollRuns: string;
  period: string;
  grossPay: string;
  deductions: string;
  netPay: string;
  status: string;
  draft: string;
  processed: string;
  approved: string;
  paid: string;
  employee: string;
  salary: string;
  allowance: string;
  bonus: string;
  overtime: string;
  payslip: string;
  generatePayslip: string;
  baseSalary?: string;
  hourlyRate?: string;
  overtimeRate?: string;
  bonusType?: string;
  deductionType?: string;
  tax?: string;
  socialSecurity?: string;
  healthInsurance?: string;
  retirement?: string;
  gross?: string;
  net?: string;
  currencySymbol?: string;
  payDate?: string;
  payPeriod?: string;
  adjustment?: string;
  reimbursement?: string;
  commission?: string;
  incentive?: string;
  salaryStructure?: string;
  salaryReview?: string;
  salaryIncrease?: string;
  effectiveDate?: string;
  payrollGroup?: string;
  costCenter?: string;
  departmentPayroll?: string;
  payrollReport?: string;
  bankTransfer?: string;
  payslipEmail?: string;
  payslipPrint?: string;
}

export interface LeaveTranslations {
  title: string;
  request: string;
  myRequests: string;
  pending: string;
  approved: string;
  rejected: string;
  cancelled: string;
  annual: string;
  sick: string;
  maternity: string;
  paternity: string;
  unpaid: string;
  other: string;
  balance: string;
  remaining: string;
  taken: string;
  startDate: string;
  endDate: string;
  reason: string;
  leaveType?: string;
  days?: string;
  halfDay?: string;
  startTime?: string;
  endTime?: string;
  attachments?: string;
  approver?: string;
  statusPending?: string;
  statusApproved?: string;
  statusRejected?: string;
  statusCancelled?: string;
  remainingDays?: string;
  accrued?: string;
  used?: string;
  carryOver?: string;
  expiry?: string;
  leaveCalendar?: string;
  teamLeave?: string;
  publicHoliday?: string;
  leavePolicy?: string;
}

export interface ValidationTranslations {
  required: string;
  email: string;
  minLength: string;
  maxLength: string;
  pattern: string;
  match: string;
  unique: string;
  number: string;
  integer: string;
  url: string;
  phone: string;
  date: string;
  dateRange: string;
  time: string;
  fileSize: string;
  fileType: string;
  minValue: string;
  maxValue: string;
  minItems: string;
  maxItems: string;
  custom: string;
}

export interface ErrorTranslations {
  generic: string;
  notFound: string;
  forbidden: string;
  unauthorized: string;
  serverError: string;
  networkError: string;
  timeout: string;
  validationError: string;
  sessionExpired: string;
  maintenance: string;
  rateLimited: string;
  conflict: string;
  badRequest: string;
  unknown: string;
  retry: string;
  contactSupport: string;
}

export interface NotificationTranslations {
  success: string;
  error: string;
  warning: string;
  info: string;
  newUpdate: string;
  mention: string;
  reminder: string;
  approval: string;
  rejection: string;
  system: string;
  markRead: string;
  markAllRead: string;
  notifications: string;
  noNotifications: string;
}

export interface EmailTranslations {
  greeting: string;
  farewell: string;
  signature: string;
  footerRights: string;
  footerCompany: string;
  buttonText: string;
  ignoreMessage: string;
  automaticMessage: string;
}

/** Top-level translation file shape */
export interface CommonTranslationsFile {
  app: AppTranslations;
  nav: NavTranslations;
  auth: AuthTranslations;
  common: CommonTranslations;
  employee: EmployeeTranslations;
  dashboard: DashboardTranslations;
  payroll: PayrollTranslations;
  leave: LeaveTranslations;
  attendance: Record<string, string>;
  reports: Record<string, string>;
  settings: Record<string, string>;
  admin: Record<string, string>;
  onboarding: Record<string, string>;
  offboarding: Record<string, string>;
  compensation: Record<string, string>;
  benefits: Record<string, string>;
  talent: Record<string, string>;
  learning: Record<string, string>;
  compliance: Record<string, string>;
  termination: Record<string, string>;
  zakat: Record<string, string>;
  scheduling: Record<string, string>;
  succession: Record<string, string>;
  company: Record<string, string>;
}

/** Deep key extraction: converts nested object to dot-notation union */
export type DeepKeys<T, Prefix extends string = ""> = {
  [K in keyof T & string]: T[K] extends Record<string, unknown>
    ? DeepKeys<T[K], `${Prefix}${K}.`>
    : `${Prefix}${K}`;
}[keyof T & string];

/** All possible dot-notation translation keys for common namespace */
export type CommonTranslationKey = DeepKeys<CommonTranslationsFile>;

