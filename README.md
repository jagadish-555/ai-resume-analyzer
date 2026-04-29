# AI Interview Preparation Platform

An AI-powered full-stack web application that analyses your resume and job description to generate personalised interview reports — including a match score, technical & behavioural questions with model answers, skill gap analysis, and a day-wise preparation plan.

---

## Features

- **Resume Upload** — Upload your resume as a PDF or paste a self-description
- **Job Description Input** — Paste the job description you're targeting
- **Match Score** — See how well your resume matches the role (0–100)
- **Technical Questions** — 10–15 role-specific technical interview questions with answers and the intention behind each question
- **Behavioural Questions** — 10–15 behavioural questions with STAR-method guidance
- **Skill Gap Analysis** — Identifies missing skills with severity levels (low / medium / high)
- **Day-wise Preparation Plan** — A personalised study plan with daily focus areas and tasks
- **Report History** — View all previously generated interview reports
- **Authentication** — Secure register/login with JWT and HTTP-only cookies

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database and ODM |
| JSON Web Tokens (JWT) | Authentication |
| bcryptjs | Password hashing |
| Groq SDK | LLM inference (LLaMA 3.1, LLaMA 3.3, GPT-OSS) |
| pdf-parse | PDF text extraction |
| Zod + zod-to-json-schema | AI response schema validation and JSON Schema generation |
| Multer | File upload handling |
| cookie-parser | HTTP-only cookie management |

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework and build tool |
| React Router v7 | Client-side routing |
| Axios | HTTP client |
| SCSS Modules | Component-scoped styling |

---


## API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Register a new user |
| POST | `/login` | No | Login and receive auth cookie |
| GET | `/logout` | No | Logout and invalidate token |
| GET | `/session` | No | Check current session status |
| GET | `/get-me` | Yes | Get authenticated user details |

### Interview — `/api/interview`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | Yes | Generate a new interview report |
| GET | `/` | Yes | Get all reports for current user |
| GET | `/report/:interviewId` | Yes | Get a specific report by ID |

---

## AI Service — Resilience Design

The AI service is built with production-grade resilience:

- **Multi-model fallback chain** — Tries models in order: `gpt-oss-120b → llama-3.1-8b-instant → llama-3.3-70b-versatile → gpt-oss-20b`
- **Per-model retries** — Configurable retry count per model (default: 1)
- **Transient error detection** — Retries on `408`, `429`, `5xx` HTTP errors and network errors (`ETIMEDOUT`, `ECONNRESET`, etc.)
- **Structured output enforcement** — Uses `response_format: json_schema` where supported, falls back to `json_object`
- **Zod validation** — All AI responses are validated against a strict Zod schema before being saved

---

## Environment Variables

### Backend — `Backend/.env`

```env
# MongoDB connection string
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>

# JWT secret (random 64-char hex string recommended)
JWT_SECRET=your_jwt_secret_here

# Groq API key
GROQ_API_KEY=your_groq_api_key

# Allowed CORS origins (comma-separated)
CORS_ORIGIN=http://localhost:5173

# Environment (development | production)
NODE_ENV=development

# Optional: override cookie security
# COOKIE_SECURE=false

# Server port (default: 3000)
PORT=3000

# Optional: override LLM fallback model list (comma-separated)
# GROQ_FALLBACK_MODELS=llama-3.1-8b-instant,llama-3.3-70b-versatile

# Optional: retries per model (0-3, default: 1)
# GROQ_RETRY_PER_MODEL=1
```

### Frontend — `Frontend/.env`

```env
VITE_API_URL=http://localhost:3000
```

---

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (or local MongoDB instance)
- [Groq API key](https://console.groq.com/)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ai-resume-analyzer.git
cd ai-resume-analyzer
```

### 2. Setup the Backend

```bash
cd Backend
cp .env.example .env
# Fill in your environment variables in .env
npm install
npm run dev
```

Backend runs on `http://localhost:3000`

### 3. Setup the Frontend

```bash
cd Frontend
# Create a .env file
echo "VITE_API_URL=http://localhost:3000" > .env
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## Deployment

| Service | Platform |
|---|---|
| Backend (Node.js) | [Render](https://render.com) |
| Frontend (React + Vite) | [Vercel](https://vercel.com) |
| Database (MongoDB) | [MongoDB Atlas](https://www.mongodb.com/atlas) |



## License

This project is licensed under the [Apache 2.0 License](./LICENSE).
