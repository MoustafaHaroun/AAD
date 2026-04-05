import { Injectable } from '@nestjs/common';
import { ListingRepository } from '@/infrastructure/persistence/typeorm/repositories';
import {
  GetListingsByUserIdRequest,
  GetListingsByUserIdResponse,
} from '@/application/dto';

@Injectable()
export class GetListingsByUserIdUseCase {
  constructor(private readonly listingRepository: ListingRepository) {}

  async execute(
    dto: GetListingsByUserIdRequest & { userId: string },
  ): Promise<GetListingsByUserIdResponse> {
    const listings = await this.listingRepository.findAllByUserId(dto.userId);

    return {
      listings: listings.map((l) => l.toDomain()),
    };
  }
}
