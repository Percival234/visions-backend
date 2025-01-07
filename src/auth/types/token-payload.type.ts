import { User } from '@prisma/client';

export type TokenUserPayload = {
  sub: User['id'];
  roles: User['roles'];
};

export type TokenPayload = TokenUserPayload & {
  iat: number;
  exp: number;
};
