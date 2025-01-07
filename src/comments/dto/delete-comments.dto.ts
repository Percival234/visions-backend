import { IsOptional } from 'class-validator';
import { ToBoolean } from 'src/utils/transformers/boolean.transformer';
import { ToUUID } from 'src/utils/transformers/uuid.transformer';

export class DeleteCommentsQueryDto {
  @IsOptional()
  @ToUUID()
  userId?: string;

  @IsOptional()
  @ToUUID()
  postId?: string;

  @IsOptional()
  @ToBoolean()
  isDeleted?: boolean;
}
