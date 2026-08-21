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
import { ListingCategory } from '@/domain/enums/listing-category.enum';
import { ListingType } from '@/domain/enums/listing-type.enum';

@Entity('listings')
export class ListingModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'enum', enum: ListingCategory })
  category: ListingCategory;

  @Column({ type: 'enum', enum: ListingType, default: ListingType.OFFER })
  type: ListingType;

  @OneToMany(() => AttachmentModel, (attachment) => attachment.listing)
  attachments: AttachmentModel[];

  @ManyToOne(() => UserModel, (user) => user.listings)
  user: UserModel;

  static fromDomain(this: void, listing: Listing): ListingModel {
    const model = new ListingModel();

    model.id = listing.id;
    model.title = listing.title;
    model.description = listing.description;
    model.category = listing.category;
    model.type = listing.type;
    model.attachments =
      listing.attachments?.map(AttachmentModel.fromDomain) ?? [];
    model.user = UserModel.fromDomain(listing.user);

    return model;
  }

  toDomain() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      category: this.category,
      type: this.type,
      attachments: this.attachments?.map((a) => a.toDomain()) ?? [],
      user: this.user.toDomain(),
    } satisfies Listing;
  }
}
