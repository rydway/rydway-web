import { Injectable, BadRequestException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export class GetSignedUrlDto {
  @ApiProperty({ example: 'vehicle-images' })
  @IsString() @IsNotEmpty() bucket: string;

  @ApiProperty({ example: 'vehicle-photos/car-front.jpg' })
  @IsString() @IsNotEmpty() filePath: string;

  @ApiProperty({ example: 'image/jpeg' })
  @IsString() @IsNotEmpty() mimeType: string;

  @ApiProperty({ required: false, example: 1048576 })
  @IsOptional() fileSizeBytes?: number;
}

@Injectable()
export class UploadsService {
  private supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  async getSignedUploadUrl(dto: GetSignedUrlDto) {
    if (!ALLOWED_MIME_TYPES.includes(dto.mimeType)) {
      throw new BadRequestException(`File type not allowed: ${dto.mimeType}`);
    }

    if (dto.fileSizeBytes && dto.fileSizeBytes > MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException('File exceeds maximum allowed size of 10MB');
    }

    const { data, error } = await this.supabase.storage
      .from(dto.bucket)
      .createSignedUploadUrl(dto.filePath);

    if (error) throw new BadRequestException(`Could not generate signed URL: ${error.message}`);

    return {
      signedUrl: data.signedUrl,
      token: data.token,
      path: data.path,
      fullPath: `${process.env.SUPABASE_URL}/storage/v1/object/public/${dto.bucket}/${dto.filePath}`,
    };
  }

  async deleteFile(bucket: string, filePath: string) {
    const { error } = await this.supabase.storage.from(bucket).remove([filePath]);
    if (error) throw new BadRequestException(`Could not delete file: ${error.message}`);
    return true;
  }

  getPublicUrl(bucket: string, filePath: string) {
    const { data } = this.supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  }
}
