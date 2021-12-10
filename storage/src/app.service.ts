import { Injectable, Logger } from '@nestjs/common';
import { unlinkSync } from 'fs';
import { join } from 'path';
import { DatabaseService } from './database/database.service';
import { env } from './utils/envs';

@Injectable()
export class AppService {
  private readonly logger: Logger;

  constructor(private readonly databaseService: DatabaseService) {
    this.logger = new Logger('FileSystem');
  }

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

  deleteFile(filename: string): boolean {
    const filepath = join(__dirname, '..', 'public', filename);

    try {
      unlinkSync(filepath);
      this.logger.verbose(`DELETE ${filepath}`);
      return true;
    } catch (error) {
      this.logger.error(`Error occured during delete file: ${filepath}`);
      return false;
    }
  }
}
