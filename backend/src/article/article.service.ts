import { Injectable, PayloadTooLargeException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { env } from 'src/utils/envs';
import { UseFor } from './model/article.model';

@Injectable()
export class ArticleService {
  constructor(private readonly databaseService: DatabaseService) {}

  async insertArticle(
    user_id: string,
    title: string,
    contents: string,
    use_for: UseFor,
  ) {
    if (title.length > 128 || contents.length > 8192)
      throw new PayloadTooLargeException('title or content is to long');
    const article = await this.databaseService.executeQuery(
      `
      INSERT INTO
        ${env.database.schema}.article(
          user_id writer_id,
          title,
          contents,
          time_stmap,
          use_for
        )
      VALUES (
        ($1),
        ($2),
        ($3),
        ($4),
        ($5)
      )
      RETURNING *;
    `,
      [user_id, title, contents, new Date().getTime(), use_for],
    );

    return article.length ? true : false;
  }

  async getArticle(use_for: UseFor, limit: number, offset: number) {
    return await this.databaseService.executeQuery(
      `
      SELECT
        user_id,
        title,
        contents,
        time_stamp
      FROM
        ${env.database.schema}.article
      ORDER BY
        time_stamp DESC
      WHERE
        use_for = ($1)
      LIMIT ($2) OFFSET ($3);
    `,
      [use_for, limit, offset],
    );
  }
}
