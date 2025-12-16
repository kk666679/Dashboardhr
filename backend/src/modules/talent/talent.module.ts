import { Module } from '@nestjs/common';
import { TalentService } from './talent.service';
import { TalentController } from './talent.controller';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TalentController],
  providers: [TalentService],
  exports: [TalentService],
})
export class TalentModule {}
