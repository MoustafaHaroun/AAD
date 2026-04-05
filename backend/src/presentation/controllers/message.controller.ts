import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import {
  CreateMessageRequest,
  CreateMessageResponse,
} from '@/application/dto/messages/create-message.dto';
import { GetMessageByIdResponse } from '@/application/dto/messages/get-message-by-id.dto';
import { GetMessagesByUserIdResponse } from '@/application/dto/messages/get-messages-by-user-id.dto';
import { CreateMessageUseCase } from '@/application/usecases/messages/create/create-message.usecase';
import { GetMessageByIdUseCase } from '@/application/usecases/messages/get/get-message-by-id.usecase';
import { GetMessagesByUserIdUseCase } from '@/application/usecases/messages/get/get-messages-by-user-id.usecase';
import { DeleteMessageUseCase } from '@/application/usecases/messages/delete/delete-message.usecase';
import * as authGuard from '@/presentation/guards/auth.guard';

@Controller('messages')
export class MessageController {
  constructor(
    private readonly createMessageUseCase: CreateMessageUseCase,
    private readonly getMessageByIdUseCase: GetMessageByIdUseCase,
    private readonly getMessagesByUserIdUseCase: GetMessagesByUserIdUseCase,
    private readonly deleteMessageUseCase: DeleteMessageUseCase,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  @UseGuards(authGuard.AuthGuard)
  @ApiBearerAuth()
  getMessages(
    @Req() request: authGuard.AuthenticatedRequest,
  ): Promise<GetMessagesByUserIdResponse> {
    const userId = request.user.sub;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.getMessagesByUserIdUseCase.execute({ userId });
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @UseGuards(authGuard.AuthGuard)
  @ApiBearerAuth()
  getMessage(@Param('id') id: string): Promise<GetMessageByIdResponse> {
    return this.getMessageByIdUseCase.execute({ id });
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @UseGuards(authGuard.AuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: CreateMessageRequest })
  createMessage(
    @Req() request: authGuard.AuthenticatedRequest,
    @Body() dto: CreateMessageRequest,
  ): Promise<CreateMessageResponse> {
    const senderId = request.user.sub;

    if (!senderId) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.createMessageUseCase.execute({ ...dto, senderId });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @UseGuards(authGuard.AuthGuard)
  @ApiBearerAuth()
  deleteMessage(@Param('id') id: string): Promise<void> {
    return this.deleteMessageUseCase.execute({ id });
  }
}
