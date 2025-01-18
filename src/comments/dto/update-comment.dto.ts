import { Prisma } from '@prisma/client';
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateCommentDto implements Prisma.CommentUpdateInput {
  @IsOptional()
  @IsString({ message: 'Коментар має бути рядком' })
  @MinLength(5, { message: 'Коментар має містити щонайменше 5 символів' })
  @MaxLength(500, { message: 'Коментар має містити не більше 500 символів' })
  comment?: string;

  @IsOptional()
  @IsBoolean({ message: 'Поле "isDeleted" має бути логічного типу' })
  isDeleted?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Поле "isBlocked" має бути логічного типу' })
  isBlocked?: boolean;
}
