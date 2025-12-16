import { Module } from '@nestjs/common';

// Database
import { DatabaseModule } from '../../database/database.module';

// Controllers
import { UsersController } from './users.controller';

// Services
import { UsersService } from './users.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
