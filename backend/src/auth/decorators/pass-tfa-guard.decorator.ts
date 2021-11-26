import { SetMetadata } from '@nestjs/common';

export const PASS_TFA_GUARD_KEY = 'passTfaGuard';
export const PassTfaGuard = () => SetMetadata(PASS_TFA_GUARD_KEY, true);
