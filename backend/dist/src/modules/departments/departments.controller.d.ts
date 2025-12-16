import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
export declare class DepartmentsController {
    private readonly departmentsService;
    constructor(departmentsService: DepartmentsService);
    create(createDepartmentDto: CreateDepartmentDto): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<any>;
    remove(id: string): Promise<any>;
    findEmployeesByDepartment(id: string): Promise<any>;
    findManager(id: string): Promise<any>;
}
