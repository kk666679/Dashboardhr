import { Module } from '@nestjs/common';

// Database
import { DatabaseModule } from '../../database/database.module';

// Controllers
import { EmployeesController } from './employees.controller';

// Services
import { EmployeesService } from './employees.service';

@Module({
  imports: [DatabaseModule],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
