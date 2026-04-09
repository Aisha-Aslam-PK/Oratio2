import { useRecording } from '../hooks/useRecording'
import styles from './RecordZone.module.css'

const WAVE_DELAYS = [0, 0.1, 0.2, 0.15, 0.05, 0.25, 0.1, 0.3, 0.05, 0.2, 0.15, 0.1]
const WAVE_HEIGHTS = [6, 10, 14, 8, 18, 12, 6, 22, 10, 16, 8, 12]

export default function RecordZone({ text, onTextChange }) {
  const { isRecording, seconds, formatTime, toggleRecording } = useRecording(onTextChange)

  return (
    <>
      <div className={`${styles.recordZone} ${isRecording ? styles.recording : ''}`}>
        <button
          className={`${styles.recordBtn} ${isRecording ? styles.recordBtnActive : ''}`}
          onClick={() => toggleRecording(text)}
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        >
          {isRecording ? (
            <svg viewBox="0 0 24 24" fill="white" width="30" height="30">
              <rect x="9" y="9" width="6" height="6" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="white" width="30" height="30">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.77V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.42 5.42-2.77 5.91-5.77.1-.6-.39-1.15-1-1.15z" />
            </svg>
          )}
        </button>
        <div className={styles.recordLabel}>
          {isRecording ? 'Recording… tap to stop' : 'Tap to start recording'}
        </div>
        <div className={styles.timer}>{isRecording ? formatTime(seconds) : ''}</div>
        <div className={styles.waveform}>
          {WAVE_HEIGHTS.map((h, i) => (
            <div
              key={i}
              className={`${styles.waveBar} ${isRecording ? styles.waveBarActive : ''}`}
              style={{
                height: `${h}px`,
                animationDelay: isRecording ? `${WAVE_DELAYS[i]}s` : '0s',
              }}
            />
          ))}
        </div>
      </div>
      <p className={styles.noteMic}>
        Recording works in Chrome/Edge with microphone permissions. Alternatively, paste or type your presentation text below.
      </p>
    </>
  )
}
