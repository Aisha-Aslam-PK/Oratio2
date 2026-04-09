import { useState, useCallback } from 'react'
import { buildSystemPrompt } from '../utils/prompt'
import { CTX_MAP } from '../utils/scoring'
import { saveSession } from '../utils/storage'

const LOADING_MESSAGES = [
  'Analysing your language and structure…',
  'Comparing against TED Talk & 3MT patterns…',
  'Evaluating cohesion and flow…',
  'Preparing your personalised report…',
]

export function useAnalysis() {
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0])
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const analyse = useCallback(async (text, presentationContext, apiKey) => {
    if (text.trim().length < 40) {
      alert('Please provide at least a few sentences for meaningful feedback.')
      return
    }
    if (!apiKey) {
      alert('Please enter your Anthropic API key at the top of the page first.')
      return
    }

    setLoading(true)
    setResult(null)
    setError(null)

    let mi = 0
    const msgInt = setInterval(() => {
      mi = (mi + 1) % LOADING_MESSAGES.length
      setLoadingMessage(LOADING_MESSAGES[mi])
    }, 2200)

    const ctxLabel = CTX_MAP[presentationContext] || 'academic presentation'
    const systemPrompt = buildSystemPrompt(presentationContext)

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: `Here is a postgraduate student's excerpt from a ${ctxLabel}. Please analyse it carefully.\n\n---\n${text}\n---`,
            },
          ],
        }),
      })

      const data = await response.json()
      clearInterval(msgInt)

      if (data.error) throw new Error(data.error.message)

      const raw = data.content.map((i) => i.text || '').join('')
      const clean = raw.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)

      saveSession({
        overall_score: parsed.overall_score,
        overall_summary: parsed.overall_summary,
        categories: parsed.categories.map((c) => ({
          name: c.name,
          score: c.score,
          level: c.level,
        })),
        context: presentationContext,
        date: new Date().toLocaleDateString('en-AU', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      })

      setResult(parsed)
    } catch (err) {
      clearInterval(msgInt)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, loadingMessage, result, error, analyse, setResult }
}
