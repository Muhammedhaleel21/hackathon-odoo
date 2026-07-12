import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ValidateBody } from '../validation/zod.validation.decorator';
import { CreateUserSchema } from './dto/create-user.dto';
import type { CreateUserDto } from './dto/create-user.dto';
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ValidateBody(CreateUserSchema)
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

}
