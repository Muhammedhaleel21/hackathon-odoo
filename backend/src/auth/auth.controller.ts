import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginSchema } from './dto/login.schema';
import type { LoginInput } from './dto/login.schema';
import { ValidateBody } from 'src/validation/zod.validation.decorator';
import { AuthService } from './auth.service';


@Controller()
export class AuthController {

  constructor(private authService: AuthService) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ValidateBody(LoginSchema)
  login(@Body() loginData: LoginInput) {
    return this.authService.login(loginData);
  }
/*
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ValidateBody(ForgotPasswordSchema)
  forgotPassword(@Body() forgotPasswordData: ForgotPasswordInput) {
    return this.authService.forgotPassword(forgotPasswordData);
  }
*/
/*
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
  }
*/

}