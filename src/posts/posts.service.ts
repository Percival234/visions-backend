import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}
  // create(createPostDto: CreatePostDto) {

  // }

  async findMany(filters: Prisma.PostFindManyArgs) {
    filters.include = {
      categories: true,
      image: true,
      user: {
        select: {
          id: true,
          avatar: true,
          username: true,
          isBlocked: true,
          isDeleted: true,
        },
      },
    };
    return await this.prismaService.post.findMany(filters);
  }

  async findById(id: string) {
    return await this.prismaService.post.findUnique({
      where: { id },
      include: {
        categories: true,
        image: true,
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

  async update(id: string, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  async delete(id: string) {
    await this.prismaService.post.delete({ where: { id } });
  }

  async deleteMany(filters: Prisma.PostDeleteManyArgs) {
    return await this.prismaService.post.deleteMany(filters);
  }
}
