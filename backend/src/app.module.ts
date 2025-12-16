import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';

// Database
import { DatabaseModule } from './database/database.module';

// Feature Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { LeaveModule } from './modules/leave/leave.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { PayrollModule } from './modules/payroll/payroll.module';
import { ComplianceModule } from './modules/compliance/compliance.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { RolesModule } from './modules/roles/roles.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { PagesModule } from './modules/pages/pages.module';

// Common Module
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    DatabaseModule,

    // Security
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),

    // Scheduling
    ScheduleModule.forRoot(),

    // Feature Modules
    CommonModule,
    AuthModule,
    UsersModule,
    RolesModule,
    DepartmentsModule,
    TenantsModule,
    EmployeesModule,
    LeaveModule,
    AttendanceModule,
    PayrollModule,
    ComplianceModule,
    AnalyticsModule,
    PagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

