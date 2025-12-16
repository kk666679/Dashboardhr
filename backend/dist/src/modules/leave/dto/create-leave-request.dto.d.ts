export declare class CreateLeaveRequestDto {
    employeeId: string;
    leaveTypeId: string;
    startDate: string;
    endDate: string;
    daysRequested?: number;
    reason?: string;
    approverId?: string;
}
