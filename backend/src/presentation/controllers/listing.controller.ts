import { z } from 'zod';
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
  Req,
  UnauthorizedException,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import {
  addAttachmentToListingApi,
  createListingApi,
  type CreateListingRequest,
  type CreateListingResponse,
  createListingSchema,
  type DeleteListingResponse,
  type GetListingByIdResponse,
  type GetListingsByUserIdResponse,
  updateListingApi,
  type UpdateListingRequest,
  type UpdateListingResponse,
  updateListingSchema,
} from '@/application/dto';
import {
  AddAttachmentToListingUseCase,
  CreateListingUseCase,
  DeleteListingUseCase,
  GetListingByIdUseCase,
  GetListingsByUserIdUseCase,
  UpdateListingUseCase,
} from '@/application/usecases/';
import * as authGuard from '@/presentation/guards/auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ZodValidationPipe } from '@/infrastructure/validation/zod.pipe';
import { RemoveAttachmentFromListingUseCase } from '@/application/usecases/listings/attachments/remove-attachment-from-listing.usecase';
import { imageSchema } from '@/application/schemas/image.schema';
import { Role } from '@/domain/enums/role.enum';

@Controller('listings')
export class ListingController {
  constructor(
    private readonly createListingUseCase: CreateListingUseCase,
    private readonly addAttachmentToListingUseCase: AddAttachmentToListingUseCase,
    private readonly removeAttachmentFromListingUseCase: RemoveAttachmentFromListingUseCase,
    private readonly getListingsByUserIdUseCase: GetListingsByUserIdUseCase,
    private readonly getListingByIdUseCase: GetListingByIdUseCase,
    private readonly updateListingUseCase: UpdateListingUseCase,
    private readonly deleteListingUseCase: DeleteListingUseCase,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  @UseGuards(authGuard.AuthGuard)
  @ApiBearerAuth()
  getListings(
    @Req() request: authGuard.AuthenticatedRequest,
  ): Promise<GetListingsByUserIdResponse> {
    const userId = request.user.sub;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.getListingsByUserIdUseCase.execute({ userId });
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @UseGuards(authGuard.AuthGuard)
  @ApiBearerAuth()
  getListing(@Param('id') id: string): Promise<GetListingByIdResponse> {
    return this.getListingByIdUseCase.execute({ id });
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @UseGuards(authGuard.AuthGuard)
  @ApiBearerAuth()
  @ApiBody(createListingApi)
  createListing(
    @Req() request: authGuard.AuthenticatedRequest,
    @Body(new ZodValidationPipe(createListingSchema)) dto: CreateListingRequest,
  ): Promise<CreateListingResponse> {
    const userId = request.user.sub;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.createListingUseCase.execute({ ...dto, userId });
  }

  @HttpCode(HttpStatus.CREATED)
  @Post(':id/attachments')
  @UseGuards(authGuard.AuthGuard)
  @UseInterceptors(FilesInterceptor('binaries', 10))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody(addAttachmentToListingApi)
  async uploadAttachment(
    @Req() request: authGuard.AuthenticatedRequest,
    @Param('id') listingId: string,
    @UploadedFiles(new ZodValidationPipe(z.array(imageSchema)))
    binaries: Express.Multer.File[],
  ) {
    const requesterId =
      request.user.role === Role.ADMIN ? undefined : request.user.sub;

    const results = await Promise.all(
      binaries.map((binary) =>
        this.addAttachmentToListingUseCase.execute({ binary, listingId, requesterId }),
      ),
    );

    return {
      attachments: results.map((obj) => obj.attachment),
    };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id/attachments/:attachmentId')
  @UseGuards(authGuard.AuthGuard)
  @ApiBearerAuth()
  removeAttachment(
    @Req() request: authGuard.AuthenticatedRequest,
    @Param('id') listingId: string,
    @Param('attachmentId') attachmentId: string,
  ) {
    const requesterId =
      request.user.role === Role.ADMIN ? undefined : request.user.sub;

    return this.removeAttachmentFromListingUseCase.execute({
      attachmentId,
      listingId,
      requesterId,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @UseGuards(authGuard.AuthGuard)
  @ApiBearerAuth()
  @ApiBody(updateListingApi)
  updateListing(
    @Req() request: authGuard.AuthenticatedRequest,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateListingSchema)) dto: UpdateListingRequest,
  ): Promise<UpdateListingResponse> {
    const requesterId =
      request.user.role === Role.ADMIN ? undefined : request.user.sub;

    return this.updateListingUseCase.execute({ ...dto, id, requesterId });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @UseGuards(authGuard.AuthGuard)
  @ApiBearerAuth()
  deleteListing(
    @Req() request: authGuard.AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<DeleteListingResponse> {
    const requesterId =
      request.user.role === Role.ADMIN ? undefined : request.user.sub;

    return this.deleteListingUseCase.execute({ id, requesterId });
  }
}
