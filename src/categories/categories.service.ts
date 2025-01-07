import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto) {
    await this.prismaService.category.create({ data: createCategoryDto });
  }

  async findMany() {
    return await this.prismaService.category.findMany();
  }

  async findByName(name: string) {
    return await this.prismaService.category.findUnique({
      where: {
        name,
      },
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.prismaService.category.update({
      where: {
        id,
      },
      data: updateCategoryDto,
    });
  }

  async delete(id: string) {
    await this.prismaService.$transaction([
      this.prismaService.category.update({
        where: { id },
        data: { posts: { disconnect: [] }, clubs: { disconnect: [] } },
      }),
      this.prismaService.category.delete({
        where: { id },
      }),
    ]);
  }
}
