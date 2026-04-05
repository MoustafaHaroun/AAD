import { UserRepository } from '@/infrastructure/persistence/typeorm/repositories/user.repository';
import { GetUserByIdRequest, GetUserByIdResponse } from '@/application/dto';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class GetUserByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    dto: GetUserByIdRequest & { id: string },
  ): Promise<GetUserByIdResponse> {
    const user = await this.userRepository.findById(dto.id);

    if (user == null) {
      throw new NotFoundException();
    }

    return {
      user: user.toDomain(),
    };
  }
}
