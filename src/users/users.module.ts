import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { FollowingService } from 'src/following/following.service';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [UsersService, AuthService, PrismaService, FollowingService],
})
export class UsersModule {}
