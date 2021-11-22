import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { User, UserRole } from './models/user.model';
import { schema } from 'src/utils/envs';
import { sqlEscaper } from 'src/utils/sqlescaper.utils';
import { Channel } from 'src/channels/models/channel.model';
import { GamesService } from 'src/games/games.service';
import { Game } from 'src/games/models/game.model';

@Injectable()
export class UsersService {
  constructor(
    private databaseService: DatabaseService,
    @Inject(forwardRef(() => GamesService)) private gamesService: GamesService,
  ) {}

  async getUserById(id: string): Promise<User | null> {
    const array = await this.databaseService.executeQuery(`
      SELECT
        id,
        nickname,
        avatar,
        status_message,
        rank_score,
        site_role,
        DENSE_RANK() OVER (
          ORDER BY
            rank_score DESC
        ) rank
      FROM
        ${schema}.user
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
        avatar,
        status_message,
        rank_score,
        site_role,
        DENSE_RANK() OVER (
          ORDER BY
            rank_score DESC
        ) rank
      FROM
        ${schema}.user
      WHERE
        nickname = '${nickname}';
    `);
    if (array.length) return array[0];
    throw new NotFoundException('No such user.');
  }

  async getOrCreateUserByOAuth(
    oauth_id: string,
    oauth_type: string,
  ): Promise<User | null> {
    const selectQueryResult = await this.databaseService.executeQuery(`
      SELECT
        id,
        tfa_secret
      FROM
        ${schema}.user
      WHERE
        oauth_id = '${oauth_id}'
      AND
        oauth_type = '${oauth_type}';
          `);

    if (selectQueryResult.length === 1) {
      return selectQueryResult[0];
    } else if (selectQueryResult.length === 0) {
      const insertQueryResult = await this.databaseService.executeQuery(`
      INSERT INTO ${schema}.user(
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
        return insertQueryResult[0];
      } else {
        console.error(
          `Failed to create user by (oauth_type = '${oauth_type}', oauth_id = '${oauth_id}')`,
        );
        throw new BadRequestException('Failed to create oauth user');
      }
    } else {
      console.error(
        `Wrong user's oauth data (oauth_type = '${oauth_type}', oauth_id = '${oauth_id}'): makes ${selectQueryResult.length} query results`,
      );
      throw new BadRequestException('wrong data from oauth');
    }
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
        avatar,
        status_message,
        rank_score,
        site_role,
        DENSE_RANK() OVER (
          ORDER BY
            rank_score DESC
        ) rank
      FROM
        ${schema}.user
      ${ladder ? 'ORDER BY rank_score DESC' : ''}
      ${limit ? `LIMIT ${limit} ${offset ? `OFFSET ${offset}` : ''}` : ''}
    `);
  }

  async createUser(nickname: string): Promise<User | null> {
    // Deprecated
    nickname = sqlEscaper(nickname);
    const existingUser = await this.databaseService.executeQuery(`
      SELECT
        id
      FROM
        ${schema}.user
      WHERE
        nickname = '${nickname}'
      `);

    if (existingUser.length) return null;
    const users = await this.databaseService.executeQuery(`
      INSERT INTO
        ${schema}.user(
          nickname,
          oauth_id,
          oauth_type
        )
      VALUES (
        '${nickname}',
        'mock_id', /* 적절한 변환 필요 */
        'FORTYTWO' )
      RETURNING *;
    `); // NOTE oauth_id, oauth_type는 일단 제외함. database.service에도 완성 전까지는 주석처리 해야할 듯?
    return users[0];
  }

  async addFriend(user_id: string, friend_id: string): Promise<boolean> {
    if (user_id === friend_id)
      throw new BadRequestException('One cannot be their own friend');
    const array: Array<User> = await this.databaseService.executeQuery(`
      INSERT INTO ${schema}.friend( my_id, friend_id )
      VALUES
        (
          ( SELECT id from ${schema}.user WHERE id = ${user_id} ),
          ( SELECT id from ${schema}.user WHERE id = ${friend_id} )
        ),
        (
          ( SELECT id from ${schema}.user WHERE id = ${friend_id} ),
          ( SELECT id from ${schema}.user WHERE id = ${user_id} )
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
        ${schema}.friend f
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
        avatar,
        status_message,
        rank_score,
        site_role
      FROM
        ${schema}.user u
      INNER JOIN
        ${schema}.friend f
          ON
        u.id = f.friend_id
      WHERE f.my_id = '${id}';
    `);
  }

  async addToBlackList(user_id: string, black_id: string): Promise<boolean> {
    if (user_id === black_id)
      throw new BadRequestException('One cannot block themself');
    const array: Array<User> = await this.databaseService.executeQuery(`
      INSERT INTO ${schema}.block( blocker_id, blocked_id )
      VALUES
      (
        ( SELECT id from ${schema}.user WHERE id = ${user_id} ),
        ( SELECT id from ${schema}.user WHERE id = ${black_id} )
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
        ${schema}.block b
      WHERE
        ( b.blocker_id = ${user_id} AND b.blocked_id = ${black_id} )
      RETURNING *;
    `);

    return !!array.length;
  }

  /*
   ** ANCHOR: ResolveField
   */

  async getFriend(id: string): Promise<User[]> {
    return await this.databaseService.executeQuery(`
      SELECT
        id,
        nickname,
        avatar,
        status_message,
        rank_score,
        site_role
      FROM
        ${schema}.user
      WHERE
        id = '${id}'
      INNER JOIN
        id ON ${schema}.user.id = ${schema}.friend.my_id;
    `);
  }

  async getBlackList(id: string): Promise<User[]> {
    return await this.databaseService.executeQuery(`
      SELECT
        id,
        nickname,
        avatar,
        status_message,
        rank_score,
        site_role
      FROM
        ${schema}.user u
      WHERE
          id = (
            SELECT
              blocked_id
            FROM
              ${schema}.block b
            WHERE
              blocker_id = ${id}
          )
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
        ${schema}.channel c
      INNER JOIN
        ${schema}.channel_user cu
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
        ${schema}.channel_user
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
        ${schema}.channel_user
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
        ${schema}.user
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

  getGameByUserId(id: string): Game {
    return this.gamesService.getGameByUserId(id);
  }
}
