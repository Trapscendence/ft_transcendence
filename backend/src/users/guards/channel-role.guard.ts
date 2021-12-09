import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { UserRole } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';
import { CHANNEL_ROLES_KEY } from '../decorators/channel-roles.decorator';

@Injectable()
export class ChannelRoleGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(
    context: ExecutionContext & { req: any },
  ): Promise<boolean> {
    const requiredRoles: UserRole[] = this.reflector.get<UserRole[]>(
      CHANNEL_ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles) return true;

    let session: { uid: string };

    if (context.getType() === 'http') {
      session = context.switchToHttp().getRequest().session;
    } else if (context.getType<GqlContextType>() === 'graphql') {
      session = GqlExecutionContext.create(context).getContext().req.session;
    } else {
      throw `Unexpected context type: ${context.getType()}`;
    }

    const userChannelRole: UserRole = await this.usersService.getChannelRole(
      session.uid,
    );
    const userSiteRole: UserRole = await this.usersService.getSiteRole(
      session.uid,
    );

    if (userSiteRole === UserRole.OWNER || userSiteRole === UserRole.ADMIN) {
      return true;
    }

    for (const requiredRole of requiredRoles) {
      if (
        requiredRole === UserRole.OWNER &&
        userChannelRole !== UserRole.OWNER
      ) {
        return false;
      } else if (
        requiredRole === UserRole.ADMIN &&
        userChannelRole === UserRole.USER
      ) {
        return false;
      }
    }

    return true;
  }
}
