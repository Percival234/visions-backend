import { Prisma } from '@prisma/client';
import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto
  implements Omit<Prisma.CommentUncheckedCreateInput, 'userId'>
{
  @IsString({ message: 'Коментар має бути рядком' })
  @MinLength(5, { message: 'Коментар має містити щонайменше 5 символів' })
  @MaxLength(500, { message: 'Коментар має містити не більше 500 символів' })
  comment: string;

  @IsString({ message: 'Поле "postId" має бути рядком' })
  @IsUUID('4', { message: 'Недійсний ID поста' })
  postId: string;
}
