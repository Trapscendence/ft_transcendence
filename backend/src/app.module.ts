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
import { SessionModule } from './session/session.module';
import { PubSubModule } from './pubsub.module';

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
        // origin: `https://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}`,
        origin: `http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}`, // NOTE: 프론트에서 cors 허용을 위해 일단 이렇게 바꿨습니다. 나중에 충분한 테스트를 거쳐서 https 적용되면 수정 후 push 해주세요. -gmoon
        credentials: true,
      },
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
      context: ({ req, connection }) =>
        connection ? { req: { headers: connection.context } } : { req },
    }),
    DatabaseModule,
    UsersModule,
    MessageModule,
    ChannelsModule,
    MatchsModule,
    AchivementsModule,
    PubSubModule,
    SessionModule,
    PubSubModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
