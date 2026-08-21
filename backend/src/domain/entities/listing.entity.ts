import { Attachment, User } from '@/domain/entities';
import { ListingCategory } from '@/domain/enums/listing-category.enum';
import { ListingType } from '@/domain/enums/listing-type.enum';

export interface Listing {
  id: string;
  title: string;
  description: string | null;
  category: ListingCategory;
  type: ListingType;
  attachments: Attachment[];
  user: User;
}
