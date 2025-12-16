"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const throttler_1 = require("@nestjs/throttler");
const database_module_1 = require("./database/database.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const employees_module_1 = require("./modules/employees/employees.module");
const leave_module_1 = require("./modules/leave/leave.module");
const attendance_module_1 = require("./modules/attendance/attendance.module");
const payroll_module_1 = require("./modules/payroll/payroll.module");
const compliance_module_1 = require("./modules/compliance/compliance.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
const roles_module_1 = require("./modules/roles/roles.module");
const departments_module_1 = require("./modules/departments/departments.module");
const tenants_module_1 = require("./modules/tenants/tenants.module");
const pages_module_1 = require("./modules/pages/pages.module");
const common_module_1 = require("./common/common.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            database_module_1.DatabaseModule,
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            schedule_1.ScheduleModule.forRoot(),
            common_module_1.CommonModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            roles_module_1.RolesModule,
            departments_module_1.DepartmentsModule,
            tenants_module_1.TenantsModule,
            employees_module_1.EmployeesModule,
            leave_module_1.LeaveModule,
            attendance_module_1.AttendanceModule,
            payroll_module_1.PayrollModule,
            compliance_module_1.ComplianceModule,
            analytics_module_1.AnalyticsModule,
            pages_module_1.PagesModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map