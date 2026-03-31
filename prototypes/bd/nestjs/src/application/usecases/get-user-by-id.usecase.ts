import { UserRepository } from '@/infrastructure/persistence/typeorm/repositories/user.repository';
import { GetUserByIdRequest, GetUserByIdResponse } from '@/application/dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetUserByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: GetUserByIdRequest): Promise<GetUserByIdResponse> {
    const user = await this.userRepository.findById(dto.id);

    return {
      user: user != null ? user.toDomain() : null,
    };
  }
}
