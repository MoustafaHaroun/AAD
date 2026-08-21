import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ListingRepository } from '@/infrastructure/persistence/typeorm/repositories';
import {
  UpdateListingRequest,
  UpdateListingResponse,
} from '@/application/dto/users/update-listing.dto';

@Injectable()
export class UpdateListingUseCase {
  constructor(private readonly listingRepository: ListingRepository) {}

  async execute(
    dto: UpdateListingRequest & { id: string; requesterId?: string },
  ): Promise<UpdateListingResponse> {
    const listing = await this.listingRepository.findById(dto.id);

    if (listing == null) {
      throw new NotFoundException(
        `Listing with id '${dto.id}' does not exist.`,
      );
    }

    if (dto.requesterId && listing.user.id !== dto.requesterId) {
      throw new ForbiddenException(
        'You do not have permission to update this listing.',
      );
    }

    if (dto.title != null) listing.title = dto.title;
    if (dto.description != null) listing.description = dto.description ?? null;
    if (dto.category != null) listing.category = dto.category;
    if (dto.type != null) listing.type = dto.type;

    return {
      listing: (await this.listingRepository.update(listing)).toDomain(),
    };
  }
}
