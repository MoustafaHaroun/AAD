import { v4 } from 'uuid';
import { AttachmentModel } from '@/infrastructure/persistence/typeorm/models';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AttachmentRepository,
  ListingRepository,
} from '@/infrastructure/persistence/typeorm/repositories';
import {
  AddAttachmentToListingRequest,
  AddAttachmentToListingResponse,
} from '@/application/dto';
import { MinioClient } from '@/infrastructure/persistence/minio';

@Injectable()
export class AddAttachmentToListingUseCase {
  constructor(
    private readonly listingRepository: ListingRepository,
    private readonly attachmentRepository: AttachmentRepository,
    private readonly minio: MinioClient,
  ) {}

  async execute(
    dto: AddAttachmentToListingRequest & {
      listingId: string;
      requesterId?: string;
    },
  ): Promise<AddAttachmentToListingResponse> {
    const listing = await this.listingRepository.findById(dto.listingId);

    if (listing == null) {
      throw new NotFoundException(
        `Listing with id '${dto.listingId}' does not exist.`,
      );
    }

    if (dto.requesterId && listing.user.id !== dto.requesterId) {
      throw new ForbiddenException(
        'You do not have permission to add attachments to this listing.',
      );
    }

    const minioClient = this.minio.getClient();
    const minioBucketName = this.minio.getBucketName();
    const fileName = `${dto.listingId}/${v4()}-${dto.binary.originalname}`;

    await minioClient.putObject(minioBucketName, fileName, dto.binary.buffer);

    const attachment = new AttachmentModel();

    attachment.id = v4();
    attachment.path = this.minio.toEndpoint(fileName);
    attachment.listing = listing;

    const created = await this.attachmentRepository.create(attachment);

    return {
      attachment: created.toDomain(),
    };
  }
}
