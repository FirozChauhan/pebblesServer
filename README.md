<div align="center">

# ⚙️ Pebbles Backend

### AI Resume Optimization API

The server that powers **Pebbles** — receives a resume PDF, extracts its text, rewrites it ATS-style with **Groq's Llama 3.3 70B**, then renders a polished PDF via **Puppeteer** and streams it back.

<br>

<img src="https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express 5"/>
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
<img src="https://img.shields.io/badge/Groq_Llama_3.3_70B-F55036?style=for-the-badge&logo=coloros&logoColor=white" alt="Groq"/>
<img src="https://img.shields.io/badge/Puppeteer-40B5A4?style=for-the-badge&logo=puppeteer&logoColor=white" alt="Puppeteer"/>
<img src="https://img.shields.io/badge/pdf--parse-FF6B6B?style=for-the-badge&logo=files&logoColor=white" alt="pdf-parse"/>
<img src="https://img.shields.io/badge/Multer-F7B500?style=for-the-badge&logo=upload&logoColor=white" alt="Multer"/>

</div>

<br>

## 🔄 The Pipeline

```
POST /optimise  (multipart: resumePdf + jobRole)
        │
        ▼
   ① Multer receives the PDF (in-memory)
        │
        ▼
   ② pdf-parse extracts raw text
        │
        ▼
   ③ Groq (llama-3.3-70b-versatile) rewrites it → JSON
        │  (ATS keywords, action verbs, STAR bullets,
        │   role-tailored skills, gap analysis)
        ▼
   ④ React SSR renders <ResumePDF> → HTML string
        │
        ▼
   ⑤ Puppeteer renders HTML → A4 PDF
        │
        ▼
   Response: application/pdf  (auto-downloaded by frontend)
```

<br>

## 🛠️ Tech Stack

| Layer | Tool |
|---|---|
| Server | **Express 5** + **TypeScript** (run via `tsx`) |
| AI | **Groq SDK** — `llama-3.3-70b-versatile` |
| PDF text extraction | **pdf-parse** |
| PDF rendering | **Puppeteer** (headless Chromium) |
| File upload | **Multer** (in-memory storage) |
| Resume template | **React 19** server-rendered (`renderToString`) |

<br>

## 🚀 Getting Started

### 1 · Prerequisites

- **Node.js** `≥ 20`
- A **Groq API key** → [console.groq.com](https://console.groq.com/keys)
- **Chromium** for Puppeteer (bundled, or system Chrome as fallback)

### 2 · Install

```bash
git clone <repo-url>
cd pebblesBackend
npm install
```

### 3 · Configure environment

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Your Groq API key ([get one here](https://console.groq.com/keys)) |
| `PORT` | Server port (default `8000`) |

> ⚠️ **Never commit `.env`** — it's gitignored.

### 4 · Run

```bash
npm run dev     # dev mode with nodemon auto-reload
npm start       # production mode
```

Server starts on `http://localhost:8000`.

<br>

## 📡 API Reference

### `GET /`
Health check — returns `{ message: "200!" }`.

### `POST /optimise`
Optimizes a resume PDF for a target job role.

| Part | Type | Required | Description |
|---|---|---|---|
| `resumePdf` | file (PDF) | ✅ | The resume to optimize |
| `jobRole` | string | ❌ | Target role (empty = simple general optimization) |

**Response:** `application/pdf` — the optimized resume, with `Content-Disposition: attachment`.

**Example:**
```bash
curl -X POST http://localhost:8000/optimise \
  -F "resumePdf=@my_resume.pdf" \
  -F "jobRole=Frontend Developer" \
  --output optimized_resume.pdf
```

<br>

## 📂 Project Structure

```
pebblesBackend/
├── server.tsx        # Express app — routes, Groq call, PDF orchestration
├── prompt.ts         # ATS-optimization prompt template
├── ResumePDF.tsx     # React resume template (SSR-rendered)
├── generatePDF.tsx   # Puppeteer HTML → PDF
├── test.json         # fallback sample data (when GROQ returns empty)
├── tsconfig.json
└── package.json
```

<br>

## 🧠 The Optimization Prompt

The prompt (`prompt.ts`) instructs the model to:
- Rewrite bullets using **action verbs** & **STAR method**
- Preserve all **quantifiable metrics** from the original
- Match **skills & keywords** to the target role
- Output strict **JSON** (name, summary, skills, experience, projects, education, ATS keywords, gap analysis)

<br>

<div align="center">

Made with ❤️ by **Asrar**

</div>
