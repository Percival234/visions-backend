import { IsEmail, IsString } from 'class-validator';

export class SignInDto {
  @IsEmail({}, { message: 'Невірний формат електронної пошти' })
  email: string;

  @IsString({ message: 'Пароль має бути рядком' })
  password: string;
}
