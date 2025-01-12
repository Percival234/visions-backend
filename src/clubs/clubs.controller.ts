import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { IdParamDto } from 'src/utils/dto/id-param.dto';
import { ClubRoles, MembershipStatus, Prisma, UserRoles } from '@prisma/client';
import { FindClubsQueryDto } from './dto/find-clubs.dto';
import { TokenUserPayload } from 'src/auth/types/token-payload.type';
import { diskStorage } from 'multer';
import { MembershipsService } from 'src/memberships/memberships.service';

@Controller({ path: 'clubs', version: '1' })
export class ClubsController {
  constructor(
    private readonly clubsService: ClubsService,
    private readonly membershipsService: MembershipsService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/clubs',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async create(
    @Req() request: Request,
    @Body()
    createClub: CreateClubDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user = request.user as TokenUserPayload;

    const isExist = await this.clubsService.findByName(createClub.name);

    if (isExist) {
      throw new BadRequestException('Клуб з такою назвою уже існує');
    }

    const isAlreadyOwner = await this.clubsService.findByOwnerId(user.sub);

    if (isAlreadyOwner) {
      throw new ForbiddenException(
        `Ви вже є власником клубу "${isAlreadyOwner.name}"`,
      );
    }

    const clubData: Prisma.ClubCreateInput = {
      owner: {
        connect: { id: user.sub },
      },
      name: createClub.name,
      description: createClub.description,
      image: file.filename,
      categories: {
        connect: createClub.categoriesIds.map((category) => ({
          id: category,
        })),
      },
      settings: {
        create: {},
      },
      memberships: {
        create: {
          roles: [ClubRoles.Member, ClubRoles.Assistant, ClubRoles.Owner],
          status: MembershipStatus.Approved,
          user: {
            connect: { id: user.sub },
          },
        },
      },
    };

    const club = await this.clubsService.create(clubData, user.sub);

    return club;
  }

  // TODO видалити картинку якшо клуб видаляється або не створено

  @Get()
  async findMany(@Req() request: Request, @Query() query: FindClubsQueryDto) {
    const user = request.user as TokenUserPayload;

    const { categories, search, ownerId, page, limit, order, sort } = query;

    const filters: Prisma.ClubFindManyArgs = {
      where: {},
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        [sort]: order,
      },
    };

    if (ownerId) filters.where.ownerId = ownerId;
    if (search) filters.where.name = { contains: search, mode: 'insensitive' };
    // if (category) {
    //   filters.where.categories = {
    //     some: {
    //       id: category,
    //     },
    //   };
    // }

    const clubs = await this.clubsService.findMany(filters, user.sub);

    const result = clubs.map((club) => ({
      ...club,
      membership: club.memberships[0] || null,
    }));

    return result;
  }

  @Get(':id')
  async findById(@Param() { id }: IdParamDto, @Req() request: Request) {
    const user = request.user as TokenUserPayload;

    const club = await this.clubsService.findByIdFull(id, user.sub);

    const result = { ...club, membership: club.memberships[0] };

    return result;
  }

  // TODO зробити так шоб запити повертали коректні типи, а також треба переробити запити бо частина в контролері а частина в сервісі, також треба прибрати лиші поля типу юзерайді бо нафіг він треба в пошуку

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/clubs',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async update(
    @Param() { id }: IdParamDto,
    @Req() request: Request,
    @Body() updateClub: UpdateClubDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user = request.user as TokenUserPayload;

    const club = await this.clubsService.findById(id);

    if (
      !user.roles.includes(UserRoles.Moderator) ||
      club.ownerId !== user.sub
    ) {
      throw new ForbiddenException('В доступі відмовлено');
    }

    const isExist = await this.clubsService.findByName(updateClub.name);

    if (isExist) {
      throw new BadRequestException('Клуб з такою назвою уже існує');
    }

    // await this.clubsService.update(id, updateClub);

    return { message: 'Дані оновлено' };
  }

  @Delete(':id')
  async delete(@Param() { id }: IdParamDto) {
    await this.clubsService.delete(id);
    return { message: 'Клуб видалено' };
  }
}
