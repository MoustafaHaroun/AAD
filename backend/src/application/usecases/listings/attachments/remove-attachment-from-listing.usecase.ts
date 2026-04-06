import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AttachmentRepository,
  ListingRepository,
} from '@/infrastructure/persistence/typeorm/repositories';
import { MinioClient } from '@/infrastructure/persistence/minio';
import {
  RemoveAttachmentFromListingRequest,
  RemoveAttachmentFromListingResponse,
} from '@/application/dto';

@Injectable()
export class RemoveAttachmentFromListingUseCase {
  constructor(
    private readonly attachmentRepository: AttachmentRepository,
    private readonly listingRepository: ListingRepository,
    private readonly minio: MinioClient,
  ) {}

  async execute(
    dto: RemoveAttachmentFromListingRequest & {
      attachmentId: string;
      listingId: string;
      requesterId?: string;
    },
  ): Promise<RemoveAttachmentFromListingResponse> {
    const attachment = await this.attachmentRepository.findById(
      dto.attachmentId,
    );

    if (attachment == null) {
      throw new NotFoundException(
        `Attachment with id '${dto.attachmentId}' does not exist.`,
      );
    }

    if (dto.requesterId) {
      const listing = await this.listingRepository.findById(dto.listingId);

      if (listing == null) {
        throw new NotFoundException(
          `Listing with id '${dto.listingId}' does not exist.`,
        );
      }

      if (listing.user.id !== dto.requesterId) {
        throw new ForbiddenException(
          'You do not have permission to remove attachments from this listing.',
        );
      }
    }

    const minioClient = this.minio.getClient();
    const minioBucketName = this.minio.getBucketName();
    const objectName = this.minio.toObjectName(attachment.path);

    if (objectName != null) {
      await minioClient.removeObject(minioBucketName, objectName);
    }

    await this.attachmentRepository.delete(dto.attachmentId);
  }
}
