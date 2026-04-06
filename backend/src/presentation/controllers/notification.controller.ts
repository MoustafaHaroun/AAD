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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import {
  createNotificationApi,
  createNotificationSchema,
  type CreateNotificationRequest,
  CreateNotificationResponse,
} from '@/application/dto/notifications/create-notification.dto';
import { GetNotificationByIdResponse } from '@/application/dto/notifications/get-notification-by-id.dto';
import { CreateNotificationUseCase } from '@/application/usecases/notifications/create/create-notification.usecase';
import { DeleteNotificationUseCase } from '@/application/usecases/notifications/delete/delete-notification.usecase';
import { GetNotificationByIdUseCase } from '@/application/usecases/notifications/get/get-notification-by-id.usecase';
import * as authGuard from '@/presentation/guards/auth.guard';
import { RolesGuard } from '@/presentation/guards/roles.guard';
import { Roles } from '@/presentation/decorators/roles.decorator';
import { Role } from '@/domain/enums/role.enum';
import { ZodValidationPipe } from '@/infrastructure/validation/zod.pipe';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly getNotificationByIdUseCase: GetNotificationByIdUseCase,
    private readonly deleteNotificationUseCase: DeleteNotificationUseCase,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @UseGuards(authGuard.AuthGuard)
  @ApiBearerAuth()
  getNotification(
    @Req() request: authGuard.AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<GetNotificationByIdResponse> {
    const requesterId = authGuard.getRequesterId(request);

    return this.getNotificationByIdUseCase.execute({ id, requesterId });
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(authGuard.AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiBody(createNotificationApi)
  createNotification(
    @Body(new ZodValidationPipe(createNotificationSchema))
    dto: CreateNotificationRequest,
  ): Promise<CreateNotificationResponse> {
    return this.createNotificationUseCase.execute(dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @UseGuards(authGuard.AuthGuard)
  @ApiBearerAuth()
  deleteNotification(
    @Req() request: authGuard.AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<void> {
    const requesterId = authGuard.getRequesterId(request);

    return this.deleteNotificationUseCase.execute({ id, requesterId });
  }
}
