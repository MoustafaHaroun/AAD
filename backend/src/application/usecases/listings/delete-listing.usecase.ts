import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ListingRepository } from '@/infrastructure/persistence/typeorm/repositories';
import {
  DeleteListingRequest,
  DeleteListingResponse,
} from '@/application/dto/delete-listing.dto';
import { AttachmentModel } from '@/infrastructure/persistence/typeorm/models/attachment.model';
import { FavoriteModel } from '@/infrastructure/persistence/typeorm/models/favorite.model';
import { ListingModel } from '@/infrastructure/persistence/typeorm/models/listing.model';

@Injectable()
export class DeleteListingUseCase {
  constructor(
    private readonly listingRepository: ListingRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(
    dto: DeleteListingRequest & { id: string },
  ): Promise<DeleteListingResponse> {
    const listing = await this.listingRepository.findById(dto.id);

    if (listing == null) {
      throw new NotFoundException(
        `Listing with id '${dto.id}' does not exist.`,
      );
    }

    await this.dataSource.transaction(async (manager) => {
      await manager.delete(AttachmentModel, { listing: { id: dto.id } });
      await manager.delete(FavoriteModel, { listing: { id: dto.id } });
      await manager.delete(ListingModel, { id: dto.id });
    });
  }
}
