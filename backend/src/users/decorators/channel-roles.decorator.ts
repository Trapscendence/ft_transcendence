import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/users/models/user.model';

export const CHANNEL_ROLES_KEY = 'channelRoles';
export const ChannelRoles = (...roles: UserRole[]) =>
  SetMetadata(CHANNEL_ROLES_KEY, roles);
