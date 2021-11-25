import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async validateTFA(user_secret: string, user_token: string): Promise<boolean> {
    return true;
  }
}
