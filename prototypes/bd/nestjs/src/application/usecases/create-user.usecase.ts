import {
  CreateUserRequest,
  CreateUserResponse,
} from '@/application/dto/create-user.dto';
import { v4 } from 'uuid';
import { UserModel } from '@/infrastructure/persistence/typeorm/models';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UserRepository } from '@/infrastructure/persistence/typeorm/repositories';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: CreateUserRequest): Promise<CreateUserResponse> {
    let user: UserModel | null;

    try {
      user = await this.userRepository.findByEmail(dto.email);
    } catch {
      throw new BadRequestException('Email is not valid.');
    }

    if (user != null) {
      throw new ConflictException('User with email already exists.');
    }

    user = new UserModel();
    user.id = v4();
    user.email = dto.email;
    user.password = dto.password;
    user.firstname = dto.firstname;
    user.surname = dto.surname;

    return {
      user: (await this.userRepository.create(user)).toDomain(),
    };
  }
}
