import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import {
  CreateVehicleReviewDto,
  CreateHostReviewDto,
  CreateRenterReviewDto,
} from './dto/reviews.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Role } from '@prisma/client';

@ApiTags('Reviews')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // ─── Renter Actions ────────────────────────────────────────────────────────

  @Post('vehicle')
  @Roles(Role.renter)
  @ApiOperation({ summary: 'Renter reviews a vehicle after a completed booking' })
  async reviewVehicle(@CurrentUser() user: any, @Body() dto: CreateVehicleReviewDto) {
    const data = await this.reviewsService.createVehicleReview(user.id, dto);
    return { message: 'Vehicle reviewed successfully', data };
  }

  @Post('host')
  @Roles(Role.renter)
  @ApiOperation({ summary: 'Renter reviews a host after a completed booking' })
  async reviewHost(@CurrentUser() user: any, @Body() dto: CreateHostReviewDto) {
    const data = await this.reviewsService.createHostReview(user.id, dto);
    return { message: 'Host reviewed successfully', data };
  }

  // ─── Host Actions ──────────────────────────────────────────────────────────

  @Post('renter')
  @Roles(Role.host)
  @ApiOperation({ summary: 'Host reviews a renter after a completed booking' })
  async reviewRenter(@CurrentUser() user: any, @Body() dto: CreateRenterReviewDto) {
    const data = await this.reviewsService.createRenterReview(user.id, dto);
    return { message: 'Renter reviewed successfully', data };
  }

  // ─── My Reviews (Received) ─────────────────────────────────────────────────

  @Get('me')
  @ApiOperation({ summary: 'Get reviews received by the current user' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getMyReviews(
    @CurrentUser() user: any,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const data = await this.reviewsService.getMyReceivedReviews(user.id, parseInt(page), parseInt(limit));
    return { message: 'Reviews fetched successfully', data };
  }

  // ─── Public Queries ────────────────────────────────────────────────────────

  @Public()
  @Get('vehicles/:vehicleId')
  @ApiOperation({ summary: 'Get all reviews for a vehicle (public)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getVehicleReviews(
    @Param('vehicleId') vehicleId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const data = await this.reviewsService.getVehicleReviews(vehicleId, parseInt(page), parseInt(limit));
    return { message: 'Vehicle reviews fetched successfully', data };
  }

  @Public()
  @Get('hosts/:hostUserId')
  @ApiOperation({ summary: 'Get all reviews for a host (public)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getHostReviews(
    @Param('hostUserId') hostUserId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const data = await this.reviewsService.getHostReviews(hostUserId, parseInt(page), parseInt(limit));
    return { message: 'Host reviews fetched successfully', data };
  }
}
