import { Injectable } from '@nestjs/common';
import { ListingRepository } from '@/infrastructure/persistence/typeorm/repositories';
import {
  GetRandomListingsRequest,
  GetRandomListingsResponse,
} from '@/application/dto/listings/get-random-listings.dto';
import { toPublicListing } from '@/application/dto/listings/public-listing.dto';

@Injectable()
export class GetRandomListingsUseCase {
  constructor(private readonly listingRepository: ListingRepository) {}

  async execute(
    dto: GetRandomListingsRequest,
  ): Promise<GetRandomListingsResponse> {
    const listings = await this.listingRepository.findRandom(dto.limit);

    return {
      listings: listings.map((l) => toPublicListing(l.toDomain())),
    };
  }
}
