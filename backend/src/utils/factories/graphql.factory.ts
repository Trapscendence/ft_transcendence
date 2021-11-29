import { StatusService } from 'src/status/status.service';
import { WsException } from '@nestjs/websockets';
import * as cookie from 'cookie';
import * as cookieParser from 'cookie-parser';

import { env } from '../envs';
import { sessionStore } from '../sessionStore';
import { join } from 'path';

function getSession(sid: string): Promise<any> {
  return new Promise((resolve, reject) => {
    sessionStore.get(sid, (err, session) => {
      if (err) reject(err);
      else if (session) resolve(session);
    });
  });
}

export function graphqlFactory(statusService: StatusService) {
  return {
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    installSubscriptionHandlers: true,
    playground: {
      subscriptionEndpoint: '/subscriptions',
      settings: {
        'request.credentials': 'include',
      },
    },
    subscriptions: {
      // NOTE: production에선 grapqh-ws를 켜야함
      // 'graphql-ws': true,
      'subscriptions-transport-ws': {
        path: '/subscriptions',
        onConnect: async (connectionParams, webSocket, context) => {
          const cookies = cookie.parse(webSocket.upgradeReq.headers.cookie);
          const sid = cookieParser.signedCookie(
            cookies[env.session.cookieName],
            env.session.secret,
          );
          if (!sid) throw new WsException('Invalid credentials.');
          else
            sessionStore.createSession(
              webSocket.upgradeReq,
              await getSession(sid),
            );
          statusService.newConnection(
            webSocket.upgradeReq.headers['sec-websocket-key'],
            webSocket.upgradeReq.session.uid,
            sid,
          );
          return { req: webSocket.upgradeReq };
        },
        onDisconnect: async (webSocket, context) => {
          await statusService.deleteConnection(
            webSocket.upgradeReq.headers['sec-websocket-key'],
            undefined,
          );
        },
      },
    },
  };
}
