import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { userInfo } from 'os';
import { DatabaseService } from 'src/database/database.service';
import { UserRole } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';
import { schema } from 'src/utils/envs';
import { ChannelsService } from '../channels.service';

@Injectable()
export class ChannelRoleGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = GqlExecutionContext.create(context).getContext().req;
    const session = req.session;

    req.channel_role = await this.usersService.getChannelRole(session.uid);
    req.site_role = await this.usersService.getSiteRole(session.uid);
    return req.channel_role === UserRole.OWNER ||
      req.channel_role === UserRole.MODERATOR ||
      req.site_role === UserRole.OWNER ||
      req.site_role === UserRole.MODERATOR
      ? true
      : false;
  }
}
