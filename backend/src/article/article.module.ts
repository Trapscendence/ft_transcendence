import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { NoticeResolver } from './article.resolver';
import { ArticleService } from './article.service';

@Module({
  imports: [DatabaseModule],
  providers: [NoticeResolver, ArticleService],
})
export class ArticleModule {}
