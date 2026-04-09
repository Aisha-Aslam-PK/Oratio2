import { useState, useRef, useCallback } from 'react'

export function useRecording(onTranscriptUpdate) {
  const [isRecording, setIsRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const recognitionRef = useRef(null)
  const timerRef = useRef(null)
  const finalTranscriptRef = useRef('')

  const startRecording = useCallback((currentText) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      alert('Speech recognition not supported. Please use Chrome or paste your text below.')
      return
    }

    finalTranscriptRef.current = currentText || ''
    const recognition = new SR()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (e) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          finalTranscriptRef.current += e.results[i][0].transcript + ' '
        } else {
          interim += e.results[i][0].transcript
        }
      }
      onTranscriptUpdate(finalTranscriptRef.current + interim)
    }

    recognition.onerror = (e) => console.warn('Speech error:', e.error)
    recognition.start()
    recognitionRef.current = recognition

    setIsRecording(true)
    setSeconds(0)

    timerRef.current = setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)
  }, [onTranscriptUpdate])

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) recognitionRef.current.stop()
    clearInterval(timerRef.current)
    setIsRecording(false)
  }, [])

  const toggleRecording = useCallback((currentText) => {
    if (isRecording) stopRecording()
    else startRecording(currentText)
  }, [isRecording, startRecording, stopRecording])

  const formatTime = (s) => {
    const m = String(Math.floor(s / 60)).padStart(2, '0')
    const sec = String(s % 60).padStart(2, '0')
    return `${m}:${sec}`
  }

  return { isRecording, seconds, formatTime, toggleRecording }
}
