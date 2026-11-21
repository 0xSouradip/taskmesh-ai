import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizePlan, removeFromPlan } from './dag.js';

const titles = (plan) => plan.map((t) => t.title);

test('orders tasks so dependencies come first and remaps indices', () => {
  const plan = normalizePlan([
    { title: 'api', dependsOn: [2] },
    { title: 'tests', dependsOn: [0, 2] },
    { title: 'design', dependsOn: [] },
  ]);
  assert.deepEqual(titles(plan), ['design', 'api', 'tests']);
  assert.deepEqual(plan.map((t) => t.dependsOn), [[], [0], [0, 1]]);
});

test('drops self, unknown, duplicate and junk references', () => {
  const plan = normalizePlan([{ title: 'a', dependsOn: [0, 7, -1, 'x', 1, 1] }, { title: 'b' }]);
  assert.deepEqual(titles(plan), ['b', 'a']);
  assert.deepEqual(plan.map((t) => t.dependsOn), [[], [0]]);
});

test('breaks cycles instead of looping', () => {
  const plan = normalizePlan([
    { title: 'a', dependsOn: [2] },
    { title: 'b', dependsOn: [0] },
    { title: 'c', dependsOn: [1] },
  ]);
  assert.equal(plan.length, 3);
  plan.forEach((t, i) => t.dependsOn.forEach((d) => assert.ok(d < i, 'every edge points backwards')));
});

test('removeFromPlan shifts indices and drops edges to the removed task', () => {
  const plan = removeFromPlan(
    [{ title: 'a', dependsOn: [] }, { title: 'b', dependsOn: [0] }, { title: 'c', dependsOn: [0, 1] }],
    1
  );
  assert.deepEqual(plan.map((t) => t.dependsOn), [[], [0]]);
});
