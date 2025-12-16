import { PrismaService } from '../../database/prisma.service';
export declare class TenantsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, data: any): Promise<any>;
    remove(id: string): Promise<any>;
    findBySlug(slug: string): Promise<any>;
    activate(id: string): Promise<any>;
    deactivate(id: string): Promise<any>;
}
