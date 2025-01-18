import { Prisma } from '@prisma/client';
import { IsString, IsUUID } from 'class-validator';

export class CreateFollowingDto
  implements Omit<Prisma.FollowingUncheckedCreateInput, 'followerId'>
{
  @IsString({ message: 'Поле "targetId" має бути рядком' })
  @IsUUID('4', { message: 'Недійсний ID користувача' })
  targetId: string;
}
