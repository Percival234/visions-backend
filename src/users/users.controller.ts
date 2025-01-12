import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { Request, Response } from 'express';
import { SignUpDto } from './dto/sign-up.dto';
import { RefreshTokenGuard } from 'src/auth/guards/refresh-token.guard';
import { Prisma, User, UserRoles } from '@prisma/client';
import {
  TokenPayload,
  TokenUserPayload,
} from 'src/auth/types/token-payload.type';
import { Roles } from 'src/roles/role.decorator';
import { BlockUserDto } from './dto/block-user.dto';
import { IdParamDto } from 'src/utils/dto/id-param.dto';

@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('roles')
  async getRoles(@Body() body: { refreshToken: string }) {
    const roles = await this.authService.getRoles(body.refreshToken);
    return { roles };
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = request.user as User;

    const { accessToken, refreshToken } =
      await this.authService.getTokens(user);

    await this.authService.createSession(refreshToken, user.id);
    await this.authService.setRefreshToken(response, refreshToken);

    return { accessToken };
  }

  @Public()
  @Post('sign-up')
  async signUp(
    @Body() credentials: SignUpDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { email, password, username } = credentials;

    const isEmailExist = await this.usersService.findByEmail(email);

    if (isEmailExist) {
      throw new BadRequestException(
        'Користувач з такою електронною поштою уже існує',
      );
    }

    const isUsernameExist = await this.usersService.findByUsername(username);

    if (isUsernameExist) {
      throw new BadRequestException("Користувач з таким ім'ям уже існує");
    }

    const hash = await this.authService.hashPassword(password);

    credentials.password = hash;

    const user = await this.usersService.create(credentials);

    const { accessToken, refreshToken } =
      await this.authService.getTokens(user);

    await this.authService.createSession(refreshToken, user.id);
    await this.authService.setRefreshToken(response, refreshToken);

    return { accessToken };
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Get('access-token')
  async generateNewAccessToken(@Req() req: Request) {
    const payload = req.user as TokenPayload;

    const accessToken = await this.authService.generateAccessToken(payload);

    return { accessToken };
  }

  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh_token'];

    if (!refreshToken) {
      throw new BadRequestException('Ви вже вийшли');
    }

    await this.authService.logout(refreshToken, response);

    return { message: 'Вихід з системи' };
  }

  @Get()
  async findMany() {
    const users = await this.usersService.findMany({});
    return users;
  }

  // @Get(':id')
  // async findById(@Param() params: IdParamDto) {
  //   const user = await this.usersService.findById(params.id);
  //   return user;
  // }

  @Get('profile')
  async findProfile(@Req() request: Request) {
    const { sub } = request.user as TokenUserPayload;

    const profile = await this.usersService.findProfileById(sub);

    console.log(profile);

    return profile;
  }

  @Get('profile/:id')
  async findProfileById(@Param() { id }: IdParamDto) {
    const profile = await this.usersService.findProfileById(id);
    return profile;
  }

  // TODO добавити зміну аватарки
  @Patch(':id')
  async update(
    @Req() request: Request,
    @Param() { id }: IdParamDto,
    @Body() updateUser: UpdateUserDto,
  ) {
    const user = request.user as TokenUserPayload;

    const { email, username, newPassword, currentPassword, ...props } =
      updateUser;

    const userData: Prisma.UserUpdateInput = { ...props };

    if (user.sub !== id || !user.roles.includes(UserRoles.Admin)) {
      throw new ForbiddenException('В доступі відмовлено');
    }

    if (email) {
      const isExist = await this.usersService.findByEmail(email);

      if (isExist) {
        throw new BadRequestException(
          'Користувач з такою електронною поштою уже існує',
        );
      }

      userData.email = email;
    }

    if (username) {
      const isExist = await this.usersService.findByUsername(username);

      if (isExist) {
        throw new BadRequestException("Користувач з таким ім'ям уже існує");
      }

      userData.username = username;
    }

    if (currentPassword && newPassword) {
      const user = await this.usersService.findById(id);

      await this.authService.comparePassword(currentPassword, user.password);

      const hash = await this.authService.hashPassword(newPassword);

      if (hash === user.password) {
        throw new BadRequestException(
          'Новий пароль не може співпадати зі старим',
        );
      }

      userData.password = hash;
    }

    const updatedUser = await this.usersService.update(id, userData);

    return updatedUser;
  }

  @Roles(UserRoles.Admin, UserRoles.Moderator)
  @Patch(':id/block')
  async block(
    @Req() request: Request,
    @Param() params: IdParamDto,
    @Body() updateData: BlockUserDto,
  ) {
    const requestUser = request.user as TokenUserPayload;

    const user = await this.usersService.findById(params.id);

    if (!user) {
      throw new NotFoundException('Користувача з таким айді не знайдено');
    }

    // TODO перевірити шо адмін жеж теж має роль модератора чи якось так, хоча може йому просто її не давати
    const isUserAdmin = user.roles.includes(UserRoles.Admin);
    const isUserModerator = user.roles.includes(UserRoles.Moderator);
    const isRequestUserModerator = requestUser.roles.includes(
      UserRoles.Moderator,
    );

    if (isUserAdmin || (isRequestUserModerator && isUserModerator)) {
      throw new ForbiddenException('В доступі відмовлено');
    }

    const updatedUser = await this.usersService.update(params.id, updateData);

    return {
      message: updatedUser.isBlocked
        ? 'Користувача заблоковано'
        : 'Користувача розблоковано',
    };
  }

  @Roles(UserRoles.Admin)
  @Patch(':id/roles')
  async roles(@Param() { id }: IdParamDto, @Body() body) {}

  @Roles(UserRoles.Admin)
  @Delete()
  async deleteMany(@Param() params) {
    await this.usersService.deleteMany(params);
    return { message: 'Користувачів видалено' };
  }

  @Roles(UserRoles.Admin)
  @Delete(':id')
  async deleteById(@Param() { id }: IdParamDto) {
    await this.usersService.deleteById(id);
    return { message: 'Користувача видалено' };
  }
}
