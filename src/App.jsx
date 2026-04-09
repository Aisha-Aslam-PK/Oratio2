import { useState } from 'react'
import Header from './components/Header'
import ApiKeyInput from './components/ApiKeyInput'
import CoachTab from './components/CoachTab'
import ProgressTab from './components/ProgressTab'
import styles from './App.module.css'

export default function App() {
  const [activeTab, setActiveTab] = useState('coach')
  const [apiKey, setApiKey] = useState('')
  const [progressKey, setProgressKey] = useState(0)

  function handleTabSwitch(tab) {
    setActiveTab(tab)
    if (tab === 'progress') setProgressKey((k) => k + 1)
  }

  return (
    <div className={styles.app}>
      <Header />

      <div className={styles.navTabs}>
        <button
          className={`${styles.navTab} ${activeTab === 'coach' ? styles.navTabActive : ''}`}
          onClick={() => handleTabSwitch('coach')}
        >
          Coach
        </button>
        <button
          className={`${styles.navTab} ${activeTab === 'progress' ? styles.navTabActive : ''}`}
          onClick={() => handleTabSwitch('progress')}
        >
          My Progress
        </button>
      </div>

      {activeTab === 'coach' && (
        <div>
          <ApiKeyInput onKeySaved={setApiKey} />
          <CoachTab apiKey={apiKey} />
        </div>
      )}

      {activeTab === 'progress' && (
        <ProgressTab key={progressKey} />
      )}
    </div>
  )
}
