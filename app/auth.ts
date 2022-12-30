// deno-lint-ignore-file no-explicit-any

import {
  jwt,
  type NextFunction,
  type Opine,
  type OpineRequest,
  type OpineResponse,
} from './deps.ts';

export const authMiddleware = (secret: string) => (app: Opine) => {
  app.use(jwt({ secret, algorithms: ['HS256'] }).unless({ path: ['/'] }));

  app.use(
    (
      err: any,
      _req: OpineRequest,
      res: OpineResponse,
      next: NextFunction,
    ): any => {
      if (err.name === 'UnauthorizedError') {
        return res.setStatus(401).send({ ok: false, msg: 'not authorized' });
      }
      // Trigger the next error handler
      next(err);
    },
  );

  return app;
};
