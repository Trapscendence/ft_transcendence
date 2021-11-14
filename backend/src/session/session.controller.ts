import { Controller, Get, Req, Res, Session, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { SessionGuard } from './guard/session.guard';

@Controller('session')
export class SessionController {
  @Get('login/42')
  @UseGuards(AuthGuard('42'))
  createSessionWith42(
    @Req() req: any,
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ) {
    session.uid = req.user.uid;
    res.redirect('/graphql');
  }

  @Get('logout')
  deleteSession(@Session() session: Record<string, any>) {
    session.destroy((err) => {
      console.log(err);
    });
  }

  @Get('test')
  @UseGuards(SessionGuard)
  returnSessionOK(@Req() req) {
    return `SessionOK, Date: ${Date.now()}`;
  }
}
