import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { HostVehiclesController } from './host-vehicles.controller';
import { AdminVehiclesController } from './admin-vehicles.controller';
import { HostProfileController } from './host-profile.controller';

@Module({
  providers: [VehiclesService],
  controllers: [VehiclesController, HostVehiclesController, AdminVehiclesController, HostProfileController],
  exports: [VehiclesService],
})
export class VehiclesModule {}
