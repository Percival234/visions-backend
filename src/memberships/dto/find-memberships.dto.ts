import { ClubRoles, MembershipStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { FindQueryDto } from 'src/utils/dto/find-query.dto';
import { ValidateEnum } from 'src/utils/transformers/enum.transformer';
import { ToUUID } from 'src/utils/transformers/uuid.transformer';

export class FindMembershipsQueryDto extends FindQueryDto {
  @IsOptional()
  @ToUUID()
  @IsNotEmpty({ message: "ID клубу є обо'язковим полем" })
  clubId: string;

  @IsOptional()
  @ValidateEnum(MembershipStatus)
  status?: MembershipStatus;

  @IsOptional()
  @ValidateEnum(ClubRoles)
  role?: ClubRoles;

  @IsOptional()
  search?: string;

  @IsOptional()
  @Transform(({ value }) =>
    ['createdAt'].includes(value) ? value : 'createdAt',
  )
  sort: string = 'createdAt';
}

// TODO створити трансформер для айді та впровадити його скрізь де потрібно
