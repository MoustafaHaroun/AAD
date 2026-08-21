import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '@/infrastructure/persistence/typeorm/repositories';
import { MinioClient } from '@/infrastructure/persistence/minio';

@Injectable()
export class RemoveAvatarFromUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly minio: MinioClient,
  ) {}

  async execute(dto: { userId: string; requesterId?: string }): Promise<void> {
    const user = await this.userRepository.findById(dto.userId);

    if (user == null) {
      throw new NotFoundException(
        `User with id '${dto.userId}' does not exist.`,
      );
    }

    if (dto.requesterId && dto.requesterId !== dto.userId) {
      throw new ForbiddenException('You can only update your own avatar.');
    }

    if (user.avatar != null) {
      const minioClient = this.minio.getClient();
      const minioBucketName = this.minio.getBucketName();
      const objectName = this.minio.toObjectName(user.avatar);

      if (objectName != null) {
        await minioClient.removeObject(minioBucketName, objectName);
      }
    }

    user.avatar = null;

    await this.userRepository.update(user);
  }
}
