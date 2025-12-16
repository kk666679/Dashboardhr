import { Module } from '@nestjs/common';

// Database
import { DatabaseModule } from '../../database/database.module';

// Controllers
import { LeaveController } from './leave.controller';

// Services
import { LeaveService } from './leave.service';

@Module({
  imports: [DatabaseModule],
  controllers: [LeaveController],
  providers: [LeaveService],
  exports: [LeaveService],
})
export class LeaveModule {}
