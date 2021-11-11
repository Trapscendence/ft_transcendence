import { Controller, UseGuards, Get, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private readonly cookieOption = {
    domain: process.env.FRONTEND_HOST,
    path: '/',
    httpOnly: false,
    secure: false,
  };

  @UseGuards(AuthGuard('42'))
  @Get('login/42')
  async issueAccessTokenFrom42(@Req() req: Request, @Res() res: Response) {
    const access_token = await this.authService.issueAccessToken(req.user);

    res.cookie('access_token', access_token, this.cookieOption);
    res.redirect(
      `http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}/`,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async deleteJWT(@Res() res: Response) {
    res.cookie('access_token', '', this.cookieOption);
  }

  @UseGuards(JwtAuthGuard)
  @Get('test')
  returnUserID(@Req() req) {
    return `JWT OK, id: ${req.user.id}`;
  }
}
