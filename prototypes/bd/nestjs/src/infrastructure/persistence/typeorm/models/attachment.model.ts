import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ListingModel } from '@/infrastructure/persistence/typeorm/models';
import { Attachment } from '@/domain/entities';

@Entity('attachments')
export class AttachmentModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  path: string;

  @ManyToOne(() => ListingModel, (listing) => listing.attachments)
  listing: ListingModel;

  static fromDomain(this: void, attachment: Attachment) {
    const model = new AttachmentModel();

    model.id = attachment.id;
    model.path = attachment.path;

    return model;
  }

  toDomain(): Attachment {
    return {
      id: this.id,
      path: this.path,
    } satisfies Attachment;
  }
}
