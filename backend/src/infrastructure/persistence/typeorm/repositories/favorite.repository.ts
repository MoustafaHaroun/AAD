import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteModel } from '@/infrastructure/persistence/typeorm/models/favorite.model';

@Injectable()
export class FavoriteRepository {
  constructor(
    @InjectRepository(FavoriteModel)
    private readonly repository: Repository<FavoriteModel>,
  ) {}

  async create(favorite: FavoriteModel): Promise<FavoriteModel> {
    return await this.repository.save(favorite);
  }

  async findById(id: string): Promise<FavoriteModel | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['user', 'listing', 'listing.attachments', 'listing.user'],
    });
  }

  async findAllByUserId(userId: string): Promise<FavoriteModel[]> {
    return await this.repository.find({
      where: { user: { id: userId } },
      relations: ['user', 'listing', 'listing.attachments', 'listing.user'],
    });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
