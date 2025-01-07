import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { FindQueryDto } from 'src/utils/dto/find-query.dto';

export class FindNotificationsQueryDto extends FindQueryDto {
  @IsOptional()
  @Transform(({ value }) =>
    ['createdAt'].includes(value) ? value : 'createdAt',
  )
  sort: string = 'createdAt';
}
