import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '@/infrastructure/persistence/typeorm/repositories';
import { UpdateUserRequest, UpdateUserResponse } from '@/application/dto';
import { UserModel } from '@/infrastructure/persistence/typeorm/models';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    dto: UpdateUserRequest & { id: string; requesterId?: string },
  ): Promise<UpdateUserResponse> {
    const user: UserModel | null = await this.userRepository.findById(dto.id);

    if (user == null) {
      throw new NotFoundException(`User with id '${dto.id}' does not exist.`);
    }

    if (dto.requesterId && dto.requesterId !== dto.id) {
      throw new ForbiddenException('You can only update your own account.');
    }

    if (dto.firstname != null) user.firstname = dto.firstname;
    if (dto.surname != null) user.surname = dto.surname;
    if (dto.email != null) user.email = dto.email;
    if (dto.location !== undefined) user.location = dto.location;
    if (dto.latitude !== undefined) user.latitude = dto.latitude;
    if (dto.longitude !== undefined) user.longitude = dto.longitude;

    return {
      user: (await this.userRepository.update(user)).toDomain(),
    };
  }
}
