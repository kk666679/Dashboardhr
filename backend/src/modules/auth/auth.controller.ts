import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';

// Guards
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';

// Services
import { AuthService } from './auth.service';

// DTOs
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() body: { email: string; password: string; role?: string }) {
    return this.authService.register(body.email, body.password, body.role);
  }
}
