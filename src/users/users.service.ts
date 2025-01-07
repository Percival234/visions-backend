import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dto/sign-up.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUser: SignUpDto) {
    return await this.prismaService.user.create({
      data: {
        ...createUser,
        settings: {
          create: {},
        },
      },
    });
  }

  async findMany(filters) {
    return await this.prismaService.user.findMany();
  }

  async findByEmail(email: string) {
    return await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  // TODO прибрати чутливі дані такі як пароль

  async findProfileById(id: string) {
    return await this.prismaService.user.findUnique({
      where: {
        id,
      },
      include: {
        settings: true,
      },
    });
  }

  async findById(id: string) {
    return await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findByUsername(username: string) {
    return await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });
  }

  async update(id: string, updateUser: Prisma.UserUpdateInput) {
    return await this.prismaService.user.update({
      where: { id },
      data: updateUser,
    });
  }

  async deleteById(id: string) {}

  async deleteMany(filters) {}
}
