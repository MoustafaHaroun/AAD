import { Injectable } from '@nestjs/common';
import { UserRepository } from '@/infrastructure/persistence/typeorm/repositories';
import { GetAllUsersResponse } from '@/application/dto/users/get-all-users.dto';

@Injectable()
export class GetAllUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<GetAllUsersResponse> {
    const users = await this.userRepository.findAll();

    return {
      users: users.map((u) => ({ id: u.id })),
    };
  }
}
