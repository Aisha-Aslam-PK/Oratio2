import { useState } from 'react'
import RecordZone from './RecordZone'
import FeedbackResults from './FeedbackResults'
import LoadingState from './LoadingState'
import { useAnalysis } from '../hooks/useAnalysis'
import styles from './CoachTab.module.css'

const CONTEXTS = [
  { key: 'conference', label: 'Conference paper' },
  { key: 'classroom', label: 'Classroom presentation' },
  { key: '3mt', label: '3MT' },
]

export default function CoachTab({ apiKey }) {
  const [text, setText] = useState('')
  const [context, setContext] = useState('conference')
  const { loading, loadingMessage, result, error, analyse, setResult } = useAnalysis()

  function handleReset() {
    setResult(null)
    setText('')
  }

  if (loading) return <LoadingState message={loadingMessage} />

  if (result) return <FeedbackResults result={result} context={context} onReset={handleReset} />

  return (
    <div>
      {error && (
        <div className={styles.errorBanner}>
          Error: {error} — please check your API key and try again.
        </div>
      )}

      <RecordZone text={text} onTextChange={setText} />

      <div className={styles.transcriptArea}>
        <div className={styles.sectionLabel}>Your presentation text</div>
        <textarea
          className={styles.textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your presentation excerpt here (at least 3–4 sentences for meaningful feedback)..."
        />
      </div>

      <div className={styles.optionsRow}>
        <div className={styles.sectionLabel} style={{ width: '100%', marginBottom: 4 }}>
          Presentation context
        </div>
        {CONTEXTS.map((ctx) => (
          <button
            key={ctx.key}
            className={`${styles.pillBtn} ${context === ctx.key ? styles.pillBtnActive : ''}`}
            onClick={() => setContext(ctx.key)}
          >
            {ctx.label}
          </button>
        ))}
      </div>

      <button
        className={styles.analyzeBtn}
        onClick={() => analyse(text, context, apiKey)}
      >
        Analyse my presentation
      </button>
    </div>
  )
}
