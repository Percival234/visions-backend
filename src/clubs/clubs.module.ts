import { Module } from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { ClubsController } from './clubs.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MembershipsService } from 'src/memberships/memberships.service';

@Module({
  controllers: [ClubsController],
  providers: [ClubsService, PrismaService, MembershipsService],
})
export class ClubsModule {}
