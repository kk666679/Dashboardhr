import { Module } from '@nestjs/common';

// Database
import { DatabaseModule } from '../../database/database.module';

// Controllers
import { DepartmentsController } from './departments.controller';

// Services
import { DepartmentsService } from './departments.service';

@Module({
  imports: [DatabaseModule],
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
  exports: [DepartmentsService],
})
export class DepartmentsModule {}
