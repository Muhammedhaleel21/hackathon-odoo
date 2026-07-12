import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';
import { fromError } from 'zod-validation-error';

export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      return value;
    }

    try {
      return this.schema.parse(value);
    } catch (error) {
      throw new BadRequestException(
        fromError(error as ZodError).message,
      );
    }
  }
}