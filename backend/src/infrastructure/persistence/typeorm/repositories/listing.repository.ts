import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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

  async findAll(query?: string): Promise<ListingModel[]> {
    if (!query) {
      return await this.repository.find({
        relations: ['attachments', 'user'],
      });
    }

    return await this.repository
      .createQueryBuilder('listing')
      .leftJoinAndSelect('listing.attachments', 'attachments')
      .leftJoinAndSelect('listing.user', 'user')
      .where('listing.title ILIKE :query', { query: `%${query}%` })
      .orWhere('listing.description ILIKE :query', { query: `%${query}%` })
      .getMany();
  }

  async findRandom(limit: number): Promise<ListingModel[]> {
    const ids = await this.repository
      .createQueryBuilder('listing')
      .select('listing.id')
      .orderBy('RANDOM()')
      .limit(limit)
      .getMany();

    if (ids.length === 0) {
      return [];
    }

    return await this.repository.find({
      where: { id: In(ids.map((listing) => listing.id)) },
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
