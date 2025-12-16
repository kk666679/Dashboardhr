import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';

// Guards
import { RolesGuard } from '../../common/guards/roles.guard';

// Services
import { LearningService } from './learning.service';

// DTOs
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('learning')
@UseGuards(RolesGuard)
export class LearningController {
  constructor(private readonly learningService: LearningService) {}

  @Post('courses')
  createCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.learningService.createCourse(createCourseDto);
  }

  @Get('courses')
  findAllCourses() {
    return this.learningService.findAllCourses();
  }

  @Get('courses/:id')
  findCourse(@Param('id') id: string) {
    return this.learningService.findCourse(id);
  }

  @Patch('courses/:id')
  updateCourse(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.learningService.updateCourse(id, updateCourseDto);
  }

  @Delete('courses/:id')
  deleteCourse(@Param('id') id: string) {
    return this.learningService.deleteCourse(id);
  }

  @Post('enroll/:employeeId/:courseId')
  enrollEmployee(@Param('employeeId') employeeId: string, @Param('courseId') courseId: string) {
    return this.learningService.enrollEmployee(employeeId, courseId);
  }

  @Get('progress/:employeeId')
  getEmployeeProgress(@Param('employeeId') employeeId: string) {
    return this.learningService.getEmployeeProgress(employeeId);
  }
}
