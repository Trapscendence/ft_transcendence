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
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { verify } from 'jsonwebtoken';
import { statusContainer } from './status/statuscontainer.instance';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      installSubscriptionHandlers: true,
      subscriptions: {
        // NOTE: production에선 grapqh-ws를 켜야함
        // 'graphql-ws': {
        //   onConnect: (ctx: Context<unknown>) => {
        //     console.log(ctx.connectionParams.authrization);
        //   },
        // },
        'subscriptions-transport-ws': {
          onConnect: (connectionParams, webSocket, context) => {
            if (connectionParams.authorization) {
              const token = connectionParams.authorization.split(' ')[1];
              const user_id = verify(token, process.env.JWT_SECRET) as string;
              statusContainer.newConnection(user_id, webSocket);
            }
          },
          onDisconnect(webSocket, context) {
            statusContainer.deleteConnection(webSocket);
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
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }, AppService],
})
export class AppModule {}
