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

  @IsOptional()
  @IsString({ message: 'Поточний пароль має бути рядком' })
  currentPassword?: string;

  @IsString({ message: 'Новий пароль має бути рядком' })
  @MinLength(8, { message: 'Новий пароль має містити щонайменше 8 символів' })
  @MaxLength(16, { message: 'Новий пароль має містити не більше 16 символів' })
  newPassword?: string;
}
