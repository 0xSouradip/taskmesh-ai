import { test } from 'node:test';
import assert from 'node:assert/strict';
import { timeAgo, levelFromXp } from './format.js';
import { decompose } from './ai.js';

test('timeAgo', () => {
  const now = Date.now();
  assert.equal(timeAgo(now - 10_000, now), 'Just now');
  assert.equal(timeAgo(now - 4 * 60_000, now), '4 minutes ago');
  assert.equal(timeAgo(now - 48 * 3600_000, now), '2 days ago');
});

test('levelFromXp', () => {
  assert.equal(levelFromXp(0), 1);
  assert.equal(levelFromXp(3850), 13);
});

test('decompose uses template tasks when given, generic breakdown otherwise', () => {
  assert.deepEqual(decompose('X', { tasks: [{ title: 't' }] }), [{ title: 't' }]);
  assert.equal(decompose('X').length, 5);
});
