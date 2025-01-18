import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    return super.canActivate(context);
  }

  handleRequest(error: unknown, payload: any, info: Error) {
    if (info?.message === 'No auth token') {
      throw new UnauthorizedException('Токен доступу відсутній');
    }

    if (info?.message === 'jwt expired') {
      throw new UnauthorizedException('Токен доступу недійсний');
    }

    if (error || !payload) {
      throw new UnauthorizedException('Помилка авторизації');
    }

    return payload;
  }
}
