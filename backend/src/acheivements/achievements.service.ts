import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { schema } from 'src/utils/envs';

@Injectable()
export class AchievementsService {
  constructor(private readonly databaseService: DatabaseService) {}
  async getAllAchievements() {
    return await this.databaseService.executeQuery(`
      SELECT
        *
      FROM
        ${schema}.achievement;
    `);
  }
}
