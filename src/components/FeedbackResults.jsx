import { useState } from 'react'
import { scoreClass, tagClass, tagLabel, iconBgStyle } from '../utils/scoring'
import styles from './FeedbackResults.module.css'

function CategoryCard({ cat, index, context, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  const tipLabel = context === '3mt' ? '3MT tip' : 'TED & 3MT tip'

  return (
    <div className={styles.feedbackSection}>
      <div
        className={`${styles.feedbackHeader} ${open ? styles.open : ''}`}
        onClick={() => setOpen(!open)}
      >
        <div className={styles.feedbackIcon} style={iconBgStyle(cat.level)}>
          {cat.icon}
        </div>
        <div className={styles.feedbackMeta}>
          <div className={styles.feedbackTitle}>{cat.name}</div>
          <div className={styles.feedbackSummary}>{cat.summary}</div>
        </div>
        <span className={`${styles.feedbackTag} ${styles[tagClass(cat.level)]}`}>
          {tagLabel(cat.level)}
        </span>
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}>▼</span>
      </div>

      {open && (
        <div className={styles.feedbackBody}>
          {cat.positives?.length > 0 && (
            <>
              <div className={styles.subLabel}>What's working</div>
              <ul>
                {cat.positives.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </>
          )}
          <div className={styles.subLabel}>Suggestions</div>
          <ul>
            {cat.improvements.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
          <div className={styles.tedTip}>
            <span className={styles.tedTipIcon}>★</span>
            <span><strong>{tipLabel}:</strong> {cat.ted_tip}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default function FeedbackResults({ result, context, onReset }) {
  return (
    <div>
      <div className={styles.overallFeedback}>
        <div className={styles.ovTitle}>Overall assessment</div>
        <div>{result.overall_summary}</div>
        <div className={styles.ovScore}>
          Overall score: <strong>{result.overall_score}/100</strong>
        </div>
      </div>

      <div className={styles.scoreBanner}>
        {result.categories.map((cat) => (
          <div key={cat.name} className={styles.scoreCard}>
            <div className={`${styles.scoreNum} ${styles[scoreClass(cat.score)]}`}>
              {cat.score}
            </div>
            <div className={styles.scoreLabel}>{cat.name.split(' ')[0]}</div>
            <div className={styles.rubricLevel}>Level {cat.rubric_level || '—'}/4</div>
          </div>
        ))}
      </div>

      {result.categories.map((cat, i) => (
        <CategoryCard
          key={cat.name}
          cat={cat}
          index={i}
          context={context}
          defaultOpen={i === 0}
        />
      ))}

      <button className={styles.resetBtn} onClick={onReset}>
        Start a new analysis
      </button>
    </div>
  )
}
