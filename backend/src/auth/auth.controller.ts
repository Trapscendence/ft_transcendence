import {
  Controller,
  UseGuards,
  Get,
  Req,
  Res,
  Body,
  Post,
  Query,
  ConflictException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { env } from 'src/utils/envs';
import { UsersService } from 'src/users/users.service';
import { PassTfaGuard } from './decorators/pass-tfa-guard.decorator';
import { PassLoginGuard } from './decorators/pass-login-guard.decorator';
import { StatusService } from 'src/status/status.service';
import { UserStatus } from 'src/users/models/user.model';
import { UserID } from 'src/users/decorators/user-id.decorator';
import { GamesService } from 'src/games/games.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly statusService: StatusService,
    private readonly usersService: UsersService, // FIXME: remove this
    private readonly gamesService: GamesService,
  ) {}

  private readonly cookieOption = {
    domain: process.env.SERVER_HOST,
    path: '/',
    httpOnly: false,
    secure: false,
  };

  @Get('login/42')
  @UseGuards(AuthGuard('42'))
  @PassTfaGuard()
  @PassLoginGuard()
  async loginWithFortyTwo(@Req() req: any, @Res() res: Response) {
    if (this.statusService.getStatus(req.user.id) !== UserStatus.OFFLINE)
      await this.statusService.deleteConnection(req.user.id);
    this.statusService.newConnection(req.user.id, req.session.id);
    req.session.uid = req.user.id;
    const tfa_secret = await this.usersService.getSecret(req.user.id);
    if (tfa_secret) {
      req.session.tfa_secret = tfa_secret;
      res.redirect(env.redirect.totp);
    } else {
      res.redirect(req.user.redirect);
    }
  }

  // FIXME: remove this
  @Get('login/dummy')
  @PassTfaGuard()
  @PassLoginGuard()
  async loginForTest(@Req() req: any, @Res() res: Response) {
    while (true) {
      try {
        const { id } = await this.usersService.createUserByOAuth(
          'DUMMY',
          `${Math.floor(Math.random() * 100000)}`,
        );
        req.session.uid = id;
        break;
      } catch (err) {}
    }
    res.redirect('/register');
  }

  @Post('totp')
  @PassTfaGuard()
  async validateTotp(
    @Req() req: any,
    @Res() res: Response,
    @Body('user_token') userToken,
  ) {
    if (req.session.tfa_secret) {
      const passed = await this.authService.validateTFA(
        req.session.tfa_secret,
        userToken,
      );
      if (passed) delete req.session.tfa_secret;
      else {
        req.session.destroy((err) => {
          if (err) throw err;
        });
        res.cookie[env.session.cookieName] = '';
      }
    }
    res.redirect('/');
  }

  @Get('logout')
  async logout(@UserID() user_id, @Req() req: any, @Res() res: Response) {
    this.gamesService.unregisterGame(user_id);
    await this.statusService.deleteConnection(user_id);
    req.session.destroy();
    res.clearCookie(env.session.cookieName);
    res.redirect('/');
  }

  @Get('test')
  test(@Req() req) {
    return `Login OK, id: ${req.session.uid}`;
  }
}
