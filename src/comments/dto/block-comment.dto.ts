import { Prisma } from '@prisma/client';
import { IsBoolean, IsOptional } from 'class-validator';

export class BlockCommentDto implements Prisma.CommentUpdateInput {
  @IsOptional()
  @IsBoolean({ message: 'Поле "isBlocked" має бути логічного типу' })
  isBlocked?: boolean;
}
