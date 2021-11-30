import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';
import { NoticeResolver } from './article.resolver';
import { ArticleService } from './article.service';

@Module({
  imports: [DatabaseModule, UsersModule],
  providers: [NoticeResolver, ArticleService],
})
export class ArticleModule {}
