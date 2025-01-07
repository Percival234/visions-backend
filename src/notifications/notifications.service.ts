import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createNotification: Prisma.NotificationUncheckedCreateInput) {
    await this.prismaService.notification.create({
      data: createNotification,
    });
  }

  async findById(id: string) {
    return await this.prismaService.notification.findUnique({ where: { id } });
  }

  async findMany(filters: Prisma.NotificationFindManyArgs) {
    return await this.prismaService.notification.findMany({
      ...filters,
      include: {
        sender: {
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

  async update(id: string, updateNotification: Prisma.NotificationUpdateInput) {
    await this.prismaService.notification.update({
      where: { id },
      data: updateNotification,
    });
  }

  async delete(id: string) {
    await this.prismaService.notification.delete({
      where: { id },
    });
  }

  async deleteMany(filters: Prisma.NotificationDeleteManyArgs) {
    await this.prismaService.notification.deleteMany(filters);
  }
}
