import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { FindQueryDto } from 'src/utils/dto/find-query.dto';
import { ToArray } from 'src/utils/transformers/array.transformer';
import { ToUUID } from 'src/utils/transformers/uuid.transformer';

export class FindClubsQueryDto extends FindQueryDto {
  @IsOptional()
  @ToUUID()
  ownerId?: string;

  @IsOptional()
  @ToArray()
  categories?: string[];

  @IsOptional()
  search?: string;

  @IsOptional()
  @Transform(({ value }) =>
    ['createdAt'].includes(value) ? value : 'createdAt',
  )
  sort: string = 'createdAt';
}
