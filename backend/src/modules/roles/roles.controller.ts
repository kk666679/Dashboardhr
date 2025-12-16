import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';

// Guards
import { RolesGuard } from '../../common/guards/roles.guard';

// Services
import { RolesService } from './roles.service';

// DTOs
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
@UseGuards(RolesGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }

  @Get('users/:role')
  getUsersByRole(@Param('role') role: string) {
    return this.rolesService.getUsersByRole(role);
  }
}
