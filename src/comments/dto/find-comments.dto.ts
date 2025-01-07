import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { FindQueryDto } from 'src/utils/dto/find-query.dto';
import { ToUUID } from 'src/utils/transformers/uuid.transformer';

export class FindCommentsQueryDto extends FindQueryDto {
  @IsOptional()
  @ToUUID()
  userId?: string;

  @IsOptional()
  @ToUUID()
  postId?: string;

  @IsOptional()
  @Transform(({ value }) =>
    ['createdAt'].includes(value) ? value : 'createdAt',
  )
  sort: string = 'createdAt';
}
