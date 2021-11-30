import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  PayloadTooLargeException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UserRole } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';
import { env } from 'src/utils/envs';
import { sqlEscaper } from 'src/utils/sqlescaper.utils';
import { UseFor } from './model/article.model';

@Injectable()
export class ArticleService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly usersService: UsersService,
  ) {}

  async insertArticle(
    user_id: string,
    title: string,
    contents: string,
    use_for: UseFor,
  ) {
    if (title.length > 128 || contents.length > 8192)
      throw new PayloadTooLargeException('title or content is to long');
    title = sqlEscaper(title);
    contents = sqlEscaper(contents);
    const article = await this.databaseService.executeQuery(
      `
      INSERT INTO
        ${env.database.schema}.article(
          user_id,
          title,
          contents,
          time_stamp,
          use_for
        )
      VALUES (
        ($1),
        ($2),
        ($3),
        ($4),
        ($5)
      )
      RETURNING
        user_id AS writer_id,
        title,
        contents,
        time_stamp,
        use_for;
    `,
      [user_id, title, contents, new Date().getTime(), use_for],
    );

    return article.length ? true : false;
  }

  async getArticle(use_for: UseFor, limit: number, offset: number) {
    return await this.databaseService.executeQuery(
      `
      SELECT
        user_id
          AS writer_id,
        title,
        contents,
        time_stamp
      FROM
        ${env.database.schema}.article
      WHERE
        use_for = ($1)
      ORDER BY
        time_stamp DESC
      LIMIT ($2) OFFSET ($3);
    `,
      [use_for, limit, offset],
    );
  }

  async editArticle(
    user_id: string,
    time_stamp: string,
    title: string,
    contents: string,
    use_for: UseFor,
  ): Promise<boolean> {
    if (!title && contents === undefined) return false;
    if (title.length > 128 || contents.length > 8192)
      throw new PayloadTooLargeException('title or content is to long');

    const [article] = await this.databaseService.executeQuery(
      `
      SELECT
        *
      FROM
        ${env.database.schema}.article
      WHERE
        time_stamp = ($1);
    `,
      [time_stamp],
    );

    if (!article) throw new NotFoundException('No such article.');
    if (
      (await this.usersService.getSiteRole(user_id)) != UserRole.OWNER ||
      article.user_id != user_id
    )
      throw new ForbiddenException('No permission to edit');

    title = sqlEscaper(title);
    contents = sqlEscaper(contents);
    const edited = await this.databaseService.executeQuery(
      `
      UPDATE
        ${env.database.schema}.article
      SET (
        title
        contents
      ) = (
        ${title ? `'${title}'` : 'title'}
        ${contents === undefined ? 'contents' : `'${contents}'`}
      )
      WHERE
        time_stamp = ($1),
        use_for = ($2)
      RETURNING *;
    `,
      [time_stamp, use_for],
    );
    if (!edited)
      throw new ConflictException('No such article or not mathing use');
    return true;
  }

  async deleteArticle(
    user_id: string,
    time_stamp: string,
    use_for: UseFor,
  ): Promise<boolean> {
    const [article] = await this.databaseService.executeQuery(
      `
      SELECT
        *
      FROM
        ${env.database.schema}.article
      WHERE
        time_stamp = ($1);
    `,
      [time_stamp],
    );

    if (!article) throw new NotFoundException('No such article.');
    if (
      (await this.usersService.getSiteRole(user_id)) != UserRole.OWNER ||
      article.user_id != user_id
    )
      throw new ForbiddenException('No permission to edit');
    const [deleted] = await this.databaseService.executeQuery(
      `
      DELETE FROM
        ${env.database.schema}.article
      WHERE
        time_stamp = ($1),
        use_for = ($2)
      RETURNING *;`,
      [time_stamp, use_for],
    );
    if (!deleted) throw new ConflictException('Not matching use');
    return true;
  }
}
