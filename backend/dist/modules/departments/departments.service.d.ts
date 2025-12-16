import { PrismaService } from '../../database/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
export declare class DepartmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDepartmentDto: CreateDepartmentDto): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<any>;
    remove(id: string): Promise<any>;
}
