import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserModel } from '@/infrastructure/persistence/typeorm/models';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserModel)
    private readonly repository: Repository<UserModel>,
  ) {}

  async create(user: UserModel): Promise<UserModel> {
    return await this.repository.save(user);
  }

  async findById(id: string): Promise<UserModel | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    return await this.repository.findOne({ where: { email } });
  }

  async update(user: UserModel): Promise<UserModel> {
    return await this.repository.save(user);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
