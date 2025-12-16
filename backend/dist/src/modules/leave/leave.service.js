"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let LeaveService = class LeaveService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.leaveRequest.create({ data });
    }
    async findAll() {
        return this.prisma.leaveRequest.findMany();
    }
    async findOne(id) {
        return this.prisma.leaveRequest.findUnique({ where: { id } });
    }
    async update(id, data) {
        return this.prisma.leaveRequest.update({ where: { id }, data });
    }
    async remove(id) {
        return this.prisma.leaveRequest.delete({ where: { id } });
    }
    async approve(id) {
        return this.prisma.leaveRequest.update({
            where: { id },
            data: { status: 'APPROVED' },
        });
    }
    async reject(id) {
        return this.prisma.leaveRequest.update({
            where: { id },
            data: { status: 'REJECTED' },
        });
    }
};
exports.LeaveService = LeaveService;
exports.LeaveService = LeaveService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeaveService);
//# sourceMappingURL=leave.service.js.map