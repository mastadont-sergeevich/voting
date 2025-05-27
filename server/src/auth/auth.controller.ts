import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async auth(@Body() data: { email: string; password: string }) {
    return this.authService.auth(data.email, data.password);
  }
}