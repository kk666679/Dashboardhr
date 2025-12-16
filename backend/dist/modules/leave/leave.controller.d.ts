import { LeaveService } from './leave.service';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { UpdateLeaveRequestDto } from './dto/update-leave-request.dto';
export declare class LeaveController {
    private readonly leaveService;
    constructor(leaveService: LeaveService);
    createLeaveRequest(createLeaveRequestDto: CreateLeaveRequestDto): any;
    findAllLeaveRequests(): any;
    findLeaveRequest(id: string): any;
    updateLeaveRequest(id: string, updateLeaveRequestDto: UpdateLeaveRequestDto): any;
    deleteLeaveRequest(id: string): any;
    findAllLeaveTypes(): any;
    createLeaveType(data: any): any;
    findLeaveBalances(employeeId: string): any;
}
