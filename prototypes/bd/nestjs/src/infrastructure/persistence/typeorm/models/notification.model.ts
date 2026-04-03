import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserModel } from '@/infrastructure/persistence/typeorm/models';
import { Notification } from '@/domain/entities';

@Entity('notifications')
export class NotificationModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  message: string;

  @ManyToOne(() => UserModel, (user) => user.notifications)
  user: UserModel;

  static fromDomain(this: void, notification: Notification): NotificationModel {
    const model = new NotificationModel();

    model.id = notification.id;
    model.title = notification.title;
    model.message = notification.message;

    return model;
  }

  toDomain(): Notification {
    return {
      id: this.id,
      title: this.title,
      message: this.message,
      user: this.user?.toDomain(),
    } satisfies Notification;
  }
}
