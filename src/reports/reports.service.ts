import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createReport: Prisma.ReportUncheckedCreateInput) {
    await this.prismaService.report.create({
      data: createReport,
    });
  }

  async findByUserId(id: string) {
    return await this.prismaService.report.findFirst({
      where: {
        userId: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string) {
    return await this.prismaService.report.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            avatar: true,
            email: true,
            username: true,
            isBlocked: true,
            isDeleted: true,
          },
        },
      },
    });
  }

  async findMany(filters: Prisma.ReportFindManyArgs) {
    return await this.prismaService.report.findMany({
      ...filters,
      include: {
        user: {
          select: {
            id: true,
            avatar: true,
            email: true,
            username: true,
            isBlocked: true,
            isDeleted: true,
          },
        },
      },
    });
  }

  async update(id: string, updateReport: Prisma.ReportUpdateInput) {
    await this.prismaService.report.update({
      where: { id },
      data: updateReport,
    });
  }

  async deleteById(id: string) {
    await this.prismaService.report.delete({
      where: { id },
    });
  }

  async deleteMany(filters: Prisma.ReportDeleteManyArgs) {
    await this.prismaService.report.deleteMany(filters);
  }
}
