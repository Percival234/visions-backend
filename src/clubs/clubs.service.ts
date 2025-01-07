import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClubsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createClub: Prisma.ClubCreateInput, userId: string) {
    return await this.prismaService.club.create({
      data: createClub,
      include: {
        categories: true,
        settings: true,
        owner: {
          select: {
            id: true,
            username: true,
            avatar: true,
            isBlocked: true,
            isDeleted: true,
          },
        },
        memberships: {
          where: {
            userId,
          },
          take: 1,
        },
      },
    });
  }

  async findMany(filters: Prisma.ClubFindManyArgs, userId: string) {
    return await this.prismaService.club.findMany({
      ...filters,
      include: {
        categories: true,
        settings: true,
        memberships: {
          where: {
            userId,
          },
          take: 1,
        },
      },
    });
  }

  // TODO виключити непотрібні поля типу memberships,

  async findByIdFull(id: string, userId: string) {
    return await this.prismaService.club.findUnique({
      where: { id },
      include: {
        categories: true,
        settings: true,
        owner: {
          select: {
            id: true,
            username: true,
            avatar: true,
            isBlocked: true,
            isDeleted: true,
          },
        },
        memberships: {
          where: {
            userId,
          },
          take: 1,
        },
      },
    });
  }

  async findById(id: string) {
    return await this.prismaService.club.findUnique({
      where: { id },
    });
  }

  async findSettings(clubId: string) {
    return await this.prismaService.clubSettings.findUnique({
      where: {
        clubId,
      },
    });
  }

  async updateSettings(
    id: string,
    updateSettings: Prisma.ClubSettingsUpdateInput,
  ) {
    await this.prismaService.club.update({
      where: { id },
      data: updateSettings,
    });
  }

  async findByName(name: string) {
    return await this.prismaService.club.findUnique({ where: { name } });
  }

  async findByOwnerId(ownerId: string) {
    return await this.prismaService.club.findUnique({ where: { ownerId } });
  }

  async update(id: string, updateClub: Prisma.ClubUpdateInput) {
    await this.prismaService.club.update({ where: { id }, data: updateClub });
  }

  async delete(id: string) {
    await this.prismaService.club.delete({ where: { id } });
  }
}
