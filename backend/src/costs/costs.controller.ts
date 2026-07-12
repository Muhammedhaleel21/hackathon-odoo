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
import { CostsService } from './costs.service';
import { CreateFuelLogSchema } from './dto/create-fuel-log.dto';
import type { CreateFuelLogDto } from './dto/create-fuel-log.dto';
import { UpdateFuelLogSchema } from './dto/update-fuel-log.dto';
import type { UpdateFuelLogDto } from './dto/update-fuel-log.dto';
import { CreateExpenseSchema } from './dto/create-expense.dto';
import type { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseSchema } from './dto/update-expense.dto';
import type { UpdateExpenseDto } from './dto/update-expense.dto';

@UseGuards(JwtAuthGuard)
@Controller()
export class CostsController {
  constructor(private readonly costsService: CostsService) {}

  @Post('fuel-logs')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(CreateFuelLogSchema))
  createFuelLog(@Body() dto: CreateFuelLogDto) {
    return this.costsService.createFuelLog(dto);
  }

  @Get('fuel-logs')
  findAllFuelLogs() {
    return this.costsService.findAllFuelLogs();
  }

  @Get('fuel-logs/:id')
  findFuelLog(@Param('id', ParseUUIDPipe) id: string) {
    return this.costsService.findFuelLog(id);
  }

  @Patch('fuel-logs/:id')
  @UsePipes(new ZodValidationPipe(UpdateFuelLogSchema))
  updateFuelLog(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateFuelLogDto) {
    return this.costsService.updateFuelLog(id, dto);
  }

  @Delete('fuel-logs/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeFuelLog(@Param('id', ParseUUIDPipe) id: string) {
    return this.costsService.removeFuelLog(id);
  }

  @Post('expenses')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(CreateExpenseSchema))
  createExpense(@Body() dto: CreateExpenseDto) {
    return this.costsService.createExpense(dto);
  }

  @Get('expenses')
  findAllExpenses() {
    return this.costsService.findAllExpenses();
  }

  @Get('expenses/:id')
  findExpense(@Param('id', ParseUUIDPipe) id: string) {
    return this.costsService.findExpense(id);
  }

  @Patch('expenses/:id')
  @UsePipes(new ZodValidationPipe(UpdateExpenseSchema))
  updateExpense(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateExpenseDto) {
    return this.costsService.updateExpense(id, dto);
  }

  @Delete('expenses/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeExpense(@Param('id', ParseUUIDPipe) id: string) {
    return this.costsService.removeExpense(id);
  }

  @Get('vehicles/:id/costs/summary')
  costSummary(@Param('id', ParseUUIDPipe) id: string) {
    return this.costsService.getVehicleCostSummary(id);
  }
}