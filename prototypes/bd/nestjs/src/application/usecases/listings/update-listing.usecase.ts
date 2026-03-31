import { Injectable, NotFoundException } from '@nestjs/common';
import { ListingRepository } from '@/infrastructure/persistence/typeorm/repositories';
import {
  UpdateListingRequest,
  UpdateListingResponse,
} from '@/application/dto/update-listing.dto';

@Injectable()
export class UpdateListingUseCase {
  constructor(private readonly listingRepository: ListingRepository) {}

  async execute(
    dto: UpdateListingRequest & { id: string },
  ): Promise<UpdateListingResponse> {
    const listing = await this.listingRepository.findById(dto.id);

    if (listing == null) {
      throw new NotFoundException(
        `Listing with id '${dto.id}' does not exist.`,
      );
    }

    if (dto.title !== undefined) listing.title = dto.title;
    if (dto.description !== undefined)
      listing.description = dto.description ?? null;

    return {
      listing: (await this.listingRepository.update(listing)).toDomain(),
    };
  }
}
