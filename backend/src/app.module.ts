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

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      installSubscriptionHandlers: true,
      subscriptions: {
        'graphql-ws': true,
      },
      // sortSchema: true, // NOTE type의 인자 등이 사전순으로 배치됨... 불편!
    }),
    DatabaseModule,
    UsersModule,
    MessageModule,
    ChannelsModule,
    MatchsModule,
    AchivementsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
