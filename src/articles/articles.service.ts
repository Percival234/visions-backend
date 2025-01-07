import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ArticlesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createArticle: Prisma.ArticleUncheckedCreateInput) {
    return await this.prismaService.article.create({
      data: createArticle,
    });
  }

  async findMany(filters: Prisma.ArticleFindManyArgs) {
    return await this.prismaService.article.findMany(filters);
  }

  async findById(id: string) {
    return await this.prismaService.article.findUnique({ where: { id } });
  }

  async update(id: string, updateArticle: Prisma.ArticleUpdateInput) {
    return await this.prismaService.article.update({
      where: { id },
      data: updateArticle,
    });
  }

  async delete(id: string) {
    return await this.prismaService.article.delete({ where: { id } });
  }
}
