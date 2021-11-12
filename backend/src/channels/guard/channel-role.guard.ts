import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { userInfo } from 'os';
import { DatabaseService } from 'src/database/database.service';
import { UserRole } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';
import { schema } from 'src/utils/envs';
import { ChannelsService } from '../channels.service';

@Injectable()
export class ChannelRoleGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    const req = ctx.req;

    let token: string;

    if (ctx.authorization) {
      token = ctx.authorization;
    } else if (ctx.req) {
      token = ctx.req.headers.authorization;
    } else {
      throw 'What?';
    }

    const payload = this.jwtService.decode(token.split(' ')[1]);

    if (typeof payload !== 'string') {
      const user_id = payload.id;

      ctx.channel_role = await this.usersService.getChannelRole(user_id);
      ctx.site_role = await this.usersService.getSiteRole(user_id);
      return ctx.channel_role === UserRole.OWNER ||
        ctx.channel_role === UserRole.MODERATOR ||
        ctx.site_role === UserRole.OWNER ||
        ctx.site_role === UserRole.MODERATOR
        ? true
        : false;
    }
  }
}
