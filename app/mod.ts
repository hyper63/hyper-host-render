import { authMiddleware } from './auth.ts';
import { app, hyper, z } from './deps.ts';

function env(key: string): string {
  const res = z.string().min(1).safeParse(Deno.env.get(key));
  if (!res.success) {
    console.error(`Error with ENV VAR: ${key}`);
    throw res.error;
  }
  return res.data;
}

export default hyper({
  app,
  adapters: [],
  middleware: [authMiddleware(env('SECRET'))],
});
