# ALGONOTES Setup Guide

Complete step-by-step guide to set up ALGONOTES for local development or production.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start (Docker)](#quick-start-docker)
3. [Local Development Setup](#local-development-setup)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [Running Services](#running-services)
7. [Verification Checklist](#verification-checklist)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements
- **OS**: Windows, macOS, or Linux
- **Disk Space**: 2GB+ free space
- **RAM**: 4GB minimum (8GB recommended)
- **Internet**: Stable connection for API calls

### Required Software

#### Option A: Docker Setup (Recommended)
- **Docker Desktop**: [Download](https://www.docker.com/products/docker-desktop)
- **Docker Compose**: Usually included with Docker Desktop

Check installation:
```bash
docker --version
docker-compose --version
```

#### Option B: Local Development Setup
- **Node.js 20+**: [Download](https://nodejs.org/)
- **Python 3.8+**: [Download](https://www.python.org/)
- **Git**: [Download](https://git-scm.com/)
- **MongoDB** (optional): [Download](https://www.mongodb.com/try/download/community)
- **Redis** (optional): [Download](https://redis.io/download)

Check installations:
```bash
node --version
npm --version
python --version
git --version
```

### External Services (Required)
Before starting, sign up for these free services:

1. **Google Gemini API**
   - Visit: https://ai.google.dev/
   - Create API key for free tier
   - Keep API key secure

2. **Cloudinary** (Image Hosting)
   - Visit: https://cloudinary.com/
   - Sign up for free account
   - Get Cloud Name, API Key, and API Secret

3. **AWS SQS** (Optional, for production)
   - Visit: https://aws.amazon.com/sqs/
   - Create SQS queue
   - Get AWS credentials

4. **LeetCode API** (Optional)
   - Sign up at: https://www.leetcode.com/
   - Get CSRF token from browser cookies

---

## Quick Start (Docker)

### 1. Clone Repository
```bash
git clone https://github.com/shahadat-gith/ALGONOTES.git
cd ALGONOTES
```

### 2. Create Environment Files

#### Backend (.env)
```bash
cat > backend/.env << EOF
# Server Configuration
PORT=8000
DEBUG=False

# Database Configuration
DATABASE_URL=mongodb://mongo:27017/algonotes

# Authentication & Security
SECRET_KEY=your_super_secret_key_here_change_in_production
ALGORITHM=HS256
JWT_EXPIRATION=7d

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# AWS SQS (Optional)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_SQS_QUEUE_URL=your_sqs_queue_url

# Email Configuration (Optional)
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_FROM=noreply@algonotes.in

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5000
EOF
```

#### Frontend (.env)
```bash
cat > frontend/.env << EOF
REACT_APP_BACKEND_URL=http://localhost:8000
REACT_APP_INTERVIEW_PREP_URL=http://localhost:5000
REACT_APP_ENVIRONMENT=development
EOF
```

#### Interview Prep Backend (.env)
```bash
cat > interview-prep-backend/.env << EOF
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=mongodb://mongo:27017/interview-prep

# Authentication
JWT_SECRET=your_jwt_secret_change_in_production

# Cache
REDIS_URL=redis://redis:6379

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Email
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
EOF
```

### 3. Start Services with Docker Compose
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# To stop services
docker-compose down

# To remove volumes (WARNING: deletes data)
docker-compose down -v
```

### 4. Access Services
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/docs
- **Interview Prep API**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017

### 5. Verify Installation
```bash
# Check all services are running
docker-compose ps

# Test backend API
curl http://localhost:8000/health

# Test frontend
curl http://localhost:3000
```

---

## Local Development Setup

### Backend Setup (Python/FastAPI)

#### 1. Navigate to Backend Directory
```bash
cd backend
```

#### 2. Create Python Virtual Environment
```bash
# On macOS/Linux
python3 -m venv venv
source venv/bin/activate

# On Windows
python -m venv venv
.\venv\Scripts\activate
```

#### 3. Install Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt

# For development
pip install pytest black flake8 mypy
```

#### 4. Create .env File
```bash
# Copy template
cp .env.example .env

# Edit with your values
# See "Environment Configuration" section below
```

#### 5. Initialize Database
```bash
# If using migrations
# alembic upgrade head

# Or manually create indexes
python -c "from app.database import db; db.create_indexes()"
```

#### 6. Run Backend Server
```bash
# Development with auto-reload
python main.py

# Or use Uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Backend will be available at**: http://localhost:8000/docs

#### 7. Verify Backend
```bash
# In another terminal
curl http://localhost:8000/health

# Check API docs
curl http://localhost:8000/openapi.json
```

---

### Frontend Setup (React)

#### 1. Navigate to Frontend Directory
```bash
cd frontend
```

#### 2. Install Node Dependencies
```bash
npm install
# or
yarn install
```

#### 3. Create .env File
```bash
# Copy template
cp .env.example .env

# Your .env should have:
# REACT_APP_BACKEND_URL=http://localhost:8000
# REACT_APP_INTERVIEW_PREP_URL=http://localhost:5000
```

#### 4. Start Development Server
```bash
npm start
# or
yarn start
```

**Frontend will be available at**: http://localhost:3000

#### 5. Verify Frontend
```bash
# Check that the app loads without errors
# Open http://localhost:3000 in browser
# Check browser console for errors
```

---

### Interview Prep Backend Setup (Node.js/Express)

#### 1. Navigate to Interview Prep Backend Directory
```bash
cd interview-prep-backend
```

#### 2. Install Node Dependencies
```bash
npm install
```

#### 3. Create .env File
```bash
# Copy template
cp .env.example .env

# See "Environment Configuration" section below
```

#### 4. Start Server
```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

**Interview Prep Backend will be available at**: http://localhost:5000

---

## Troubleshooting

### MongoDB Connection Error
```
Error: MongoServerError: connect ECONNREFUSED 127.0.0.1:27017

Solution:
# Check if MongoDB is running
# macOS/Linux: brew services list
# Windows: Check Services (services.msc)
# Start MongoDB: brew services start mongodb-community
```

### Port Already in Use
```
Error: Address already in use :::8000

Solution:
# Find process using port
lsof -i :8000  # On macOS/Linux
netstat -ano | findstr :8000  # On Windows

# Kill process
kill -9 <PID>  # On macOS/Linux
taskkill /PID <PID> /F  # On Windows

# Or use different port
python main.py --port 8001
```

### Virtual Environment Issues
```
Solution:
# Make sure you're in the backend directory
cd backend

# Try explicit path
source ./venv/bin/activate  # macOS/Linux
.\venv\Scripts\activate.bat  # Windows CMD
.\venv\Scripts\Activate.ps1  # Windows PowerShell

# If still issues, recreate venv
rm -rf venv  # or rmdir venv /s on Windows
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### CORS Errors
```
Error: Access to XMLHttpRequest has been blocked by CORS policy

Solution:
1. Ensure REACT_APP_BACKEND_URL is correct in frontend/.env
2. Check ALLOWED_ORIGINS in backend/.env includes http://localhost:3000
3. Restart backend service
4. Clear browser cache and cookies
```

---

## Next Steps

1. **Read the [Architecture](./ARCHITECTURE.md) guide** to understand system design
2. **Check [API Documentation](./API.md)** for available endpoints
3. **Review [Contributing Guide](../CONTRIBUTING.md)** before making changes
4. **Start with a simple feature** to familiarize yourself
5. **Join the community** and share feedback

---

## Getting Help

- 📖 Check [Architecture Guide](./ARCHITECTURE.md)
- 🔧 See [Troubleshooting](#troubleshooting) section
- 💬 Open a GitHub Issue
- 📧 Contact: support@algonotes.in

**Happy coding! 🚀**