// deno-lint-ignore-file no-explicit-any

import { type NextFunction, type Opine, type OpineRequest, type OpineResponse } from './deps.ts';

// deno-lint-ignore no-unused-vars
export const authMiddleware = (secret: string) => (app: Opine) => {
  app.use((_req, _res, next) => {
    // TODO: implement authorization check
    next();
  });

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
