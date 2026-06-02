import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Host Storefront')
@Controller('host/profile')
export class HostProfileController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Public()
  @Get(':hostId')
  @ApiOperation({ summary: 'Get public storefront for a host' })
  async getHostStorefront(@Param('hostId') hostId: string) {
    const data = await this.vehiclesService.getHostStorefront(hostId);
    return {
      message: 'Host storefront profile fetched successfully',
      data,
    };
  }
}
