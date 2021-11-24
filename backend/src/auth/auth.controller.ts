import { Controller, UseGuards, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { Public } from './decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private readonly cookieOption = {
    domain: process.env.SERVER_HOST,
    path: '/',
    httpOnly: false,
    secure: false,
  };

  @Get('login/42')
  @UseGuards(AuthGuard('42'))
  @Public()
  async loginWithFortyTwo(@Req() req: any, @Res() res: Response) {
    req.session.uid = req.user.id;
    res.redirect(
      `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/`,
    );
  }

  @Get('logout')
  async logout(@Req() req: any, @Res() res: Response) {
    req.session.destroy((err) => {
      if (err) throw err;
      res.redirect('/');
    });
  }

  @Get('test')
  test(@Req() req) {
    return `Login OK, id: ${req.user.id}`;
  }
}
