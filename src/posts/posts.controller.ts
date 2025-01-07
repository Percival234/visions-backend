import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindPostsQueryDto } from './dto/find-posts.dto';
import { IdParamDto } from 'src/utils/dto/id-param.dto';
import { Prisma } from '@prisma/client';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // @Post()
  // async create(@Body() createPostDto: CreatePostDto) {
  //   return this.postsService.create(createPostDto);
  // }

  @Get()
  async findMany(@Query() query: FindPostsQueryDto) {
    const { userId, limit, page, order, sort, category, search } = query;

    const filters: Prisma.PostFindManyArgs = {
      where: {},
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        [sort]: order,
      },
    };

    if (userId) filters.where.userId = userId;
    if (search) filters.where.title = { contains: search, mode: 'insensitive' };
    // if (category) {
    //   filters.where.categories = {
    //     some: {
    //       category: {
    //         id: category,
    //       },
    //     },
    //   };
    // }

    const posts = await this.postsService.findMany(filters);

    return posts;
  }

  @Get(':id')
  async findById(@Param() params: IdParamDto) {
    const post = await this.postsService.findById(params.id);
    return post;
  }

  @Patch(':id')
  async update(
    @Param() params: IdParamDto,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(params.id, updatePostDto);
  }

  @Delete()
  async deleteMany(@Query() query) {
    const filters: Prisma.PostDeleteManyArgs = { where: {} };

    await this.postsService.deleteMany(filters);

    return { message: 'Публікації видалено' };
  }

  @Delete(':id')
  async delete(@Param() params: IdParamDto) {
    await this.postsService.delete(params.id);

    return { message: 'Публікацію видалено' };
  }
}
