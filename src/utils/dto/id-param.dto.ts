import { IsUUID } from 'class-validator';

export class IdParamDto {
  @IsUUID(4, { message: 'Недійсний ID' })
  id: string;
}
