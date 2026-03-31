import { Listing } from '@/domain/entities';

export interface User {
  id: string;
  email: string;
  firstname: string;
  surname: string;
  listings: Listing[];
}
