import { Query, Resolver } from '@nestjs/graphql';
import { AchievementsService } from './achievements.service';
import { Achievement } from './models/achievement.model';

@Resolver()
export class AchievementsResolver {
  constructor(private readonly achievementService: AchievementsService) {}

  @Query((returns) => [Achievement])
  async achievement() {
    this.achievementService.getAllAchievements();
  }
}
