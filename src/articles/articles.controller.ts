import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { IdParamDto } from 'src/utils/dto/id-param.dto';
import { Prisma, UserRoles } from '@prisma/client';
import { Roles } from 'src/roles/role.decorator';
import { FindArticlesQueryDto } from './dto/find-articles.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Roles(UserRoles.Admin)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/articles',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async create(
    @Body() createArticle: CreateArticleDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const articleData: Prisma.ArticleCreateInput = {
      ...createArticle,
      articleHtml: '',
      image: file.filename,
    };

    const article = await this.articlesService.create(articleData);

    return article;
  }

  @Get()
  async findMany(@Query() query: FindArticlesQueryDto) {
    const { limit, page, order, sort } = query;

    const filters: Prisma.ArticleFindManyArgs = {
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        [sort]: order,
      },
    };

    const articles = await this.articlesService.findMany(filters);

    return articles;
  }

  @Get(':id')
  async findById(@Param() { id }: IdParamDto) {
    const article = await this.articlesService.findById(id);

    return article;
  }

  @Roles(UserRoles.Admin)
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/articles',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async update(
    @Param() { id }: IdParamDto,
    @Body() updateArticle: UpdateArticleDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const articleData: Prisma.ArticleUpdateInput = updateArticle;

    if (file) {
      articleData.image = file.filename;
    }

    const article = await this.articlesService.update(id, articleData);

    return article;
  }

  @Roles(UserRoles.Admin)
  @Delete(':id')
  async delete(@Param() { id }: IdParamDto) {
    await this.articlesService.delete(id);

    return { mesasge: 'Статтю видалено' };
  }
}
