// ─── Centralized route map ────────────────────────────────────────────────────
// Used by sidebar, breadcrumbs, command palette, and deep-link helpers.
// Every route resolves to a real page – no dead links.

export type DashboardRoot = "/dashboard";
export type EssRoot = "/ess";
export type MssRoot = "/mss";

export const ROUTE = {
  // ── System ────────────────────────────────────────────────────────────────
  system: {
    home:        "/" as const,
    login:       "/login" as const,
    notFound:    "/404" as const,
    forbidden:   "/forbidden" as const,
    serverError: "/500" as const,
  },

  // ── Dashboard root helpers ─────────────────────────────────────────────────
  dashboard: {
    root:      "/dashboard" as const,
    analytics: "/dashboard/analytics" as const,
    withLocale: (locale: string, path: string) => `/${locale}${path}` as const,

    // ── Employees / HR ────────────────────────────────────────────────────
    employees: {
      root:           "/dashboard/employees" as const,
      new:            "/dashboard/employees/new" as const,
      byId:           (id: string) => `/dashboard/employees/${id}`,
      editById:       (id: string) => `/dashboard/employees/${id}/edit`,
      documents:      (id: string) => `/dashboard/employees/${id}/documents`,
      skills:         (id: string) => `/dashboard/employees/${id}/skills`,
      timeline:       (id: string) => `/dashboard/employees/${id}/timeline`,
      orgChart:       "/dashboard/employees/org-chart" as const,
      directory:      "/dashboard/employees/directory" as const,
      skillsInventory:"/dashboard/employees/skills-inventory" as const,
    },

    workers: {
      root:              "/dashboard/workers" as const,
      add:               "/dashboard/workers/add" as const,
      attendanceAlert:   "/dashboard/workers/attendance-alert" as const,
      leaveRequest:      "/dashboard/workers/leave-request" as const,
      payrollAdjustment: "/dashboard/workers/payroll-adjustment" as const,
    },

    // ── Onboarding / Offboarding ──────────────────────────────────────────
    onboarding: {
      root:          "/dashboard/onboarding" as const,
      wizard:        "/dashboard/onboarding/wizard" as const,
      checklist:     "/dashboard/onboarding/checklist" as const,
      byEmployeeId:  (id: string) => `/dashboard/onboarding/${id}`,
    },
    offboarding: {
      root:     "/dashboard/offboarding" as const,
      checklist:"/dashboard/offboarding/checklist" as const,
      exit:     "/dashboard/offboarding/exit-interview" as const,
    },
    termination: {
      root: "/dashboard/termination" as const,
      new:  "/dashboard/termination/new" as const,
      byId: (id: string) => `/dashboard/termination/${id}`,
    },

    // ── Leave ─────────────────────────────────────────────────────────────
    leave: {
      root:     "/dashboard/leave" as const,
      apply:    "/dashboard/leave/apply" as const,
      balance:  "/dashboard/leave/balance" as const,
      calendar: "/dashboard/leave/calendar" as const,
      approvals:"/dashboard/leave/approvals" as const,
      policy:   "/dashboard/leave/policy" as const,
    },

    // ── Attendance ────────────────────────────────────────────────────────
    attendance: {
      root:       "/dashboard/attendance" as const,
      biometric:  "/dashboard/attendance/biometric" as const,
      correction: "/dashboard/attendance/correction" as const,
      overtime:   "/dashboard/attendance/overtime" as const,
      roster:     "/dashboard/attendance/roster" as const,
      shifts:     "/dashboard/attendance/shifts" as const,
      reports:    "/dashboard/attendance/reports" as const,
    },

    // ── Scheduling ────────────────────────────────────────────────────────
    scheduling: {
      root:    "/dashboard/scheduling" as const,
      shifts:  "/dashboard/scheduling/shifts" as const,
      roster:  "/dashboard/scheduling/roster" as const,
    },

    // ── Payroll ───────────────────────────────────────────────────────────
    payroll: {
      root:        "/dashboard/payroll" as const,
      run:         "/dashboard/payroll/run" as const,
      calendar:    "/dashboard/payroll/calendar" as const,
      epf:         "/dashboard/payroll/epf" as const,
      socso:       "/dashboard/payroll/socso" as const,
      eis:         "/dashboard/payroll/eis" as const,
      pcb:         "/dashboard/payroll/pcb" as const,
      hrdCorp:     "/dashboard/payroll/hrd-corp" as const,
      levy:        "/dashboard/payroll/levy" as const,
      payslips:    "/dashboard/payroll/payslips" as const,
      reports:     "/dashboard/payroll/reports" as const,
      bankFile:    "/dashboard/payroll/bank-file" as const,
      audit:       "/dashboard/payroll/audit" as const,
      statutory:   "/dashboard/payroll/statutory" as const,
      byRunId:     (id: string) => `/dashboard/payroll/${id}`,
    },

    // ── Compensation & Benefits ───────────────────────────────────────────
    compensation: { root: "/dashboard/compensation" as const },
    compensationBenefits: {
      root:       "/dashboard/compensation-benefits" as const,
      salaryBands:"/dashboard/compensation-benefits/salary-bands" as const,
      bonusPlans: "/dashboard/compensation-benefits/bonus-plans" as const,
      equity:     "/dashboard/compensation-benefits/equity" as const,
      benchmarks: "/dashboard/compensation-benefits/benchmarks" as const,
    },
    benefits: { root: "/dashboard/benefits" as const },

    // ── Performance ───────────────────────────────────────────────────────
    performance: {
      root:  "/dashboard/performance" as const,
      new:   "/dashboard/performance/new" as const,
      byId:  (id: string) => `/dashboard/performance/${id}`,
      goals: "/dashboard/performance/goals" as const,
      kpis:  "/dashboard/performance/kpis" as const,
    },

    // ── Learning & Development ────────────────────────────────────────────
    learningDevelopment: {
      root:     "/dashboard/learning-development" as const,
      courses:  "/dashboard/learning-development/courses" as const,
      paths:    "/dashboard/learning-development/paths" as const,
      certifications: "/dashboard/learning-development/certifications" as const,
    },

    // ── Recruitment & Talent ──────────────────────────────────────────────
    recruitment: {
      root:      "/dashboard/recruitment" as const,
      vacancies: "/dashboard/recruitment/vacancies" as const,
      pipeline:  "/dashboard/recruitment/pipeline" as const,
      interviews:"/dashboard/recruitment/interviews" as const,
      offers:    "/dashboard/recruitment/offers" as const,
      new:       "/dashboard/recruitment/new" as const,
    },
    talentAcquisition: {
      root:      "/dashboard/talent-acquisition" as const,
      sourcing:  "/dashboard/talent-acquisition/sourcing" as const,
      pipeline:  "/dashboard/talent-acquisition/pipeline" as const,
    },
    succession: { root: "/dashboard/succession" as const },

    // ── Foreign Workers ───────────────────────────────────────────────────
    foreignWorkers: {
      root:       "/dashboard/foreign-workers" as const,
      directory:  "/dashboard/foreign-workers/directory" as const,
      byId:       (id: string) => `/dashboard/foreign-workers/${id}`,
      quota:      "/dashboard/foreign-workers/quota" as const,
      levy:       "/dashboard/foreign-workers/levy" as const,
      fomema:     "/dashboard/foreign-workers/fomema" as const,
      insurance:  "/dashboard/foreign-workers/insurance" as const,
      agency:     "/dashboard/foreign-workers/agency" as const,
      transport:  "/dashboard/foreign-workers/transport" as const,
      compliance: "/dashboard/foreign-workers/compliance" as const,
      expiry:     "/dashboard/foreign-workers/expiry-calendar" as const,
    },

    // ── Permits & Visas ───────────────────────────────────────────────────
    permits: {
      root:           "/dashboard/permits" as const,
      apply:          "/dashboard/permits/apply" as const,
      bulkRenewal:    "/dashboard/permits/bulk-renewal" as const,
      levyCalculator: "/dashboard/permits/levy-calculator" as const,
      visaRenewal:    "/dashboard/permits/visa-renewal" as const,
      passport:       "/dashboard/permits/passport" as const,
      plks:           "/dashboard/permits/plks" as const,
      workPermit:     "/dashboard/permits/work-permit" as const,
      specialPass:    "/dashboard/permits/special-pass" as const,
      byId:           (id: string) => `/dashboard/permits/${id}`,
    },

    // ── Expatriates ───────────────────────────────────────────────────────
    expatriates: {
      root:          "/dashboard/expatriates" as const,
      byId:          (id: string) => `/dashboard/expatriates/${id}`,
      employmentPass:"/dashboard/expatriates/employment-pass" as const,
      dependantPass: "/dashboard/expatriates/dependant-pass" as const,
      taxEqualization:"/dashboard/expatriates/tax-equalization" as const,
      relocation:    "/dashboard/expatriates/relocation" as const,
      housing:       "/dashboard/expatriates/housing" as const,
      schooling:     "/dashboard/expatriates/schooling" as const,
      expenses:      "/dashboard/expatriates/expenses" as const,
      globalPayroll: "/dashboard/expatriates/global-payroll" as const,
      timeline:      "/dashboard/expatriates/timeline" as const,
      mobility:      "/dashboard/expatriates/mobility-analytics" as const,
    },

    // ── Medical / FOMEMA ──────────────────────────────────────────────────
    medical: {
      root:          "/dashboard/medical" as const,
      fomema:        "/dashboard/medical/fomema" as const,
      fomemaSchedule:"/dashboard/medical/fomema/schedule" as const,
      schedule:      "/dashboard/medical/schedule" as const,
      insurance:     "/dashboard/medical/insurance" as const,
      centers:       "/dashboard/medical/centers" as const,
    },

    // ── Accommodation ─────────────────────────────────────────────────────
    accommodation: {
      root:       "/dashboard/accommodation" as const,
      hostels:    "/dashboard/accommodation/hostels" as const,
      rooms:      "/dashboard/accommodation/rooms" as const,
      placement:  "/dashboard/accommodation/placement" as const,
      inspection: "/dashboard/accommodation/inspection" as const,
      maintenance:"/dashboard/accommodation/maintenance" as const,
      utilities:  "/dashboard/accommodation/utilities" as const,
    },

    // ── Geolocation ───────────────────────────────────────────────────────
    geolocation: {
      root:         "/dashboard/geolocation" as const,
      liveTracking: "/dashboard/geolocation/live-tracking" as const,
      geofences:    "/dashboard/geolocation/geofences" as const,
      alerts:       "/dashboard/geolocation/alerts" as const,
      history:      "/dashboard/geolocation/history" as const,
      analytics:    "/dashboard/geolocation/analytics" as const,
      settings:     "/dashboard/geolocation/settings" as const,
    },

    // ── Compliance ────────────────────────────────────────────────────────
    compliance: {
      root:         "/dashboard/compliance" as const,
      auditNew:     "/dashboard/compliance/audit/new" as const,
      auditDashboard:"/dashboard/compliance/audit-dashboard" as const,
      score:        "/dashboard/compliance/score" as const,
      requirements: "/dashboard/compliance/requirements" as const,
      policyLibrary:"/dashboard/compliance/policy-library" as const,
      riskRegister: "/dashboard/compliance/risk-register" as const,
      corrective:   "/dashboard/compliance/corrective-actions" as const,
      calendar:     "/dashboard/compliance/calendar" as const,
      zakat:        "/dashboard/compliance/zakat" as const,
      regulatory:   "/dashboard/compliance/regulatory-updates" as const,
    },

    // ── Documents ─────────────────────────────────────────────────────────
    documents: {
      root:        "/dashboard/documents" as const,
      repository:  "/dashboard/documents/repository" as const,
      ocr:         "/dashboard/documents/ocr" as const,
      aiExtraction:"/dashboard/documents/ai-extraction" as const,
      versions:    "/dashboard/documents/versions" as const,
      signatures:  "/dashboard/documents/signatures" as const,
      templates:   "/dashboard/documents/templates" as const,
      contracts:   "/dashboard/documents/contracts" as const,
      byId:        (id: string) => `/dashboard/documents/${id}`,
    },

    // ── Reports ───────────────────────────────────────────────────────────
    reports: {
      root:       "/dashboard/reports" as const,
      workforce:  "/dashboard/reports/workforce" as const,
      payroll:    "/dashboard/reports/payroll" as const,
      compliance: "/dashboard/reports/compliance" as const,
      immigration:"/dashboard/reports/immigration" as const,
      financial:  "/dashboard/reports/financial" as const,
      esg:        "/dashboard/reports/esg" as const,
      executive:  "/dashboard/reports/executive" as const,
      byId:       (id: string) => `/dashboard/reports/${id}`,
    },

    // ── AI Copilot ────────────────────────────────────────────────────────
    ai: {
      root:           "/dashboard/ai" as const,
      chat:           "/dashboard/ai/chat" as const,
      workflowBuilder:"/dashboard/ai/workflow-builder" as const,
      recommendations:"/dashboard/ai/recommendations" as const,
      complianceAdvisor:"/dashboard/ai/compliance-advisor" as const,
      documentAssistant:"/dashboard/ai/document-assistant" as const,
      analytics:      "/dashboard/ai/analytics" as const,
      forecasting:    "/dashboard/ai/forecasting" as const,
      hrOrchestrator: "/dashboard/ai/hr-orchestrator" as const,
      agents:         "/dashboard/ai/agents" as const,
      byAgentId:      (id: string) => `/dashboard/ai/agents/${id}`,
    },

    // ── Workflows ─────────────────────────────────────────────────────────
    workflows: {
      root:      "/dashboard/workflows" as const,
      byId:      (id: string) => `/dashboard/workflows/${id}`,
      approvals: "/dashboard/workflows/approvals" as const,
      builder:   "/dashboard/workflows/builder" as const,
      monitor:   "/dashboard/workflows/monitor" as const,
      templates: "/dashboard/workflows/templates" as const,
      triggers:  "/dashboard/workflows/triggers" as const,
    },

    // ── Analytics & Dashboards ────────────────────────────────────────────
    dashboards: {
      root:         "/dashboard/dashboards" as const,
      executive:    "/dashboard/dashboards/executive" as const,
      hr:           "/dashboard/dashboards/hr" as const,
      compliance:   "/dashboard/dashboards/compliance" as const,
      immigration:  "/dashboard/dashboards/immigration" as const,
      payroll:      "/dashboard/dashboards/payroll" as const,
      foreignWorker:"/dashboard/dashboards/foreign-worker" as const,
      expatriate:   "/dashboard/dashboards/expatriate" as const,
      aiOps:        "/dashboard/dashboards/ai-ops" as const,
    },

    // ── Administration ────────────────────────────────────────────────────
    admin: {
      root:          "/dashboard/admin" as const,
      users:         "/dashboard/admin/users" as const,
      roles:         "/dashboard/admin/roles" as const,
      permissions:   "/dashboard/admin/permissions" as const,
      departments:   "/dashboard/admin/departments" as const,
      locations:     "/dashboard/admin/locations" as const,
      companies:     "/dashboard/admin/companies" as const,
      businessUnits: "/dashboard/admin/business-units" as const,
      workflowConfig:"/dashboard/admin/workflow-config" as const,
      aiSettings:    "/dashboard/admin/ai-settings" as const,
      apiIntegrations:"/dashboard/admin/api-integrations" as const,
      notifications: "/dashboard/admin/notification-settings" as const,
      auditLogs:     "/dashboard/admin/audit-logs" as const,
      systemHealth:  "/dashboard/admin/system-health" as const,
    },

    // ── Integrations ──────────────────────────────────────────────────────
    integrations: {
      root:       "/dashboard/integrations" as const,
      government: "/dashboard/integrations/government" as const,
      biometric:  "/dashboard/integrations/biometric" as const,
      accounting: "/dashboard/integrations/accounting" as const,
      banking:    "/dashboard/integrations/banking" as const,
      webhooks:   "/dashboard/integrations/webhooks" as const,
      syncJobs:   "/dashboard/integrations/sync-jobs" as const,
    },

    // ── Misc ──────────────────────────────────────────────────────────────
    sops: {
      root:  "/dashboard/sops" as const,
      new:   "/dashboard/sops/new" as const,
      byId:  (id: string) => `/dashboard/sops/${id}`,
    },
    organisation: {
      root:     "/dashboard/organisation" as const,
      byNodeId: (id: string) => `/dashboard/organisation/${id}`,
    },
    workforcePlanning: { root: "/dashboard/workforce-planning" as const },
    automation: {
      root:      "/automation" as const,
      designer:  "/automation/designer" as const,
      monitor:   "/automation/monitor" as const,
      qms:       "/automation/qms" as const,
      sop:       "/automation/sops" as const,
      analytics: "/automation/analytics" as const,
      templates: "/automation/templates" as const,
    },
    workflowEngine:   { root: "/automation/workflow-engine" as const },
    healthSafety:     { root: "/dashboard/health-safety" as const },
    employeeRelations:{ root: "/dashboard/employee-relations" as const },
    industrialRelations:{ root: "/dashboard/industrial-relations" as const },
    travel:           { root: "/dashboard/travel" as const },
    lifecycle:        { root: "/dashboard/lifecycle" as const },
    auditTrail:       { root: "/dashboard/audit-trail" as const },
    security:         { root: "/dashboard/security" as const },
    dataGovernance:   { root: "/dashboard/data-governance" as const },
    notifications:    { root: "/dashboard/notifications" as const },
    settings: {
      root:         "/dashboard/settings" as const,
      avatar:       "/dashboard/settings/avatar" as const,
      pricing:      "/dashboard/settings/pricing" as const,
      subscription: "/dashboard/settings/subscription" as const,
      mfa:          "/dashboard/settings/mfa" as const,
      apiKeys:      "/dashboard/settings/api-keys" as const,
    },
    subscription:   { root: "/dashboard/subscription" as const },
    pdfGenerator:   { root: "/dashboard/pdf-generator" as const },
    iso:            { root: "/iso" as const },
    opex:           { root: "/opex" as const },
    capex:          { root: "/capex" as const },
    maintenance:    { root: "/dashboard/maintenance" as const },
    help:           { root: "/dashboard/help" as const },
  },

  // ── ESS ───────────────────────────────────────────────────────────────────
  ess: {
    root:     "/ess" as const,
    leave:    "/ess/leave" as const,
    payslips: "/ess/payslips" as const,
    assets:   "/ess/assets" as const,
    claims:   "/ess/claims" as const,
    profile:  "/ess/profile" as const,
    training: "/ess/training" as const,
    workers:  "/ess/workers" as const,
  },

  // ── MSS ───────────────────────────────────────────────────────────────────
  mss: {
    root:        "/mss" as const,
    approvals:   "/mss/approvals" as const,
    attendance:  "/mss/attendance" as const,
    performance: "/mss/performance" as const,
    team:        "/mss/team" as const,
  },
} as const;
