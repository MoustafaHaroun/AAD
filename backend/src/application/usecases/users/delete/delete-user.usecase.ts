import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { UserRepository } from '@/infrastructure/persistence/typeorm/repositories';
import { DeleteUserRequest, DeleteUserResponse } from '@/application/dto';
import { AttachmentModel } from '@/infrastructure/persistence/typeorm/models/attachment.model';
import { FavoriteModel } from '@/infrastructure/persistence/typeorm/models/favorite.model';
import { ListingModel } from '@/infrastructure/persistence/typeorm/models/listing.model';
import { MessageModel } from '@/infrastructure/persistence/typeorm/models/message.model';
import { NotificationModel } from '@/infrastructure/persistence/typeorm/models/notification.model';
import { UserModel } from '@/infrastructure/persistence/typeorm/models/user.model';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(
    dto: DeleteUserRequest & { id: string },
  ): Promise<DeleteUserResponse> {
    const user = await this.userRepository.findById(dto.id);

    if (user == null) {
      throw new NotFoundException(`User with id '${dto.id}' does not exist.`);
    }

    await this.dataSource.transaction(async (manager) => {
      const listings = await manager.find(ListingModel, {
        where: { user: { id: dto.id } },
        select: ['id'],
      });

      const listingIds = listings.map((l) => l.id);

      if (listingIds.length > 0) {
        await manager.delete(AttachmentModel, {
          listing: { id: In(listingIds) },
        });
        await manager.delete(FavoriteModel, {
          listing: { id: In(listingIds) },
        });
      }

      await manager.delete(FavoriteModel, { user: { id: dto.id } });
      await manager.delete(MessageModel, { sender: { id: dto.id } });
      await manager.delete(MessageModel, { recipient: { id: dto.id } });
      await manager.delete(NotificationModel, { user: { id: dto.id } });
      await manager.delete(ListingModel, { user: { id: dto.id } });
      await manager.delete(UserModel, { id: dto.id });
    });
  }
}
