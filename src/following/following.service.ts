import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FollowingService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createFollowing: Prisma.FollowingUncheckedCreateInput) {
    await this.prismaService.following.create({ data: createFollowing });
  }

  async findOne(filters: Prisma.FollowingFindFirstArgs) {
    return await this.prismaService.following.findFirst(filters);
  }

  async findMany(filters: Prisma.FollowingFindManyArgs) {
    return await this.prismaService.following.findMany({
      ...filters,
      include: {
        target: {
          select: {
            id: true,
            avatar: true,
            username: true,
            isBlocked: true,
            isDeleted: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    await this.prismaService.following.delete({ where: { id } });
  }
}
