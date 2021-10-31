import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from 'src/users/models/user.medel';
import { ChannelsService } from './channels.service';
import { Channel } from './models/channel.medel';

@Resolver((of) => Channel)
export class ChannelsResolver {
  constructor(private channelsService: ChannelsService) {}

  /*
   ** ANCHOR: Query
   */

  @Query((returns) => Channel, { name: 'channel', nullable: true })
  async getChannel(
    @Args('channel_id', { type: () => ID! }) channel_id: string,
  ) {
    return await this.channelsService.getChannel(channel_id);
  }

  @Query((returns) => [Channel], { name: 'channels' }) // TODO: 제대로 하려면 수정 필요할 듯? 필터링 부분...
  async getChannels(
    @Args('isPrivate', { nullable: true }) isPrivate?: boolean,
  ) {
    return await this.channelsService.getChannels(isPrivate);
  }

  /*
   ** ANCHOR: Mutation
   */

  @Mutation((returns) => Channel)
  async addChannel(
    @Args('title') title: string,
    @Args('password', { nullable: true }) password: string,
    @Args('owner_user_id') owner_user_id: string,
  ) {
    return await this.channelsService.addChannel(
      title,
      password,
      owner_user_id,
    );
  }

  @Mutation((returns) => Channel)
  async editChannel(
    @Args('channel_id', { type: () => ID! }) channel_id: string,
    @Args('title') title: string,
    @Args('password', { nullable: true }) password: string,
  ) {
    return await this.channelsService.editChannel(channel_id, title, password);
  }

  @Mutation((returns) => Boolean)
  async deleteChannel(
    @Args('channel_id', { type: () => ID! }) channel_id: string,
  ) {
    return await this.channelsService.deleteChannel(channel_id);
  }

  @Mutation((returns) => User) // TODO: User 여기서 어떻게 쓰는지 알아보기
  async muteUserFromChannel(
    @Args('user_id', { type: () => ID! }) user_id: string,
    @Args('mute_time', { type: () => Int! }) mute_time: number,
  ) {
    return new Promise(() => {});
  }

  @Mutation((returns) => User)
  async kickUserFromChannel(
    @Args('user_id', { type: () => ID! }) user_id: string,
  ) {
    return new Promise(() => {});
  }

  @Mutation((returns) => User)
  async banUserFromChannel(
    @Args('user_id', { type: () => ID! }) user_id: string,
    @Args('ban_time', { type: () => Int! }) ban_time: number,
  ) {
    return new Promise(() => {});
  }

  @Mutation((returns) => Boolean) // TODO: 아마... chat 유형이 필요하지 않을까?
  async chatMessage(
    @Args('user_id', { type: () => ID! }) user_id: string,
    @Args('message') message: string,
  ) {
    return new Promise(() => {});
  }

  /*
   ** ANCHOR: ResolveField
   */
}
