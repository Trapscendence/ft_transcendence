import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AchievementsService } from './achievements.service';
import { Achievement } from './models/achievement.model';

@Resolver()
export class AchievementsResolver {
  constructor(private readonly achievementService: AchievementsService) {}

  @Query((returns) => [Achievement])
  async achievement(): Promise<Achievement[]> {
    return await this.achievementService.getAllAchievements();
  }

  @Mutation((returns) => Boolean)
  async changeAchievementName(
    @Args('new_name') new_name: string,
    @Args('ach_id', { type: () => ID }) achievement_id: string,
  ): Promise<boolean> {
    return await this.achievementService.changeAchievementName(
      new_name,
      achievement_id,
    );
  }
}
