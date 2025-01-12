import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { TokenPayload, TokenUserPayload } from './types/token-payload.type';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async validateUserByCredentials(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    await this.comparePassword(password, user.password);

    return user;
  }

  async validateUserById(id: string) {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    return user;
  }

  async getTokens(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: TokenUserPayload = { sub: user.id, roles: user.roles };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '30d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();

    const hash = await bcrypt.hash(password, salt);

    return hash;
  }

  async comparePassword(hashedPassword: string, password: string) {
    const isMatch = await bcrypt.compare(hashedPassword, password);

    if (!isMatch) {
      throw new BadRequestException('Невірний пароль');
    }

    return isMatch;
  }

  async generateAccessToken(payload: TokenPayload) {
    const newPayload: TokenUserPayload = {
      sub: payload.sub,
      roles: payload.roles,
    };

    const accessToken = this.jwtService.sign(newPayload);

    return accessToken;
  }

  async setRefreshToken(response: Response, refreshToken: string) {
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  async logout(refreshToken: string, response: Response) {
    await this.deleteRefreshToken(response);
    await this.deleteSession(refreshToken);
  }

  async deleteRefreshToken(response: Response) {
    response.clearCookie('refresh_token', {
      httpOnly: true,
      secure: false,
    });
    // TODO чи треба тут ці опції бо ядесь без них використав
  }

  async getRoles(refreshToken: string) {
    try {
      const payload: TokenPayload = await this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      return payload.roles;
    } catch (error) {
      // TODO (перевірити чи рефреш токен не входить в перевірку помилки в аксіосі
      throw new UnauthorizedException('Не валідний токен');
    }
  }

  async createSession(refreshToken: string, userId: string) {
    // TODO якшо сесій більше 3 то видаляти всі сесії
    const now = new Date(); // Поточна дата та час
    const expiresAt = new Date(now);
    expiresAt.setDate(now.getDate() + 30);

    await this.prismaService.refreshSession.create({
      data: {
        expiresAt,
        userId,
        refreshToken,
      },
    });
  }

  async getSessionByToken(refreshToken: string) {
    const session = await this.prismaService.refreshSession.findUnique({
      where: {
        refreshToken,
      },
    });

    return session;
  }

  async getUsersSessions(userId: string) {
    const sessions = await this.prismaService.refreshSession.findMany({
      where: {
        userId,
      },
    });

    return sessions;
  }

  async deleteSession(refreshToken: string) {
    await this.prismaService.refreshSession.delete({
      where: { refreshToken },
    });
  }

  async deleteSessionsByUserId(userId: string) {
    await this.prismaService.refreshSession.deleteMany({
      where: { userId },
    });
  }

  async deleteExpiredSessions() {
    const now = new Date(); // Поточний час
    // TODO schedule
    // await this.prismaService.refreshSession.deleteMany({
    //   where: {
    //     expiresAt: {
    //       lt: now,
    //     },
    //   },
    // });
  }
}
