import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';

// Guards
import { RolesGuard } from '../../common/guards/roles.guard';

// Services
import { LeaveService } from './leave.service';

// DTOs
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { UpdateLeaveRequestDto } from './dto/update-leave-request.dto';

@Controller('leave')
@UseGuards(RolesGuard)
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  // Leave Requests
  @Post('requests')
  createLeaveRequest(@Body() createLeaveRequestDto: CreateLeaveRequestDto) {
    return this.leaveService.createLeaveRequest(createLeaveRequestDto);
  }

  @Get('requests')
  findAllLeaveRequests() {
    return this.leaveService.findAllLeaveRequests();
  }

  @Get('requests/:id')
  findLeaveRequest(@Param('id') id: string) {
    return this.leaveService.findLeaveRequest(id);
  }

  @Patch('requests/:id')
  updateLeaveRequest(@Param('id') id: string, @Body() updateLeaveRequestDto: UpdateLeaveRequestDto) {
    return this.leaveService.updateLeaveRequest(id, updateLeaveRequestDto);
  }

  @Delete('requests/:id')
  deleteLeaveRequest(@Param('id') id: string) {
    return this.leaveService.deleteLeaveRequest(id);
  }

  // Leave Types
  @Get('types')
  findAllLeaveTypes() {
    return this.leaveService.findAllLeaveTypes();
  }

  @Post('types')
  createLeaveType(@Body() data: any) {
    return this.leaveService.createLeaveType(data);
  }

  // Leave Balances
  @Get('balances/:employeeId')
  findLeaveBalances(@Param('employeeId') employeeId: string) {
    return this.leaveService.findLeaveBalances(employeeId);
  }
}
