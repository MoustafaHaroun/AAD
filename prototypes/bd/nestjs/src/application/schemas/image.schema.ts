import { z } from 'zod';

const allowedMimeTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];
const allowedMaxFileSize = 10; // in MiB.

export const imageSchema = z
  .custom<Express.Multer.File>()
  .refine((file) => !!file, {
    message: 'Image file is required',
  })
  .refine((file) => allowedMimeTypes.includes(file.mimetype), {
    message: 'Only jpg, jpeg, png or webp images are allowed',
  })
  .refine((file) => file.size <= allowedMaxFileSize * 1024 * 1024, {
    message: `Image must be smaller than ${allowedMaxFileSize}MiB`,
  });
