import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
export declare class TenantsController {
    private readonly tenantsService;
    constructor(tenantsService: TenantsService);
    create(createTenantDto: CreateTenantDto): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateTenantDto: UpdateTenantDto): Promise<any>;
    remove(id: string): Promise<any>;
    findBySlug(slug: string): Promise<any>;
    activate(id: string): Promise<any>;
    deactivate(id: string): Promise<any>;
}
