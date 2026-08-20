import { Injectable, NotFoundException } from '@nestjs/common';
import { ListingRepository } from '@/infrastructure/persistence/typeorm/repositories';
import {
  GetListingByIdRequest,
  GetListingByIdResponse,
} from '@/application/dto/listings/get-listing-by-id.dto';
import { toPublicListing } from '@/application/dto/listings/public-listing.dto';

@Injectable()
export class GetListingByIdUseCase {
  constructor(private readonly listingRepository: ListingRepository) {}

  async execute(
    dto: GetListingByIdRequest & { id: string },
  ): Promise<GetListingByIdResponse> {
    const listing = await this.listingRepository.findById(dto.id);

    if (listing == null) {
      throw new NotFoundException(
        `Listing with id '${dto.id}' does not exist.`,
      );
    }

    return {
      listing: toPublicListing(listing.toDomain()),
    };
  }
}
