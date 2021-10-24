import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { ChannelsModule } from './channels/channels.module';
import { GraphQLModule } from '@nestjs/graphql';
import { MatchsModule } from './matchs/matchs.module';
import { AchivementsModule } from './achivements/achivements.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      // sortSchema: true, // NOTE type의 인자 등이 사전순으로 배치됨... 불편!
    }),
    DatabaseModule,
    UsersModule,
    ChannelsModule,
    MatchsModule,
    AchivementsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
