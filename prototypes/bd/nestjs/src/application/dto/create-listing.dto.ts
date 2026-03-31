import { ApiProperty } from '@nestjs/swagger';
import { Listing } from '@/domain/entities';

export class CreateListingRequest {
  @ApiProperty({ example: 'My first listing' })
  title: string;

  @ApiProperty({ example: 'This is my first ever listing!' })
  description: string | undefined;
}

export class CreateListingResponse {
  listing: Listing;
}
