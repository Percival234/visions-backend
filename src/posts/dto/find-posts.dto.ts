import { Transform } from 'class-transformer';
import { IsOptional, isUUID } from 'class-validator';
import { FindQueryDto } from 'src/utils/dto/find-query.dto';
import { ToUUID } from 'src/utils/transformers/uuid.transformer';

export class FindPostsQueryDto extends FindQueryDto {
  @IsOptional()
  @ToUUID()
  userId?: string;

  @IsOptional()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => (isUUID(value) ? value : undefined))
  category?: string;

  @IsOptional()
  @Transform(({ value }) =>
    ['createdAt'].includes(value) ? value : 'createdAt',
  )
  sort: string = 'createdAt';
}
