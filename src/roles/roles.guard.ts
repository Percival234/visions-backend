import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './role.decorator';
import { TokenUserPayload } from 'src/auth/types/token-payload.type';
import { UserRoles } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const user: TokenUserPayload = context.switchToHttp().getRequest().user;

    const isAllow = requiredRoles.some((role) => user.roles?.includes(role));

    if (!isAllow) {
      throw new ForbiddenException('В доступі відмовлено');
    }

    return true;
  }
}
