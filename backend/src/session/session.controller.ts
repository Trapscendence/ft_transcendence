import { Controller, Get, Req, Session, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SessionGuard } from './guard/session.guard';

@Controller('session')
export class SessionController {
  @Get('login/42')
  @UseGuards(AuthGuard('42'))
  createSessionWith42(
    @Req() req: any,
    @Session() session: Record<string, any>,
  ) {
    session.uid = req.user.uid;
  }

  @Get('logout')
  deleteSession(@Session() session: Record<string, any>) {
    session.destroy((err) => {
      console.log(err);
    });
  }

  @Get('test')
  @UseGuards(SessionGuard)
  returnSessionOK() {
    return 'SessionOK';
  }
}
