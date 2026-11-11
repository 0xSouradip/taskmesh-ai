import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword } from './password.js';

test('salted hash round-trip', async () => {
  const a = await hashPassword('hunter22');
  const b = await hashPassword('hunter22');
  assert.notEqual(a, b, 'salt makes hashes differ');
  assert.equal(await verifyPassword('hunter22', a), true);
  assert.equal(await verifyPassword('wrong', a), false);
  assert.equal(await verifyPassword('x', null), false);
});
