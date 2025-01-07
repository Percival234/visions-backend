import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createComment: Prisma.CommentUncheckedCreateInput) {
    await this.prismaService.comment.create({ data: createComment });
  }

  async findMany(filters: Prisma.CommentFindManyArgs) {
    return await this.prismaService.comment.findMany({
      ...filters,
      include: {
        user: {
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

  async findById(id: string) {
    return await this.prismaService.comment.findUnique({
      where: { id },
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

  async findByUserId(userId: string, postId: string) {
    return await this.prismaService.comment.findFirst({
      where: { userId, postId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: string, updateComment: Prisma.CommentUpdateInput) {
    return await this.prismaService.comment.update({
      where: { id },
      data: updateComment,
    });
  }

  async delete(id: string) {
    await this.prismaService.comment.delete({ where: { id } });
  }

  async deleteMany(filters: Prisma.CommentDeleteManyArgs) {
    await this.prismaService.comment.findMany(filters);
  }
}
