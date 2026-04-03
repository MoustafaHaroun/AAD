import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import {
  CreateNotificationRequest,
  CreateNotificationResponse,
} from '@/application/dto/notifications/create-notification.dto';
import { GetNotificationByIdResponse } from '@/application/dto/notifications/get-notification-by-id.dto';
import {
  UpdateNotificationRequest,
  UpdateNotificationResponse,
} from '@/application/dto/notifications/update-notification.dto';
import { CreateNotificationUseCase } from '@/application/usecases/notifications/create-notification.usecase';
import { DeleteNotificationUseCase } from '@/application/usecases/notifications/delete-notification.usecase';
import { GetNotificationByIdUseCase } from '@/application/usecases/notifications/get-notification-by-id.usecase';
import { UpdateNotificationUseCase } from '@/application/usecases/notifications/update-notification.usecase';
import { AuthGuard } from '@/presentation/guards/auth.guard';
import { RolesGuard } from '@/presentation/guards/roles.guard';
import { Roles } from '@/presentation/decorators/roles.decorator';
import { Role } from '@/domain/enums/role.enum';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly getNotificationByIdUseCase: GetNotificationByIdUseCase,
    private readonly updateNotificationUseCase: UpdateNotificationUseCase,
    private readonly deleteNotificationUseCase: DeleteNotificationUseCase,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  getNotification(
    @Param('id') id: string,
  ): Promise<GetNotificationByIdResponse> {
    return this.getNotificationByIdUseCase.execute({ id });
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: CreateNotificationRequest })
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  createNotification(
    @Body() dto: CreateNotificationRequest,
  ): Promise<CreateNotificationResponse> {
    return this.createNotificationUseCase.execute(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiBody({ type: UpdateNotificationRequest })
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  updateNotification(
    @Param('id') id: string,
    @Body() dto: UpdateNotificationRequest,
  ): Promise<UpdateNotificationResponse> {
    return this.updateNotificationUseCase.execute({ ...dto, id });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  deleteNotification(@Param('id') id: string): Promise<void> {
    return this.deleteNotificationUseCase.execute({ id });
  }
}
