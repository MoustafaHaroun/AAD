import { ApiProperty } from '@nestjs/swagger';
import { Listing } from '@/domain/entities';

export class UpdateListingRequest {
  @ApiProperty({ example: 'My updated listing', required: false })
  title?: string;

  @ApiProperty({ example: 'An updated description.', required: false })
  description?: string | null;
}

export class UpdateListingResponse {
  listing: Listing;
}
