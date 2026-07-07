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

## Environment Configuration

### Backend Configuration Details

#### Database
```env
# MongoDB connection string
# Local: mongodb://localhost:27017/algonotes
# Atlas: mongodb+srv://user:password@cluster.mongodb.net/algonotes?retryWrites=true
DATABASE_URL=mongodb://localhost:27017/algonotes
```

#### Authentication
```env
# Strong secret key for JWT signing (generate: python -c "import secrets; print(secrets.token_urlsafe(32))")
SECRET_KEY=your_super_secret_key_change_this

# JWT algorithm
ALGORITHM=HS256

# Token expiration time
JWT_EXPIRATION=7d
```

#### Google Gemini API
```env
# Get from https://ai.google.dev/
GEMINI_API_KEY=AIzaSyD...

# Optional: Model name
GEMINI_MODEL=gemini-pro
```

#### Cloudinary
```env
# Get from https://cloudinary.com/
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=1234567890
CLOUDINARY_API_SECRET=abcdefg123456

# Optional: Upload preset
CLOUDINARY_UPLOAD_PRESET=your_preset
```

#### AWS SQS (Production)
```env
# AWS region where SQS queue is created
AWS_REGION=us-east-1

# AWS credentials (create in IAM console)
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...

# SQS queue URL
AWS_SQS_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/123456789/algonotes
```

#### Email Configuration (Optional)
```env
# For Gmail: generate app-specific password
# See: https://support.google.com/accounts/answer/185833
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your_app_specific_password

# Sender email address
MAIL_FROM=noreply@algonotes.in

# SMTP settings (Gmail example)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
```

#### CORS Configuration
```env
# Comma-separated list of allowed origins
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5000,https://algonotes.in
```

### Frontend Configuration Details

```env
# Backend API URL
REACT_APP_BACKEND_URL=http://localhost:8000

# Interview Prep Backend URL
REACT_APP_INTERVIEW_PREP_URL=http://localhost:5000

# Environment
REACT_APP_ENVIRONMENT=development

# Optional: Analytics/Monitoring
REACT_APP_SENTRY_DSN=your_sentry_dsn
```

### Interview Prep Backend Configuration Details

```env
# Server port
PORT=5000
NODE_ENV=development

# MongoDB connection
DATABASE_URL=mongodb://localhost:27017/interview-prep

# Redis connection for job queue
REDIS_URL=redis://localhost:6379

# JWT secret
JWT_SECRET=your_jwt_secret

# Gemini API
GEMINI_API_KEY=your_gemini_key

# Email configuration
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_password
```

---

## Database Setup

### MongoDB Local Setup

#### macOS
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Verify
mongo --version
```

#### Windows
1. Download from: https://www.mongodb.com/try/download/community
2. Run installer
3. Select "Install MongoDB as a Service"
4. Start service: `net start MongoDB`

#### Linux (Ubuntu)
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### Create Databases
```bash
# Connect to MongoDB
mongo

# Or using mongosh
mongosh

# Create databases
use algonotes
use interview-prep

# Create initial collections
db.users.insertOne({ initialized: true })
db.notes.insertOne({ initialized: true })
db.theories.insertOne({ initialized: true })
```

### MongoDB Atlas (Cloud Setup)

1. Visit: https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create cluster
4. Get connection string
5. Add IP address to whitelist
6. Use connection string in `DATABASE_URL`

---

## Redis Setup

### macOS
```bash
brew install redis
brew services start redis
redis-cli ping  # Should return PONG
```

### Windows
1. Download from: https://github.com/microsoftarchive/redis/releases
2. Extract and run `redis-server.exe`

### Linux (Ubuntu)
```bash
sudo apt-get install redis-server
sudo systemctl start redis-server
redis-cli ping  # Should return PONG
```

---

## Running Services

### All Services Running Checklist

#### Terminal 1: Backend
```bash
cd backend
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
python main.py
# Should show: "Uvicorn running on http://0.0.0.0:8000"
```

#### Terminal 2: Frontend
```bash
cd frontend
npm start
# Should show: "Compiled successfully!" and open browser
```

#### Terminal 3: Interview Prep Backend
```bash
cd interview-prep-backend
npm run dev
# Should show: "Server running on port 5000"
```

### Service Status Verification

```bash
# Backend health check
curl http://localhost:8000/health

# Backend API docs
open http://localhost:8000/docs

# Frontend
open http://localhost:3000

# Interview prep
curl http://localhost:5000/health
```

---

## Verification Checklist

- [ ] Clone repository successfully
- [ ] Created all .env files with valid keys
- [ ] MongoDB is running locally or Atlas connected
- [ ] Redis is running locally
- [ ] Backend service started (port 8000)
- [ ] Frontend service started (port 3000)
- [ ] Interview Prep Backend started (port 5000)
- [ ] Can access http://localhost:3000
- [ ] Can access http://localhost:8000/docs
- [ ] No errors in browser console
- [ ] Can register a new account
- [ ] Can generate a note (if AI keys configured)

---

## Troubleshooting

### Common Issues

#### MongoDB Connection Error
```
Error: MongoServerError: connect ECONNREFUSED 127.0.0.1:27017

Solution:
# Check if MongoDB is running
# macOS/Linux: brew services list
# Windows: Check Services (services.msc)
# Start MongoDB: brew services start mongodb-community
```

#### Port Already in Use
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

#### Python Virtual Environment Not Activating
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

#### API Keys Not Working
```
Solution:
1. Verify keys are correct (no extra spaces)
2. Check keys haven't been revoked
3. Ensure .env file is in correct directory
4. Try restarting the service
5. Check API quota/usage limits

For Gmail App Password:
- Enable 2-factor authentication on Gmail
- Generate app-specific password
- Use 16-character password without spaces
```

#### CORS Errors in Browser
```
Error: Access to XMLHttpRequest has been blocked by CORS policy

Solution:
1. Ensure REACT_APP_BACKEND_URL is correct in frontend/.env
2. Check ALLOWED_ORIGINS in backend/.env includes http://localhost:3000
3. Restart backend service
4. Clear browser cache and cookies
```

#### Gemini API Errors
```
Error: 429 Resource has been exhausted

Solution:
1. Free tier has rate limits
2. Upgrade to paid plan for higher limits
3. Implement request queuing
4. Add caching for responses

Error: Invalid API key

Solution:
1. Verify key from https://ai.google.dev/
2. Ensure key is correct in .env
3. Check key hasn't expired
4. Try generating new key
```

#### Docker Compose Issues
```
# See service logs
docker-compose logs service_name

# Rebuild containers
docker-compose build --no-cache

# Remove and recreate volumes
docker-compose down -v
docker-compose up -d

# Check service status
docker-compose ps
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
