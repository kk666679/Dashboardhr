import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';

// Guards
import { RolesGuard } from '../../common/guards/roles.guard';

// Services (placeholder)
class AiAgentsService {
  getAgent(agentType: string) {
    return { message: `Agent ${agentType} retrieved` };
  }

  interactWithAgent(agentType: string, message: string) {
    return { message: `Interacted with ${agentType} agent`, response: `Response to: ${message}` };
  }
}

@Controller('ai-agents')
@UseGuards(RolesGuard)
export class AiAgentsController {
  private aiAgentsService = new AiAgentsService();

  @Get(':agentType')
  getAgent(@Param('agentType') agentType: string) {
    return this.aiAgentsService.getAgent(agentType);
  }

  @Post(':agentType/interact')
  interactWithAgent(@Param('agentType') agentType: string, @Body() body: { message: string }) {
    return this.aiAgentsService.interactWithAgent(agentType, body.message);
  }
}
