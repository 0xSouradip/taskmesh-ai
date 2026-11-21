import { test } from 'node:test';
import assert from 'node:assert/strict';
import { safeNext } from './safe-next.js';

test('safeNext only allows same-site paths', () => {
  assert.equal(safeNext('/tasks?q=react'), '/tasks?q=react');
  assert.equal(safeNext('//evil.com'), '/');
  assert.equal(safeNext('/\\evil.com'), '/');
  assert.equal(safeNext('https://evil.com'), '/');
  assert.equal(safeNext(undefined), '/');
  assert.equal(safeNext('/sign-in?next=/x'), '/');
});
