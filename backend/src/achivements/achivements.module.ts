import { Module } from '@nestjs/common';
import { AchivementsResolver } from './achivements.resolver';
import { AchivementsService } from './achivements.service';

@Module({
  providers: [AchivementsResolver, AchivementsService],
})
export class AchivementsModule {}
