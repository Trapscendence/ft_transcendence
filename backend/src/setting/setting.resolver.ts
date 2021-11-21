// import { Inject, UseGuards } from '@nestjs/common';
// import {
//   Args,
//   ID,
//   Int,
//   Mutation,
//   Parent,
//   Query,
//   ResolveField,
//   Resolver,
//   Subscription,
// } from '@nestjs/graphql';
// import { PubSub } from 'graphql-subscriptions';
// import { User } from 'src/users/models/user.model';
// import { UsersService } from 'src/users/users.service';
// import { MyProfile } from './model/setting.model';
// import { PUB_SUB } from '../pubsub.module';
// import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
// import { UserID } from 'src/auth/decorator/user-id.decorator';

// @UseGuards(JwtAuthGuard)
// @Resolver((of) => MyProfile)
// export class SettingResolver {
//   constructor(
//     // private readonly settingService: settingService,
//     private readonly usersService: UsersService,
//   ) {}

//   /*
//    ** ANCHOR: DM query
//    */

//    @Query((returns) => MyProfile, { nullable: true })
//    async myProfile(
//      @UserID() user_id: any,
//    ): Promise<MyProfile> {
//      return await this.settingService.getMyProfile(user_id);
//    }
 
//   // /*
//   //  ** ANCHOR: DM resolveField
//   //  */

//   // @ResolveField('messages', (returns) => [Message])
//   // async messages(
//   //   @Parent() setting: MyProfile,
//   //   @Args('offset', { type: () => Int }) offset: number,
//   //   @Args('limit', { type: () => Int }) limit: number,
//   // ): Promise<Message[]> {
//   //   const { user_id, other_id } = dm;
//   //   return await this.settingService.getMessages(
//   //     user_id,
//   //     other_id,
//   //     offset,
//   //     limit,
//   //   );
//   // }

//   /*
//    ** ANCHOR: 프로필 이미지가 여기 있어야할지 user에 있어야할지 profile에 있어야할지 잘 모르겠습니다.
//    ** ANCHOR: profilePic 의 type이 뭘까요... 일단 Image로 해두었습니다.
//    */
//   @Query((returns) => Image)
//   async profilePic(
//     @UserID() user_id: any,
//   ): Promise<Image> {
//     return await this.usersService.getProfilePic(user_id);
//   }

//   /*
//    ** ANCHOR: blackUsers
//    */

//   @Query((returns) => [User])
//   async blackUsers(
//     @UserID() user_id: any,
//   ): Promise<User[]> {
//     return await this.usersService.getBlackList(user_id);
//   }

//   /*
//    ** ANCHOR: setting mutation (pic, nickname, blackList, otp)
//    */


//   @Mutation((returns) => Boolean, { nullable: true })
//   updateProfilePic(
//     @UserID() user_id: any,
//     @Args('profilePicture', { type: () => ID }) profilePicture: Image,
//   ): null {
//     this.settingService.setCheckDate(user_id, profilePicture);
//     return null;
//   }

//   @Mutation((returns) => Boolean, { nullable: true })
//   updateNickname(
//     @UserID() user_id: any,
//     @Args('new_nickname', { type: () => ID }) new_nickname: string,
//   ): null {
//     this.settingService.setNickname(user_id, new_nickname);
//     return null;
//   }

//   @Mutation((returns) => ID, { nullable: true })
//   async addToBlackList(
//     @UserID() user_id: any,
//     @Args('black_id', { type: () => ID }) black_id: string,
//   ): Promise<boolean> {
//     return await this.usersService.addToBlackList(user_id, black_id);
//   }
// }
