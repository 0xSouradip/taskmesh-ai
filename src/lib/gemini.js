// Minimal Gemini Interactions API client (REST, no SDK).
// Docs: https://ai.google.dev/gemini-api/docs/interactions/quickstart
const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/interactions';
const API_REVISION = '2026-05-20';

export const DEFAULT_MODEL = 'gemini-3.8-flash';
export const modelName = () => process.env.GEMINI_MODEL || DEFAULT_MODEL;

// Message is safe to show users; details go to the server log only.
export class AiError extends Error {}

export const aiConfigured = () => Boolean(process.env.GEMINI_API_KEY);

/**
 * One stateless call that must answer with JSON matching `schema`.
 * Returns the parsed object.
 */
export async function generateJson({ system, input, schema, tools, thinking = 'low', timeoutMs = 60_000 }) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new AiError('AI is not configured on this server (GEMINI_API_KEY is missing).');

  let res;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'x-goog-api-key': key, 'Api-Revision': API_REVISION, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelName(),
        system_instruction: system,
        input,
        store: false,
        ...(tools ? { tools } : {}),
        generation_config: { thinking_level: thinking },
        response_format: { type: 'text', mime_type: 'application/json', schema },
      }),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (e) {
    console.error('[gemini] request failed:', e?.message);
    throw new AiError(e?.name === 'TimeoutError' ? 'The AI took too long to answer. Try again.' : 'Could not reach the AI service.');
  }

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    console.error('[gemini] HTTP', res.status, JSON.stringify(body)?.slice(0, 500));
    throw new AiError(res.status === 429 ? 'The AI is busy (rate limited). Try again in a minute.' : 'The AI service returned an error.');
  }
  if (body?.status !== 'completed') {
    console.error('[gemini] unexpected status:', body?.status);
    throw new AiError('The AI did not finish its answer. Try again.');
  }

  const text = (body.steps ?? [])
    .filter((s) => s.type === 'model_output')
    .flatMap((s) => s.content ?? [])
    .filter((c) => c.type === 'text')
    .map((c) => c.text)
    .join('');
  try {
    return JSON.parse(text);
  } catch {
    console.error('[gemini] non-JSON output:', text.slice(0, 300));
    throw new AiError('The AI returned an unreadable answer. Try again.');
  }
}
