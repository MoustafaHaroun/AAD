import { User } from '@/domain/entities';

export type GetUserByIdRequest = {
  id: string;
};

export type GetUserByIdResponse = {
  user: User | null
};
