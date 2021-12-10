import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-42';
import { UsersService } from 'src/users/users.service';
import { env } from 'src/utils/envs';

@Injectable()
export class FTStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private readonly usersService: UsersService) {
    super(env.fortytwoStrategy);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    cb: VerifyCallback,
  ) {
    const oauth_id = profile.id;
    let redirect = '/';
    let user = await this.usersService.getUserByOAuth('FORTYTWO', oauth_id);
    if (!user) {
      user = await this.usersService.createUserByOAuth('FORTYTWO', oauth_id);
      redirect = '/register';
    }

    if (user) {
      return cb(null, { id: user.id, redirect });
    } else {
      return cb('Bad query result', null);
    }
  }
}
