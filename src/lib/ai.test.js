import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { decompose, verify, AiError } from './ai.js';

// Canned Interactions API response wrapping `obj` as the model's JSON output.
const reply = (obj, status = 'completed') => ({
  ok: true,
  status: 200,
  json: async () => ({ status, steps: [{ type: 'thought' }, { type: 'model_output', content: [{ type: 'text', text: JSON.stringify(obj) }] }] }),
});

let calls;
beforeEach(() => {
  process.env.GEMINI_API_KEY = 'test-key';
  calls = [];
});
const stub = (res) => (globalThis.fetch = async (url, init) => (calls.push({ url, body: JSON.parse(init.body), headers: init.headers }), res));

test('decompose: sends schema + brief, clamps output, and returns a DAG in order', async () => {
  stub(reply({
    tasks: [
      { title: 'Build UI', category: 'Frontend', difficulty: 'Intermediate', estimatedHours: '3 hrs', bounty: 99999, xp: 600, description: 'd', deliverables: ['repo'], acceptanceCriteria: ['c'], dependsOn: [1] },
      { title: 'Design', category: 'Not a category', difficulty: 'Bite-Sized', estimatedHours: '2 hrs', bounty: 10, xp: 400, description: 'd', deliverables: ['figma'], acceptanceCriteria: ['c'], dependsOn: [] },
    ],
  }));
  const plan = await decompose({ title: 'Shop', description: 'A coffee shop site', category: 'Web' });
  assert.equal(calls[0].url, 'https://generativelanguage.googleapis.com/v1beta/interactions');
  assert.equal(calls[0].headers['x-goog-api-key'], 'test-key');
  assert.equal(calls[0].body.response_format.mime_type, 'application/json');
  assert.match(calls[0].body.input, /A coffee shop site/);
  assert.deepEqual(plan.map((t) => t.title), ['Design', 'Build UI']);
  assert.deepEqual(plan[1].dependsOn, [0]);
  assert.equal(plan[0].category, 'Frontend'); // unknown category clamped
  assert.equal(plan[0].bounty, 50);
  assert.equal(plan[1].bounty, 5000);
});

test('verify: returns clamped advice only and uses url_context', async () => {
  stub(reply({ score: 69, criteria: [{ criterion: 'x', met: 'yes', evidence: 'e' }], feedback: 'Close.', missing: ['Add tests'] }));
  const r = await verify({ task: { title: 't', description: 'd', deliverables: [], acceptance_criteria: ['x'] }, link: 'https://example.com', notes: '' });
  assert.deepEqual(r, { score: 69, feedback: 'Close.', missing: ['Add tests'], criteria: [{ criterion: 'x', met: false, evidence: 'e' }] });
  assert.equal('passed' in r, false, 'no accept/reject decision from the model');
  assert.deepEqual(calls[0].body.tools, [{ type: 'url_context' }]);

  stub(reply({ score: 140, criteria: [], feedback: 'ok', missing: [] }));
  const ok = await verify({ task: { title: 't', description: 'd' }, link: 'https://x.dev', notes: '' });
  assert.equal(ok.score, 100);
});

test('errors: missing key, HTTP error, unfinished answer, bad JSON', async () => {
  delete process.env.GEMINI_API_KEY;
  await assert.rejects(decompose({ title: 'a', description: 'b' }), (e) => e instanceof AiError && /not configured/.test(e.message));

  process.env.GEMINI_API_KEY = 'k';
  const quiet = console.error;
  console.error = () => {};
  try {
    stub({ ok: false, status: 429, json: async () => ({}) });
    await assert.rejects(decompose({ title: 'a', description: 'b' }), /rate limited/);
    stub(reply({}, 'failed'));
    await assert.rejects(decompose({ title: 'a', description: 'b' }), /did not finish/);
    stub({ ok: true, status: 200, json: async () => ({ status: 'completed', steps: [{ type: 'model_output', content: [{ type: 'text', text: 'nope' }] }] }) });
    await assert.rejects(decompose({ title: 'a', description: 'b' }), /unreadable/);
    stub(reply({ tasks: [] }));
    await assert.rejects(decompose({ title: 'a', description: 'b' }), /could not plan/);
  } finally {
    console.error = quiet;
  }
});
