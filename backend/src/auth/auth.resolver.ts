import { Mutation, Resolver } from '@nestjs/graphql';
import { UserID } from 'src/users/decorators/user-id.decorator';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation((returns) => String)
  async createTfa(@UserID() user_id: string): Promise<string> {
    const tfaUri = this.authService.issueTfaUri(user_id);
    return tfaUri;
  }
}
