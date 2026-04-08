# Oratio2.0 🎙️
### Academic Presentation Coach for Postgraduate Researchers

Oratio2.0 is a browser-based app that helps postgraduate students — especially non-native speakers of English — improve their academic presentation skills. It analyses spoken or written presentation excerpts and provides detailed, personalised feedback inspired by TED Talk and Three Minute Thesis (3MT) standards.

---

## What it does

Students record or paste a segment of their academic presentation and receive feedback across four key dimensions:

- **Grammar & Accuracy** — sentence structure, tense consistency, article use
- **Vocabulary & Register** — word choice, academic tone, precision
- **Cohesion & Flow** — transitions, linking language, how ideas connect
- **Structure & Logic** — argument organisation, signposting, narrative arc

Each category includes a score, specific praise for what's working, actionable suggestions, and a practical tip drawn from TED Talk and 3MT presentation standards.

Students can select their presentation type — **Conference paper**, **Classroom presentation**, or **3MT** — and the feedback adjusts accordingly. For 3MT, the app applies the official 3MT judging criteria: accessibility to a non-specialist audience, a clear research significance argument, engaging delivery, and a memorable conclusion within three minutes.

The app also tracks progress across sessions, showing score trends over time so students can see their improvement.

---

## Demo

> Open `Oratio2.0.html` in your browser after following the setup steps below.

---

## Getting started

### What you need
- A modern browser (Chrome or Edge recommended for voice recording)
- A free Anthropic API key — get one at [console.anthropic.com](https://console.anthropic.com)

### How to run it locally

1. Clone this repository using GitHub Desktop or the command line:
   ```bash
   git clone https://github.com/YOUR-USERNAME/oratio2.git
   ```

2. Open the project folder and serve it locally. If you have Python installed:
   ```bash
   python3 -m http.server 8080
   ```
   Then open `http://localhost:8080/Oratio2.0.html` in Chrome.

3. Enter your Anthropic API key in the field at the top of the app.

4. Start recording or paste your presentation text and click **Analyse my presentation**.

### How to host it online (for free)

You can share a live version of the app using GitHub Pages:

1. Go to your repository on GitHub
2. Click **Settings → Pages**
3. Under Branch, select **main** and click **Save**
4. Your app will be live at:
   `https://YOUR-USERNAME.github.io/oratio2/Oratio2.0.html`

> **Note:** Each user will need to enter their own Anthropic API key. Keys are stored only in the browser's memory and are never shared or saved externally.

---

## Project structure

```
oratio2/
│
├── Oratio2.0.html     # The entire app (HTML, CSS, and JavaScript in one file)
└── README.md            # This file
```

The app is intentionally built as a single self-contained HTML file so it is easy to share, modify, and deploy without any build tools or dependencies.

---

## How to contribute

We welcome contributions! Here is the recommended workflow:

### 1. Fork and clone the repository
Click **Fork** at the top right of this page, then clone your fork locally using GitHub Desktop or:
```bash
git clone https://github.com/YOUR-USERNAME/oratio2.git
```

### 2. Create a new branch
Always create a branch before making changes — never work directly on `main`:
```bash
git checkout -b feature/your-feature-name
```

Examples of good branch names:
- `feature/discipline-filter`
- `fix/microphone-permissions`
- `feature/rewritten-text-suggestions`

### 3. Make your changes
Edit `Oratio2.0.html` in any code editor (VS Code is recommended).

### 4. Commit and push
```bash
git add .
git commit -m "Add: short description of what you changed"
git push origin feature/your-feature-name
```

### 5. Open a Pull Request
Go to the repository on GitHub and click **Compare & pull request**. Write a short description of what you changed and why. The repository owner will review and merge it.

---

## Planned features

- [ ] Discipline-specific feedback (STEM vs humanities vs social sciences)
- [ ] Side-by-side rewritten text suggestions
- [ ] Export feedback as PDF report
- [ ] Multi-language interface
- [ ] Instructor dashboard to review student sessions
- [ ] 3MT countdown timer with real-time pacing feedback

---

## Technology

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, vanilla JavaScript |
| AI feedback | [Anthropic Claude API](https://www.anthropic.com) (claude-sonnet-4) |
| Voice input | Web Speech API (browser-native) |
| Charts | [Chart.js](https://www.chartjs.org) |
| Fonts | Google Fonts (Playfair Display, DM Sans) |
| Hosting | GitHub Pages |

---

## Privacy

- Presentation text is sent to the Anthropic API for analysis only
- No data is stored on any server
- Progress history is saved in the user's own browser (localStorage) only
- API keys are held in memory only and never persisted

---

## Licence

This project is open source and available under the [MIT Licence](LICENSE).

---

## About

Oratio2.0 was created to support postgraduate researchers who are non-native speakers of English, helping them build confidence and clarity in academic communication. It draws on two gold standards of accessible academic communication — the clarity and storytelling of TED Talks, and the precision and conciseness of the Three Minute Thesis (3MT) competition.
