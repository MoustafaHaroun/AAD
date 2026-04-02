import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttachmentModel } from '@/infrastructure/persistence/typeorm/models';

@Injectable()
export class AttachmentRepository {
  constructor(
    @InjectRepository(AttachmentModel)
    private readonly repository: Repository<AttachmentModel>,
  ) {}

  async create(attachment: AttachmentModel): Promise<AttachmentModel> {
    return await this.repository.save(attachment);
  }

  async findById(id: string): Promise<AttachmentModel> {
    return await this.repository.findOneOrFail({ where: { id } });
  }

  async findAllByListingId(listingId: string): Promise<AttachmentModel[]> {
    return await this.repository.find({
      where: { listing: { id: listingId } },
    });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
