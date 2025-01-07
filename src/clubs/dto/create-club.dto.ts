import { Transform } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

// TODO валідація відбувається від низу до верху властивості, віднести перевірку типів на самий низ

export class CreateClubDto {
  @MinLength(3, { message: 'Назва має містити щонайменше 3 символів' })
  @MaxLength(30, { message: 'Назва має містити не більше 30 символів' })
  @IsString({ message: 'Назва має бути рядком' })
  name: string;

  @MaxLength(1000, { message: 'Опис має містити не більше 1000 символів' })
  @IsString({ message: 'Опис має бути рядком' })
  description: string;

  @ArrayUnique({ message: 'Категорії повинні містити унікальні значення' })
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @IsArray({ message: 'Категорії мають бути масивом' })
  @IsUUID(4, {
    each: true,
    message: 'Кожен категорія має бути валідним UUID',
  })
  @IsOptional()
  categoriesIds?: string[];
}
