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
import { GamesModule } from './games/games.module';
import { verify } from 'jsonwebtoken';
import { StatusService } from './status/status.service';
import { StatusModule } from './status/status.module';
import { JwtDTO } from './auth/dto/jwt.dto';
import { Context } from 'graphql-ws';
import { AuthService } from './auth/auth.service';
import { GamesService } from './games/games.service';

@Module({
  imports: [
    // GraphQLModule.forRoot({
    //   autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    //   installSubscriptionHandlers: true,
    //   subscriptions: { 'graphql-ws': true },
    //   cors: {
    //     origin: `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`,
    //     credentials: true,
    //   },
    // }),

    GraphQLModule.forRootAsync({
      imports: [StatusModule, AuthModule],
      inject: [StatusService, AuthService],
      useFactory: async (
        statusService: StatusService,
        authService: AuthService,
        gamesService: GamesService,
      ) => {
        return {
          playground: {
            subscriptionEndpoint: 'ws://localhost:7000/subscriptions',
          },
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          installSubscriptionHandlers: true,
          subscriptions: {
            // NOTE: production에선 grapqh-ws를 켜야함
            // 'graphql-ws': {
            //   path: '/subscriptions',
            //   onConnect: (ctx: Context<unknown>) => {
            //     console.log(ctx.connectionParams.authrization);
            //   },
            // },
            'subscriptions-transport-ws': {
              path: '/subscriptions',
              onConnect: async (
                connectionParams: any,
                webSocket: WebSocket,
                context: any,
              ) => {
                const auth = context.upgradeReq?.headers?.authorization;
                if (auth) {
                  const token = auth.split(' ')[1];
                  const id = await authService.extractUserId(token);
                  statusService.newConnection(id, webSocket);
                }
                return connectionParams;
              },
              onDisconnect: async (webSocket: WebSocket, context: any) => {
                const auth = context.upgradeReq?.headers?.authorization;
                if (auth) {
                  const token = auth.split(' ')[1];
                  const id = await authService.extractUserId(token);
                  statusService.deleteConnection(id, webSocket);
                }
              },
            },
          },
          cors: {
            origin: `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`,
            // origin: `http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}`,
            credentials: true,
          },
        };
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
    GamesModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }, AppService],
})
export class AppModule {}
