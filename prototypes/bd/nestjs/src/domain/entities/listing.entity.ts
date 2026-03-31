import { Attachment, User } from '@/domain/entities';

export interface Listing {
  id: string;
  title: string;
  description: string | null;
  attachments: Attachment[];
  user: User;
}
