import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  handleRequest(
    error: any,
    payload: any,
    info: Error,
    context: ExecutionContext,
  ) {
    const response: Response = context.switchToHttp().getResponse();

    if (info?.message === 'No auth token') {
      throw new UnauthorizedException('Токен відсутній');
    }

    if (info?.message === 'jwt expired') {
      response.clearCookie('refreshToken');
      throw new UnauthorizedException('Токен недійсний');
    }

    if (error || !payload) {
      throw new UnauthorizedException(error?.message || 'Помилка авторизації');
    }

    return payload;
  }
}
