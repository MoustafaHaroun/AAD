import { Injectable } from '@nestjs/common';
import { ListingRepository } from '@/infrastructure/persistence/typeorm/repositories';
import {
  GetListingsRequest,
  GetListingsResponse,
} from '@/application/dto/listings/get-listings.dto';

@Injectable()
export class GetListingsUseCase {
  constructor(private readonly listingRepository: ListingRepository) {}

  async execute(dto: GetListingsRequest): Promise<GetListingsResponse> {
    const listings = await this.listingRepository.findAll(dto.q);

    return {
      listings: listings.map((l) => l.toDomain()),
    };
  }
}
