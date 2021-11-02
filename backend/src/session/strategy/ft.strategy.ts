import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-42';
import { DatabaseService } from 'src/database/database.service';
import { UsersService } from 'src/users/users.service';
import { schema } from 'src/utils/envs';

@Injectable()
export class FTStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private readonly usersService: UsersService,
    private readonly databaseService: DatabaseService,
  ) {
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

    const queryResult: any[] = await this.databaseService.executeQuery(
      `SELECT id FROM ${schema}.user WHERE oauth_id = '${oauthID}' AND oauth_type = 'FORTYTWO'`,
    );

    const userID =
      queryResult.length === 0
        ? await this.usersService.createUser(oauthID, 'FORTYTWO')
        : queryResult[0].id;

    return cb(null, { uid: userID });
  }
}
