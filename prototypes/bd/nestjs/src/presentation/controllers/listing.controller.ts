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
  CreateListingRequest,
  CreateListingResponse,
  DeleteListingResponse,
  GetListingByIdResponse,
  GetListingsByUserResponse,
  UpdateListingRequest,
  UpdateListingResponse,
} from '@/application/dto';
import {
  AddAttachmentToListingUseCase,
  CreateListingUseCase,
  DeleteListingUseCase,
  GetListingByIdUseCase,
  GetListingsByUserUseCase,
  UpdateListingUseCase,
} from '@/application/usecases/';
import * as authGuard from '@/presentation/guards/auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('listings')
export class ListingController {
  constructor(
    private readonly createListingUseCase: CreateListingUseCase,
    private readonly addAttachmentToListingUseCase: AddAttachmentToListingUseCase,
    private readonly getListingsByUserUseCase: GetListingsByUserUseCase,
    private readonly getListingByIdUseCase: GetListingByIdUseCase,
    private readonly updateListingUseCase: UpdateListingUseCase,
    private readonly deleteListingUseCase: DeleteListingUseCase,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiBearerAuth()
  @UseGuards(authGuard.AuthGuard)
  getListings(
    @Req() request: authGuard.AuthenticatedRequest,
  ): Promise<GetListingsByUserResponse> {
    const userId = request.user.sub;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.getListingsByUserUseCase.execute({ userId });
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(authGuard.AuthGuard)
  getListing(@Param('id') id: string): Promise<GetListingByIdResponse> {
    return this.getListingByIdUseCase.execute({ id });
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: CreateListingRequest })
  @UseGuards(authGuard.AuthGuard)
  createListing(
    @Req() request: authGuard.AuthenticatedRequest,
    @Body() dto: CreateListingRequest,
  ): Promise<CreateListingResponse> {
    const userId = request.user.sub;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.createListingUseCase.execute({ ...dto, userId });
  }

  @HttpCode(HttpStatus.CREATED)
  @Post(':id/attachments')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        binaries: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @UseGuards(authGuard.AuthGuard)
  @UseInterceptors(FilesInterceptor('binaries', 10))
  async uploadAttachment(
    @Param('id') listingId: string,
    @UploadedFiles() binaries: Express.Multer.File[],
  ) {
    const results = await Promise.all(
      binaries.map((binary) =>
        this.addAttachmentToListingUseCase.execute({ binary, listingId }),
      ),
    );

    return {
      attachments: results.map((obj) => obj.attachment),
    };
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiBody({ type: UpdateListingRequest })
  @UseGuards(authGuard.AuthGuard)
  updateListing(
    @Param('id') id: string,
    @Body() dto: UpdateListingRequest,
  ): Promise<UpdateListingResponse> {
    return this.updateListingUseCase.execute({ ...dto, id });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(authGuard.AuthGuard)
  deleteListing(@Param('id') id: string): Promise<DeleteListingResponse> {
    return this.deleteListingUseCase.execute({ id });
  }
}
