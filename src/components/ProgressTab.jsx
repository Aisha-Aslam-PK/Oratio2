import { useEffect, useRef } from 'react'
import {
  Chart,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Legend,
  Filler,
  Tooltip,
} from 'chart.js'
import { getSessions, clearSessions } from '../utils/storage'
import { scoreColor, CTX_LABELS, CAT_COLORS } from '../utils/scoring'
import styles from './ProgressTab.module.css'

Chart.register(LineElement, PointElement, LineController, CategoryScale, LinearScale, Legend, Filler, Tooltip)

function DeltaBadge({ delta }) {
  if (delta === null) return null
  if (delta > 0) return <div className={`${styles.progDelta} ${styles.deltaUp}`}>▲ +{delta} from last</div>
  if (delta < 0) return <div className={`${styles.progDelta} ${styles.deltaDown}`}>▼ {delta} from last</div>
  return <div className={`${styles.progDelta} ${styles.deltaFlat}`}>— same as last</div>
}

function ProgressChart({ sessions }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current || sessions.length === 0) return
    if (chartRef.current) chartRef.current.destroy()

    const labels = sessions.map((_, i) => `#${i + 1}`)
    const catNames = sessions[0].categories.map((c) => c.name)

    const datasets = [
      {
        label: 'Overall',
        data: sessions.map((s) => s.overall_score),
        borderColor: '#1a1a2e',
        backgroundColor: 'rgba(26,26,46,0.08)',
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#1a1a2e',
        tension: 0.3,
        fill: true,
      },
      ...catNames.map((name) => ({
        label: name.split(' ')[0],
        data: sessions.map((s) => {
          const c = s.categories.find((x) => x.name === name)
          return c ? c.score : null
        }),
        borderColor: CAT_COLORS[name] || '#888',
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        pointRadius: 3,
        borderDash: [4, 3],
        tension: 0.3,
        fill: false,
      })),
    ]

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { font: { family: 'DM Sans', size: 11 }, boxWidth: 12, padding: 12 },
          },
        },
        scales: {
          y: {
            min: 0,
            max: 100,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { font: { size: 11 }, stepSize: 25 },
          },
          x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        },
      },
    })

    return () => { if (chartRef.current) chartRef.current.destroy() }
  }, [sessions])

  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartTitle}>Overall score over time</div>
      <div style={{ height: 180 }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}

export default function ProgressTab({ refreshKey }) {
  const sessions = getSessions()

  function handleClear() {
    if (!confirm('Delete all session history? This cannot be undone.')) return
    clearSessions()
    window.location.reload()
  }

  if (sessions.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>📈</div>
        <div>No sessions yet.</div>
        <div className={styles.emptyHint}>Complete your first analysis to start tracking progress.</div>
      </div>
    )
  }

  const scores = sessions.map((s) => s.overall_score)
  const latest = scores[scores.length - 1]
  const prev = scores.length > 1 ? scores[scores.length - 2] : null
  const best = Math.max(...scores)
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  const delta = prev !== null ? latest - prev : null

  return (
    <div>
      <div className={styles.progressSummary}>
        <div className={styles.progCard}>
          <div className={styles.progNum}>{latest}</div>
          <div className={styles.progLabel}>Latest score</div>
          <DeltaBadge delta={delta} />
        </div>
        <div className={styles.progCard}>
          <div className={styles.progNum}>{best}</div>
          <div className={styles.progLabel}>Best score</div>
        </div>
        <div className={styles.progCard}>
          <div className={styles.progNum}>{sessions.length}</div>
          <div className={styles.progLabel}>Sessions</div>
          <div className={`${styles.progDelta} ${styles.deltaFlat}`}>avg {avg}/100</div>
        </div>
      </div>

      <ProgressChart sessions={sessions} />

      <div className={styles.sectionLabel}>Session history</div>
      <div className={styles.sessionList}>
        {[...sessions].reverse().map((s, ri) => {
          const num = sessions.length - ri
          const scoreC = scoreColor(s.overall_score)
          return (
            <div key={ri} className={styles.sessionItem}>
              <div className={styles.sessionNum}>{num}</div>
              <div className={styles.sessionInfo}>
                <div className={styles.sessionCtx}>{CTX_LABELS[s.context] || s.context}</div>
                <div className={styles.sessionDate}>{s.date}</div>
                <div className={styles.sessionScores}>
                  {s.categories.map((c) => {
                    const bg = c.level === 'good' ? '#e8f5ee' : c.level === 'mid' ? '#fff8e6' : '#fef0f0'
                    const col = c.level === 'good' ? '#1e7d4f' : c.level === 'mid' ? '#b87a00' : '#c0392b'
                    return (
                      <span key={c.name} className={styles.miniScore} style={{ background: bg, color: col }}>
                        {c.name[0]} {c.score}
                      </span>
                    )
                  })}
                </div>
              </div>
              <div className={styles.sessionOverall} style={{ color: scoreC }}>
                {s.overall_score}
              </div>
            </div>
          )
        })}
      </div>

      <button className={styles.clearBtn} onClick={handleClear}>
        Clear all history
      </button>
    </div>
  )
}
