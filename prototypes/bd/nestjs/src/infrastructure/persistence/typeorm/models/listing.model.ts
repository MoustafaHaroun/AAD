import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import {
  AttachmentModel,
  UserModel,
} from '@/infrastructure/persistence/typeorm/models';
import { Listing } from '@/domain/entities';

@Entity('listings')
export class ListingModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @OneToMany(() => AttachmentModel, (attachment) => attachment.listing)
  attachments: AttachmentModel[];

  @ManyToOne(() => UserModel, (user) => user.listings)
  user: UserModel;

  static fromDomain(this: void, listing: Listing): ListingModel {
    const model = new ListingModel();

    model.id = listing.id;
    model.title = listing.title;
    model.description = listing.description;
    model.attachments = listing.attachments.map(AttachmentModel.fromDomain);
    model.user = UserModel.fromDomain(listing.user);

    return model;
  }

  toDomain() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      attachments: this.attachments.map((a) => a.toDomain()),
      user: this.user.toDomain(),
    } satisfies Listing;
  }
}
