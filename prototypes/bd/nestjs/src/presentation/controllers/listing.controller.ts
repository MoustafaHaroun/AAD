import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import {
  CreateListingRequest,
  CreateListingResponse,
} from '@/application/dto';
import {
  AddAttachmentToListingUseCase,
  CreateListingUseCase,
} from '@/application/usecases/';
import { AuthGuard } from '@/presentation/guards/auth.guard';
import type { Request } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('listings')
export class ListingController {
  constructor(
    private readonly createListingUseCase: CreateListingUseCase,
    private readonly addAttachmentToListingUseCase: AddAttachmentToListingUseCase,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: CreateListingRequest })
  @UseGuards(AuthGuard)
  createListing(
    @Req() request: Request,
    @Body() dto: CreateListingRequest,
  ): Promise<CreateListingResponse> {
    // @ts-ignore User will exist if AuthGuard is used.
    const userId = request.user.sub;

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
  @UseGuards(AuthGuard)
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
      attachments: results.map(obj => obj.attachment),
    };
  }
}
