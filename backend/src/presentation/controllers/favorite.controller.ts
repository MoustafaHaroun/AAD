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
  CreateFavoriteRequest,
  CreateFavoriteResponse,
} from '@/application/dto/favorites/create-favorite.dto';
import { GetFavoritesByUserIdResponse } from '@/application/dto/favorites/get-favorites-by-user-id.dto';
import { CreateFavoriteUseCase } from '@/application/usecases/favorites/create/create-favorite.usecase';
import { GetFavoritesByUserIdUseCase } from '@/application/usecases/favorites/get/get-favorites-by-user-id.usecase';
import { DeleteFavoriteUseCase } from '@/application/usecases/favorites/delete/delete-favorite.usecase';
import * as authGuard from '@/presentation/guards/auth.guard';

@Controller('favorites')
export class FavoriteController {
  constructor(
    private readonly createFavoriteUseCase: CreateFavoriteUseCase,
    private readonly getFavoritesByUserIdUseCase: GetFavoritesByUserIdUseCase,
    private readonly deleteFavoriteUseCase: DeleteFavoriteUseCase,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  @UseGuards(authGuard.AuthGuard)
  @ApiBearerAuth()
  getFavorites(
    @Req() request: authGuard.AuthenticatedRequest,
  ): Promise<GetFavoritesByUserIdResponse> {
    const userId = request.user.sub;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.getFavoritesByUserIdUseCase.execute({ userId });
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @UseGuards(authGuard.AuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: CreateFavoriteRequest })
  createFavorite(
    @Req() request: authGuard.AuthenticatedRequest,
    @Body() dto: CreateFavoriteRequest,
  ): Promise<CreateFavoriteResponse> {
    const userId = request.user.sub;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.createFavoriteUseCase.execute({ ...dto, userId });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @UseGuards(authGuard.AuthGuard)
  @ApiBearerAuth()
  deleteFavorite(@Param('id') id: string): Promise<void> {
    return this.deleteFavoriteUseCase.execute({ id });
  }
}
