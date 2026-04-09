import styles from './LoadingState.module.css'

export default function LoadingState({ message }) {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
      <div className={styles.text}>{message}</div>
    </div>
  )
}
