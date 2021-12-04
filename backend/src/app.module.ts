import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { ChannelsModule } from './channels/channels.module';
import { GraphQLModule } from '@nestjs/graphql';
import { AchievementsModule } from './acheivements/acheivements.module';
import { MessageModule } from './message/message.module';
import { PubSubModule } from './pubsub.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { GamesModule } from './games/games.module';
import { LoginGuard } from './auth/guards/login.guard';
import { TfaGuard } from './auth/guards/tfa.guard';
import { StatusModule } from './status/status.module';
import { StatusService } from './status/status.service';
import { graphqlFactory } from './utils/factories/graphql.factory';
import { ArticleModule } from './article/article.module';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      imports: [StatusModule],
      inject: [StatusService],
      useFactory: graphqlFactory,
    }),
    DatabaseModule,
    UsersModule,
    MessageModule,
    ChannelsModule,
    GamesModule,
    AchievementsModule,
    PubSubModule,
    AuthModule,
    ArticleModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: LoginGuard },
    { provide: APP_GUARD, useClass: TfaGuard },
    AppService,
  ],
})
export class AppModule {}
