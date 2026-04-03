import { Listing } from './listing.entity';
import { User } from './user.entity';

export interface Favorite {
  id: string;
  user: User;
  listing: Listing;
}
