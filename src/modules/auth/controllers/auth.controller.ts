import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body('token') token: string) {
    const data = await this.authService.login(token);
    console.log({data});
    return {
      data,
    };
  }
}
