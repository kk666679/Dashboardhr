import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';

// Guards
import { RolesGuard } from '../../common/guards/roles.guard';

// Services
import { TenantsService } from './tenants.service';

// DTOs
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Controller('tenants')
@UseGuards(RolesGuard)
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantsService.create(createTenantDto);
  }

  @Get()
  findAll() {
    return this.tenantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tenantsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto) {
    return this.tenantsService.update(id, updateTenantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tenantsService.remove(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.tenantsService.findBySlug(slug);
  }

  @Post(':id/activate')
  activate(@Param('id') id: string) {
    return this.tenantsService.activate(id);
  }

  @Post(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.tenantsService.deactivate(id);
  }
}
