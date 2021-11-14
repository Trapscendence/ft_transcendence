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
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      installSubscriptionHandlers: true,
      subscriptions: {
        // NOTE: production에선 켜야함
        // 'graphql-ws': {}
        'subscriptions-transport-ws': {
          onConnect: (connectionParams, webSocket, context) => {
            if (connectionParams.authorization) {
              return connectionParams;
            }
          },
        },
      },
      cors: {
        origin: `http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}`,
        credentials: true,
      },
    }),
    DatabaseModule,
    UsersModule,
    MessageModule,
    ChannelsModule,
    MatchsModule,
    AchivementsModule,
    PubSubModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
