import { Controller, Get, Param } from '@nestjs/common';
import { GalleriesService } from './galleries.service';

@Controller({ path: 'galleries', version: '1' })
export class GalleriesController {
  constructor(private readonly galleriesService: GalleriesService) {}

  @Get(':userId')
  async findByUserId(@Param() { userId }: { userId: string }) {
    const gallery = await this.galleriesService.findByUserId(userId);

    return gallery;
  }
}
