import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.tenant.create({ data });
  }

  async findAll() {
    return this.prisma.tenant.findMany();
  }

  async findOne(id: string) {
    return this.prisma.tenant.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    return this.prisma.tenant.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.tenant.delete({ where: { id } });
  }

  async findBySlug(slug: string) {
    return this.prisma.tenant.findUnique({ where: { slug } });
  }

  async activate(id: string) {
    return this.prisma.tenant.update({
      where: { id },
      data: { isActive: true },
    });
  }

  async deactivate(id: string) {
    return this.prisma.tenant.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
