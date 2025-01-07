import { IsOptional } from 'class-validator';
import { ToBoolean } from 'src/utils/transformers/boolean.transformer';
import { ToArrayIds } from 'src/utils/transformers/ids-array.transformer';

export class DeleteReportsQueryDto {
  @IsOptional()
  @ToBoolean()
  isMarked?: boolean;

  @IsOptional()
  @ToBoolean()
  isRead?: boolean;

  @IsOptional()
  @ToArrayIds()
  ids?: string[];
}
