import { Prisma } from '@prisma/client';
import { IsString, IsUUID } from 'class-validator';

export class CreateMembershipDto
  implements Omit<Prisma.ClubMembershipUncheckedCreateInput, 'userId'>
{
  @IsString({ message: 'Поле "clubId" має бути рядком' })
  @IsUUID(4, { message: 'Недійсний ID клубу' })
  clubId: string;
}
