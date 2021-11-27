import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { env } from 'src/utils/envs';

@Injectable()
export class AchievementsService {
  constructor(private readonly databaseService: DatabaseService) {}
  async getAllAchievements() {
    return await this.databaseService.executeQuery(`
      SELECT
        *
      FROM
        ${env.database.schema}.achievement;
    `);
  }
}
