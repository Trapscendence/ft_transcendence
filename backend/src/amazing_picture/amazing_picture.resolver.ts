import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { createReadStream } from 'fs';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { join } from 'path';
import { SiteRoles } from 'src/users/decorators/site-roles.decorator';
import { SiteRoleGuard } from 'src/users/guards/site-role.guard';
import { UserRole } from 'src/users/models/user.model';
import { env } from 'src/utils/envs';
import { AmazingPictureService } from './amazing_picture.service';

@Resolver()
export class AmazingPictureResolver {
  constructor(private readonly amazingPictureService: AmazingPictureService) {
    const defaultAmazingPictureReadStream = createReadStream(
      join(process.cwd(), 'src', env.defaultAmazingPicture),
    );
    this.amazingPictureService.create(
      defaultAmazingPictureReadStream,
      env.defaultAmazingPicture,
    );
  }

  @Query((returns) => String)
  async amazingPicture() {
    return await this.amazingPictureService.find();
  }

  @Mutation((returns) => Boolean)
  @UseGuards(SiteRoleGuard)
  @SiteRoles(UserRole.ADMIN)
  async updateAmazingPicture(
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
  ): Promise<boolean> {
    return (
      (await this.amazingPictureService.delete()) &&
      (await this.amazingPictureService.create(
        file.createReadStream(),
        file.filename,
      ))
    );
  }
}
