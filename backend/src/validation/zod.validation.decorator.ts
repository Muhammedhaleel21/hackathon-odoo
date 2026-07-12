import {
  Query,
  Param,
  UsePipes,
  UploadedFile,
  UploadedFiles,
  applyDecorators,
} from '@nestjs/common';
import { ZodSchema } from 'zod';
import { ZodValidationPipe } from './zod.validation.pipe';

export function ValidateBody(schema: ZodSchema): MethodDecorator {
  return applyDecorators(
    UsePipes(new ZodValidationPipe(schema)),
  );
}

export const ValidateQuery = (schema: ZodSchema): ParameterDecorator =>
  Query(new ZodValidationPipe(schema));

export const ValidateParam = (
  param: string,
  schema: ZodSchema,
): ParameterDecorator => Param(param, new ZodValidationPipe(schema));

export const ValidateFile = (schema: ZodSchema): ParameterDecorator =>
  UploadedFile(new ZodValidationPipe(schema));

export const ValidateFiles = (schema: ZodSchema): ParameterDecorator =>
  UploadedFiles(new ZodValidationPipe(schema));