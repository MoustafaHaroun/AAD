import { Injectable, NotFoundException } from '@nestjs/common';
import { ListingRepository } from '@/infrastructure/persistence/typeorm/repositories';
import {
  DeleteListingRequest,
  DeleteListingResponse,
} from '@/application/dto/delete-listing.dto';

@Injectable()
export class DeleteListingUseCase {
  constructor(private readonly listingRepository: ListingRepository) {}

  async execute(
    dto: DeleteListingRequest & { id: string },
  ): Promise<DeleteListingResponse> {
    const listing = await this.listingRepository.findById(dto.id);

    if (listing == null) {
      throw new NotFoundException(
        `Listing with id '${dto.id}' does not exist.`,
      );
    }

    await this.listingRepository.delete(dto.id);
  }
}
