import { SetMetadata } from '@nestjs/common';

export const PASS_LOGIN_GUARD_KEY = 'passLoginGuard';
export const PassLoginGuard = () => SetMetadata(PASS_LOGIN_GUARD_KEY, true);
