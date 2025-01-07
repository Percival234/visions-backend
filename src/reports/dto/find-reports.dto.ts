import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { FindQueryDto } from 'src/utils/dto/find-query.dto';
import { ToBoolean } from 'src/utils/transformers/boolean.transformer';
import { ToUUID } from 'src/utils/transformers/uuid.transformer';

export class FindReportsQueryDto extends FindQueryDto {
  @IsOptional()
  @ToBoolean()
  isMarked?: boolean;

  @IsOptional()
  @ToBoolean()
  isRead?: boolean;

  @IsOptional()
  @ToUUID()
  userId?: string;

  @IsOptional()
  type?: string;

  @IsOptional()
  search?: string;

  @IsOptional()
  @Transform(({ value }) =>
    ['createdAt'].includes(value) ? value : 'createdAt',
  )
  sort: string = 'createdAt';
}
