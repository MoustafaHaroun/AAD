import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '@/infrastructure/persistence/typeorm/repositories';
import { DeleteUserRequest, DeleteUserResponse } from '@/application/dto';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: DeleteUserRequest): Promise<DeleteUserResponse> {
    const user = await this.userRepository.findById(dto.id);

    if (user == null) {
      throw new NotFoundException(`User with id '${dto.id}' does not exist.`);
    }

    await this.userRepository.delete(dto.id);
  }
}
