import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserModel } from '@/infrastructure/persistence/typeorm/models/user.model';
import { Message } from '@/domain/entities/message.entity';

@Entity('messages')
export class MessageModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => UserModel)
  @JoinColumn({ name: 'sender_id' })
  sender: UserModel;

  @ManyToOne(() => UserModel)
  @JoinColumn({ name: 'recipient_id' })
  recipient: UserModel;

  toDomain(): Message {
    return {
      id: this.id,
      content: this.content,
      createdAt: this.createdAt,
      sender: this.sender.toDomain(),
      recipient: this.recipient.toDomain(),
    } satisfies Message;
  }
}
