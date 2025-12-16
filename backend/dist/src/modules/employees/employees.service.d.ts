import { PrismaService } from '../../database/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
export declare class EmployeesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createEmployeeDto: CreateEmployeeDto): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<any>;
    remove(id: string): Promise<any>;
}
