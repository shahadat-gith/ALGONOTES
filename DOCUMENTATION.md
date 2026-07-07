Make these code changes?
DOCUMENTATION.md

md
# 📚 ALGONOTES - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Repository Structure](#repository-structure)
5. [Setup Guide](#setup-guide)
6. [API Documentation](#api-documentation)
7. [Database Schema](#database-schema)
8. [Development Guide](#development-guide)
9. [Deployment](#deployment)
10. [Contributing](#contributing)

---

## 📖 Project Overview

**ALGONOTES** is a comprehensive **AI-powered interview preparation platform** designed to help candidates excel in technical interviews. The platform analyzes resumes and job descriptions, generates personalized interview topics, and provides AI-driven coaching through interactive chat discussions.

### Key Features
- 🎯 **Resume & JD Analysis** - Intelligent parsing and matching
- 🤖 **AI-Powered Interview Topics** - Personalized preparation topics
- 💬 **Interactive Chat Coaching** - Real-time interview practice with AI
- 📊 **Interview Preparation Guides** - Rich, structured learning materials
- 🔄 **Asynchronous Job Processing** - AWS SQS integration for scalable operations
- 🏗️ **Multi-Service Architecture** - Modular design with separate backends
- 📱 **Responsive Frontend** - Modern React-based UI
- 🗄️ **MongoDB Database** - Flexible data storage

---

## 🏗️ Architecture

### System Overview

┌─────────────────────────────────────────────────────────────┐ │ Frontend (React) │ │ http://localhost:3000 │ └────────────┬────────────────────────────────┬────────────────┘ │ │ ┌────────▼────────┐ ┌──────────▼──────────┐ │ Backend API │ │ Interview Prep API │ │ (Python/FastAPI) │ (Node.js/Express) │ │ :8000 │ │ :5000 │ └────────┬────────┘ └──────────┬──────────┘ │ │ ┌────────▼────────────────────────────────▼────────┐ │ MongoDB Database │ │ (Shared Data Repository) │ └─────────────────────────────────────────────────┘ │ ┌────────▼──────────────┐ │ AWS SQS │ │ (Job Queue) │ └──────────────────────┘ │ ┌────────▼──────────────────────────┐ │ Background Workers │ │ - Application Processing │ │ - Topic Explanation Generation │ └────────────────────────────────────┘

Code

### 1. Frontend Architecture (React)

**Location**: `frontend/`

#### Components Structure
src/ ├── pages/ # Page components ├── components/ # Reusable UI components ├── context/ # React context for global state ├── constants/ # App-wide constants ├── utils/ # Utility functions ├── hooks/ # Custom React hooks ├── services/ # API client services ├── styles/ # CSS/Tailwind styles ├── App.jsx # Root component └── main.jsx # React entry point

Code

#### State Management
- **React Context API** - Global app state
- **Local Component State** - UI-specific state
- **API Caching** - Optimized data fetching

---

### 2. Main Backend Architecture (Python/FastAPI)

**Location**: `backend/`

#### Architecture Pattern: Layered Architecture

HTTP Request ↓ Route Handler ↓ Validation (Schema) ↓ Authentication (Middleware) ↓ Service Logic ↓ Database Query (Model) ↓ Response (Schema) ↓ HTTP Response

Code

#### Key Components

**Models** (`backend/app/models/`)
- **User** - User profiles and authentication
- **Note** - Algorithmic notes with solutions
- **Theory** - Theory study guides
- **Analytics** - Usage tracking
- **Temp** - Temporary processing jobs

**Routes** (`backend/app/routes/`)
auth.py - Authentication endpoints notes.py - Note CRUD operations theory.py - Theory management analytics.py - Analytics data prompt.py - Prompt optimization leetcode.py - LeetCode integration user.py - User profile management

Code

**Services** (`backend/app/services/`)
- **email.py** - Email sending
- **security.py** - Password hashing, JWT
- **analytics.py** - Analytics processing
- **cloudinary.py** - Image hosting

**Middlewares** (`backend/app/middlewares/`)
- **auth.py** - JWT validation
- **error.py** - Global error handling
- **metrics.py** - Performance tracking

**Configuration** (`backend/app/config/`)
- **settings.py** - App configuration
- **gemini.py** - Google Gemini AI setup
- **cloudinary.py** - Cloudinary setup
- **mailer.py** - Email configuration

**Async Workers** (`backend/app/sqs/`)
- **worker.py** - AWS SQS consumer
- **dispatcher.py** - Job dispatcher
- **handler.py** - Message handlers
- **router.py** - Route messages to handlers

#### API Response Format
```json
{
    "success": true,
    "data": {...},
    "message": "Operation successful",
    "timestamp": "2024-01-01T12:00:00Z"
}
3. Interview Prep Backend (Node.js/Express)
Location: interview-prep-backend/

Architecture: MVC with Job Queue & AWS SQS
Code
Routes (HTTP Endpoints)
    ↓
Controllers (Request handling)
    ↓
Services (Business logic)
    ↓
Models (Data access)
    ↓
Database (MongoDB)

    ⊕

AWS SQS Queue
    ↓
Background Workers
    ├── Application Worker
    ├── Topic Worker
    └── Explanation Worker
Core Modules
Application Flow
Code
1. User uploads Resume + Job Description
   ↓
2. Create Application record (status: processing)
   ↓
3. Queue application processing job via AWS SQS
   ↓
4. Background Worker receives job
   ├── Parse resume text
   ├── Parse job description
   ├── Send to LLM for analysis
   ├── Extract ATS score, skills, recommendations
   ├── Generate interview topics
   └── Update application status to completed
   ↓
5. Frontend polls or listens for completion
Topic Flow
Code
1. User opens a topic for discussion
   ↓
2. Check if explanation exists
   ├── Yes (completed) → Return explanation
   ├── Yes (processing) → Return 202 Accepted
   └── No/Failed → Queue explanation generation
   ↓
3. Background Worker
   ├── Generate structured explanation
   ├── Create code blocks, diagrams, tips
   └── Save to database
   ↓
4. User views prepared interview guide
Chat Flow
Code
1. User sends message in topic discussion
   ↓
2. Retrieve topic context & application details
   ↓
3. Load chat history
   ↓
4. Send to LLM with system prompt
   ↓
5. Save user message & assistant response
   ↓
6. Return response to frontend
Key Directories
Code
interview-prep-backend/src/
├── ai/                      # AI integration & LLM calls
├── application/             # Application management
│   ├── model.js            # Mongoose schema
│   ├── controller.js       # Route handlers
│   └── routes.js           # Express routes
├── topic/                   # Interview topic management
│   ├── topic.model.js
│   ├── explanation.model.js
│   ├── controller.js
│   └── routes.js
├── chat/                    # Chat functionality
│   ├── model.js
│   ├── controller.js
│   └── routes.js
├── jobs/                    # BullMQ job processors (legacy/alternative)
├── config/                  # Configuration files
│   ├── env.js             # Environment variables
│   ├── db.js              # MongoDB connection
│   └── ...
├── middlewares/             # Express middlewares
│   ├── auth.js
│   └── error.js
├── sqs/                     # AWS SQS integration
│   ├── config.js           # SQS client setup
│   ├── publishers.js       # Message publishing
│   └── workers/
│       ├── dispatcher.js    # Route jobs to workers
│       ├── application.worker.js
│       └── explanation.worker.js
├── prompts/                 # LLM prompt templates
│   ├── application.js
│   ├── explanation.js
│   └── chat.js
├── utils/                   # Helper functions
│   └── helpers.js
├── llm/
│   ├── llm.js             # OpenRouter SDK setup
│   └── response.js        # LLM response generation
├── app.js                  # Express app setup
└── server.js               # Server entry point
File Descriptions
app.js - Express application setup

JavaScript
- CORS configuration for frontend domains
- Body parser middleware
- Route mounting
- Error handler middleware
server.js - Server entry point

JavaScript
- Database connection
- Port configuration
- Server start
lambda.js - AWS Lambda handler

JavaScript
- Dual mode: HTTP requests & SQS messages
- Serverless Express setup
- SQS message dispatching
Database Connection (config/db.js)

JavaScript
- Mongoose connection management
- Connection state checking
- Error handling
Environment Configuration (config/env.js)

Code
PORT                 - Server port
DATABASE_URL         - MongoDB connection string
SQS_QUEUE_URL        - AWS SQS queue URL
OPENROUTER_API_KEY   - LLM API key
OPENROUTER_MODEL     - LLM model name
CLOUDINARY_*         - Image hosting credentials
QDRANT_*             - Vector database credentials
JWT_SECRET           - Authentication secret
4. Database Layer (MongoDB)
Collections Schema
Applications Collection

JavaScript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  company: String,
  role: String,
  
  processingData: {
    resumeText: String,
    jobDescriptionText: String
  },
  
  analysis: {
    atsScore: Number (0-100),
    summary: String,
    strengths: [String],
    weaknesses: [String],
    matchedSkills: [String],
    missingSkills: [String],
    recommendations: [String],
    interviewFocus: [String]
  },
  
  status: String (enum: ["processing", "completed", "failed"]),
  failureReason: String,
  
  createdAt: Date,
  updatedAt: Date
}
Topics Collection

JavaScript
{
  _id: ObjectId,
  application: ObjectId (ref: Application),
  order: Number,
  title: String,
  priority: String (enum: ["high", "medium", "low"]),
  reason: String,
  
  createdAt: Date,
  updatedAt: Date
}
Explanations Collection

JavaScript
{
  _id: ObjectId,
  topic: ObjectId (ref: Topic, unique),
  
  status: String (enum: ["processing", "completed", "failed"]),
  failureReason: String,
  
  tableOfContents: [
    { id: String, label: String }
  ],
  
  sections: [
    {
      id: String,
      title: String,
      blocks: [
        {
          id: String,
          type: String (enum: ["text", "diagram", "code", "table", "tip", "warning", "note"]),
          title: String,
          content: String,
          metadata: {
            language?: String,
            highlightLines?: [Number],
            headers?: [String],
            rows?: [String[]],
            ...
          }
        }
      ]
    }
  ],
  
  createdAt: Date,
  updatedAt: Date
}
Chat Collection

JavaScript
{
  _id: ObjectId,
  topic: ObjectId (ref: Topic, unique),
  
  messages: [
    {
      role: String (enum: ["user", "assistant"]),
      content: String,
      createdAt: Date,
      updatedAt: Date
    }
  ],
  
  createdAt: Date,
  updatedAt: Date
}
💻 Technology Stack
Frontend
React 18+ - UI framework
Vite - Build tool
Tailwind CSS - Styling
Axios - HTTP client
React Router - Navigation
Context API - State management
Backend (Python)
FastAPI - Web framework
Pydantic - Data validation
MongoDB - Database driver
JWT - Authentication
Google Gemini - AI integration
Cloudinary - Image hosting
AWS SQS - Message queue
Backend (Node.js)
Express.js - Web framework
Mongoose - MongoDB ODM
OpenRouter SDK - LLM API client
Multer - File upload handling
JWT - Authentication
pdfjs-dist - PDF parsing
Serverless Express - AWS Lambda support
Database
MongoDB - Document database
Mongoose - Object modeling
Infrastructure
AWS SQS - Message queue
AWS Lambda - Serverless compute
Docker & Docker Compose - Containerization
MongoDB Atlas - Cloud database (optional)
AI/ML
OpenRouter API - LLM provider (supports multiple models)
Google Gemini - AI model (Python backend)
Qdrant - Vector database (optional for embeddings)
📁 Repository Structure
Code
ALGONOTES/
├── frontend/                        # React frontend application
│   ├── src/
│   │   ├── components/             # Reusable components
│   │   ├── pages/                  # Page components
│   │   ├── context/                # React context
│   │   ├── constants/              # Constants
│   │   ├── utils/                  # Utilities
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── backend/                         # Python/FastAPI backend
│   ├── app/
│   │   ├── models/                 # Database models
│   │   ├── routes/                 # API routes
│   │   ├── services/               # Business logic
│   │   ├── middlewares/            # Middleware
│   │   ├── config/                 # Configuration
│   │   ├── sqs/                    # SQS workers
│   │   └── schemas/                # Pydantic schemas
│   ├── main.py                     # Entry point
│   ├── requirements.txt            # Dependencies
│   └── .env.example
│
├── interview-prep-backend/          # Node.js/Express backend
│   ├── src/
│   │   ├── ai/                     # AI integration
│   │   ├── application/            # Application module
│   │   ├── topic/                  # Topic module
│   │   ├── chat/                   # Chat module
│   │   ├── config/                 # Configuration
│   │   ├── middlewares/            # Middleware
│   │   ├── sqs/                    # SQS integration
│   │   ├── prompts/                # LLM prompts
│   │   ├── utils/                  # Utilities
│   │   ├── llm/                    # LLM setup
│   │   ├── app.js                  # Express app
│   │   ├── server.js               # Server entry
│   │   └── lambda.js               # Lambda handler
│   ├── package.json
│   └── .env.example
│
├── docker-compose.yml              # Multi-service orchestration
├── docs/
│   └── ARCHITECTURE.md             # Detailed architecture
├── .gitignore
├── DOCUMENTATION.md                # This file
└── README.md                       # Project overview
🚀 Setup Guide
Prerequisites
Node.js 20+ with npm
Python 3.8+
Docker & Docker Compose (optional)
MongoDB (local or Atlas)
Git
Option 1: Docker Compose (Recommended)
bash
# Clone repository
git clone https://github.com/shahadat-gith/ALGONOTES.git
cd ALGONOTES

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp interview-prep-backend/.env.example interview-prep-backend/.env

# Edit environment files with your configuration
# - Database URLs
# - API keys
# - Service URLs

# Start all services
docker-compose up -d

# Access services
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# Interview Prep API: http://localhost:5000
Option 2: Local Development Setup
Python Backend Setup
bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Run server
python main.py
# Backend available at http://localhost:8000
Node.js Interview Prep Backend Setup
bash
cd interview-prep-backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings:
# - DATABASE_URL=mongodb://...
# - OPENROUTER_API_KEY=your_key
# - SQS_QUEUE_URL=your_sqs_url
# - JWT_SECRET=your_secret

# Development mode (with auto-reload)
npm run dev
# Production mode
npm start
# Server available at http://localhost:5000
Frontend Setup
bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings:
# - VITE_API_URL=http://localhost:8000
# - VITE_INTERVIEW_API_URL=http://localhost:5000

# Development mode
npm run dev
# Frontend available at http://localhost:3000

# Production build
npm run build
📡 API Documentation
Interview Prep Backend API
Base URL
Development: http://localhost:5000
Production: Configure via environment
Authentication
All endpoints (except auth) require JWT token in header:

Code
Authorization: Bearer <token>
Application Endpoints
Create Application
Code
POST /api/applications
Content-Type: multipart/form-data

Body:
- company (string): Company name
- role (string): Job role
- jobDescription (string): Job description text
- resume (file): Resume PDF/DOC file

Response (202 Accepted):
{
  "success": true,
  "message": "Application submitted successfully.",
  "applicationId": "507f1f77bcf86cd799439011"
}
Get Applications
Code
GET /api/applications

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "company": "Google",
      "role": "Backend Engineer",
      "status": "completed",
      "analysis": {...},
      "createdAt": "2024-01-01T...",
      "updatedAt": "2024-01-01T..."
    }
  ]
}
Get Application Status
Code
GET /api/applications/:id/status

Response (200 OK):
{
  "success": true,
  "data": {
    "status": "processing|completed|failed",
    "failureReason": ""
  }
}
Get Application Details
Code
GET /api/applications/:id

Response (200 OK):
{
  "success": true,
  "data": {
    "application": {...},
    "topics": [
      {
        "_id": "...",
        "title": "System Design",
        "priority": "high",
        "order": 1,
        "reason": "Role requires distributed systems knowledge"
      }
    ]
  }
}
Delete Application
Code
DELETE /api/applications/:id

Response (200 OK):
{
  "success": true,
  "message": "Application deleted successfully."
}
Topic Endpoints
Get Topic
Code
GET /api/topics/:topicId

Response (200 OK):
{
  "success": true,
  "data": {
    "topic": {...},
    "explanation": {...}
  }
}
Generate Explanation
Code
POST /api/topics/:topicId/generate-explanation

Body:
{
  "codeLanguage": "javascript" // optional
}

Response (202 Accepted):
{
  "success": true,
  "message": "Explanation generation started."
}
Check Explanation Status
Code
GET /api/topics/:topicId/explanation-status

Response (200 OK):
{
  "success": true,
  "data": {
    "status": "processing|completed|failed|unrequested",
    "failureReason": ""
  }
}
Get Explanation
Code
GET /api/topics/:topicId/explanation

Response (200 OK):
{
  "success": true,
  "data": {
    "tableOfContents": [
      { "id": "intro", "label": "Introduction" },
      { "id": "concepts", "label": "Key Concepts" }
    ],
    "sections": [
      {
        "id": "intro",
        "title": "Introduction",
        "blocks": [
          {
            "id": "block-1",
            "type": "text",
            "title": "Overview",
            "content": "<p>Content here</p>",
            "metadata": {}
          }
        ]
      }
    ]
  }
}
Chat Endpoints
Get Chat History
Code
GET /api/chat/:topicId

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "role": "user",
      "content": "What is..."
    },
    {
      "role": "assistant",
      "content": "Answer..."
    }
  ]
}
Send Chat Message
Code
POST /api/chat/:topicId

Body:
{
  "message": "Can you explain this?"
}

Response (200 OK):
{
  "success": true,
  "answer": "AI-generated response..."
}
🗄️ Database Schema
Indexes
Applications Collection

JavaScript
- user: 1, createdAt: -1    // For user's applications list
- status: 1                  // For status-based queries
- user: 1, status: 1        // Combined index
Topics Collection

JavaScript
- application: 1, order: 1  // For topic ordering within application
Chat Collection

JavaScript
- topic: 1 (unique)         // One chat per topic
Explanations Collection

JavaScript
- topic: 1 (unique)         // One explanation per topic
🔧 Development Guide
Code Structure Best Practices
Controllers (Request Handlers)
JavaScript
// interview-prep-backend/src/application/controller.js
export const createApplication = async (req, res, next) => {
  try {
    // 1. Validate input
    // 2. Parse files if needed
    // 3. Create database record
    // 4. Queue background job
    // 5. Return response with 202 Accepted for async operations
    return res.status(202).json({success: true, ...});
  } catch (error) {
    next(error); // Pass to error middleware
  }
};
Background Workers
JavaScript
// interview-prep-backend/src/sqs/workers/application.worker.js
export const processApplicationJob = async (applicationId) => {
  try {
    // 1. Fetch application from database
    // 2. Extract and parse data
    // 3. Call LLM service
    // 4. Parse response
    // 5. Update database with results
    // 6. Handle cleanup
  } catch (error) {
    // Update application with failure status
    await Application.findByIdAndUpdate(applicationId, {
      status: "failed",
      failureReason: error.message,
    });
    throw error;
  }
};
Service Pattern (Business Logic)
JavaScript
// Services encapsulate business logic
// Controllers call services
// Services call models
// Models interact with database
Error Handling
JavaScript
// All async endpoints use try-catch
// Errors passed to next() middleware
// Middleware formats and returns standardized error response
Adding New Features
Step 1: Create Model
JavaScript
// Define MongoDB schema
const NewFeatureSchema = new Schema({...});
export const NewFeature = mongoose.model("NewFeature", NewFeatureSchema);
Step 2: Create Controller
JavaScript
// Handle HTTP requests
export const createNewFeature = async (req, res, next) => {...};
Step 3: Create Routes
JavaScript
// Map URLs to controllers
router.post("/features", authenticate, createNewFeature);
Step 4: Add to App
JavaScript
// Mount routes in app.js
app.use("/api/features", featureRoutes);
Testing
Running Tests
bash
# Backend
cd interview-prep-backend
npm test

# Frontend
cd frontend
npm test
Writing Tests
JavaScript
// Test async operations
// Mock external services (LLM, SQS)
// Test error handling
// Test database operations
🚀 Deployment
Docker Deployment
Build Images
bash
# Build all services
docker-compose build

# Build specific service
docker-compose build interview-prep-backend
Environment Configuration
Create .env files for each service:

backend/.env

env
ENVIRONMENT=production
NODE_ENV=production
PORT=5000
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your_secret_key
SQS_QUEUE_URL=https://sqs.region.amazonaws.com/account/queue
OPENROUTER_API_KEY=your_api_key
OPENROUTER_MODEL=openrouter/auto
AWS Deployment
Lambda Setup

bash
# The interview-prep-backend supports AWS Lambda via lambda.js
# Package the application with dependencies
npm install --production

# Create deployment package
zip -r lambda-package.zip .

# Upload to Lambda
# Set handler: src/lambda.handler
# Configure environment variables
# Set timeout: 300 seconds (for long-running jobs)
SQS Setup

Create SQS queue
Configure Dead Letter Queue (DLQ) for failed messages
Set queue attributes:
Message Retention: 14 days
Visibility Timeout: 300 seconds
RDS/MongoDB Setup

Deploy MongoDB instance
Create database and collections
Configure indexes
Set connection string in environment
Scaling Considerations
Horizontal Scaling
Frontend: Serve via CDN, multiple instances
Backend APIs: Load balance across instances
SQS Workers: Multiple Lambda concurrent executions
Vertical Scaling
Database: Increase instance size, enable replication
APIs: Increase container/Lambda memory
Workers: Increase Lambda timeout if needed
Performance Optimization
Add Redis for caching
Implement API rate limiting
Optimize database queries with indexes
Compress large responses
Implement pagination
🤝 Contributing
Before Contributing
Fork the repository
Create a feature branch: git checkout -b feature/your-feature
Follow code style guidelines
Write tests for new features
Update documentation
Code Style
JavaScript: ESLint + Prettier
Python: Black + isort
CSS: Tailwind conventions
Commit Messages
Code
type(scope): description

fix(auth): resolve JWT token expiration issue
feat(chat): add message persistence
docs(api): update endpoint documentation
Pull Request Process
Update README.md with any new information
Add tests for new features
Ensure all tests pass
Request review from maintainers
Address feedback and iterate
📚 Additional Resources
Documentation Files
ARCHITECTURE.md - Detailed technical architecture
README.md - Project overview and quick start
External Resources
Express.js Docs
Mongoose Docs
MongoDB Docs
OpenRouter API
AWS SQS Docs
React Docs
📞 Support
For issues, questions, or suggestions:

Check existing issues
Create a new issue with detailed description
Contact the maintainers
