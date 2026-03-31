import { Injectable, NotFoundException } from '@nestjs/common';
import { ListingRepository } from '@/infrastructure/persistence/typeorm/repositories';
import {
  GetListingByIdRequest,
  GetListingByIdResponse,
} from '@/application/dto/get-listing-by-id.dto';

@Injectable()
export class GetListingByIdUseCase {
  constructor(private readonly listingRepository: ListingRepository) {}

  async execute(dto: GetListingByIdRequest): Promise<GetListingByIdResponse> {
    const listing = await this.listingRepository.findById(dto.id);

    if (listing == null) {
      throw new NotFoundException(
        `Listing with id '${dto.id}' does not exist.`,
      );
    }

    return {
      listing: listing.toDomain(),
    };
  }
}
