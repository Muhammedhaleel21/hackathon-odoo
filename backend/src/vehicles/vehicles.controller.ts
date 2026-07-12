import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
  UsePipes,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateVehicleSchema, type CreateVehicleDto } from './dto/create-vehicle.dto';
import {
  UpdateVehicleSchema,
  type UpdateVehicleDto,
  AssignDriverSchema,
  type AssignDriverDto,
} from './dto/update-vehicle.dto';
import { z } from 'zod';
import { ZodValidationPipe } from 'src/validation/zod.validation.pipe';

const UpdateStatusSchema = z.object({
  status: z.enum(['available', 'on_trip', 'on_maintenance']),
});

@UseGuards(JwtAuthGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  findAll() {
    return this.vehiclesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.vehiclesService.findOne(id);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(CreateVehicleSchema))
  create(@Body() dto: CreateVehicleDto) {
    return this.vehiclesService.create(dto);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(UpdateVehicleSchema))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateVehicleDto,
  ) {
    return this.vehiclesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.vehiclesService.remove(id);
  }

  @Patch(':id/assign-driver')
  @UsePipes(new ZodValidationPipe(AssignDriverSchema))
  assignDriver(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignDriverDto,
  ) {
    return this.vehiclesService.assignDriver(id, dto);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { status: 'available' | 'on_trip' | 'on_maintenance' },
  ) {
    const parsed = UpdateStatusSchema.parse(body);
    return this.vehiclesService.updateStatus(id, parsed.status);
  }
}
