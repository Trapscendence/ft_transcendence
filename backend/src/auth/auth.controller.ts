import { Controller, UseGuards, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { Public } from './decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { env } from 'src/utils/envs';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService, // FIXME: remove this
  ) {}

  private readonly cookieOption = {
    domain: process.env.SERVER_HOST,
    path: '/',
    httpOnly: false,
    secure: false,
  };

  @Get('login/42')
  @UseGuards(AuthGuard('42'))
  @Public()
  loginWithFortyTwo(@Req() req: any, @Res() res: Response) {
    req.session.uid = req.user.id;
    res.redirect('/');
  }

  // FIXME: remove this
  @Get('login/dummy')
  @Public()
  async loginForTest(@Req() req: any, @Res() res: Response) {
    while (true) {
      try {
        console.log('hey~');
        const { id } = await this.usersService.createUserByOAuth(
          'DUMMY',
          `${Math.floor(Math.random() * 100000)}`,
        );
        req.session.uid = id;
        break;
      } catch (err) {}
    }
    res.redirect('/');
  }

  @Get('logout')
  async logout(@Req() req: any, @Res() res: Response) {
    req.session.destroy((err) => {
      if (err) throw err;
    });
    res.cookie[env.session.cookieName] = '';
    res.redirect('/');
  }

  @Get('test')
  test(@Req() req) {
    return `Login OK, id: ${req.user.id}`;
  }
}
