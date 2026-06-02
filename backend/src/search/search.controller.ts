import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchVehiclesDto } from './dto/search.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Public()
  @Get('vehicles')
  @ApiOperation({ summary: 'Search for vehicles' })
  async searchVehicles(@Query() query: SearchVehiclesDto) {
    const { items, meta } = await this.searchService.searchVehicles(query);
    return {
      success: true, // the TransformInterceptor also checks this format or we just let it wrap
      message: 'Vehicles fetched successfully',
      data: {
        items,
        ...meta,
      },
    };
  }

  @Public()
  @Get('filters')
  @ApiOperation({ summary: 'Get available search filters' })
  async getFilters() {
    const data = await this.searchService.getFilters();
    return {
      message: 'Filters fetched successfully',
      data,
    };
  }

  @Public()
  @Get('hosts')
  @ApiOperation({ summary: 'Search for hosts/businesses' })
  async searchHosts(@Query('query') query?: string) {
    const data = await this.searchService.searchHosts(query || '');
    return {
      message: 'Hosts fetched successfully',
      data,
    };
  }

  @Public()
  @Get('autocomplete')
  @ApiOperation({ summary: 'Search autocomplete suggestions' })
  async autocomplete(@Query('query') query?: string) {
    const data = await this.searchService.autocomplete(query || '');
    return {
      message: 'Suggestions fetched successfully',
      data,
    };
  }
}

