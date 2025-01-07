import { Prisma } from '@prisma/client';
import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateNotificationDto
  implements
    Pick<
      Prisma.NotificationUncheckedCreateInput,
      'title' | 'userId' | 'textMarkdown'
    >
{
  @IsString({ message: 'Заголовок має бути рядком' })
  @MinLength(10, { message: 'Заголовок має містити щонайменше 10 символів' })
  @MaxLength(100, { message: 'Заголовок має містити не більше 100 символів' })
  title: string;

  @IsString({ message: 'Текст повідомлення має бути рядком' })
  @MinLength(20, {
    message: 'Текст повідомлення має містити щонайменше 20 символів',
  })
  textMarkdown: string;

  @IsUUID(4, { message: 'Невірний ID користувача' })
  userId: string;
}
