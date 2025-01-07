import { Prisma } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto implements Prisma.UserUpdateInput {
  @IsOptional()
  @IsEmail({}, { message: 'Невірний формат електронної пошти' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Нікнейм має бути рядком' })
  @MinLength(5, { message: 'Нікнейм має містити щонайменше 5 символів' })
  @MaxLength(20, { message: 'Нікнейм має містити не більше 20 символів' })
  username?: string;

  @IsOptional()
  @IsBoolean({ message: 'Поле "isDeleted" має бути логічного типу' })
  isDeleted?: boolean;
}
