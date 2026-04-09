export function scoreColor(score) {
  if (score >= 70) return '#1e7d4f'
  if (score >= 45) return '#b87a00'
  return '#c0392b'
}

export function scoreClass(score) {
  if (score >= 70) return 'score-good'
  if (score >= 45) return 'score-mid'
  return 'score-low'
}

export function tagClass(level) {
  if (level === 'good') return 'tag-good'
  if (level === 'mid') return 'tag-mid'
  return 'tag-low'
}

export function tagLabel(level) {
  if (level === 'good') return 'Strong'
  if (level === 'mid') return 'Developing'
  return 'Needs work'
}

export function iconBgStyle(level) {
  if (level === 'good') return { background: '#e8f5ee', color: '#1e7d4f' }
  if (level === 'mid') return { background: '#fff8e6', color: '#b87a00' }
  return { background: '#fef0f0', color: '#c0392b' }
}

export const CTX_LABELS = {
  conference: 'Conference paper',
  classroom: 'Classroom presentation',
  '3mt': '3MT',
}

export const CTX_MAP = {
  conference: 'academic conference presentation',
  classroom: 'postgraduate classroom presentation',
  '3mt': 'Three Minute Thesis (3MT) competition presentation',
}

export const CAT_COLORS = {
  'Structure of Presentation': '#534AB7',
  'Grammatical Accuracy': '#0F6E56',
  'Vocabulary & Register': '#BA7517',
  'Audience Engagement': '#993556',
}
