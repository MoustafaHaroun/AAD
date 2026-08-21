import { v4 } from 'uuid';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '@/infrastructure/persistence/typeorm/repositories';
import {
  AddAvatarToUserRequest,
  AddAvatarToUserResponse,
} from '@/application/dto';
import { MinioClient } from '@/infrastructure/persistence/minio';

@Injectable()
export class AddAvatarToUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly minio: MinioClient,
  ) {}

  async execute(
    dto: AddAvatarToUserRequest & { userId: string; requesterId?: string },
  ): Promise<AddAvatarToUserResponse> {
    const user = await this.userRepository.findById(dto.userId);

    if (user == null) {
      throw new NotFoundException(
        `User with id '${dto.userId}' does not exist.`,
      );
    }

    if (dto.requesterId && dto.requesterId !== dto.userId) {
      throw new ForbiddenException('You can only update your own avatar.');
    }

    const minioClient = this.minio.getClient();
    const minioBucketName = this.minio.getBucketName();
    const fileName = `avatars/${dto.userId}/${v4()}-${dto.binary.originalname}`;

    await minioClient.putObject(minioBucketName, fileName, dto.binary.buffer);

    user.avatar = this.minio.toEndpoint(fileName);

    return {
      user: (await this.userRepository.update(user)).toDomain(),
    };
  }
}
