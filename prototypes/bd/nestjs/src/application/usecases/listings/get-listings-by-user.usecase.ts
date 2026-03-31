import { Injectable } from '@nestjs/common';
import { ListingRepository } from '@/infrastructure/persistence/typeorm/repositories';
import {
  GetListingsByUserRequest,
  GetListingsByUserResponse,
} from '@/application/dto/get-listings-by-user.dto';

@Injectable()
export class GetListingsByUserUseCase {
  constructor(private readonly listingRepository: ListingRepository) {}

  async execute(
    dto: GetListingsByUserRequest,
  ): Promise<GetListingsByUserResponse> {
    const listings = await this.listingRepository.findAllByUserId(dto.userId);

    return {
      listings: listings.map((l) => l.toDomain()),
    };
  }
}
