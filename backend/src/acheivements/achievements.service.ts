import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { env } from 'src/utils/envs';
import { Achievement } from './models/achievement.model';

@Injectable()
export class AchievementsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllAchievements(): Promise<Achievement[]> {
    return await this.databaseService.executeQuery(`
      SELECT
        id,
        name,
        time_stamp
      FROM
        ${env.database.schema}.achievement;
    `);
  }

  async changeAchievementName(
    new_name: string,
    ach_id: string,
  ): Promise<boolean> {
    const array = await this.databaseService.executeQuery(
      `
      UPDATE
        ${env.database.schema}.achievement
      SET
        name = ($1)
      WHERE
        id = ($2)
      RETURNING *;
    `,
      [new_name, ach_id],
    );
    return array.length ? true : false;
  }
}
