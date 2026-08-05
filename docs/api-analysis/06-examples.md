# 06 — Client SDK Examples

TypeScript usage examples for both the tRPC client and the REST API. All examples assume a Next.js frontend with the project's existing setup.

---

## tRPC Client Setup

The project uses `@trpc/react-query` + `@tanstack/react-query`. The client is configured in `lib/trpc.ts`.

```typescript
// lib/trpc.ts (existing pattern)
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/server/root";

export const trpc = createTRPCReact<AppRouter>();
```

---

## Authentication Examples

### Check current session

```typescript
// In a React component
const { data: me, isLoading } = trpc.auth.me.useQuery();

if (isLoading) return <Spinner />;
if (!me) return <LoginPage />;

console.log(me.userId, me.role, me.tenantId);
```

### Login via REST

```typescript
async function login(email: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();

  if (data.mfaRequired) {
    // Redirect to MFA page, store tempToken
    sessionStorage.setItem("mfaTempToken", data.tempToken);
    router.push("/auth/mfa");
    return;
  }

  if (data.success) {
    // Session cookie is set automatically
    router.push("/dashboard");
  }
}
```

### Complete MFA

```typescript
async function completeMfa(code: string) {
  const tempToken = sessionStorage.getItem("mfaTempToken");
  const res = await fetch("/api/auth/mfa", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tempToken, method: "totp", code }),
  });
  const data = await res.json();
  if (data.success) router.push("/dashboard");
}
```

---

## Employee Examples

### List employees with filters

```typescript
const { data: employees } = trpc.employee.list.useQuery({
  department: "Engineering",
  status: "ACTIVE",
});
```

### Create an employee

```typescript
const createEmployee = trpc.employee.create.useMutation();

await createEmployee.mutateAsync({
  name: "Ahmad bin Abdullah",
  email: "ahmad@company.com",
  department: "Engineering",
  position: "Software Engineer",
  nationality: "Malaysian",
  hireDate: new Date("2026-08-01"),
  isForeign: false,
});
```

### Get employee profile (ESS)

```typescript
const { data: profile } = trpc.employee.getProfile.useQuery({ id: employeeId });

console.log(profile?.name, profile?.position, profile?.employmentStatus);
```

---

## Leave Management Examples

### Check leave balance

```typescript
const { data: balances } = trpc.leave.balance.useQuery({
  employeeId: "emp_abc",
  year: 2026,
});

const annualBalance = balances?.find(b => b.leaveType === "ANNUAL");
console.log(`Available: ${annualBalance?.entitlement} days`);
```

### Submit a leave request

```typescript
const requestLeave = trpc.leave.request.useMutation();

try {
  const application = await requestLeave.mutateAsync({
    employeeId: "emp_abc",
    leaveType: "ANNUAL",
    startDate: new Date("2026-08-10"),
    endDate: new Date("2026-08-14"),
    reason: "Family vacation",
  });
  console.log("Applied:", application.id, "Status:", application.status);
} catch (err) {
  // TRPCClientError with zodError or custom message
  console.error(err.message); // e.g. "Insufficient leave balance. Available: 2.0 days, Requested: 5.0 days"
}
```

### Approve a leave request

```typescript
const approveLeave = trpc.leave.approve.useMutation();

await approveLeave.mutateAsync({
  leaveId: "leave_xyz",
  comment: "Approved by HR Manager",
});
```

### Calendar view

```typescript
const { data: calendar } = trpc.leave.getCalendar.useQuery({
  from: new Date("2026-08-01"),
  to: new Date("2026-08-31"),
});

// Returns all PENDING and APPROVED leaves in the date range
calendar?.forEach(app => {
  console.log(`${app.employee_id}: ${app.start_date} → ${app.end_date}`);
});
```

---

## Attendance Examples

### Clock in (with GPS)

```typescript
const clockIn = trpc.attendance.clockIn.useMutation();

navigator.geolocation.getCurrentPosition(async (pos) => {
  const result = await clockIn.mutateAsync({
    employeeId: "emp_abc",
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude,
    method: "GPS",
  });

  if (result.geofenceViolation) {
    alert("Warning: You are outside the designated work area.");
  }
  console.log("Clocked in at:", result.checkIn);
});
```

### Clock out

```typescript
const clockOut = trpc.attendance.clockOut.useMutation();

const result = await clockOut.mutateAsync({ employeeId: "emp_abc" });
console.log(`Hours worked: ${result.hoursWorked}, Overtime: ${result.overtime}`);
```

### Daily summary

```typescript
const { data: summary } = trpc.attendance.getDailySummary.useQuery({
  date: new Date(),
});

console.log(`Present: ${summary?.present}/${summary?.total}, Absent: ${summary?.absent}`);
```

---

## Payroll Examples

### Create and process payroll

```typescript
const createPayroll = trpc.payroll.create.useMutation();
const processPayroll = trpc.payroll.process.useMutation();

// Step 1: Create
const payroll = await createPayroll.mutateAsync({
  employeeId: "emp_abc",
  periodStart: new Date("2026-08-01"),
  periodEnd: new Date("2026-08-31"),
  basicSalary: 5000,
  allowances: 500,
  deductions: 200,
});

// Step 2: Process
await processPayroll.mutateAsync({ id: payroll.id });
```

### Get payslip

```typescript
const { data: payslip } = trpc.payroll.payslip.useQuery({ id: "pay_abc" });
// Returns payslip details for PDF generation
```

---

## Workflow Engine Examples

### Define and trigger a workflow

