import { Prisma } from '@prisma/client';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto implements Prisma.CategoryCreateInput {
  @IsString({ message: 'Назва має бути рядком' })
  @MinLength(2, { message: 'Назва має містити щонайменше 2 символів' })
  @MaxLength(20, { message: 'Назва має містити не більше 20 символів' })
  name: string;

  @IsString({ message: 'Опис має бути рядком' })
  @MinLength(20, { message: 'Опис має містити щонайменше 20 символів' })
  @MaxLength(120, { message: 'Опис має містити не більше 120 символів' })
  description: string;
}
