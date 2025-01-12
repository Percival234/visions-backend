import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { Request } from 'express';
import { TokenUserPayload } from 'src/auth/types/token-payload.type';
import { ClubsService } from 'src/clubs/clubs.service';
import { ClubRoles, MembershipStatus, Prisma } from '@prisma/client';
import { IdParamDto } from 'src/utils/dto/id-param.dto';
import { FindMembershipsQueryDto } from './dto/find-memberships.dto';

@Controller({ path: 'memberships', version: '1' })
export class MembershipsController {
  constructor(
    private readonly membershipsService: MembershipsService,
    private readonly clubsService: ClubsService,
  ) {}

  @Post()
  async create(
    @Req() request: Request,
    @Body() createMembership: CreateMembershipDto,
  ) {
    const { sub: userId } = request.user as TokenUserPayload;

    const { clubId } = createMembership;

    const { isPrivate } = await this.clubsService.findSettings(clubId);

    const membership = await this.membershipsService.findOne({
      where: {
        userId_clubId: {
          clubId,
          userId,
        },
      },
    });

    if (membership) {
      if (membership.roles.includes(ClubRoles.Owner)) {
        throw new ForbiddenException('Ви не можете покинути власний клуб.');
      }

      const { status } = membership;

      if (
        status == MembershipStatus.Blocked ||
        status == MembershipStatus.Rejected
      ) {
        return membership;
      }

      if (
        status == MembershipStatus.Approved ||
        status == MembershipStatus.Pending
      ) {
        await this.membershipsService.delete({
          where: {
            userId_clubId: {
              clubId,
              userId,
            },
          },
        });

        return null;
      }
    }

    const membershipData: Prisma.ClubMembershipCreateInput = {
      club: { connect: { id: clubId } },
      user: { connect: { id: userId } },
      status: isPrivate ? MembershipStatus.Pending : MembershipStatus.Approved,
    };

    const newMembership = await this.membershipsService.create(membershipData);

    return newMembership;
  }

  @Get()
  async findMany(@Query() query: FindMembershipsQueryDto) {
    const { clubId, role, status, search, limit, page, order, sort } = query;

    const filters: Prisma.ClubMembershipFindManyArgs = {
      where: {
        clubId,
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        [sort]: order,
      },
    };

    if (status) filters.where.status = status;
    if (role)
      filters.where.roles = {
        has: role,
      };
    if (search)
      filters.where.user = {
        username: { contains: search, mode: 'insensitive' },
      };

    const memberships = await this.membershipsService.findMany(filters);

    return memberships;
  }

  // @Get(':clubId')
  // async findById(@Param() { id }: IdParamDto) {

  // }

  @Patch(':id')
  async update(
    @Req() request: Request,
    @Param() { id }: IdParamDto,
    @Body() updateMembership: UpdateMembershipDto,
  ) {
    const { sub: userId } = request.user as TokenUserPayload;

    const membership = await this.membershipsService.findOne({
      where: { id },
    });

    if (!membership) {
      throw new NotFoundException('Даної підписки на клуб не існує');
    }

    const isUserAssistant = membership.roles.includes(ClubRoles.Assistant);
    const isUserOwner = membership.roles.includes(ClubRoles.Owner);

    if (isUserOwner) {
      throw new ForbiddenException('Ці дані не можна змінювати');
    }

    const requestUserMembership = await this.membershipsService.findOne({
      where: {
        userId_clubId: {
          userId,
          clubId: membership.clubId,
        },
      },
    });

    if (!requestUserMembership) {
      throw new ForbiddenException('В доступі відмовлено');
    }

    const isRequestUserOwner = requestUserMembership.roles.includes(
      ClubRoles.Owner,
    );

    if (!isRequestUserOwner) {
      if (isUserOwner || isUserAssistant) {
        throw new ForbiddenException('В доступі відмовлено');
      }

      if (updateMembership.role) {
        throw new ForbiddenException('В доступі відмовлено');
      }
    }

    await this.membershipsService.update(id, updateMembership);

    return { message: 'Підписка оновлена' };
  }

  @Delete(':id')
  async delete(@Req() request: Request, @Param() { id }: IdParamDto) {
    const { sub: userId } = request.user as TokenUserPayload;

    const membership = await this.membershipsService.findOne({
      where: { id },
    });

    if (!membership) {
      throw new NotFoundException('Даної підписки на клуб не існує');
    }

    if (membership.roles.includes(ClubRoles.Owner)) {
      throw new ForbiddenException('Власник не може покинути клуб');
    }

    const requestUserMembership = await this.membershipsService.findOne({
      where: {
        userId_clubId: {
          userId,
          clubId: membership.clubId,
        },
      },
    });

    if (!requestUserMembership) {
      throw new ForbiddenException('В доступі відмовлено');
    }

    const isAssistant = requestUserMembership.roles.includes(
      ClubRoles.Assistant,
    );
    const isTargetAssistant = membership.roles.includes(ClubRoles.Assistant);

    if (!isAssistant || isTargetAssistant) {
      throw new ForbiddenException('В доступі відмовлено');
    }

    await this.membershipsService.delete({ where: { id } });

    return { message: 'Користувач більше не є членом клубу' };
  }
}
