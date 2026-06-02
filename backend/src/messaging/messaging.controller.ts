import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MessagingService } from './messaging.service';
import { CreateConversationDto, SendMessageDto } from './dto/messaging.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PolicyGuard } from '../common/guards/policy.guard';
import { RequireActiveStatus } from '../common/policies/policies.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Messaging')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PolicyGuard)
@RequireActiveStatus()
@Controller('conversations')
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new conversation or resume existing one' })
  async createConversation(@CurrentUser() user: any, @Body() dto: CreateConversationDto) {
    const data = await this.messagingService.createConversation(user.id, dto);
    return {
      message: 'Conversation ready',
      data,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all conversations for current user' })
  async getConversations(@CurrentUser() user: any) {
    const data = await this.messagingService.getConversations(user.id);
    return {
      message: 'Conversations fetched successfully',
      data,
    };
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'Get messages in a conversation' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getMessages(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Query('page') page = '1',
    @Query('limit') limit = '30',
  ) {
    const data = await this.messagingService.getMessages(user.id, id, parseInt(page), parseInt(limit));
    return {
      message: 'Messages fetched successfully',
      data,
    };
  }

  @Post('messages')
  @ApiOperation({ summary: 'Send a message via REST (fallback for WebSocket)' })
  async sendMessage(@CurrentUser() user: any, @Body() dto: SendMessageDto) {
    const data = await this.messagingService.sendMessage(user.id, dto);
    return {
      message: 'Message sent successfully',
      data,
    };
  }

  @Post(':id/read')
  @ApiOperation({ summary: 'Mark all messages in a conversation as read' })
  async markAsRead(@CurrentUser() user: any, @Param('id') id: string) {
    await this.messagingService.markAsRead(user.id, id);
    return {
      message: 'Messages marked as read',
      data: null,
    };
  }
}
