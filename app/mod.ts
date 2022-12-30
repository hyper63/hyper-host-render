import { authMiddleware } from './auth.ts';
import { app, couchdb, hyper, z } from './deps.ts';

function env(key: string): string {
  const res = z.string().min(1).safeParse(Deno.env.get(key));
  if (!res.success) {
    console.error(`Error with ENV VAR: ${key}`);
    throw res.error;
  }
  return res.data;
}

const COUCH = `http://${env('COUCHDB_USER')}:${env('COUCHDB_PASSWORD')}@${
  env(
    'COUCHDB_HOST',
  )
}:5984`;

export default hyper({
  app,
  adapters: [{ port: 'data', plugins: [couchdb({ url: COUCH })] }],
  middleware: [authMiddleware(env('SECRET'))],
});
