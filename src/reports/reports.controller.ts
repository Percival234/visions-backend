import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Roles } from 'src/roles/role.decorator';
import { Request } from 'express';
import { Prisma, UserRoles } from '@prisma/client';
import { IdParamDto } from 'src/utils/dto/id-param.dto';
import { FindReportsQueryDto } from './dto/find-reports.dto';
import { TokenUserPayload } from 'src/auth/types/token-payload.type';
import { DeleteReportsQueryDto } from './dto/delete-reports.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  async create(@Req() request: Request, @Body() createReport: CreateReportDto) {
    const user = request.user as TokenUserPayload;

    const lastReport = await this.reportsService.findByUserId(user.sub);

    if (lastReport) {
      const timer = new Date(Date.now() - 5 * 60 * 1000);

      if (new Date(lastReport.createdAt) > timer) {
        throw new ForbiddenException(
          'Ви можете надсилати звіти не частіше, ніж раз в 5 хвилин.',
        );
      }
    }

    const report = { ...createReport, userId: user.sub };

    await this.reportsService.create(report);

    return { message: 'Звіт відправлено' };
  }

  @Roles(UserRoles.Admin, UserRoles.Moderator)
  @Get()
  async findMany(@Query() query: FindReportsQueryDto) {
    const { isMarked, isRead, userId, limit, page, sort, order, type } = query;

    const filters: Prisma.ReportFindManyArgs = {
      where: {},
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        [sort]: order,
      },
    };

    if (typeof isMarked === 'boolean') filters.where.isMarked = isMarked;
    if (isRead) filters.where.read = { not: null };
    if (isRead === false) filters.where.read = null;
    if (userId) filters.where.userId = userId;
    if (type) filters.where.type = type;

    const reports = await this.reportsService.findMany(filters);

    return reports;
  }

  @Roles(UserRoles.Admin, UserRoles.Moderator)
  @Get(':id')
  async findById(@Param() { id }: IdParamDto) {
    const report = await this.reportsService.findById(id);

    if (!report?.read) {
      await this.reportsService.update(report.id, { read: new Date() });
    }

    return report;
  }

  @Roles(UserRoles.Admin, UserRoles.Moderator)
  @Patch(':id')
  async update(
    @Param() { id }: IdParamDto,
    @Body() updateReport: UpdateReportDto,
  ) {
    await this.reportsService.update(id, updateReport);

    return null;
  }

  @Roles(UserRoles.Admin, UserRoles.Moderator)
  @Delete()
  async deleteMany(@Query() query: DeleteReportsQueryDto) {
    const { ids, isMarked, isRead } = query;

    const filters: Prisma.ReportDeleteManyArgs = { where: {} };

    if (ids?.length) filters.where.id = { in: ids };
    if (isMarked) filters.where.isMarked = isMarked;
    if (isRead) filters.where.read = { not: null };

    if (Object.keys(filters.where).length) {
      await this.reportsService.deleteMany(filters);
    }

    return { message: 'Звіти видалено' };
  }

  @Roles(UserRoles.Admin, UserRoles.Moderator)
  @Delete(':id')
  async deleteById(@Param() { id }: IdParamDto) {
    await this.reportsService.deleteById(id);

    return { message: 'Звіт видалено' };
  }
}
