import { Attachment } from '@/domain/entities';

export class AddAttachmentToListingRequest {
  binary: Express.Multer.File;
}

export class AddAttachmentToListingResponse {
  attachment: Attachment;
}
