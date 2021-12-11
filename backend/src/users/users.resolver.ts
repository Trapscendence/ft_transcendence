import {
  forwardRef,
  Inject,
  InternalServerErrorException,
  Logger,
  UseGuards,
} from '@nestjs/common';
import {
  Query,
  Args,
  Int,
  Resolver,
  Mutation,
  ID,
  ResolveField,
  Parent,
  Subscription,
} from '@nestjs/graphql';
import { Channel } from 'src/channels/models/channel.model';
import { UserID } from 'src/users/decorators/user-id.decorator';
import { User, UserRole, UserStatus } from './models/user.model';
import { UsersService } from './users.service';
import { Achievement } from 'src/acheivements/models/achievement.model';
import { StatusService } from 'src/status/status.service';
import { PUB_SUB } from 'src/pubsub.module';
import { PubSub } from 'graphql-subscriptions';
import { Game } from 'src/games/models/game.model';
import { Match } from 'src/games/models/match.model';
import { GamesService } from 'src/games/games.service';
import { AchievementsService } from 'src/acheivements/achievements.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { SiteRoleGuard } from './guards/site-role.guard';
import { SiteRoles } from './decorators/site-roles.decorator';
import { createReadStream, readFileSync } from 'fs';
import { join } from 'path';
import { env } from 'src/utils/envs';

