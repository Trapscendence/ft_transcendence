import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AchievementsResolver } from './achievements.resolver';
import { AchievementsService } from './achievements.service';

@Module({
  imports: [DatabaseModule],
  providers: [AchievementsResolver, AchievementsService],
})
export class AchievementsModule {}