```typescript
const saveDefinition = trpc.workflowEngine.saveDefinition.useMutation();
const triggerWorkflow = trpc.workflowEngine.triggerWorkflow.useMutation();

// Step 1: Define a leave approval workflow
const definition = await saveDefinition.mutateAsync({
  name: "Leave Approval",
  module: "leave",
  graphJson: {
    nodes: [
      { id: "start", type: "start", data: { label: "Start" }, position: { x: 0, y: 0 } },
      { id: "mgr_approve", type: "approval", data: { label: "Manager Approval", assigneeRole: "Manager", slaMinutes: 2880 }, position: { x: 200, y: 0 } },
      { id: "hr_approve", type: "approval", data: { label: "HR Approval", assigneeRole: "HR_Manager", slaMinutes: 1440 }, position: { x: 400, y: 0 } },
      { id: "end", type: "end", data: { label: "End" }, position: { x: 600, y: 0 } },
    ],
    edges: [
      { id: "e1", source: "start", target: "mgr_approve" },
      { id: "e2", source: "mgr_approve", target: "hr_approve", label: "approved" },
      { id: "e3", source: "hr_approve", target: "end", label: "approved" },
    ],
  },
  isActive: true,
});

// Step 2: Trigger for a leave application
const instance = await triggerWorkflow.mutateAsync({
  definitionId: definition.id,
  entityType: "LeaveApplication",
  entityId: "leave_xyz",
  context: { employeeId: "emp_abc", days: 3 },
});
```

### Submit approval decision

```typescript
const submitDecision = trpc.workflowEngine.submitDecision.useMutation();

await submitDecision.mutateAsync({
  instanceId: instance.id,
  stepId: "mgr_approve",
  decision: "APPROVED",
  comment: "Approved, enjoy your time off.",
});
```

---

## Security Administration Examples

### Update user role

```typescript
const updateRole = trpc.security.updateRole.useMutation();

await updateRole.mutateAsync({
  userId: "usr_abc",
  role: "HR_Manager",
});
// All existing sessions for this user are immediately invalidated
```

### Change password

```typescript
const changePassword = trpc.security.changePassword.useMutation();

await changePassword.mutateAsync({
  currentPassword: "oldpass123",
  newPassword: "newSecurePass456!",
});
```

---

## Audit Trail Examples

### Query audit log with filters

```typescript
const { data: auditLog } = trpc.auditTrail.list.useQuery({
  module: "payroll",
  action: "UPDATE",
  from: new Date("2026-08-01"),
  to: new Date("2026-08-31"),
  take: 50,
  skip: 0,
});

console.log(`Total: ${auditLog?.total}`);
auditLog?.records.forEach(entry => {
  console.log(`${entry.action} ${entry.entityType} by ${entry.actorId} at ${entry.createdAt}`);
});
```

---

## REST API Examples

### Upload a document

```typescript
async function uploadDocument(employeeId: string, tenantId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("documentType", "WORK_PERMIT");
  formData.append("expiryDate", "2027-12-31");

  const res = await fetch("/api/documents/upload", {
    method: "POST",
    headers: {
      "X-Employee-ID": employeeId,
      "X-Tenant-ID": tenantId,
    },
    body: formData,
  });

  const { document } = await res.json();
  return document;
}
```

### Stream AI chat response

```typescript
async function* streamAIChat(message: string, sessionId: string) {
  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sessionId, persona: "orchestrator" }),
  });

  if (!res.body) throw new Error("No response body");
  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    yield decoder.decode(value);
  }
}

// Usage
for await (const chunk of streamAIChat("What is EPF rate?", "sess_123")) {
  appendToChat(chunk);
}
```

### Check health

```typescript
async function checkApiHealth() {
  const res = await fetch("/api/health");
  const { status, db } = await res.json();
  return { healthy: status === "ok", dbConnected: db === "connected" };
}
```

### Fetch SIEM audit events

```typescript
async function fetchSiemEvents(tenantId: string, since?: Date) {
  const params = new URLSearchParams({ tenantId, format: "json" });
  if (since) params.set("since", since.toISOString());

  const res = await fetch(`/api/siem?${params}`, {
    headers: { "x-api-key": process.env.SIEM_API_KEY! },
  });
  const { events, count } = await res.json();
  return { events, count };
}
```

---

## Error Handling

### tRPC error handling

```typescript
import { TRPCClientError } from "@trpc/client";

try {
  await trpc.leave.request.mutate({ ... });
} catch (err) {
  if (err instanceof TRPCClientError) {
    if (err.data?.zodError) {
      // Validation error — show field errors
      const fieldErrors = err.data.zodError.fieldErrors;
      Object.entries(fieldErrors).forEach(([field, msgs]) => {
        console.error(`${field}: ${msgs?.join(", ")}`);
      });
    } else {
      // Business logic error
      console.error(err.message);  // "Insufficient leave balance. Available: 2.0 days..."
    }
    
    switch (err.data?.httpStatus) {
      case 401: router.push("/login"); break;
      case 403: showPermissionDeniedToast(); break;
      case 404: showNotFoundToast(); break;
      default: showGenericErrorToast(err.message);
    }
  }
}
```

### React Query integration

```typescript
const mutation = trpc.employee.create.useMutation({
  onSuccess: (data) => {
    queryClient.invalidateQueries(trpc.employee.list.queryKey());
    toast.success(`Employee ${data.name} created`);
  },
  onError: (err) => {
    toast.error(err.message);
  },
});
```

---

## TypeScript Types

The tRPC router exports inferred types automatically:

```typescript
import type { AppRouter } from "@/server/root";
import type { inferRouterOutputs, inferRouterInputs } from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>;
type RouterInput  = inferRouterInputs<AppRouter>;

// Use these for typed props
type Employee     = RouterOutput["employee"]["byId"];
type LeaveRequest = RouterOutput["leave"]["request"];
type PayrollItem  = RouterOutput["payroll"]["list"][number];
```
