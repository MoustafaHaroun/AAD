import { Listing, User } from '@/domain/entities';

export type PublicListing = Omit<Listing, 'user'> & {
  user: Pick<
    User,
    'id' | 'firstname' | 'surname' | 'role' | 'latitude' | 'longitude'
  >;
};

export function toPublicListing(listing: Listing): PublicListing {
  const { user, ...rest } = listing;

  return {
    ...rest,
    user: {
      id: user.id,
      firstname: user.firstname,
      surname: user.surname,
      role: user.role,
      latitude: user.latitude,
      longitude: user.longitude,
    },
  };
}
