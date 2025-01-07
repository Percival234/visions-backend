import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MembershipsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createMembership: Prisma.ClubMembershipCreateInput) {
    return await this.prismaService.clubMembership.create({
      data: createMembership,
    });
  }

  async findOne(filters: Prisma.ClubMembershipFindUniqueArgs) {
    return await this.prismaService.clubMembership.findUnique(filters);
  }

  async findMany(filters: Prisma.ClubMembershipFindManyArgs) {
    return await this.prismaService.clubMembership.findMany({
      ...filters,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
            isBlocked: true,
            isDeleted: true,
          },
        },
      },
    });
  }

  async update(id: string, updateMembership: Prisma.ClubMembershipUpdateInput) {
    await this.prismaService.clubMembership.update({
      where: { id },
      data: updateMembership,
    });
  }

  async delete(leaveRequest: Prisma.ClubMembershipDeleteArgs) {
    await this.prismaService.clubMembership.delete(leaveRequest);
  }
}
