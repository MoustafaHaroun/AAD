import { UserRepository } from '@/infrastructure/persistence/typeorm/repositories/user.repository';
import { v4 } from 'uuid';
import {
  ListingModel,
  UserModel,
} from '@/infrastructure/persistence/typeorm/models';
import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ListingRepository } from '@/infrastructure/persistence/typeorm/repositories';
import {
  CreateListingRequest,
  CreateListingResponse,
} from '@/application/dto/create-listing.dto';

@Injectable()
export class CreateListingUseCase {
  constructor(
    private readonly listingRepository: ListingRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(dto: CreateListingRequest & { userId: string }): Promise<CreateListingResponse> {
    let user: UserModel;

    try {
      user = await this.userRepository.findById(dto.userId);
    } catch {
      throw new UnauthorizedException();
    }

    const listing = new ListingModel();

    listing.id = v4();
    listing.title = dto.title;
    listing.description = dto.description ?? null;
    listing.user = user;
    listing.attachments = [];

    return {
      listing: (await this.listingRepository.create(listing)).toDomain(),
    };
  }
}
