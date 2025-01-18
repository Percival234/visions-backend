import { Module } from '@nestjs/common';
import { GalleriesService } from './galleries.service';
import { GalleriesController } from './galleries.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [GalleriesController],
  providers: [GalleriesService, PrismaService],
})
export class GalleriesModule {}
