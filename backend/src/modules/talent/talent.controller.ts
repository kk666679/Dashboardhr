import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';

// Guards
import { RolesGuard } from '../../common/guards/roles.guard';

// Services
import { TalentService } from './talent.service';

// DTOs (placeholders)
interface CreateJobPostingDto {
  title: string;
  description: string;
  requirements: string[];
}

interface UpdateJobPostingDto {
  title?: string;
  description?: string;
  requirements?: string[];
}

interface CreateCandidateDto {
  name: string;
  email: string;
  resume: string;
}

@Controller('talent')
@UseGuards(RolesGuard)
export class TalentController {
  constructor(private readonly talentService: TalentService) {}

  @Post('job-postings')
  createJobPosting(@Body() createJobPostingDto: CreateJobPostingDto) {
    return this.talentService.createJobPosting(createJobPostingDto);
  }

  @Get('job-postings')
  findAllJobPostings() {
    return this.talentService.findAllJobPostings();
  }

  @Get('job-postings/:id')
  findJobPosting(@Param('id') id: string) {
    return this.talentService.findJobPosting(id);
  }

  @Patch('job-postings/:id')
  updateJobPosting(@Param('id') id: string, @Body() updateJobPostingDto: UpdateJobPostingDto) {
    return this.talentService.updateJobPosting(id, updateJobPostingDto);
  }

  @Delete('job-postings/:id')
  deleteJobPosting(@Param('id') id: string) {
    return this.talentService.deleteJobPosting(id);
  }

  @Post('candidates')
  createCandidate(@Body() createCandidateDto: CreateCandidateDto) {
    return this.talentService.createCandidate(createCandidateDto);
  }

  @Get('candidates')
  findAllCandidates() {
    return this.talentService.findAllCandidates();
  }

  @Get('candidates/:id')
  findCandidate(@Param('id') id: string) {
    return this.talentService.findCandidate(id);
  }
}
