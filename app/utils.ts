import { jwt, z } from './deps.ts';

export function env(key: string): string {
  const res = z.string().min(1).safeParse(Deno.env.get(key));
  if (!res.success) {
    console.error(`Error with ENV VAR: ${key}`);
    throw res.error;
  }
  return res.data;
}

export const verifyAuthorizationHeader =
  ({ sub, secret }: { sub: string; secret: string }) => async (header: string) => {
    const payload = await jwt
      .verify(header.split(' ').pop() as string, secret, 'HS256')
      .catch(() => {
        throw { name: 'UnauthorizedError' };
      });
    /**
     * Confirm sub matches
     */
    if (payload.sub !== sub) throw { name: 'UnauthorizedError' };
  };
