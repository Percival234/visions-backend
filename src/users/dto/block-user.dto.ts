import { Prisma } from '@prisma/client';
import { IsBoolean, IsOptional } from 'class-validator';

export class BlockUserDto implements Prisma.UserUpdateInput {
  @IsOptional()
  @IsBoolean({ message: 'Поле "isBlocked" має бути логічного типу' })
  isBlocked?: boolean;
}
