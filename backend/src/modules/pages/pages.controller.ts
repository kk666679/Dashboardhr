import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PagesService } from './pages.service';

@ApiTags('Pages')
@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all frontend pages for syncing' })
  @ApiResponse({ status: 200, description: 'List of frontend pages' })
  getPages() {
    return this.pagesService.getPages();
  }
}
