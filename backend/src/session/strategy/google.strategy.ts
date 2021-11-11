import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { User } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly usersService: UsersService) {
    super({
      clientID: process.env.GOOGLE_APP_ID,
      clientSecret: process.env.GOOGLE_APP_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
      scope: ['https://www.googleapis.com/auth/userinfo.profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    cb: VerifyCallback,
  ) {
    const oauthID = profile.id;
    const user: User = await this.usersService.getOrCreateUserByOAuth(
      oauthID,
      'GOOGLE',
    );

    if (user) {
      return cb(null, { uid: user.id });
    } else {
      return cb('Bad query result', null);
    }
  }
}
