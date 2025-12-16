import { Module } from '@nestjs/common';

// Database
import { DatabaseModule } from '../../database/database.module';

// Controllers
import { ComplianceController } from './compliance.controller';

// Services
import { ComplianceService } from './compliance.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ComplianceController],
  providers: [ComplianceService],
  exports: [ComplianceService],
})
export class ComplianceModule {}
