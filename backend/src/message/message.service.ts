import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { User } from 'src/users/models/user.model';
import { schema } from 'src/utils/envs';
import { DM, Message } from './model/message.model';

@Injectable()
export class MessageService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getDM(user_id: string, other_user: string): Promise<DM[]> {
    return await this.databaseService.executeQuery(`
SELECT
  sender_id AS user_id,
  ${other_user} AS other_id,
  check_date AS checked_date
FROM
  ${schema}.dm
WHERE
  sender_id = ${user_id}
    AND
  receiver_id = ${other_user};
    `);
  }

  async getMessages(
    user_id: string,
    other_user: string,
    offset: number,
    limit: number,
  ): Promise<Message[]> {
    return await this.databaseService.executeQuery(`
  SELECT
    m.id,
    false AS received,
    m.dm_text AS content,
    m.time_stamp,
    true AS checked
  FROM
    ${schema}.message m,
    (
      SELECT
        id
      FROM
        ${schema}.dm
      WHERE
        sender_id = ${user_id}
          AND
        receiver_id = ${other_user}
    ) AS d
  WHERE
    dm_id = d.id
UNION
  SELECT
    m.id,
    false AS received,
    m.dm_text AS content,
    m.time_stamp,
    CASE
      WHEN
        m.time_stamp < d.check_date
      THEN
        false
      ELSE
        true
    END AS checked
  FROM
    ${schema}.message m,
    (
      SELECT
        id,
        check_date
      FROM
        ${schema}.dm
      WHERE
        sender_id = ${user_id}
          AND
        receiver_id = ${other_user}
    ) d
  WHERE
    dm_id = d.id
ORDER BY time_stamp DESC
OFFSET ${offset} ROWS
FETCH NEXT ${limit} ROWS ONLY;
    `);
  }

  async getDmUsers(
    user_id: string,
    offset: number,
    limit: number,
  ): Promise<User[]> {
    return await this.databaseService.executeQuery(`
SELECT
  u.id,
  u.nickname,
  u.avatar,
  u.status_message,
  u.rank_score,
  u.site_role
  t.time_stamp


SELECT


    `);
  }
}
