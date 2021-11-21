import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-42';
import { UsersService } from 'src/users/users.service';

// @Injectable()
// export class FTStrategy extends PassportStrategy(Strategy, '42') {
//   constructor(private readonly usersService: UsersService) {
//     super({
//       clientID: process.env.FORTYTWO_APP_ID,
//       clientSecret: process.env.FORTYTWO_APP_SECRET,
//       callbackURL: process.env.FORTYTWO_REDIRECT_URI,
//       profileFields: {
//         id: function (obj) {
//           return String(obj.obj);
//         },
//       },
//     });
//   }

//   async validate(
//     accessToken: string,
//     refreshToken: string,
//     profile: Profile,
//     cb: VerifyCallback,
//   ) {
//     const oauth_id = profile.id;
//     const user = await this.usersService.getOrCreateUserByOAuth(
//       oauth_id,
//       'FORTYTWO',
//     );

//     if (user) {
//       return cb(null, { id: user.id });
//     } else {
//       return cb('Bad query result', null);
//     }
//   }
// }

@Injectable()
export class FTStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private readonly usersService: UsersService) {
    super({
      clientID: process.env.FORTYTWO_APP_ID,
      clientSecret: process.env.FORTYTWO_APP_SECRET,
      callbackURL: process.env.FORTYTWO_REDIRECT_URI,
      profileFields: {
        id: function (obj) {
          return obj.obj;
        },
      },
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    cb: VerifyCallback,
  ) {
    const oauth_id = profile.id ?? profile._json.id;
    const user = await this.usersService.getOrCreateUserByOAuth(
      String(oauth_id),
      'FORTYTWO',
    );

    if (user) {
      return cb(null, { id: user.id });
    } else {
      return cb('Bad query result', null);
    }
  }
}
