import { Prisma } from '@prisma/client';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateArticleDto
  implements Omit<Prisma.ArticleCreateInput, 'articleHtml' | 'image'>
{
  @IsString({ message: 'Заголовок має бути рядком' })
  @MinLength(15, { message: 'Заголовок має містити щонайменше 15 символів' })
  @MaxLength(100, { message: 'Заголовок має містити не більше 100 символів' })
  title: string;

  @IsString({ message: 'Текст статті має бути рядком' })
  @MinLength(200, {
    message: 'Текст статті має містити щонайменше 20 символів',
  })
  articleMarkdown: string;
}
