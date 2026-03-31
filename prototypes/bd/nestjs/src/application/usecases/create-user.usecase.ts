import {
  CreateUserRequest,
  CreateUserResponse,
} from '@/application/dto/create-user.dto';
import { v4 } from 'uuid';
import { UserModel } from '@/infrastructure/persistence/typeorm/models';
import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from '@/infrastructure/persistence/typeorm/repositories';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: CreateUserRequest): Promise<CreateUserResponse> {
    const exisitingUser = await this.userRepository.findByEmail(dto.email);

    if (exisitingUser != null) {
      throw new ConflictException('User with email already exists.');
    }

    const newUser = new UserModel();

    newUser.id = v4();
    newUser.email = dto.email;
    newUser.password = dto.password;
    newUser.firstname = dto.firstname;
    newUser.surname = dto.surname;

    return {
      user: (await this.userRepository.create(newUser)).toDomain(),
    };
  }
}
