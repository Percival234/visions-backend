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
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { FindNotificationsQueryDto } from './dto/find-notifications.dto';
import { Prisma, UserRoles } from '@prisma/client';
import { Roles } from 'src/roles/role.decorator';
import { IdParamDto } from 'src/utils/dto/id-param.dto';
import { TokenUserPayload } from 'src/auth/types/token-payload.type';
import { Request } from 'express';
import { markdownToHTML } from 'src/utils/markdown-to-html/markdown-to-html';

@Controller({ path: 'notifications', version: '1' })
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Roles(UserRoles.Moderator, UserRoles.Admin)
  @Post()
  async create(
    @Req() request: Request,
    @Body() createNotification: CreateNotificationDto,
  ) {
    const user = request.user as TokenUserPayload;

    const html = await markdownToHTML(createNotification.textMarkdown);

    const notification: Prisma.NotificationUncheckedCreateInput = {
      senderId: user.sub,
      textHtml: html,
      ...createNotification,
    };

    await this.notificationsService.create(notification);

    return { message: 'Повідомлення відправлено' };
  }

  @Get()
  async findMany(
    @Req() request: Request,
    @Query() query: FindNotificationsQueryDto,
  ) {
    const { limit, page, order, sort } = query;

    const user = request.user as TokenUserPayload;

    const filters: Prisma.NotificationFindManyArgs = {
      where: { userId: user.sub },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        [sort]: order,
      },
    };

    const notifications = await this.notificationsService.findMany(filters);

    return notifications;
  }

  @Patch(':id')
  async update(
    @Param() { id }: IdParamDto,
    @Body() updateNotification: UpdateNotificationDto,
    @Req() request: Request,
  ) {
    const user = request.user as TokenUserPayload;

    const notification = await this.notificationsService.findById(id);

    if (!notification) {
      throw new NotFoundException('Повідомлення не знайдено');
    }

    if (notification.userId !== user.sub) {
      throw new ForbiddenException('В доступі відмовлено');
    }

    if (notification.read && updateNotification.read) {
      delete updateNotification.read;
    }

    await this.notificationsService.update(id, updateNotification);

    return null;
  }

  @Delete()
  async deleteMany(@Req() request: Request) {
    const user = request.user as TokenUserPayload;

    const filters: Prisma.NotificationDeleteManyArgs = {
      where: { userId: user.sub },
    };

    await this.notificationsService.deleteMany(filters);

    return { message: 'Повідомлення виделені' };
  }

  @Delete(':id')
  async delete(@Param() { id }: IdParamDto, @Req() request: Request) {
    const user = request.user as TokenUserPayload;

    const notification = await this.notificationsService.findById(id);

    if (!notification) {
      throw new NotFoundException('Повідомлення не знайдено');
    }

    if (notification.userId !== user.sub) {
      throw new ForbiddenException('В доступі відмовлено');
    }

    await this.notificationsService.delete(id);

    return { message: 'Повідомлення виделено' };
  }
}
