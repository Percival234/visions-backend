import { Prisma } from '@prisma/client';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SignUpDto implements Prisma.UserCreateInput {
  @IsEmail({}, { message: 'Невірний формат електронної пошти' })
  email: string;

  @IsString({ message: 'Пароль має бути рядком' })
  @MinLength(8, { message: 'Пароль має містити щонайменше 8 символів' })
  @MaxLength(16, { message: 'Пароль має містити не більше 16 символів' })
  password: string;

  @IsString({ message: 'Нікнейм має бути рядком' })
  @MinLength(5, { message: 'Нікнейм має містити щонайменше 5 символів' })
  @MaxLength(20, { message: 'Нікнейм має містити не більше 20 символів' })
  username: string;
}
