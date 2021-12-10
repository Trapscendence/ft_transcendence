import { UnauthorizedException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserID } from 'src/users/decorators/user-id.decorator';
import { UserRole } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';
import { env } from 'src/utils/envs';
import { AmazingPictureService } from './amazing_picture.service';

@Resolver()
export class AmazingPictureResolver {
  constructor(
    private readonly amazingPictureService: AmazingPictureService,
    private readonly usersService: UsersService,
  ) {}

  @Query((returns) => String)
  amazingPicture() {
    return `http://${env.storage.host}:${env.storage.port}/storage/amazing_picture`;
  }

  @Mutation((returns) => Boolean)
  async setAmazingPicture(
    @UserID() user_id: string,
    @Args('amazing_picture') amazing_picture: string,
  ): Promise<boolean> {
    // if ((await this.usersService.getSiteRole(user_id)) === UserRole.USER)
    //   throw new UnauthorizedException(
    //     'The user does not have permission to change the amazing picture.',
    //   );
    await this.amazingPictureService.deleteAmazingPicture();
    return await this.amazingPictureService.uploadAmazingPicture(
      amazing_picture,
    );
  }
}
