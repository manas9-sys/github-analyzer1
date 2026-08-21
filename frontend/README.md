# 🚀 GitHub Profile Analyzer

A production-quality full-stack developer analytics platform that analyzes public GitHub profiles, calculates transparent engineering metrics and quality scores, detects technologies directly from repository manifests & code signals, and generates evidence-grounded AI developer profiles.

---

## 🌟 Key Features

1. **Evidence-Based Technology Detection**
   - Scans repository languages, topic tags, and dependency manifests (`package.json`, `requirements.txt`, `go.mod`, `Cargo.toml`, `Dockerfile`, etc.).
   - Categorizes tools across Frontend, Backend, Database, DevOps/Cloud, AI/ML, Languages, Testing, and Tooling.
   - Includes verifiable evidence tooltips showing where each technology was discovered.

2. **Transparent GitHub Developer Score (/100)**
   - Deterministic, 0-100 rubric evaluating 6 distinct pillars:
     - **Technical Breadth** (20 pts)
     - **Project Quality** (20 pts)
     - **Activity & Consistency** (20 pts)
     - **Documentation** (15 pts)
     - **Engineering Practices** (15 pts)
     - **Open Source & Community** (10 pts)
   - Built-in interactive Scoring Rubric dialog explaining the exact formula.

3. **AI Developer Evaluation & Archetype**
   - Synthesizes an evidence-backed persona summary (2-4 sentences).
   - Identifies developer archetypes (e.g. *Full-Stack Builder*, *Frontend Specialist*, *Backend Engineer*, *Systems & Infrastructure Engineer*, *AI & Data Engineer*, *Open Source Contributor*).
   - Generates an estimated skill level (*Beginner*, *Junior*, *Intermediate*, *Advanced*) clearly labeled as an AI estimate.
   - Highlights 3-6 verified strengths and 3-5 realistic growth areas.
   - Generates 3 tailored project recommendations with target tech stacks and skill takeaways.

4. **Rich Interactive Visualizations (Recharts)**
   - Donut language distribution chart with official GitHub language colors.
   - Longitudinal repository creation and update activity timeline.
   - 6-dimension engineering health radar chart.

5. **Repository Explorer**
   - Sort repositories by **Quality Score**, **Stars**, or **Recently Updated**.
   - Filter by language and source (All, Original, Forks).
   - Click-to-inspect modal displaying README previews, manifest files, and individual repository health metrics.

6. **Shareable Reports & Markdown Export**
   - Clean shareable URLs: `/u/:username`.
   - 1-click **Copy Profile Markdown** formatted for resumes, portfolios, and LinkedIn.
   - Direct cache bypass and refresh trigger.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Recharts, Lucide React
- **Backend**: Node.js, Express, Axios, Express Rate Limit, Node-Cache, `@google/generative-ai`
- **APIs**: GitHub REST API v3, Google Gemini API (with robust heuristic fallback)

---

## 🚀 Quickstart Guide

### Prerequisites
- Node.js 18+ installed

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm start
```

*The backend runs on `http://localhost:5000`.*

#### Environment Variables (`backend/.env`)

```env
PORT=5000

# (Optional) GitHub Token to increase rate limit from 60 to 5,000 requests/hr
GITHUB_TOKEN=

# (Optional) Google Gemini API Key for AI synthesis (free at https://aistudio.google.com/)
GEMINI_API_KEY=

# Cache TTL in seconds (default: 600)
CACHE_TTL=600
```

> **Note**: The app functions out of the box with zero configuration! If `GEMINI_API_KEY` is not provided, the built-in deterministic heuristic AI engine computes the profile.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

*The frontend runs on `http://localhost:3000`.*

---

## 📡 API Endpoints

- `GET /api/health` — Health check, server uptime, and cache metrics
- `GET /api/analyze/:username` — Performs end-to-end profile analysis (`?refresh=true` to force fresh fetch)
- `GET /api/repos/:username/:repo` — Fetches README preview and configuration manifests for a repository

---

## 🔒 Security & Reliability

- Server-side API key containment (keys never exposed to the client).
- Rate limiting protection with `express-rate-limit`.
- Fast in-memory caching with `node-cache` to protect GitHub API quotas.
- Strict input validation and sanitization for GitHub usernames.
