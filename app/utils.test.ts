import { assert, assertEquals, assertThrows } from 'https://deno.land/std@0.199.0/assert/mod.ts';
import * as jwt from 'https://deno.land/x/djwt@v2.2/mod.ts';

import { env, verifyAuthorizationHeader } from './utils.ts';

Deno.test('utils', async (t) => {
  await t.step('env', async (t) => {
    await t.step('it should return the environment variable value', () => {
      Deno.env.set('TEST', 'foobar');
      assertEquals(env('TEST'), 'foobar');
    });

    await t.step(
      'it should throw if the environment variable is not defined',
      () => {
        Deno.env.delete('TEST');
        assertThrows(() => env('TEST'));
      },
    );
  });

  await t.step('verifyAuthorizationHeader', async (t) => {
    const verify = verifyAuthorizationHeader({ sub: 'foo', secret: 'bar' });

    // deno-lint-ignore no-explicit-any
    const createToken = ({ sub, secret }: any, headers: any) =>
      jwt.create(headers, { sub }, secret);

    await t.step('it should verify the header value', async () => {
      const token = await createToken(
        { sub: 'foo', secret: 'bar' },
        { alg: 'HS256', type: 'JWT' },
      );
      await verify(`Bearer ${token}`)
        .then(() => assert(true))
        .catch((err) => assert(false, err));
    });

    await t.step(
      'it should throw an UnauthorizedError if token signing verification fails',
      async () => {
        const token = await createToken(
          { sub: 'foo', secret: 'NOT_RIGHT' },
          {
            alg: 'HS256',
            type: 'JWT',
          },
        );
        await verify(`Bearer ${token}`)
          .then(() => assert(false, 'should have thrown'))
          .catch((err) => {
            assertEquals(err.name, 'UnauthorizedError');
          });
      },
    );

    await t.step(
      'it should throw an UnauthorizedError if the sub in the payload is incorrect',
      async () => {
        const token = await createToken(
          { sub: 'NOT_RIGHT', secret: 'bar' },
          {
            alg: 'HS256',
            type: 'JWT',
          },
        );
        await verify(`Bearer ${token}`)
          .then(() => assert(false, 'should have thrown'))
          .catch((err) => {
            assertEquals(err.name, 'UnauthorizedError');
          });
      },
    );
  });
});
