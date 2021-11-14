import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-42';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FTStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private readonly usersService: UsersService) {
    super({
      clientID: process.env.FORTYTWO_APP_ID,
      clientSecret: process.env.FORTYTWO_APP_SECRET,
      callbackURL: process.env.FORTYTWO_REDIRECT_URI,
      scope: ['public'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    cb: VerifyCallback,
  ) {
    const oauthID = profile.id;
    const user = await this.usersService.getOrCreateUserByOAuth(
      oauthID,
      'FORTYTWO',
    );

    if (user) {
      return cb(null, { uid: user.id });
    } else {
      return cb('Bad query result', null);
    }
  }
}
