import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { IdParamDto } from 'src/utils/dto/id-param.dto';
import { Roles } from 'src/roles/role.decorator';
import { Prisma, UserRoles } from '@prisma/client';
import { Request } from 'express';
import { TokenUserPayload } from 'src/auth/types/token-payload.type';
import { BlockCommentDto } from './dto/block-comment.dto';
import { DeleteCommentsQueryDto } from './dto/delete-comments.dto';
import { FindCommentsQueryDto } from './dto/find-comments.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(
    @Req() request: Request,
    @Body() createComment: CreateCommentDto,
  ) {
    const user = request.user as TokenUserPayload;

    const lastPostComment = await this.commentsService.findByUserId(
      user.sub,
      createComment.postId,
    );

    if (lastPostComment) {
      const timer = new Date(Date.now() - 30 * 60 * 1000);

      if (new Date(lastPostComment.createdAt) > timer) {
        throw new ForbiddenException(
          'Ви можете надсилати коментарі для однієї публікації не частіше, ніж раз на пів години.',
        );
      }
    }

    const comment = { ...createComment, userId: user.sub };

    await this.commentsService.create(comment);

    return { message: 'Коментар додано' };
  }

  @Get()
  async findMany(@Query() query: FindCommentsQueryDto) {
    const { userId, postId, sort, order, limit, page } = query;

    const filters: Prisma.CommentFindManyArgs = {
      where: {},
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        [sort]: order,
      },
    };

    if (userId) filters.where.userId = userId;
    if (postId) filters.where.postId = postId;

    const comments = await this.commentsService.findMany(filters);

    return comments;
  }

  @Patch(':id')
  async update(
    @Req() request: Request,
    @Param() { id }: IdParamDto,
    @Body() updateComment: UpdateCommentDto,
  ) {
    const user = request.user as TokenUserPayload;

    const comment = await this.commentsService.findById(id);

    if (
      !user.roles.includes(UserRoles.Moderator) ||
      comment.userId !== user.sub
    ) {
      throw new ForbiddenException('В доступі відмовлено');
    }

    await this.commentsService.update(id, updateComment);

    return { message: 'Коментар оновлено' };
  }

  @Roles(UserRoles.Moderator, UserRoles.Admin)
  @Patch(':id/block')
  async block(
    @Param() { id }: IdParamDto,
    @Body() blockComment: BlockCommentDto,
  ) {
    const comment = await this.commentsService.update(id, blockComment);

    return {
      message: comment.isBlocked ? 'Пост заблоковано' : 'Пост розблоковано',
    };
  }

  @Roles(UserRoles.Admin)
  @Delete()
  async deleteMany(@Query() query: DeleteCommentsQueryDto) {
    const filters: Prisma.CommentDeleteManyArgs = { where: {} };

    const { postId, userId, isDeleted } = query;

    if (postId) filters.where.postId = postId;
    if (userId) filters.where.userId = userId;
    if (isDeleted) filters.where.isDeleted = true;

    await this.commentsService.deleteMany(filters);

    return {
      message: 'Коментарі видалено',
    };
  }

  @Roles(UserRoles.Admin)
  @Delete(':id')
  async delete(@Param() params: IdParamDto) {
    await this.commentsService.delete(params.id);

    return { message: 'Коментар видалено' };
  }
}
