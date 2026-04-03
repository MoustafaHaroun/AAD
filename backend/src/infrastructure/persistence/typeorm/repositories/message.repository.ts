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

  async findAllBySenderId(senderId: string): Promise<MessageModel[]> {
    return await this.repository.find({
      where: { sender: { id: senderId } },
      relations: ['sender', 'recipient'],
    });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
