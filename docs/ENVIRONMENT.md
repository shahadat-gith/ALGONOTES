# Environment Configuration Guide

Complete guide to configuring environment variables for all ALGONOTES services.

## Table of Contents
1. [Backend Configuration](#backend-configuration)
2. [Interview Prep Backend Configuration](#interview-prep-backend-configuration)
3. [Frontend Configuration](#frontend-configuration)
4. [External Services Setup](#external-services-setup)
5. [Development vs Production](#development-vs-production)

---

## Backend Configuration

**File**: `backend/.env`

### Required Variables

#### Server Configuration
```env
# Port the backend server runs on
PORT=5000

# Environment: development, staging, production
ENVIRONMENT=development
```

#### Authentication & Security
```env
# JWT secret key for signing tokens
# Generate strong key: python -c "import secrets; print(secrets.token_urlsafe(32))"
JWT_SECRET=your_super_secret_jwt_key_change_in_production
```

#### Database
```env
# MongoDB connection string
# Local: mongodb://localhost:27017/algonotes
# Atlas: mongodb+srv://user:password@cluster.mongodb.net/algonotes
DATABASE_URL=mongodb://localhost:27017/algonotes
```

#### AWS SQS (Message Queue)
```env
# SQS Queue URL for async job processing
SQS_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/123456789/algonotes-queue

# AWS Region where SQS queue is located
AWS_REGION=us-east-1
```

#### Cloudinary (Image Hosting)
```env
# Cloudinary cloud name from dashboard
CLOUDINARY_CLOUD_NAME=your_cloud_name

# Cloudinary API credentials
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Email Configuration (Gmail)
```env
# Gmail email address
MAIL_USERNAME=your-email@gmail.com

# Gmail App-Specific Password (NOT your regular password)
# Generate at: https://support.google.com/accounts/answer/185833
MAIL_PASSWORD=your_app_specific_password
```

#### AI Service (OpenRouter)
```env
# OpenRouter API key for AI model access
# Get from: https://openrouter.ai/
OPENROUTER_API_KEY=your_openrouter_api_key

# Model to use for AI tasks
# Examples: openai/gpt-4o, anthropic/claude-3-opus
OPENROUTER_MODEL=openai/gpt-4o
```

#### Admin Configuration
```env
# Admin email for system access
ADMIN_EMAIL=admin@algonotes.in

# Admin password
ADMIN_PASS=your_admin_password
```

### Example Backend .env
```env
PORT=5000
ENVIRONMENT=development
JWT_SECRET=sk_test_abc123def456xyz789
DATABASE_URL=mongodb://localhost:27017/algonotes
SQS_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/123456789/algonotes-queue
AWS_REGION=us-east-1
CLOUDINARY_CLOUD_NAME=demo
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=abc123def456
MAIL_USERNAME=noreply@algonotes.in
MAIL_PASSWORD=xyza bcde fghi jklm
OPENROUTER_API_KEY=sk-or-v1-abc123xyz
OPENROUTER_MODEL=openai/gpt-4o
ADMIN_EMAIL=admin@algonotes.in
ADMIN_PASS=secure_admin_password
```

---

## Interview Prep Backend Configuration

**File**: `interview-prep-backend/.env`

### Required Variables

#### Server Configuration
```env
# Port the interview prep backend runs on
PORT=5001

# Environment identifier
ENVIRONMENT=development

# Node.js environment
NODE_ENV=development
```

#### Authentication & Security
```env
# JWT secret key for signing tokens
JWT_SECRET=your_super_secret_jwt_key_change_in_production
```

#### Database
```env
# MongoDB connection string for interview prep data
DATABASE_URL=mongodb://localhost:27017/interview-prep
```

#### AWS SQS
```env
# SQS Queue URL for interview prep async jobs
SQS_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/123456789/interview-prep-queue
```

#### Hugging Face (Optional - for embeddings)
```env
# Hugging Face API token
# Get from: https://huggingface.co/settings/tokens
HF_TOKEN=hf_your_token_here

# Model name to use
HF_MODEL=sentence-transformers/all-MiniLM-L6-v2
```

#### OpenRouter (AI Service)
```env
# OpenRouter API key
OPENROUTER_API_KEY=sk-or-v1-abc123xyz

# AI model for interview topic generation
OPENROUTER_MODEL=openai/gpt-4o
```

#### Cloudinary
```env
# Cloudinary credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Qdrant (Vector Database - Optional)
```env
# Qdrant API key for vector similarity search
QDRANT_API_KEY=your_qdrant_api_key

# Qdrant server URL
# Local: http://localhost:6333
# Cloud: https://your-cloud-url.qdrant.io
QDRANT_URL=http://localhost:6333
```

#### Frontend URL
```env
# Frontend URL for CORS and redirects
FRONTEND_URL=http://localhost:3000
```

### Example Interview Prep .env
```env
PORT=5001
ENVIRONMENT=development
NODE_ENV=development
JWT_SECRET=sk_test_interview_abc123def456
DATABASE_URL=mongodb://localhost:27017/interview-prep
SQS_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/123456789/interview-queue
HF_TOKEN=hf_abc123xyz
HF_MODEL=sentence-transformers/all-MiniLM-L6-v2
OPENROUTER_API_KEY=sk-or-v1-interview123
OPENROUTER_MODEL=openai/gpt-4o
CLOUDINARY_CLOUD_NAME=demo
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=abc123def456
QDRANT_API_KEY=qdrant_key_123
QDRANT_URL=http://localhost:6333
FRONTEND_URL=http://localhost:3000
```

---

## Frontend Configuration

**File**: `frontend/.env` (Vite configuration)

### Required Variables

#### Backend API URLs
```env
# Main backend API base URL (with /api/v1 path)
VITE_BACKEND_URL=http://localhost:5000/api/v1

# Interview prep backend URL
VITE_INTERVIEW_PREP_URL=http://localhost:5001
```

#### Environment
```env
# Environment identifier
VITE_ENVIRONMENT=development
```

### Example Frontend .env
```env
VITE_BACKEND_URL=http://localhost:5000/api/v1
VITE_INTERVIEW_PREP_URL=http://localhost:5001
VITE_ENVIRONMENT=development
```

### Frontend Environment Access
In your React/Vite components, access variables using:
```javascript
// Using import.meta.env
console.log(import.meta.env.VITE_BACKEND_URL);
console.log(import.meta.env.VITE_INTERVIEW_PREP_URL);
```

---

## External Services Setup

### 1. MongoDB

#### Local Setup
```bash
# macOS with Homebrew
brew install mongodb-community
brew services start mongodb-community

# Linux (Ubuntu)
sudo apt-get install mongodb
sudo systemctl start mongodb

# Windows
# Download installer: https://www.mongodb.com/try/download/community
# Run installer and follow prompts
```

#### MongoDB Atlas (Cloud)
1. Visit: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Add IP address to whitelist
5. Get connection string
6. Update `DATABASE_URL` in .env

### 2. Redis

#### Local Setup
```bash
# macOS with Homebrew
brew install redis
brew services start redis

# Linux (Ubuntu)
sudo apt-get install redis-server
sudo systemctl start redis-server

# Windows
# Download: https://github.com/microsoftarchive/redis/releases
# Or use WSL2
```

### 3. AWS SQS

1. Visit: https://aws.amazon.com/sqs/
2. Create AWS account
3. Create SQS queue
4. Create IAM user with SQS permissions
5. Get queue URL and credentials
6. Update `SQS_QUEUE_URL` and `AWS_REGION` in .env

### 4. Cloudinary

1. Visit: https://cloudinary.com/
2. Sign up for free account
3. Go to Settings → API Keys
4. Copy credentials
5. Update Cloudinary variables in .env

### 5. OpenRouter (AI Service)

1. Visit: https://openrouter.ai/
2. Create account
3. Generate API key
4. Choose model (e.g., `openai/gpt-4o`)
5. Update `OPENROUTER_API_KEY` and `OPENROUTER_MODEL` in .env

### 6. Gmail App-Specific Password

1. Enable 2-Factor Authentication on Gmail
2. Go to: https://support.google.com/accounts/answer/185833
3. Generate app-specific password
4. Use 16-character password (without spaces) as `MAIL_PASSWORD`

### 7. Qdrant (Vector Database - Optional)

#### Local Docker Setup
```bash
docker run -p 6333:6333 qdrant/qdrant:latest
```

#### Cloud Setup
1. Visit: https://qdrant.tech/
2. Create account
3. Create cluster
4. Get API key and URL
5. Update `QDRANT_API_KEY` and `QDRANT_URL` in .env

### 8. Hugging Face (Optional)

1. Visit: https://huggingface.co/
2. Create account
3. Go to Settings → API Tokens
4. Create new token (read access)
5. Update `HF_TOKEN` in .env

---

## Development vs Production

### Development Configuration

**Backend (.env)**
```env
PORT=5000
ENVIRONMENT=development
# Use local MongoDB
DATABASE_URL=mongodb://localhost:27017/algonotes
# Use local or free tier services
```

**Interview Prep Backend (.env)**
```env
PORT=5001
ENVIRONMENT=development
NODE_ENV=development
# Use local MongoDB
DATABASE_URL=mongodb://localhost:27017/interview-prep
```

**Frontend (.env)**
```env
VITE_BACKEND_URL=http://localhost:5000/api/v1
VITE_INTERVIEW_PREP_URL=http://localhost:5001
VITE_ENVIRONMENT=development
```

### Production Configuration

**Backend (.env)**
```env
PORT=5000
ENVIRONMENT=production
# Use production MongoDB Atlas
DATABASE_URL=mongodb+srv://prod_user:prod_pass@prod-cluster.mongodb.net/algonotes
# Use production services
JWT_SECRET=<strong-production-secret>
```

**Interview Prep Backend (.env)**
```env
PORT=5001
ENVIRONMENT=production
NODE_ENV=production
# Use production MongoDB Atlas
DATABASE_URL=mongodb+srv://prod_user:prod_pass@prod-cluster.mongodb.net/interview-prep
```

**Frontend (.env)**
```env
VITE_BACKEND_URL=https://api.algonotes.in/api/v1
VITE_INTERVIEW_PREP_URL=https://interview-api.algonotes.in
VITE_ENVIRONMENT=production
```

---

## Security Best Practices

### 1. Secret Key Generation
```bash
# Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Never Commit .env
```bash
# Already in .gitignore
.env
.env.local
.env.*.local
```

### 3. Use .env.example
Always commit `.env.example` with dummy values for reference.

### 4. Environment Variable Naming
- UPPERCASE with UNDERSCORES
- Prefix with service name if needed: `CLOUDINARY_API_KEY`
- No spaces in values

### 5. Secure Secrets Management
- Use strong, random values
- Rotate keys regularly in production
- Never share credentials
- Use separate credentials per environment

### 6. Production Deployment
- Use CI/CD environment variables
- Never copy .env to production server directly
- Use secrets management tools (HashiCorp Vault, AWS Secrets Manager, etc.)
- Encrypt sensitive data at rest

---

## Troubleshooting

### "Invalid API Key"
- Verify key is correct (no extra spaces)
- Check key hasn't expired
- Ensure using correct environment (dev vs prod)
- Try regenerating key from service dashboard

### "Connection Refused"
- Check if service is running (MongoDB, Redis)
- Verify correct host and port
- Check firewall rules
- Verify DATABASE_URL format

### "CORS Errors"
- Ensure FRONTEND_URL matches frontend URL
- Check backend allows origin
- Restart backend service after env changes

### "Authentication Failed"
- Verify JWT_SECRET is same across services
- Check token hasn't expired
- Ensure using Bearer token format

---

## Quick Setup Script

```bash
#!/bin/bash

# Create .env files from examples
cp backend/.env.example backend/.env
cp interview-prep-backend/.env.example interview-prep-backend/.env
cp frontend/.env.example frontend/.env

echo "Environment files created!"
echo "Now edit the .env files with your actual values:"
echo "  - backend/.env"
echo "  - interview-prep-backend/.env"
echo "  - frontend/.env"
```

---

## Environment Variables Reference Table

| Variable | Backend | Interview | Frontend | Required | Purpose |
|----------|---------|-----------|----------|----------|---------|
| PORT | ✓ | ✓ | - | Yes | Server port |
| ENVIRONMENT | ✓ | ✓ | - | Yes | Env identifier |
| JWT_SECRET | ✓ | ✓ | - | Yes | Token signing |
| DATABASE_URL | ✓ | ✓ | - | Yes | DB connection |
| SQS_QUEUE_URL | ✓ | ✓ | - | No | Message queue |
| CLOUDINARY_* | ✓ | ✓ | - | No | Image hosting |
| OPENROUTER_* | ✓ | ✓ | - | Yes | AI service |
| MAIL_* | ✓ | - | - | No | Email service |
| HF_* | - | ✓ | - | No | Embeddings |
| QDRANT_* | - | ✓ | - | No | Vector DB |
| VITE_* | - | - | ✓ | Yes | API URLs |

---

**Last Updated**: January 2024
**Config Version**: v1.0.0
