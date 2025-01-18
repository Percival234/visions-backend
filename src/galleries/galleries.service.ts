import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GalleriesService {
  constructor(private readonly prismaService: PrismaService) {}
  async findByUserId(userId: string) {
    return await this.prismaService.gallery.findUnique({
      where: { userId },
      include: {
        images: true,
        collections: true,
      },
    });
  }
}
