import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { CostsModule } from '../costs/costs.module';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceService } from './maintenance.service';

@Module({
  imports: [DatabaseModule, CostsModule],
  controllers: [MaintenanceController],
  providers: [MaintenanceService],
  exports: [MaintenanceService],
})
export class MaintenanceModule {}