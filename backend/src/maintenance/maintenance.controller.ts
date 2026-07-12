import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  ParseUUIDPipe,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../validation/zod.validation.pipe';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceSchema } from './dto/create-maintenance.dto';
import type { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceSchema } from './dto/update-maintenance.dto';
import type { UpdateMaintenanceDto } from './dto/update-maintenance.dto';

@UseGuards(JwtAuthGuard)
@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(CreateMaintenanceSchema))
  create(@Body() dto: CreateMaintenanceDto) {
    return this.maintenanceService.create(dto);
  }

  @Get()
  findAll() {
    return this.maintenanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.maintenanceService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(UpdateMaintenanceSchema))
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateMaintenanceDto) {
    return this.maintenanceService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.maintenanceService.remove(id);
  }

  @Post(':id/complete')
  complete(@Param('id', ParseUUIDPipe) id: string) {
    return this.maintenanceService.complete(id);
  }

  @Post(':id/cancel')
  cancel(@Param('id', ParseUUIDPipe) id: string) {
    return this.maintenanceService.cancel(id);
  }
}