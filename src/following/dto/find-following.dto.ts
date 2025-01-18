import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { FindQueryDto } from 'src/utils/dto/find-query.dto';
import { ToUUID } from 'src/utils/transformers/uuid.transformer';

export class FindFollowingQueryDto extends FindQueryDto {
  @ToUUID()
  userId: string;

  @IsOptional()
  @Transform(({ value }) =>
    ['followers', 'following'].includes(value) ? value : 'followers',
  )
  type: string = 'followers';

  @IsOptional()
  @Transform(({ value }) =>
    ['createdAt'].includes(value) ? value : 'createdAt',
  )
  sort: string = 'createdAt';
}
