import { Controller, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UploadsService, GetSignedUrlDto } from './uploads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class DeleteFileDto {
  @ApiProperty({ example: 'vehicle-images' })
  @IsString() @IsNotEmpty() bucket: string;

  @ApiProperty({ example: 'vehicle-photos/car-front.jpg' })
  @IsString() @IsNotEmpty() filePath: string;
}

@ApiTags('Uploads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('sign-url')
  @ApiOperation({
    summary: 'Get a signed upload URL from Supabase Storage',
    description: 'Returns a signed URL the client uses to upload directly to Supabase Storage. Never exposes storage credentials.',
  })
  async getSignedUrl(@Body() dto: GetSignedUrlDto) {
    const data = await this.uploadsService.getSignedUploadUrl(dto);
    return { message: 'Signed URL generated successfully', data };
  }

  @Delete()
  @ApiOperation({ summary: 'Delete a file from Supabase Storage' })
  async deleteFile(@Body() dto: DeleteFileDto) {
    await this.uploadsService.deleteFile(dto.bucket, dto.filePath);
    return { message: 'File deleted successfully', data: null };
  }
}
