# 📚 ALGONOTES

**AI-powered interview preparation platform** that analyzes resumes and job descriptions, generates personalized interview topics, and provides AI-driven coaching through interactive chat discussions.

---

## ✨ Features

- 🎯 **Resume & JD Analysis** — Intelligent parsing and matching against job descriptions
- 🤖 **AI-Powered Interview Topics** — Personalized preparation topics based on your profile
- 💬 **Interactive Chat Coaching** — Real-time interview practice with AI
- 📊 **Interview Preparation Guides** — Rich, structured learning materials with code, diagrams, and tips
- 🔄 **Asynchronous Job Processing** — AWS SQS-backed background workers for scalable operations
- 🏗️ **Multi-Service Architecture** — Modular design with separate backends
- 📱 **Responsive Frontend** — Modern React-based UI
- 🗄️ **MongoDB Database** — Flexible document storage

---

## 🏗️ Architecture

ALGONOTES is composed of three main services:

| Service | Stack | Port |
|---|---|---|
| Frontend | React + Vite + Tailwind | `3000` |
| Backend API | Python / FastAPI | `8000` |
| Interview Prep API | Node.js / Express | `5000` |

All services share a MongoDB database, and background workers (driven by AWS SQS) handle long-running jobs like resume analysis and explanation generation.

See [`DOCUMENTATION.md`](./DOCUMENTATION.md) for the full architecture breakdown, database schema, and API reference.

---

## 💻 Tech Stack

- **Frontend:** React 18+, Vite, Tailwind CSS, Axios, React Router
- **Backend (Python):** FastAPI, Pydantic, Google Gemini, Cloudinary
- **Backend (Node.js):** Express, Mongoose, OpenRouter SDK, Multer, pdfjs-dist
- **Database:** MongoDB
- **Infrastructure:** AWS SQS, AWS Lambda, Docker & Docker Compose

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Python 3.8+
- MongoDB (local or Atlas)
- Docker & Docker Compose (optional but recommended)
- Git

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/shahadat-gith/ALGONOTES.git
cd ALGONOTES

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp interview-prep-backend/.env.example interview-prep-backend/.env

# Edit each .env file with your database URLs, API keys, etc.

# Start all services
docker-compose up -d
```

Once running:
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000](http://localhost:8000)
- Interview Prep API: [http://localhost:5000](http://localhost:5000)

### Option 2: Local Development

**Python backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env       # edit as needed
python main.py
```

**Node.js interview prep backend**
```bash
cd interview-prep-backend
npm install
cp .env.example .env       # edit as needed
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
cp .env.example .env       # edit as needed
npm run dev
```

---

## 📁 Repository Structure

```
ALGONOTES/
├── frontend/                 # React frontend application
├── backend/                  # Python/FastAPI backend
├── interview-prep-backend/   # Node.js/Express backend
├── docker-compose.yml        # Multi-service orchestration
├── docs/
│   └── ARCHITECTURE.md
├── DOCUMENTATION.md           # Full technical documentation
└── README.md                  # You are here
```

---

## 📡 API Overview

The Interview Prep API (Node.js) exposes endpoints for:
- **Applications** — submit, list, check status, view details, delete
- **Topics** — fetch topics, generate/check explanations
- **Chat** — retrieve chat history, send messages to the AI coach

Full request/response examples are documented in [`DOCUMENTATION.md`](./DOCUMENTATION.md#-api-documentation).

---

## 🧪 Testing

```bash
# Backend
cd interview-prep-backend
npm test

# Frontend
cd frontend
npm test
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Follow the code style (ESLint + Prettier for JS, Black + isort for Python)
4. Write tests for new features
5. Update documentation
6. Open a pull request

Commit messages follow the convention:
```
type(scope): description

feat(chat): add message persistence
fix(auth): resolve JWT token expiration issue
docs(api): update endpoint documentation
```

---

## 📚 More Documentation

- [`DOCUMENTATION.md`](./DOCUMENTATION.md) — full architecture, database schema, API reference, deployment guide
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — detailed technical architecture

---

## 📞 Support

For issues, questions, or suggestions, please check existing issues or open a new one with a detailed description.
