export const env = {
  name: 'TRAPscendence',
  redirect: {
    totp: '/login/totp',
  },
  database: {
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: +process.env.POSTGRES_LOCAL_PORT,
    schema: process.env.DB_SCHEMA,
  },
  session: {
    secret: process.env.SESSION_SECRET,
    cookieName: 'TRAP_SESSIONID',
    tableName: 'user_session',
  },
  fortytwoStrategy: {
    clientID: process.env.FORTYTWO_APP_ID,
    clientSecret: process.env.FORTYTWO_APP_SECRET,
    callbackURL: process.env.FORTYTWO_REDIRECT_URI,
  },
  storage: {
    host: process.env.STORAGE_HOST,
    port: process.env.STORAGE_PORT,
  },
};
