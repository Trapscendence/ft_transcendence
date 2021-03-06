import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { User, UserRole } from './models/user.model';
import { env } from 'src/utils/envs';
import { sqlEscaper } from 'src/utils/sqlescaper.utils';
import { Channel } from 'src/channels/models/channel.model';
import { GamesService } from 'src/games/games.service';
import { Game } from 'src/games/models/game.model';
import { Match } from 'src/games/models/match.model';
import { AchievementsService } from 'src/acheivements/achievements.service';
import { FileUpload } from 'graphql-upload';
import { StorageService } from 'src/storage/storage.service';
import { ReadStream } from 'fs';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private databaseService: DatabaseService,
    @Inject(forwardRef(() => GamesService))
    private readonly gamesService: GamesService,
    private readonly achievementsService: AchievementsService,
    private readonly storageService: StorageService,
  ) {}

  async getUserById(id: string): Promise<User | null> {
    const array = await this.databaseService.executeQuery(`
      SELECT
        id,
        nickname,
        status_message,
        rank_score,
        site_role,
        DENSE_RANK() OVER (
          ORDER BY
            rank_score DESC
        ) rank
      FROM
        ${env.database.schema}.user
      WHERE
        id = '${id}';
      `);
    if (array.length) return array[0];
    throw new NotFoundException('No such user.');
  }

  async getUserByNickname(nickname: string): Promise<User | null> {
    nickname = sqlEscaper(nickname);
    const array = await this.databaseService.executeQuery(`
      SELECT
        id,
        nickname,
        status_message,
        rank_score,
        site_role,
        DENSE_RANK() OVER (
          ORDER BY
            rank_score DESC
        ) rank
      FROM
        ${env.database.schema}.user
      WHERE
        nickname = '${nickname}';
    `);
    if (array.length) return array[0];
    throw new NotFoundException('No such user.');
  }

  async getUserByOAuth(
    oauth_type: string,
    oauth_id: string,
  ): Promise<{ id: string; tfa_secret: string } | null> {
    const selectQueryResult = await this.databaseService.executeQuery(`
      SELECT
        id,
        tfa_secret
      FROM
        ${env.database.schema}.user
      WHERE
        oauth_id = '${oauth_id}'
      AND
        oauth_type = '${oauth_type}';
    `);

    if (selectQueryResult.length === 1) return selectQueryResult[0];
    else if (selectQueryResult.length === 0) return null;
  }

  async createUserByOAuth(
    oauth_type: string,
    oauth_id: string,
  ): Promise<{ id: string; tfa_secret: string }> {
    const insertQueryResult = await this.databaseService.executeQuery(`
    INSERT INTO ${env.database.schema}.user(
      nickname,
      oauth_id,
      oauth_type
    ) VALUES (
      '${oauth_type}-${oauth_id}',
      '${oauth_id}',
      '${oauth_type}'
    ) RETURNING id, tfa_secret;
    `);

    if (insertQueryResult.length === 1) {
      this.achievementsService.achieveOne(insertQueryResult[0].id, '1');
      return insertQueryResult[0];
    } else
      throw new ConflictException(
        `Conflict with oauth data (oauth_type: ${oauth_type}, oauth_id: ${oauth_id})`,
      );
  }

  async getUsers(
    ladder: boolean,
    offset: number,
    limit: number,
  ): Promise<User[]> {
    return this.databaseService.executeQuery(`
      SELECT
        id,
        nickname,
        status_message,
        rank_score,
        site_role,
        DENSE_RANK() OVER (
          ORDER BY
            rank_score DESC
        ) rank
      FROM
        ${env.database.schema}.user
      ${ladder ? 'ORDER BY rank_score DESC' : 'ORDER BY id'}
      ${limit ? `LIMIT ${limit} ${offset ? `OFFSET ${offset}` : ''}` : ''}
    `);
  }

  async setNickname(user_id: string, nickname: string): Promise<boolean> {
    const existence = await this.databaseService.executeQuery(
      `
      SELECT
        id
      FROM
        ${env.database.schema}.user
      WHERE
        nickname = ($1);
    `,
      [nickname],
    );
    if (existence.length) return false;

    const array = await this.databaseService.executeQuery(
      `
      UPDATE
        ${env.database.schema}.user
      SET
        nickname = ($1)
      WHERE
        id = ($2)
      RETURNING *;
    `,
      [nickname, user_id],
    );
    return array.length ? true : null;
  }

  async getSecret(user_id: string): Promise<string> {
    const selectQuery = await this.databaseService.executeQuery(`
      SELECT
        tfa_secret
      FROM
        ${env.database.schema}.user
      WHERE
        id = ${+user_id};
    `);

    if (selectQuery.length === 1) return selectQuery[0].tfa_secret;
    else throw new ConflictException(`No user with { user_id: ${user_id} }`);
  }

  async updateAvatar(user_id: string, file: FileUpload) {
    const fileUrl = await this.storageService.post(
      file.createReadStream(),
      file.filename,
    );
    const updatedId = (
      await this.databaseService.executeQuery(
        `UPDATE ${
          env.database.schema
        }.user SET avatar = '${fileUrl}' WHERE id = ${+user_id} RETURNING id;`,
      )
    ).at(0)?.id;
    if (updatedId) return true;
    else return false;
  }

  async deleteAvatar(user_id: string): Promise<boolean> {
    const filename = (
      await this.databaseService.executeQuery(
        `SELECT avatar FROM ${env.database.schema}.user WHERE id = ${+user_id}`,
      )
    ).at(0)?.avatar;
    if (!filename) return true;
    else this.storageService.delete(filename);

    const id = (
      await this.databaseService.executeQuery(
        `UPDATE ${
          env.database.schema
        }.user SET avatar = NULL WHERE id = ${+user_id} RETURNING id`,
      )
    ).at(0)?.id;
    if (id) return true;
    else return false;
  }

  async findDefaultAvatar(): Promise<string> {
    return (
      await this.databaseService.executeQuery(
        `SELECT url FROM ${env.database.schema}.storage_url WHERE filename = 'default_avatar';`,
      )
    ).at(0)?.url;
  }

  async createDefaultAvatar(fileStream: ReadStream, filename: string) {
    const defaultAvatar = await this.findDefaultAvatar();
    if (defaultAvatar) {
      this.logger.verbose(`Skip creating default avatar`);
      return false;
    }
    const url = await this.storageService.post(fileStream, filename);
    await this.databaseService.executeQuery(
      `INSERT INTO ${env.database.schema}.storage_url VALUES('default_avatar', '${url}');`,
    );
    this.logger.verbose(`Create default avatar: ${filename}`);
    return true;
  }

  async deleteDefaultAvatar() {
    const filename = (
      await this.databaseService.executeQuery(
        `SELECT url FROM ${env.database.schema}.storage_url WHERE filename = 'default_avatar';`,
      )
    ).at(0)?.url;
    if (!filename) return true;

    await this.storageService.delete(filename);
    return true;
  }

  async addFriend(user_id: string, friend_id: string): Promise<boolean> {
    if (user_id === friend_id)
      throw new BadRequestException('One cannot be their own friend');
    const array: Array<User> = await this.databaseService.executeQuery(`
      INSERT INTO ${env.database.schema}.friend( my_id, friend_id )
      VALUES
        (
          ( SELECT id from ${env.database.schema}.user WHERE id = ${user_id} ),
          ( SELECT id from ${env.database.schema}.user WHERE id = ${friend_id} )
        ),
        (
          ( SELECT id from ${env.database.schema}.user WHERE id = ${friend_id} ),
          ( SELECT id from ${env.database.schema}.user WHERE id = ${user_id} )
        )
      ON CONFLICT
        ON CONSTRAINT friend_pk
      DO NOTHING
      RETURNING *;
    `);
    return !(array.length === 0);
  }

  async deleteFriend(user_id: string, friend_id: string): Promise<boolean> {
    if (user_id === friend_id)
      throw new BadRequestException('One cannot have themself as a friend');
    const array: Array<User> = await this.databaseService.executeQuery(`
      DELETE FROM
        ${env.database.schema}.friend f
      WHERE
        ( f.my_id = ${user_id} AND f.friend_id = ${friend_id} )
        OR
        ( f.my_id = ${friend_id} AND f.friend_id = ${user_id} )
      RETURNING *;
    `);
    return !(array.length === 0);
  }

  async getFriends(id: string): Promise<User[]> {
    return await this.databaseService.executeQuery(`
      SELECT
        u.id,
        nickname,
        status_message,
        rank_score,
        site_role
      FROM
        ${env.database.schema}.user u
      INNER JOIN
        ${env.database.schema}.friend f
          ON
        u.id = f.friend_id
      WHERE f.my_id = '${id}';
    `);
  }

  async addToBlackList(user_id: string, black_id: string): Promise<boolean> {
    if (user_id === black_id)
      throw new BadRequestException('One cannot block themself');
    const array: Array<User> = await this.databaseService.executeQuery(`
      INSERT INTO ${env.database.schema}.block( blocker_id, blocked_id )
      VALUES
      (
        ( SELECT id from ${env.database.schema}.user WHERE id = ${user_id} ),
        ( SELECT id from ${env.database.schema}.user WHERE id = ${black_id} )
      )
      ON CONFLICT
        ON CONSTRAINT block_pk
      DO NOTHING
      RETURNING *;
    `);
    if (!array.length) throw new BadRequestException('No such user.');
    return true;
  }

  async deleteFromBlackList(
    user_id: string,
    black_id: string,
  ): Promise<boolean> {
    if (user_id === black_id)
      throw new BadRequestException('One cannot block themself');

    const array: Array<User> = await this.databaseService.executeQuery(`
      DELETE FROM
        ${env.database.schema}.block b
      WHERE
        ( b.blocker_id = ${user_id} AND b.blocked_id = ${black_id} )
      RETURNING *;
    `);

    return !!array.length;
  }

  async unregister(user_id: string): Promise<boolean> {
    const queryResult = await this.databaseService.executeQuery(
      `DELETE FROM ${
        env.database.schema
      }.user WHERE id = ${+user_id} RETURNING id;`,
    );
    if (queryResult.length === 1) return true;
    else return false;
  }

  /*
   ** ANCHOR: ResolveField
   */

  async getAvatar(id: string): Promise<string> {
    const avatar = (
      await this.databaseService.executeQuery(
        `SELECT avatar FROM ${env.database.schema}.user WHERE id = ${+id};`,
      )
    ).at(0).avatar;
    if (avatar) return avatar;
    else return await this.findDefaultAvatar();
  }

  async getFriend(id: string): Promise<User[]> {
    return await this.databaseService.executeQuery(`
      SELECT
        id,
        nickname,
        status_message,
        rank_score,
        site_role
      FROM
        ${env.database.schema}.user
      WHERE
        id = '${id}'
      INNER JOIN
        id ON ${env.database.schema}.user.id = ${env.database.schema}.friend.my_id;
    `);
  }

  async getBlackList(id: string): Promise<User[]> {
    return await this.databaseService.executeQuery(`
      WITH b as (
        SELECT
          blocked_id id
        FROM
          ${env.database.schema}.block
        WHERE
          blocker_id = ${id}
      )
      SELECT
        u.id,
        u.nickname,
        u.status_message,
        u.rank_score,
        u.site_role,
        DENSE_RANK() OVER (
          ORDER BY
            u.rank_score DESC
        ) rank
      FROM
        ${env.database.schema}.user u
      INNER JOIN
        b
      ON
        u.id = b.id;
    `);
  }

  async getChannelByUserId(id: string): Promise<Channel | null> {
    const array: Channel[] = await this.databaseService.executeQuery(`
      SELECT
        c.id
          AS id,
        c.title
          AS title,
        CASE
          WHEN
            c.password IS NULL
          THEN
            false
          ELSE
            true
        END
          AS is_private
      FROM
        ${env.database.schema}.channel c
      INNER JOIN
        ${env.database.schema}.channel_user cu
          ON
            cu.user_id = '${id}'
              AND
            cu.channel_id = c.id
    `);
    return array.length ? array[0] : null;
  }

  async getChannelIdByUserId(id: string): Promise<string | null> {
    const selectChannelId: { channel_id: string }[] = await this.databaseService
      .executeQuery(`
      SELECT
        channel_id
      FROM
        ${env.database.schema}.channel_user
      WHERE
        user_id = '${id}'
    `);
    return selectChannelId.length ? selectChannelId[0].channel_id : null;
  }

  async getChannelRole(id: string): Promise<UserRole | null> {
    const select_channel_role: { channel_role: UserRole }[] = await this
      .databaseService.executeQuery(`
      SELECT
        channel_role
      FROM
        ${env.database.schema}.channel_user
      WHERE
        user_id = '${id}';
    `);

    if (select_channel_role.length === 0) {
      throw new ConflictException(`This user(id: '${id}') is not in a channel`);
    } else {
      return select_channel_role[0].channel_role;
    }
  }

  async getSiteRole(id: string): Promise<UserRole> {
    const select_site_role: User[] = await this.databaseService.executeQuery(`
      SELECT
        site_role
      FROM
        ${env.database.schema}.user
      WHERE
        id = '${id}';
    `);

    if (select_site_role.length === 0) {
      throw new ConflictException(`The user(id: ${id}) does not exist`);
    } else if (select_site_role.length !== 1) {
      throw `FATAL ERROR: User with (id: ${id}) is not only one`;
    } else {
      return select_site_role[0].site_role;
    }
  }

  async setSiteRole(
    setter: string,
    target: string,
    role: UserRole,
  ): Promise<boolean> {
    const setter_role = await this.getSiteRole(setter);
    const target_role = await this.getSiteRole(target);
    if (
      setter_role === 'USER' ||
      setter_role === target_role ||
      (setter_role === 'ADMIN' && target_role === 'OWNER') ||
      (setter_role !== 'ADMIN' && role === 'OWNER')
    )
      return false;
    const result: any = await this.databaseService.executeQuery(
      `
      UPDATE ${env.database.schema}.user
        SET
        site_role
          =
        ($1)
      WHERE
        id = ($2)
      RETURNING *;
    `,
      [role, target],
    );
    return !!result;
  }

  async getGameByUserId(id: string): Promise<Game> {
    const ret = await this.gamesService.getGameByUserId(id.toString());

    return ret;
    // return await this.gamesService.getGameByUserId(id);
  }

  async getMatchHistory(
    id: string,
    limit: number,
    offset: number,
  ): Promise<Match[]> {
    return await this.databaseService.executeQuery(`
      SELECT
        id,
        winner AS winner_id,
        loser AS loser_id,
        win_points,
        lose_points,
        time_stamp,
        CASE
          WHEN ladder = true THEN 'RANK'
          ELSE 'CUSTOM'
        END
          AS type
      FROM
        ${env.database.schema}.match
      WHERE
        winner = ${id}
          OR
        loser = ${id}
      ORDER BY
        time_stamp DESC
      LIMIT ${limit} OFFSET ${offset}
    `);
  }

  async getAchieved(user_id: string) {
    return await this.databaseService.executeQuery(`
      WITH ad AS (
        SELECT
          achievement_id id,
          time_stamp time_stamp
        FROM
          ${env.database.schema}.achieved
        WHERE
          user_id = ${user_id}
      )
      SELECT
        am.id,
        am.name,
        am.icon,
        ad.time_stamp
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
          time_stamp
        )
      VALUES
        (
          ($1),
          ($2),
          ${new Date().getTime()}
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
}
