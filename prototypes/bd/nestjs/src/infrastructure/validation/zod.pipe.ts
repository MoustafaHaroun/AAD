import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodTypeAny, ZodError, z } from 'zod';

type ZodFieldErrors<TSchema extends ZodTypeAny> = Partial<
  Record<keyof z.infer<TSchema>, string[]>
>;

export class ZodValidationPipe<
  TSchema extends ZodTypeAny,
> implements PipeTransform {
  constructor(private readonly schema: TSchema) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: unknown, _: ArgumentMetadata): z.infer<TSchema> {
    console.log(value)
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error);
        const flattened = error.flatten();

        const errors = flattened.fieldErrors as ZodFieldErrors<TSchema>;

        throw new BadRequestException({
          message: 'Validation failed',
          errors,
        });
      }

      throw new BadRequestException('Validation failed');
    }
  }
}
