import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ListingModel } from '@/infrastructure/persistence/typeorm/models';
import { ListingCategory } from '@/domain/enums/listing-category.enum';
import { ListingType } from '@/domain/enums/listing-type.enum';

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

  async findAll(
    query?: string,
    category?: ListingCategory,
    type?: ListingType,
  ): Promise<ListingModel[]> {
    if (!query && !category && !type) {
      return await this.repository.find({
        relations: ['attachments', 'user'],
      });
    }

    const builder = this.repository
      .createQueryBuilder('listing')
      .leftJoinAndSelect('listing.attachments', 'attachments')
      .leftJoinAndSelect('listing.user', 'user');

    if (query) {
      builder.andWhere(
        '(listing.title ILIKE :query OR listing.description ILIKE :query)',
        { query: `%${query}%` },
      );
    }

    if (category) {
      builder.andWhere('listing.category = :category', { category });
    }

    if (type) {
      builder.andWhere('listing.type = :type', { type });
    }

    return await builder.getMany();
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
