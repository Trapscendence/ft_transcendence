import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/users/models/user.model';

export const SITE_ROLES_KEY = 'siteRoles';
export const SiteRoles = (...roles: UserRole[]) =>
  SetMetadata(SITE_ROLES_KEY, roles);
