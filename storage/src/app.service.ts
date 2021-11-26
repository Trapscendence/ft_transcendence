import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { env } from './utils/envs';

@Injectable()
export class AppService {
  constructor(private readonly databaseService: DatabaseService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async setUserProfileUrl(userId: string, url: string) {
    const queryResult = await this.databaseService.executeQuery(
      `UPDATE ${
        env.database.schema
      }.user SET avatar = '${url}' WHERE id = ${+userId} RETURNING id;`,
    );

    if (queryResult.length === 1) return true;
    else return false;
  }
}
