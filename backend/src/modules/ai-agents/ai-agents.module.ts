import { Module } from '@nestjs/common';
import { AiAgentsService } from './ai-agents.service';
import { AiAgentsController } from './ai-agents.controller';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AiAgentsController],
  providers: [AiAgentsService],
  exports: [AiAgentsService],
})
export class AiAgentsModule {}
