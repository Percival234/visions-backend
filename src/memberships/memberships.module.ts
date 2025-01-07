import { Module } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { MembershipsController } from './memberships.controller';
import { ClubsService } from 'src/clubs/clubs.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MembershipsController],
  providers: [MembershipsService, ClubsService, PrismaService],
})
export class MembershipsModule {}
