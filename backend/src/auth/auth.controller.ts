import {
  Controller,
  Post,
  Body,
  UsePipes,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterSchema, type RegisterDto } from './dto/register.dto';
import { LoginSchema, type LoginDto } from './dto/login.dto';
import { ValidateBody } from '../validation/zod.validation.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ValidateBody(RegisterSchema)
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ValidateBody(LoginSchema)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
