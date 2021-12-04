import {
  Args,
  ID,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserID } from 'src/users/decorators/user-id.decorator';
import { User } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';
import { ArticleService } from './article.service';
import { Notice, PatchNote, UseFor } from './model/article.model';

@Resolver((of) => Notice)
export class NoticeResolver {
  constructor(
    private readonly articleService: ArticleService,
    private readonly usersService: UsersService,
  ) {}

  @Query((returns) => [Notice])
  async Notices(
    @Args('limit', { type: () => Int }) limit: number,
    @Args('offset', { type: () => Int }) offset: number,
  ): Promise<Notice[]> {
    return await this.articleService.getArticle(UseFor.NOTICE, limit, offset);
  }

  @Mutation((returns) => Boolean)
  async writeNotice(
    @UserID() user_id: string,
    @Args('title') title: string,
    @Args('contents') contents: string,
  ): Promise<boolean> {
    return await this.articleService.insertArticle(
      user_id,
      title,
      contents,
      UseFor.NOTICE,
    );
  }

  @Mutation((returns) => Boolean)
  async editNotice(
    @UserID() user_id: string,
    @Args('time_stamp') time_stamp: string,
    @Args('title', { nullable: true }) title: string,
    @Args('contents', { nullable: true }) contents: string,
  ) {
    this.articleService.editArticle(
      user_id,
      time_stamp,
      title,
      contents,
      UseFor.NOTICE,
    );
  }

  @Mutation((returns) => Boolean)
  async deleteNotice(
    @UserID() user_id: string,
    @Args('time_stamp') time_stamp: string,
  ) {
    this.articleService.deleteArticle(user_id, time_stamp, UseFor.NOTICE);
  }

  @ResolveField('writer', (returns) => User)
  async writer(@Parent() notice: Notice): Promise<User> {
    const { writer_id } = notice;
    return await this.usersService.getUserById(writer_id);
  }
}

@Resolver((of) => PatchNote)
export class PatchNoteResolver {
  constructor(
    private readonly articleService: ArticleService,
    private readonly usersService: UsersService,
  ) {}

  @Query((returns) => [PatchNote])
  async PatchNotes(
    @Args('limit', { type: () => Int }) limit: number,
    @Args('offset', { type: () => Int }) offset: number,
  ): Promise<PatchNote[]> {
    return await this.articleService.getArticle(UseFor.PATCH, limit, offset);
  }

  @Mutation((returns) => Boolean)
  async writePatchNote(
    @UserID() user_id: string,
    @Args('title') title: string,
    @Args('contents') contents: string,
  ): Promise<boolean> {
    return await this.articleService.insertArticle(
      user_id,
      title,
      contents,
      UseFor.PATCH,
    );
  }

  @Mutation((returns) => Boolean)
  async editPatchNote(
    @UserID() user_id: string,
    @Args('time_stamp') time_stamp: string,
    @Args('title', { nullable: true }) title: string,
    @Args('contents', { nullable: true }) contents: string,
  ) {
    this.articleService.editArticle(
      user_id,
      time_stamp,
      title,
      contents,
      UseFor.PATCH,
    );
  }

  @Mutation((returns) => Boolean)
  async deleteNotice(
    @UserID() user_id: string,
    @Args('time_stamp') time_stamp: string,
  ) {
    this.articleService.deleteArticle(user_id, time_stamp, UseFor.PATCH);
  }

  @ResolveField('writer', (returns) => User)
  async writer(@Parent() patch_note: PatchNote): Promise<User> {
    const { writer_id } = patch_note;
    return await this.usersService.getUserById(writer_id);
  }
}
