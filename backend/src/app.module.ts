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
// import { SessionGuard } from './auth/guards/session.guard';
import { ImageModule } from './image/image.module';
import { LoginGuard } from './auth/guards/login.guard';
import * as cookie from 'cookie';
import * as cookieParser from 'cookie-parser';
import { env } from './utils/envs';
import { sessionStore } from './utils/sessionStore';
import { WsException } from '@nestjs/websockets';
import { TfaGuard } from './auth/guards/tfa.guard';
import { StatusModule } from './status/status.module';
import { StatusService } from './status/status.service';

function getSession(sid): Promise<any> {
  return new Promise((resolve, reject) => {
    sessionStore.get(sid, (err, session) => {
      if (err) reject(err);
      else if (session) resolve(session);
    });
  });
}

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      imports: [StatusModule],
      inject: [StatusService],
      useFactory: (statusService: StatusService) => {
        return {
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          installSubscriptionHandlers: true,
          subscriptions: {
            // NOTE: production에선 grapqh-ws를 켜야함
            // 'graphql-ws': true,
            'subscriptions-transport-ws': {
              path: '/subscriptions',
              onConnect: async (connectionParams, webSocket, context) => {
                const cookies = cookie.parse(
                  webSocket.upgradeReq.headers.cookie,
                );
                const sid = cookieParser.signedCookie(
                  cookies[env.session.cookieName],
                  env.session.secret,
                );
                if (sid === false)
                  throw new WsException('Invalid credentials.');
                else
                  sessionStore.createSession(
                    webSocket.upgradeReq,
                    await getSession(sid),
                  );
                statusService.newConnection(
                  webSocket.upgradeReq.session.uid,
                  sid,
                );
                return { req: webSocket.upgradeReq };
              },
              onDisconnect: (webSocket, context) => {
                const cookies = cookie.parse(
                  webSocket.upgradeReq.headers.cookie,
                );
                const sid = cookieParser.signedCookie(
                  cookies[env.session.cookieName],
                  env.session.secret,
                );
                if (sid) return;
                statusService.deleteConnection(
                  webSocket.upgradeReq.session.uid,
                  sid as string,
                );
              },
            },
          },
          playground: {
            subscriptionEndpoint: '/subscriptions',
            settings: {
              'request.credentials': 'include',
            },
          },
        };
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
    AuthModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: LoginGuard },
    { provide: APP_GUARD, useClass: TfaGuard },
    AppService,
  ],
})
export class AppModule {}
