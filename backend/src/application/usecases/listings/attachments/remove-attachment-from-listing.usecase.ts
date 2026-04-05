import { Injectable, NotFoundException } from '@nestjs/common';
import { AttachmentRepository } from '@/infrastructure/persistence/typeorm/repositories';
import { MinioClient } from '@/infrastructure/persistence/minio';
import {
  RemoveAttachmentFromListingRequest,
  RemoveAttachmentFromListingResponse,
} from '@/application/dto';

@Injectable()
export class RemoveAttachmentFromListingUseCase {
  constructor(
    private readonly attachmentRepository: AttachmentRepository,
    private readonly minio: MinioClient,
  ) {}

  async execute(
    dto: RemoveAttachmentFromListingRequest & {
      attachmentId: string;
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

    const minioClient = this.minio.getClient();
    const minioBucketName = this.minio.getBucketName();
    const objectName = this.minio.toObjectName(attachment.path);

    if (objectName != null) {
      await minioClient.removeObject(minioBucketName, objectName);
    }

    await this.attachmentRepository.delete(dto.attachmentId);
  }
}
