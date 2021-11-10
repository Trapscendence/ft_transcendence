import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';
import { SessionController } from './session.controller';
import { FTStrategy } from './strategy/ft.strategy';
// import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  imports: [UsersModule, DatabaseModule, PassportModule],
  controllers: [SessionController],
  providers: [FTStrategy],
})
export class SessionModule {}
