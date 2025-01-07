import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { ClubsModule } from './clubs/clubs.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ContestsModule } from './contests/contests.module';
import { ArticlesModule } from './articles/articles.module';
import { ImagesModule } from './images/images.module';
import { CollectionsModule } from './collections/collections.module';
import { ReportsModule } from './reports/reports.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './roles/roles.guard';
import { ConfigModule } from '@nestjs/config';
import { MembershipsModule } from './memberships/memberships.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    UsersModule,
    CategoriesModule,
    PostsModule,
    CommentsModule,
    ClubsModule,
    NotificationsModule,
    ContestsModule,
    ArticlesModule,
    ImagesModule,
    CollectionsModule,
    ReportsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MembershipsModule,
    CacheModule.register({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
