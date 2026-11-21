import { test } from 'node:test';
import assert from 'node:assert/strict';
import { safeNext } from './safe-next.js';

test('safeNext only allows same-site paths', () => {
  assert.equal(safeNext('/tasks?q=react'), '/tasks?q=react');
  assert.equal(safeNext('/portfolio?handle=alice#ledger'), '/portfolio?handle=alice#ledger');
  assert.equal(safeNext('//evil.com'), '/');
  assert.equal(safeNext('/\\evil.com'), '/');
  assert.equal(safeNext('/\t/evil.com'), '/');
  assert.equal(safeNext('/\n/evil.com'), '/');
  assert.equal(safeNext('/%09/evil.com'), '/%09/evil.com'); // still encoded: a same-site path
  assert.equal(safeNext('https://evil.com'), '/');
  assert.equal(safeNext(undefined), '/');
  assert.equal(safeNext('/sign-in?next=/x'), '/');
  assert.equal(safeNext('/api/auth/x'), '/');
});
