import { PrismaService } from '../../database/prisma.service';
export declare class LeaveService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, data: any): Promise<any>;
    remove(id: string): Promise<any>;
    approve(id: string): Promise<any>;
    reject(id: string): Promise<any>;
}
