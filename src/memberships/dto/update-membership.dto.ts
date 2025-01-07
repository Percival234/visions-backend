import { ClubRoles, MembershipStatus, Prisma } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateMembershipDto implements Prisma.ClubMembershipUpdateInput {
  @IsOptional()
  @IsEnum(MembershipStatus, { message: 'Невірний статус' })
  status?: MembershipStatus;

  @IsOptional()
  @IsEnum(ClubRoles, { message: 'Невірна роль' })
  role?: ClubRoles;
}
