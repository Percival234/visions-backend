import { Prisma } from '@prisma/client';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateReportDto
  implements Omit<Prisma.ReportUncheckedCreateInput, 'userId'>
{
  @IsString({ message: 'Звіт має бути рядком' })
  @MinLength(20, { message: 'Звіт має містити щонайменше 20 символів' })
  @MaxLength(500, { message: 'Звіт має містити не більше 500 символів' })
  text: string;

  @IsString({ message: 'Тип звіту має бути рядком' })
  type: string;
}
