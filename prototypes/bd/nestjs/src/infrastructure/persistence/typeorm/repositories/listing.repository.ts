import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListingModel } from '@/infrastructure/persistence/typeorm/models';

@Injectable()
export class ListingRepository {
  constructor(
    @InjectRepository(ListingModel)
    private readonly repository: Repository<ListingModel>,
  ) {}

  async create(listing: ListingModel): Promise<ListingModel> {
    return await this.repository.save(listing);
  }

  async findById(id: string): Promise<ListingModel | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['attachments', 'user'],
    });
  }

  async findAllByUserId(userId: string): Promise<ListingModel[]> {
    return await this.repository.find({
      where: { user: { id: userId } },
      relations: ['attachments', 'user'],
    });
  }

  async update(listing: ListingModel): Promise<ListingModel> {
    return await this.repository.save(listing);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
