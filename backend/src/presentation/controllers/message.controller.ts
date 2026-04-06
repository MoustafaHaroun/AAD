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
  createMessageApi,
  createMessageSchema,
  type CreateMessageRequest,
  CreateMessageResponse,
} from '@/application/dto/messages/create-message.dto';
import { GetMessageByIdResponse } from '@/application/dto/messages/get-message-by-id.dto';
import { GetMessagesByUserIdResponse } from '@/application/dto/messages/get-messages-by-user-id.dto';
import { CreateMessageUseCase } from '@/application/usecases/messages/create/create-message.usecase';
import { GetMessageByIdUseCase } from '@/application/usecases/messages/get/get-message-by-id.usecase';
import { GetMessagesByUserIdUseCase } from '@/application/usecases/messages/get/get-messages-by-user-id.usecase';
import { DeleteMessageUseCase } from '@/application/usecases/messages/delete/delete-message.usecase';
import * as authGuard from '@/presentation/guards/auth.guard';
import { getRequesterId } from '@/presentation/guards/auth.guard';
import { ZodValidationPipe } from '@/infrastructure/validation/zod.pipe';

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
  getMessage(
    @Req() request: authGuard.AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<GetMessageByIdResponse> {
    const requesterId = getRequesterId(request);

    return this.getMessageByIdUseCase.execute({ id, requesterId });
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @UseGuards(authGuard.AuthGuard)
  @ApiBearerAuth()
  @ApiBody(createMessageApi)
  createMessage(
    @Req() request: authGuard.AuthenticatedRequest,
    @Body(new ZodValidationPipe(createMessageSchema)) dto: CreateMessageRequest,
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
  deleteMessage(
    @Req() request: authGuard.AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<void> {
    const requesterId = getRequesterId(request);

    return this.deleteMessageUseCase.execute({ id, requesterId });
  }
}
