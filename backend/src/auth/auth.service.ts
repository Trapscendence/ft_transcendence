import { ConflictException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { authenticator } from 'otplib';
import { env } from 'src/utils/envs';

@Injectable()
export class AuthService {
  constructor(private readonly databaseService: DatabaseService) {}

  async issueTfaUri(user_id: string): Promise<string> {
    const secret = authenticator.generateSecret();
    const nicknameQueryResult = await this.databaseService.executeQuery(`
      SELECT nickname FROM ${env.database.schema}.user WHERE id = ${+user_id};
    `);
    const updateQueryResult = await this.databaseService.executeQuery(`
      UPDATE ${
        env.database.schema
      }.user SET tfa_secret = '${secret}' WHERE id = ${+user_id} RETURNING id;
    `);

    if (nicknameQueryResult.length === 1 && updateQueryResult.length === 1) {
      const otpauth = authenticator.keyuri(
        nicknameQueryResult[0].nickname,
        env.name,
        secret,
      );
      return otpauth;
    } else throw new ConflictException(`No user with {id: ${+user_id}}`);
  }

  async validateTFA(user_secret: string, user_token: string): Promise<boolean> {
    return authenticator.check(user_token, user_secret);
  }
}
