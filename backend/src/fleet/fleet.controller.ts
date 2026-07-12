import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	ParseUUIDPipe,
	UsePipes,
} from '@nestjs/common';
import { FleetService } from './fleet.service';
import { CreateVehicleSchema } from './dto/create-vehicle.dto';
import { UpdateVehicleSchema } from './dto/update-vehicle.dto';
import type { CreateVehicleDto } from './dto/create-vehicle.dto';
import type { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { ZodValidationPipe } from '../validation/zod.validation.pipe';

@Controller('fleet')
export class FleetController {
	constructor(private readonly fleetService: FleetService) {}

	@Post('vehicles')
	@HttpCode(HttpStatus.CREATED)
	@UsePipes(new ZodValidationPipe(CreateVehicleSchema))
	create(@Body() dto: CreateVehicleDto) {
		return this.fleetService.create(dto);
	}

	@Get('vehicles')
	findAll() {
		return this.fleetService.findAll();
	}

	@Get('vehicles/:id')
	findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.fleetService.findOne(id);
	}

	@Patch('vehicles/:id')
	@UsePipes(new ZodValidationPipe(UpdateVehicleSchema))
	update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateVehicleDto) {
		return this.fleetService.update(id, dto);
	}

	@Delete('vehicles/:id')
	@HttpCode(HttpStatus.NO_CONTENT)
	remove(@Param('id', ParseUUIDPipe) id: string) {
		return this.fleetService.remove(id);
	}
}