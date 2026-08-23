import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationModel } from '../models/notification.model';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectRepository(NotificationModel)
    private readonly repository: Repository<NotificationModel>,
  ) {}

  async create(notification: NotificationModel): Promise<NotificationModel> {
    return await this.repository.save(notification);
  }

  async findById(id: string): Promise<NotificationModel | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async findAllByUserId(userId: string): Promise<NotificationModel[]> {
    return await this.repository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(notification: NotificationModel): Promise<NotificationModel> {
    return await this.repository.save(notification);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
