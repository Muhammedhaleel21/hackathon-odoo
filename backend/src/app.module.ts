import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './db/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { FleetModule } from './fleet/fleet.module';
import { DriversModule } from './drivers/drivers.module';

@Module({
  imports: [DatabaseModule, AuthModule, UsersModule, VehiclesModule, FleetModule, DriversModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
