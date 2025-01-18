import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { ToNumber } from '../transformers/number.transformer';

export class FindQueryDto {
  @IsOptional()
  @ToNumber(30)
  limit: number = 30;

  @IsOptional()
  @ToNumber(1)
  page: number = 1;

  @IsOptional()
  @Transform(({ value }) => (['desc', 'asc'].includes(value) ? value : 'asc'))
  order: 'desc' | 'asc' = 'asc';
}
