import { Module } from '@nestjs/common';

// Database
import { DatabaseModule } from '../../database/database.module';

// Controllers
import { AttendanceController } from './attendance.controller';

// Services
import { AttendanceService } from './attendance.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
