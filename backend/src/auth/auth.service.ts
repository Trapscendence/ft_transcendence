import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtDTO } from './dto/jwt.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateTFA(user_secret: string, user_token: string): Promise<boolean> {
    return true;
  }

  async issueAccessToken(user: any): Promise<string> {
    const payload: JwtDTO = { id: user.id };
    const access_token: string = this.jwtService.sign(payload, {});

    return access_token;
  }

  async extractUserId(token: string): Promise<string> {
    const { id } = this.jwtService.verify(token) as JwtDTO;
    return id;
  }
}
