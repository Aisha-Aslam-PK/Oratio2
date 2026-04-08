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
     ▼
Oratio2.html  ──── POST /analyse ────►  Your backend server  ────►  Anthropic API
                   (no key needed)            │                      (your key)
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

### 2. Proxied API calls — hide the Anthropic key
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

### 3. Usage logging — track who used the app and when
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

### 4. Instructor dashboard — view usage data
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
| Environment variables | Store the Anthropic API key in a `.env` file, never in code |

---

## Changes needed to the frontend

The frontend (`Oratio2.html`) will need small adjustments:

1. **Remove** the API key input field and the `x-api-key` header from the fetch call
2. **Add** a simple login screen shown before the main app
3. **Change** the API call from hitting Anthropic directly to hitting your backend's `/analyse` endpoint
4. **Add** the session token to each request header: `Authorization: Bearer <token>`
5. The progress tracking (Chart.js, localStorage) can stay as-is or be migrated to the backend database

These are small, well-contained changes — the rest of the frontend can remain untouched.

---

## Security requirements

- The Anthropic API key must **never** appear in the frontend code or be sent to the browser
- Store it as an environment variable on the server only
- All `/analyse` and `/admin` endpoints must require authentication
- Use HTTPS in production
- Rate-limit the `/analyse` endpoint per user (e.g. max 20 requests per day) to control API costs

---

## Out of scope for this brief

- Mobile app version
- Real-time audio transcription on the server (the browser's Web Speech API handles this already)
- LMS integration (Blackboard, Canvas, Moodle) — possible future phase
- Plagiarism or AI-detection features

---

## Questions to discuss with the instructor before starting

1. Should students self-register, or should the instructor pre-load a list of student emails?
2. Is university SSO (Single Sign-On) available and preferred over email/password?
3. What is the expected number of students using the app? (Affects hosting and API cost estimates)
4. Should there be a limit on how many analyses a student can run per day?
5. Where should the app be hosted — on a university server or a third-party platform?

---

*Frontend repository: https://github.com/YOUR-USERNAME/oratio2*
*Frontend developer: [your name]*
*Brief prepared: April 2026*
