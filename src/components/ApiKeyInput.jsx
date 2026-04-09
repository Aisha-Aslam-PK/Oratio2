import { useState } from 'react'
import styles from './ApiKeyInput.module.css'

export default function ApiKeyInput({ onKeySaved }) {
  const [value, setValue] = useState('')
  const [saved, setSaved] = useState(false)

  function handleSave() {
    if (value.trim().startsWith('sk-')) {
      onKeySaved(value.trim())
      setSaved(true)
    } else {
      alert('Please enter a valid Anthropic API key starting with "sk-ant-".')
    }
  }

  return (
    <div className={styles.notice}>
      <strong>Setup required:</strong> Enter your Anthropic API key below. Your key is stored only
      in your browser's memory and never sent anywhere except the Anthropic API.
      <div className={styles.row}>
        <input
          type="password"
          placeholder="sk-ant-..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        />
        <button onClick={handleSave}>Save</button>
      </div>
      {saved && <div className={styles.keySaved}>✓ Key saved for this session</div>}
    </div>
  )
}