@Resolver((of) => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly statusService: StatusService,
    @Inject(forwardRef(() => GamesService)) private gamesService: GamesService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
    private readonly achievementsService: AchievementsService,
  ) {
    const defaultAvatarReadStream = createReadStream(
      join(process.cwd(), 'src', env.defaultAvatar),
    );
    this.usersService.createDefaultAvatar(
      defaultAvatarReadStream,
      env.defaultAvatar,
    );
  }

  /*
   ** ANCHOR: User
   */

  @Query((returns) => User, { nullable: true })
  async user(
    @UserID() user_id: string,
    @Args('id', { type: () => ID, nullable: true }) id?: string,
    @Args('nickname', { nullable: true }) nickname?: string,
  ): Promise<User | null> {
    if (id && nickname)
      throw new Error('You must put exactly one parameter to the query.');
    if (id) return await this.usersService.getUserById(id);
    if (nickname) return await this.usersService.getUserByNickname(nickname);
    return await this.usersService.getUserById(user_id);
  }

  @Query((returns) => [User])
  async users(
    @Args('ladder') ladder: boolean,
    @Args('offset', { type: () => Int }) offset: number,
    @Args('limit', { type: () => Int }) limit: number,
  ): Promise<User[]> {
    return await this.usersService.getUsers(ladder, offset, limit); // NOTE 임시
  }

  @Query((returns) => Boolean)
  async isEnabledTfa(@UserID() user_id: string): Promise<Boolean> {
    console.log(await this.usersService.getSecret(user_id));
    return !!(await this.usersService.getSecret(user_id));
  }

  @Mutation((returns) => Boolean)
  async updateAvatar(
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
    @UserID() user_id: string,
  ): Promise<Boolean> {
    if (
      (await this.usersService.deleteAvatar(user_id)) &&
      (await this.usersService.updateAvatar(user_id, file))
    )
      return true;
    else
      throw new InternalServerErrorException(
        `Error occured during update avatar(id: ${user_id})`,
      );
  }

  @Mutation((returns) => Boolean)
  async deleteAvatar(@UserID() user_id: string): Promise<Boolean> {
    if (await this.usersService.deleteAvatar(user_id)) return true;
    else
      throw new InternalServerErrorException(
        `Error occured during delete avatar (id: ${user_id})`,
      );
  }

  @Mutation((returns) => Boolean)
  @UseGuards(SiteRoleGuard)
  @SiteRoles(UserRole.ADMIN)
  async updateDefaultAvatar(
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
  ) {
    return (
      (await this.usersService.deleteDefaultAvatar()) &&
      (await this.usersService.createDefaultAvatar(
        file.createReadStream(),
        file.filename,
      ))
    );
  }

  @Mutation((returns) => ID)
  async createDummyUser(): Promise<string> {
    while (true) {
      try {
        const { id } = await this.usersService.createUserByOAuth(
          'DUMMY',
          `${Math.floor(Math.random() * 100000)}`,
        );
        return id;
      } catch (err) {}
    }
  }

  /*
   ** ANCHOR: User mutation
   */

  @Mutation((returns) => Boolean, { nullable: true })
  async changeNickname(
    @UserID() user_id: string,
    @Args('new_nickname') new_nickname: string,
  ): Promise<boolean> {
    return await this.usersService.setNickname(user_id, new_nickname);
  }

  @Mutation((returns) => Boolean, { nullable: true })
  async addFriend(
    @UserID() user_id: string,
    @Args('friend_id', { type: () => ID }) friend_id: string,
  ): Promise<boolean> {
    return this.usersService.addFriend(user_id, friend_id);
  }

  @Mutation((returns) => Boolean)
  async deleteFriend(
    @UserID() user_id: string,
    @Args('friend_id', { type: () => ID }) friend_id: string,
  ): Promise<boolean> {
    return await this.usersService.deleteFriend(user_id, friend_id);
  }

  @Mutation((returns) => Boolean)
  async addToBlackList(
    @UserID() user_id: string,
    @Args('black_id', { type: () => ID }) black_id: string,
  ): Promise<boolean> {
    return await this.usersService.addToBlackList(user_id, black_id);
  }

  @Mutation((returns) => Boolean)
  async deleteFromBlackList(
    @UserID() user_id: string,
    @Args('black_id', { type: () => ID }) black_id: string,
  ): Promise<boolean> {
    return await this.usersService.deleteFromBlackList(user_id, black_id);
  }

  @Mutation((returns) => Boolean)
  async setSiteRole(
    @UserID() user_id: string,
    @Args('target_id', { type: () => ID }) target_id: string,
    @Args('role', { type: () => UserRole }) role: UserRole,
  ): Promise<boolean> {
    return await this.usersService.setSiteRole(user_id, target_id, role);
  }

  @Mutation((returns) => Boolean)
  async achieveOne(
    @UserID() user_id: string,
    @Args('achievement_id') achievement_id: string,
  ): Promise<boolean> {
    return await this.achievementsService.achieveOne(user_id, achievement_id);
  }

  @Mutation((returns) => Boolean)
  async checkAchieved(
    @UserID() user_id: string,
    @Args('achievement_id') achievement_id: string,
  ): Promise<boolean> {
    return await this.achievementsService.checkAchieved(
      user_id,
      achievement_id,
    );
  }

  @Mutation((returns) => Boolean)
  setStatus(
    @UserID() user_id: string,
    @Args('status', { type: () => UserStatus }) status: UserStatus,
  ): boolean {
    this.statusService.setStatus(user_id, status);
    return true;
  }

  @Mutation((returns) => Boolean)
  async unregister(@UserID() user_id: string): Promise<boolean> {
    return await this.usersService.unregister(user_id);
  }

  // NOTE for test
  @Mutation((returns) => Boolean)
  async insertMatchResult(
    @Args('winner_id', { type: () => ID }) winner_id: string,
    @Args('loser_id', { type: () => ID }) loser_id: string,
    @Args('ladder') ladder: boolean,
  ): Promise<boolean> {
    return await this.gamesService.recordMatch(winner_id, loser_id, ladder);
  }

  /*
   ** ANCHOR: ResolveField
   */

  @ResolveField('avatar', (returns) => String)
  async getAvatar(@Parent() user: User): Promise<string> {
    const { id } = user;
    return await this.usersService.getAvatar(id);
  }

  @ResolveField('friends', (returns) => [User])
  async getFriends(@Parent() user: User): Promise<User[]> {
    const { id } = user;
    return await this.usersService.getFriends(id);
  }

  @ResolveField('blacklist', (returns) => [User])
  async getBlackList(@Parent() user: User): Promise<User[]> {
    const { id } = user;
    return await this.usersService.getBlackList(id);
  }

  @ResolveField('channel', (returns) => Channel, { nullable: true })
  async getChannelByUserId(@Parent() user: User): Promise<Channel | null> {
    const { id } = user;
    return await this.usersService.getChannelByUserId(id);
  }

  @ResolveField('channel_role', (returns) => UserRole, { nullable: true })
  async getChannelRole(@Parent() user: User): Promise<UserRole | null> {
    const { id } = user;
    return await this.usersService.getChannelRole(id);
  }

  @ResolveField('achievements', (returns) => [Achievement], { nullable: true })
  async getAchieved(@Parent() user: User): Promise<Achievement[]> {
    return await this.achievementsService.getAchieved(user.id);
  }

  @ResolveField('status', (returns) => UserStatus)
  getStatus(@Parent() user: User): UserStatus {
    const { id } = user;
    return this.statusService.getStatus(id);
  }

  /*
   ** ANCHOR: User Subscription
   */

  @ResolveField('match_history', (returns) => [Match])
  async getMatchHistory(
    @Parent() user: User,
    @Args('limit', { type: () => Int }) limit: number,
    @Args('offset', { type: () => Int }) offset: number,
  ): Promise<Match[]> {
    const { id } = user;
    return await this.usersService.getMatchHistory(id, limit, offset);
  }

  @ResolveField('game', (returns) => Game, { nullable: true })
  async getGame(@Parent() user: User): Promise<Game | null> {
    const { id } = user;
    return await this.usersService.getGameByUserId(id);
  }

  @Subscription((returns) => UserStatus)
  statusChange(@Args('user_id', { type: () => ID }) user_id: string) {
    return this.pubSub.asyncIterator(`status_of_${user_id}`);
  }
}
