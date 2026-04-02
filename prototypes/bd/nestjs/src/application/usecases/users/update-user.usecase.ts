import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '@/infrastructure/persistence/typeorm/repositories';
import { UpdateUserRequest, UpdateUserResponse } from '@/application/dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    dto: UpdateUserRequest & { id: string },
  ): Promise<UpdateUserResponse> {
    const user = await this.userRepository.findById(dto.id);

    if (user == null) {
      throw new NotFoundException(`User with id '${dto.id}' does not exist.`);
    }

    if (dto.firstname != null) user.firstname = dto.firstname;
    if (dto.surname != null) user.surname = dto.surname;
    if (dto.email != null) user.email = dto.email;

    return {
      user: (await this.userRepository.update(user)).toDomain(),
    };
  }
}
