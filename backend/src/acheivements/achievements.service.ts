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

  async getAchieved(user_id: string) {
    return await this.databaseService.executeQuery(`
      WITH ad AS (
        SELECT
          achievement_id id,
          time_stamp time_stamp,
          checked checked
        FROM
          ${env.database.schema}.achieved
        WHERE
          user_id = ${user_id}
      )
      SELECT
        am.id,
        am.name,
        am.icon,
        ad.time_stamp,
        ad.checked
      FROM
        ${env.database.schema}.achievement am
      INNER JOIN
        ad
      ON
        am.id = ad.id
      ORDER BY
        am.id ASC;
    `);
  }

  async achieveOne(user_id: string, ach_id: string) {
    const array = await this.databaseService.executeQuery(
      `
      INSERT INTO
        ${env.database.schema}.achieved(
          user_id,
          achievement_id,
          time_stamp,
          checked
        )
      VALUES
        (
          ($1),
          ($2),
          ${new Date().getTime()},
          false
        )
      ON CONFLICT
        ON CONSTRAINT
          user_id_achievement_id_unique
      DO NOTHING
      RETURNING *;
    `,
      [user_id, ach_id],
    );
    return array.length ? true : false;
  }

  async checkAchieved(user_id: string, ach_id: string) {
    const array = await this.databaseService.executeQuery(
      `
      UPDATE
        ${env.database.schema}.achieved
      SET
        checked = true
      WHERE
        user_id = ($1)
          AND
        achievement_id = ($2)
    `,
      [user_id, ach_id],
    );
    return array.length ? true : false;
  }
}
