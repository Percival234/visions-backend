import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from 'src/roles/role.decorator';
import { IdParamDto } from 'src/utils/dto/id-param.dto';
import { UserRoles } from '@prisma/client';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

export const CATEGORIES_CACHE_KEY = 'categories';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Roles(UserRoles.Admin)
  @Post()
  async create(@Body() createCategory: CreateCategoryDto) {
    const isExist = await this.categoriesService.findByName(
      createCategory.name,
    );

    if (isExist) {
      throw new BadRequestException('Категорія з такою назвою уже існує');
    }

    await this.categoriesService.create(createCategory);

    await this.cacheManager.del(CATEGORIES_CACHE_KEY);

    return { message: 'Категорію додано' };
  }

  @Get()
  async findMany() {
    const cachedCategories = await this.cacheManager.get(CATEGORIES_CACHE_KEY);

    if (cachedCategories) {
      return cachedCategories;
    }

    const categories = await this.categoriesService.findMany();

    await this.cacheManager.set(CATEGORIES_CACHE_KEY, categories, 0);

    return categories;
  }

  @Roles(UserRoles.Admin)
  @Patch(':id')
  async update(
    @Param() params: IdParamDto,
    @Body() updateCategory: UpdateCategoryDto,
  ) {
    if (updateCategory.name) {
      const isExist = await this.categoriesService.findByName(
        updateCategory.name,
      );

      if (isExist) {
        throw new BadRequestException('Категорія з такою назвою уже існує');
      }
    }

    await this.categoriesService.update(params.id, updateCategory);

    await this.cacheManager.del(CATEGORIES_CACHE_KEY);

    return { message: 'Категорію оновлено' };
  }

  @Roles(UserRoles.Admin)
  @Delete(':id')
  async delete(@Param() { id }: IdParamDto) {
    await this.categoriesService.delete(id);

    await this.cacheManager.del(CATEGORIES_CACHE_KEY);

    return { message: 'Категорію успішно видалено' };
  }
}
