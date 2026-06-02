import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({ example: 'uuid-conversation-id' })
  @IsUUID()
  @IsNotEmpty()
  conversationId: string;

  @ApiProperty({ example: 'Hi, is the car available from June 1st?' })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty({ required: false, example: 'https://storage.supabase.co/attachments/file.pdf' })
  @IsOptional()
  @IsString()
  attachmentUrl?: string;
}

export class CreateConversationDto {
  @ApiProperty({ example: 'uuid-booking-id', required: false })
  @IsOptional()
  @IsUUID()
  bookingId?: string;

  @ApiProperty({ example: 'uuid-vehicle-id' })
  @IsUUID()
  @IsNotEmpty()
  vehicleId: string;

  @ApiProperty({ example: 'uuid-host-user-id' })
  @IsUUID()
  @IsNotEmpty()
  hostUserId: string;

  @ApiProperty({ example: 'Is the car available next weekend?' })
  @IsString()
  @IsNotEmpty()
  initialMessage: string;
}
