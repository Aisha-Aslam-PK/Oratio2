# Oratio2.0 — Backend Development Brief

## Project overview

Oratio2.0 is a browser-based academic presentation coaching app for postgraduate students who are non-native speakers of English. The frontend is complete and built as a single HTML file (`Oratio2.html`). It currently requires each user to enter their own Anthropic API key, which is not practical for a classroom setting.

This brief describes the backend layer needed to:
1. Remove the API key burden from students
2. Handle all Anthropic API calls server-side securely
3. Track and log student usage for the instructor

---

## Current architecture

```
Student browser
     │
     ▼
Oratio2.html  ──── direct API call ────►  Anthropic API
                   (with user's key)
```

## Target architecture

```
Student browser
     │
     ├── POST /transcribe  (audio file) ────►  Your backend server  ────►  OpenAI Whisper API
     │                                               │                      (transcribed text)
     │                                               │
     └── POST /analyse  (text + context) ──────►    │              ────►  Anthropic API
                                                     │                      (feedback JSON)
                                                     ▼
                                                Database
                                            (logs usage data)
```

---

## What the backend needs to do

### 1. Authentication — know who is using the app
Students should log in before they can use the app. Recommended approach:

- Simple email + password registration and login
- Or university SSO (Single Sign-On) if available
- On login, the server issues a session token the frontend stores in the browser
- Every request to the backend includes this token so the server knows who is asking

Suggested endpoints:
```
POST /auth/register     { name, email, password }
POST /auth/login        { email, password }  →  { token }
POST /auth/logout
```

### 2. Speech-to-text transcription — replace browser recognition with Whisper

The current app uses the browser's built-in Web Speech API (Google's engine) for voice recording. This has poor accuracy for non-native speakers and accented English, which directly undermines the quality of feedback. The backend should replace this with **OpenAI Whisper**, which is significantly more accurate for non-native English speakers.

**Why Whisper:**
- Trained on 680,000 hours of multilingual audio including diverse accents
- Cost: $0.006 per minute — a 3-minute 3MT presentation costs less than 2 cents
- Open source — can also be self-hosted for zero API cost if needed
- Handles Pakistani, South Asian, East Asian, and other accents far better than Google's engine

**How it works:**

The frontend records audio using the browser's `MediaRecorder` API (not Web Speech API) and sends the audio file to the backend. The backend forwards it to Whisper, gets back the transcript, and returns it to the frontend for display and subsequent analysis.

New endpoint:
```
POST /transcribe
Authorization: Bearer <token>
Content-Type: multipart/form-data

{ audio: <audio file, webm or mp4 format> }

Response:
{ "transcript": "Good morning. My research investigates..." }
```

Backend flow:
1. Receive audio file from frontend
2. Forward to OpenAI Whisper API: `POST https://api.openai.com/v1/audio/transcriptions`
3. Return transcript text to frontend
4. Frontend displays transcript in the text box — student can review and edit before clicking Analyse

**Frontend changes needed for Whisper:**
- Replace `window.SpeechRecognition` with `MediaRecorder` to capture audio as a file
- Add a "Stop & Transcribe" button — recording stops, audio is sent to `/transcribe`, transcript appears in the text box
- Remove the live interim transcription display (Whisper works on completed audio, not streaming)
- Students can edit the transcript before submitting for analysis — this is actually better UX

**Environment variable to add:**
```
OPENAI_API_KEY=sk-...
```

**Estimated cost for a class of 30 students, 3 sessions each, average 3 minutes per recording:**
- 30 × 3 × 3 minutes = 270 minutes of audio
- 270 × $0.006 = **$1.62 total** — negligible

**Self-hosting option (zero cost):**
If the university has a GPU server available, Whisper can be run locally using the `openai-whisper` Python package. The `medium` or `large` model gives the best accuracy for non-native speakers. This removes the OpenAI API dependency entirely.

```bash
pip install openai-whisper
# Then call whisper.transcribe(audio_file, language="en") in the backend
```

---

### 3. Proxied API calls — hide the Anthropic key
The frontend currently calls the Anthropic API directly. Instead, it should call your backend, which forwards the request using your securely stored API key.

