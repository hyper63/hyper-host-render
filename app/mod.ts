import { app, bullmq, elasticsearch, type express, hyper, minio, mongodb, redis } from './deps.ts';
import { env, verifyAuthorizationHeader } from './utils.ts';

/**
 * Given a sub and secret, return a hyper middleware that will
 * check that all incoming requests have a properly signed jwt token
 * in the authorization header
 */
const authMiddleware =
  ({ sub, secret }: { sub: string; secret: string }) => (app: express.Express) => {
    const verify = verifyAuthorizationHeader({ sub, secret });
    app.use(async (req, _res, next) => {
      await verify(req.get('authorization') || 'Bearer notoken')
        .then(() => next())
        // pass error to next, triggering the next error middleware to take over
        .catch(next);
    });

    app.use(
      (
        // deno-lint-ignore no-explicit-any
        err: any,
        _req: express.Request,
        res: express.Response,
        next: express.NextFunction,
      ): unknown => {
        if (err && err.name === 'UnauthorizedError') {
          return res.status(401).send({ ok: false, msg: 'not authorized' });
        }
        // Trigger the next error handler
        next(err);
      },
    );

    return app;
  };

const MONGO_URL = `mongodb://${env('MONGO_USERNAME')}:${env('MONGO_PASSWORD')}@${
  env('MONGO_HOST')
}`;
const REDIS_URL = `http://${env('REDIS_HOST')}:${env('REDIS_PORT')}`;
const ELASTICSEARCH_URL = `http://${env('ELASTICSEARCH_HOST')}`;
// Use the public url, so presigned url signatures match
const MINIO_URL = `https://${env('MINIO_USERNAME')}:${env('MINIO_PASSWORD')}@${
  env('MINIO_HOST')
}.onrender.com`;

export default hyper({
  app,
  adapters: [
    {
      port: 'data',
      plugins: [mongodb({ url: MONGO_URL })],
    },
    {
      port: 'cache',
      plugins: [redis({ url: REDIS_URL })],
    },
    {
      port: 'search',
      plugins: [elasticsearch({ url: ELASTICSEARCH_URL })],
    },
    {
      port: 'storage',
      plugins: [
        minio({
          url: MINIO_URL,
          bucketPrefix: 'hyper',
          useNamespacedBucket: false,
        }),
      ],
    },
    {
      port: 'queue',
      plugins: [
        bullmq({
          url: REDIS_URL,
          options: {
            keyPrefix: 'hyper',
          },
        }),
      ],
    },
  ],
  middleware: [authMiddleware({ sub: env('SUB'), secret: env('SECRET') })],
});
