import { Prisma } from '@prisma/client';
import { IsBoolean, IsDateString, IsOptional } from 'class-validator';

export class UpdateReportDto implements Prisma.ReportUpdateInput {
  @IsOptional()
  @IsBoolean({ message: 'Поле "isMarked" має бути логічного типу' })
  isMarked?: boolean;
}
