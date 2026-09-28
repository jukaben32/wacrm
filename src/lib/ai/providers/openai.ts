import { AiError, type ProviderResult } from '../types'
import { MAX_OUTPUT_TOKENS } from '../defaults'
import {
  mergeConsecutive,
  normalizeUsage,
  providerHttpError,
  toNetworkError,
  type ProviderArgs,
} from './shared'

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'

interface OpenAiResponse {
  choices?: { message?: { content?: string } }[]
  usage?: {
    prompt_tokens?: number
    completion_tokens?: number
    total_tokens?: number
  }
}

/**
 * Call OpenAI / OpenRouter's Chat Completions endpoint with the caller's key.
 * Automatically routes to OpenRouter when an OpenRouter API key (`sk-or-...`)
 * or a namespaced model (`provider/model`) is provided.
 * Returns the raw assistant text + token usage (handoff parsing happens
 * in `generateReply`).
 */
export async function generateOpenAi(args: ProviderArgs): Promise<ProviderResult> {
  const { apiKey, model, systemPrompt, messages, timeoutMs } = args
  const isOpenRouter = apiKey.startsWith('sk-or-') || model.includes('/')
  const endpoint = isOpenRouter
    ? 'https://openrouter.ai/api/v1/chat/completions'
    : OPENAI_URL

  let res: Response
  try {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }
    if (isOpenRouter) {
      headers['HTTP-Referer'] = 'https://wacrm.local'
      headers['X-Title'] = 'WACRM'
    }

    const payload: Record<string, unknown> = {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...mergeConsecutive(messages),
      ],
      max_tokens: MAX_OUTPUT_TOKENS,
    }
    if (!isOpenRouter) {
      payload.max_completion_tokens = MAX_OUTPUT_TOKENS
    }

    res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(timeoutMs),
    })
  } catch (err) {
    throw toNetworkError(err)
  }

  if (!res.ok) {
    throw await providerHttpError(isOpenRouter ? 'OpenRouter' : 'OpenAI', res)
  }

  const data = (await res.json().catch(() => null)) as OpenAiResponse | null
  const text = data?.choices?.[0]?.message?.content
  if (!text || typeof text !== 'string' || !text.trim()) {
    throw new AiError(
      `${isOpenRouter ? 'OpenRouter' : 'OpenAI'} returned an empty response.`,
      {
        code: 'empty_response',
      },
    )
  }
  const usage = normalizeUsage({
    prompt: data?.usage?.prompt_tokens,
    completion: data?.usage?.completion_tokens,
    total: data?.usage?.total_tokens,
  })
  return { text, usage }
}
