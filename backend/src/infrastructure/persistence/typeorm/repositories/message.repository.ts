import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageModel } from '@/infrastructure/persistence/typeorm/models/message.model';

@Injectable()
export class MessageRepository {
  constructor(
    @InjectRepository(MessageModel)
    private readonly repository: Repository<MessageModel>,
  ) {}

  async create(message: MessageModel): Promise<MessageModel> {
    return await this.repository.save(message);
  }

  async findById(id: string): Promise<MessageModel | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['sender', 'recipient'],
    });
  }

  async findAllByUserId(userId: string): Promise<MessageModel[]> {
    return await this.repository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.recipient', 'recipient')
      .where('sender.id = :userId', { userId })
      .orWhere('recipient.id = :userId', { userId })
      .orderBy('message.createdAt', 'ASC')
      .getMany();
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
