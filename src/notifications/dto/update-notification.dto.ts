import { Prisma } from '@prisma/client';
import { IsDateString, IsOptional } from 'class-validator';

export class UpdateNotificationDto implements Prisma.NotificationUpdateInput {
  @IsOptional()
  @IsDateString({}, { message: 'Невірний формат дати' })
  read?: string | Date;
}
