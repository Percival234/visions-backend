import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  BadRequestException,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { FollowingService } from './following.service';
import { CreateFollowingDto } from './dto/create-following.dto';
import { IdParamDto } from 'src/utils/dto/id-param.dto';
import { TokenUserPayload } from 'src/auth/types/token-payload.type';
import { Request } from 'express';
import { Prisma } from '@prisma/client';
import { FindFollowingQueryDto } from './dto/find-following.dto';

@Controller({ path: 'following', version: '1' })
export class FollowingController {
  constructor(private readonly followingService: FollowingService) {}

  @Post()
  async create(
    @Req() request: Request,
    @Body() createFollowing: CreateFollowingDto,
  ) {
    const { sub } = request.user as TokenUserPayload;
    const { targetId } = createFollowing;

    if (sub === targetId) {
      throw new BadRequestException('Неможливо підписатися на самого себе');
    }

    const following = await this.followingService.findOne({
      where: { targetId, followerId: sub },
    });

    if (following) {
      throw new BadRequestException('Ви уже підписані на цього користувача');
    }

    const followingData: Prisma.FollowingUncheckedCreateInput = {
      targetId,
      followerId: sub,
    };

    const newFollowing = await this.followingService.create(followingData);

    return newFollowing;
  }

  @Get()
  async findMany(@Query() query: FindFollowingQueryDto) {
    const { userId, type, sort, order, limit, page } = query;

    const filters: Prisma.FollowingFindManyArgs = {
      where: {},
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        [sort]: order,
      },
    };

    if (type === 'followers') {
      filters.where.targetId = userId;
    } else {
      filters.where.followerId = userId;
    }

    const following = await this.followingService.findMany(filters);

    return following;
  }

  @Delete(':id')
  async delete(@Param() { id }: IdParamDto) {
    const following = await this.followingService.findOne({ where: { id } });

    if (!following) {
      throw new NotFoundException('Підписку не знайдено');
    }

    await this.followingService.delete(id);

    return { message: 'Підписку відмінено' };
  }
}
