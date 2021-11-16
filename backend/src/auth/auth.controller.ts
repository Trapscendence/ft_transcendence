import { Controller, UseGuards, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { Public } from './decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private readonly cookieOption = {
    domain: process.env.FRONTEND_HOST,
    path: '/',
    httpOnly: false,
    secure: false,
  };

  @Get('login/42')
  @UseGuards(AuthGuard('42'))
  @Public()
  async issueAccessTokenFrom42(@Req() req: Request, @Res() res: Response) {
    const access_token = await this.authService.issueAccessToken(req.user);

    res.cookie('access_token', access_token, this.cookieOption);
    res.redirect(
      `http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}/`,
    );
  }

  @Get('logout')
  async deleteJWT(@Res() res: Response) {
    res.cookie('access_token', '', this.cookieOption);
  }

  @Get('test')
  returnUserID(@Req() req) {
    return `JWT OK, id: ${req.user.id}`;
  }
}
