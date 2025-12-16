import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
export declare class TenantsController {
    private readonly tenantsService;
    constructor(tenantsService: TenantsService);
    create(createTenantDto: CreateTenantDto): any;
    findAll(): any;
    findOne(id: string): any;
    update(id: string, updateTenantDto: UpdateTenantDto): any;
    remove(id: string): any;
    findBySlug(slug: string): any;
    activate(id: string): any;
    deactivate(id: string): any;
}