The frontend sends:
```json
POST /analyse
Authorization: Bearer <token>

{
  "text": "The student's presentation excerpt...",
  "context": "conference | thesis | seminar | public"
}
```

The backend:
1. Validates the session token
2. Constructs the full prompt (currently in the frontend JS)
3. Calls the Anthropic API using the server-side API key
4. Returns the JSON feedback response to the frontend
5. Logs the session to the database

```json
Response:
{
  "overall_summary": "...",
  "overall_score": 74,
  "categories": [ ... ]
}
```

### 4. Usage logging — track who used the app and when
Every time a student submits a presentation for analysis, log the following to a database:

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Unique session ID |
| `user_id` | FK | Links to the student's account |
| `timestamp` | DateTime | When the session occurred |
| `context` | String | Presentation type (conference, thesis, etc.) |
| `overall_score` | Integer | Overall score returned by AI |
| `grammar_score` | Integer | Grammar category score |
| `vocabulary_score` | Integer | Vocabulary category score |
| `cohesion_score` | Integer | Cohesion category score |
| `structure_score` | Integer | Structure category score |
| `text_length` | Integer | Character count of submitted text |

> Note: Do not store the actual presentation text — only the scores and metadata. This protects student privacy.

### 5. Instructor dashboard — view usage data
A simple password-protected page (separate from the student app) where the instructor can see:

- List of all registered students
- Number of sessions per student
- Each student's score progression over time (overall and per category)
- Date of first and most recent session
- Export to CSV for further analysis

Suggested endpoint:
```
GET /admin/students          →  list of all students + session counts
GET /admin/students/:id      →  full session history for one student
GET /admin/export            →  CSV download of all sessions
```

---

## Suggested tech stack

These are recommendations — use whatever you are most comfortable with:

| Layer | Suggestion |
|---|---|
| Backend language | Python (FastAPI or Flask) or Node.js (Express) |
| Database | PostgreSQL or SQLite for simplicity |
| Authentication | JWT tokens or Flask-Login / Passport.js |
| Hosting | Railway, Render, or Fly.io (all have free tiers) |
| Speech-to-text | OpenAI Whisper API — or self-hosted `openai-whisper` Python package |
| Environment variables | Store all API keys in a `.env` file, never in code |

---

## Changes needed to the frontend

The frontend (`Oratio2.html`) will need small adjustments:

1. **Remove** the API key input field and the `x-api-key` header from the fetch call
2. **Add** a simple login screen shown before the main app
3. **Replace** `window.SpeechRecognition` with `MediaRecorder` to capture audio as a file for Whisper
4. **Change** the recording button to send audio to `/transcribe` and display the returned transcript
5. **Change** the analysis call from hitting Anthropic directly to hitting your backend's `/analyse` endpoint
6. **Add** the session token to each request header: `Authorization: Bearer <token>`
7. The progress tracking (Chart.js, localStorage) can stay as-is or be migrated to the backend database

These are small, well-contained changes — the rest of the frontend can remain untouched.

---

## Security requirements

- The Anthropic API key and OpenAI API key must **never** appear in the frontend code or be sent to the browser
- Store both as environment variables on the server only
- All `/transcribe`, `/analyse`, and `/admin` endpoints must require authentication
- Use HTTPS in production
- Rate-limit the `/analyse` and `/transcribe` endpoints per user (e.g. max 20 requests per day) to control API costs

---

## Out of scope for this brief

- Mobile app version
- Real-time streaming transcription (Whisper works on completed audio files — this is fine for the use case)
- LMS integration (Blackboard, Canvas, Moodle) — possible future phase
- Plagiarism or AI-detection features

---

## Questions to discuss with the instructor before starting

1. Should students self-register, or should the instructor pre-load a list of student emails?
2. Is university SSO (Single Sign-On) available and preferred over email/password?
3. What is the expected number of students using the app? (Affects hosting and API cost estimates)
4. Should there be a limit on how many analyses a student can run per day?
5. Where should the app be hosted — on a university server or a third-party platform?
6. Does the university have a GPU server available for self-hosting Whisper? If yes, transcription costs drop to zero.

---

*Frontend repository: https://github.com/YOUR-USERNAME/oratio2*
*Frontend developer: [your name]*
*Brief prepared: April 2026*
