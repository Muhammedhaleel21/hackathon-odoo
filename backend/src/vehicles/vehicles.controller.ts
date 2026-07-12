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
import { CreateVehicleSchema, CreateVehicleDto } from './dto/create-vehicle.dto';
import {
  UpdateVehicleSchema,
  UpdateVehicleDto,
  AssignDriverSchema,
  AssignDriverDto,
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


  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.vehiclesService.remove(id);
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
