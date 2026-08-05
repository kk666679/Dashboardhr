export enum NotificationType {
  LEAVE_REQUEST = "LEAVE_REQUEST",
  DOCUMENT_REVIEW = "DOCUMENT_REVIEW",
  PAYSLIP_AVAILABLE = "PAYSLIP_AVAILABLE",
  VISA_EXPIRING = "VISA_EXPIRING",
  COMPLIANCE_ALERT = "COMPLIANCE_ALERT",
  WORKFLOW_UPDATE = "WORKFLOW_UPDATE",
  INFO = "INFO",
}

export interface Notification {
  id: string;
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  icon?: string;
  read: boolean;
  readAt?: Date;
  createdAt: Date;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
}

export interface NotificationPreference {
  userId: string;
  type: NotificationType;
  email: boolean;
  sms: boolean;
  inApp: boolean;
  pushNotification: boolean;
}

// Notification creation helpers
export async function createNotification(data: {
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
}): Promise<Notification> {
  const priorityMap: Record<
    NotificationType,
    "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  > = {
    [NotificationType.VISA_EXPIRING]: "URGENT",
    [NotificationType.COMPLIANCE_ALERT]: "HIGH",
    [NotificationType.PAYSLIP_AVAILABLE]: "MEDIUM",
    [NotificationType.LEAVE_REQUEST]: "MEDIUM",
    [NotificationType.DOCUMENT_REVIEW]: "MEDIUM",
    [NotificationType.WORKFLOW_UPDATE]: "LOW",
    [NotificationType.INFO]: "LOW",
  };

  return {
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    recipientId: data.recipientId,
    type: data.type,
    title: data.title,
    message: data.message,
    link: data.link,
    read: false,
    createdAt: new Date(),
    priority: data.priority || priorityMap[data.type] || "MEDIUM",
  };
}

// Notification fetching
export async function getNotifications(
  userId: string,
  filters?: {
    unreadOnly?: boolean;
    type?: NotificationType;
    limit?: number;
    offset?: number;
  },
): Promise<Notification[]> {
  // This will be connected to database in next phase
  return [];
}

export async function markAsRead(notificationId: string): Promise<void> {
  // Update database
}

export async function markAllAsRead(userId: string): Promise<void> {
  // Update database
}

export async function deleteNotification(
  notificationId: string,
): Promise<void> {
  // Delete from database
}

// Bulk notification creation (for compliance alerts, expirations, etc.)
export async function notifyExpiryAlerts(
  tenantId: string,
  expiringItems: Array<{
    recipientId: string;
    itemType: string;
    itemName: string;
    daysUntilExpiry: number;
  }>,
): Promise<Notification[]> {
  return Promise.all(
    expiringItems.map((item) =>
      createNotification({
        recipientId: item.recipientId,
        type:
          item.itemType === "VISA"
            ? NotificationType.VISA_EXPIRING
            : NotificationType.COMPLIANCE_ALERT,
        title: `${item.itemType} Expiring Soon`,
        message: `${item.itemName} expires in ${item.daysUntilExpiry} days`,
        priority:
          item.daysUntilExpiry <= 7
            ? "URGENT"
            : item.daysUntilExpiry <= 30
              ? "HIGH"
              : "MEDIUM",
      }),
    ),
  );
}

export async function notifyPayslipAvailable(
  tenantId: string,
  employeeIds: string[],
  payrollPeriod: string,
): Promise<Notification[]> {
  return Promise.all(
    employeeIds.map((employeeId) =>
      createNotification({
        recipientId: employeeId,
        type: NotificationType.PAYSLIP_AVAILABLE,
        title: "Payslip Available",
        message: `Your payslip for ${payrollPeriod} is now available`,
        link: `/ess/payslips/${payrollPeriod}`,
      }),
    ),
  );
}

export async function notifyLeaveRequest(
  managerId: string,
  employeeName: string,
  leaveType: string,
  days: number,
  link: string,
): Promise<Notification> {
  return createNotification({
    recipientId: managerId,
    type: NotificationType.LEAVE_REQUEST,
    title: "New Leave Request",
    message: `${employeeName} has requested ${days} days of ${leaveType} leave`,
    link,
    priority: "MEDIUM",
  });
}
