import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { ChannelsModule } from './channels/channels.module';
import { GraphQLModule } from '@nestjs/graphql';
import { MatchsModule } from './matchs/matchs.module';
import { AchivementsModule } from './achivements/achivements.module';
import { MessageModule } from './message/message.module';
import { join } from 'path';
import { PubSubModule } from './pubsub.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      installSubscriptionHandlers: true,
      // subscriptions: {
      //   'graphql-ws': true,
      // }, // production에선 켜야함
      // sortSchema: true, // NOTE type의 인자 등이 사전순으로 배치됨... 불편!
      cors: {
        origin: process.env.FRONTEND_URI,
        credentials: true,
      },
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
    }),
    DatabaseModule,
    UsersModule,
    MessageModule,
    ChannelsModule,
    MatchsModule,
    AchivementsModule,
    PubSubModule,
    SessionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
