import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { JwtDTO } from 'src/auth/dto/jwt.dto';
import { UserRole } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';
import { CHANNEL_ROLES_KEY } from '../decorators/channel-roles.decorator';

@Injectable()
export class ChannelRoleGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles: UserRole[] = this.reflector.get<UserRole[]>(
      CHANNEL_ROLES_KEY,
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true;
    }

    let user: JwtDTO;

    if (context.getType() === 'http') {
      user = context.switchToHttp().getRequest().user;
    } else if (context.getType<GqlContextType>() === 'graphql') {
      user = GqlExecutionContext.create(context).getContext().req.user;
    } else {
      throw `Unexpected context type: ${context.getType()}`;
    }

    const userChannelRole: UserRole = await this.usersService.getChannelRole(
      user.id,
    );
    const userSiteRole: UserRole = await this.usersService.getSiteRole(user.id);

    if (
      userSiteRole === UserRole.OWNER ||
      userSiteRole === UserRole.MODERATOR
    ) {
      return true;
    }

    for (const requiredRole of requiredRoles) {
      if (
        requiredRole === UserRole.OWNER &&
        userChannelRole !== UserRole.OWNER
      ) {
        return false;
      } else if (
        requiredRole === UserRole.MODERATOR &&
        userChannelRole === UserRole.USER
      ) {
        return false;
      }
    }

    return true;
  }
}
