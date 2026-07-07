# ALGONOTES Architecture

## System Overview

ALGONOTES is a microservices-based platform with three main components:

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│                   Port: 3000                                     │
│  - UI Components, Pages, State Management                        │
│  - Authentication & Authorization                               │
└──────────────────────────┬──────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  Main Backend    │ │ Interview Prep   │ │  External APIs   │
│ (Python/FastAPI)│ │  (Node.js/Exp)   │ │                  │
│  Port: 8000     │ │  Port: 5000      │ │ - Google Gemini  │
└────────┬─────────┘ └────────┬─────────┘ │ - Cloudinary     │
         │                    │           │ - AWS SQS        │
         └────────────────────┼───────────┘ │ - LeetCode API   │
                              │            └──────────────────┘
                ┌─────────────┴──────────┐
                ▼                        ▼
          ┌──────────────┐        ┌──────────────┐
          │  MongoDB     │        │  Redis       │
          │  Database    │        │  Cache/Queue │
          └──────────────┘        └──────────────┘
```

## Component Architecture

### 1. Frontend (React)

**Location**: `frontend/`

#### Key Features:
- **Single Page Application (SPA)** using React 18
- **Component-based architecture** for reusability
- **Context API** for state management
- **Tailwind CSS** for responsive styling
- **Custom hooks** for business logic

#### Directory Structure:
```
frontend/src/
├── api/                 # API client configuration
├── components/
│   ├── auth/           # Authentication components
│   ├── common/         # Reusable components
│   ├── home/           # Homepage components
│   ├── layout/         # Layout wrappers
│   ├── leetcode/       # LeetCode integration
│   ├── notes/          # Note components
│   ├── theory/         # Theory components
│   ├── interview-prep/ # Interview prep UI
│   └── modals/         # Modal dialogs
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── context/            # React context
├── utils/              # Utility functions
└── constants/          # App constants
```

#### Key Technologies:
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Routing
- **Unified.js** - Markdown processing
- **Highlight.js** - Code highlighting
- **Lucide React** - Icons

### 2. Main Backend (Python/FastAPI)

**Location**: `backend/`

#### Architecture Pattern: Layered Architecture

```
├── Routes (HTTP Endpoints)
│   └── Schemas (Request/Response validation)
│       └── Services (Business logic)
│           └── Models (Data access)
│               └── Database (MongoDB)
```

#### Key Components:

##### Models (`backend/app/models/`)
- **User**: User profiles and authentication
- **Note**: Algorithmic notes with solutions
- **Theory**: Theory study guides
- **Analytics**: Usage tracking
- **Temp**: Temporary processing jobs

##### Routes (`backend/app/routes/`)
```
auth.py           - Authentication endpoints
notes.py          - Note CRUD operations
theory.py         - Theory management
analytics.py      - Analytics data
prompt.py         - Prompt optimization
leetcode.py       - LeetCode integration
user.py           - User profile management
```

##### Services (`backend/app/services/`)
- **email.py** - Email sending
- **security.py** - Password hashing, JWT
- **analytics.py** - Analytics processing
- **cloudinary.py** - Image hosting

##### Middlewares (`backend/app/middlewares/`)
- **auth.py** - JWT validation
- **error.py** - Global error handling
- **metrics.py** - Performance tracking

##### Configuration (`backend/app/config/`)
- **settings.py** - App configuration
- **gemini.py** - Google Gemini AI setup
- **cloudinary.py** - Cloudinary setup
- **mailer.py** - Email configuration

##### Async Workers (`backend/app/sqs/`)
- **worker.py** - AWS SQS consumer
- **dispatcher.py** - Job dispatcher
- **handler.py** - Message handlers
- **router.py** - Route messages to handlers

#### Request Flow:
```
HTTP Request
    ↓
Route Handler
    ↓
Validation (Schema)
    ↓
Authentication (Middleware)
    ↓
Service Logic
    ↓
Database Query (Model)
    ↓
Response (Schema)
    ↓
HTTP Response
```

#### API Response Format:
```python
{
    "success": True,
    "data": {...},
    "message": "Operation successful",
    "timestamp": "2024-01-01T12:00:00Z"
}
```

### 3. Interview Prep Backend (Node.js/Express)

**Location**: `interview-prep-backend/`

#### Architecture: MVC with Job Queue

```
├── Routes (HTTP Endpoints)
│   ├── Controllers (Request handling)
│   │   └── Services (Business logic)
│   │       └── Models (Data access)
│   │           └── Database (MongoDB)
│   │
│   └── Jobs (BullMQ)
│       ├── Application Worker
│       └── Topic Worker
```

#### Key Modules:

##### Application Flow:
```
Upload Resume + JD
    ↓
Create Application (Queue Job)
    ↓
Application Worker
    ├── Extract Resume Data
    ├── Extract Job Description
    ├── Analyze Candidate Profile
    ├── Generate Interview Topics
    └── Save Application
```

##### Topic Flow:
```
Open Topic
    ↓
Has Discussion?
├── Yes → Return Discussion
└── No → Queue Job
         ↓
    Topic Worker
         ├── Generate Discussion (AI)
         ├── Save Discussion
         └── Update Status
```

##### Chat Flow:
```
User Message
    ↓
Load Topic & Context
    ↓
Load Previous Messages
    ↓
Send to Gemini API
    ↓
Save Conversation
    ↓
Return Response
```

#### BullMQ Integration:
- **Job Queue**: Redis-backed queue
- **Workers**: Background job processors
- **Retry Logic**: Failed job retry mechanism
- **Monitoring**: Job status tracking

### 4. Database Layer (MongoDB)

#### Collections:

**Users Collection**
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  name: String,
  profile: {
    avatar: String,
    bio: String,
    skills: [String]
  },
  settings: {
    notifications: Boolean,
    theme: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Notes Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  title: String,
  content: {...},
  status: String, // draft, published
  tags: [String],
  likes: Number,
  views: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**Theory Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  title: String,
  topic: String,
  content: String (HTML),
  images: [String],
  status: String, // processing, draft, published
  likes: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**Analytics Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  action: String, // view_note, create_note, etc.
  resourceId: ObjectId,
  timestamp: Date,
  metadata: Object
}
```

#### Indexing Strategy:
```javascript
db.notes.createIndex({ userId: 1, createdAt: -1 })
db.theory.createIndex({ userId: 1, topic: 1 })
db.users.createIndex({ email: 1 }, { unique: true })
db.analytics.createIndex({ userId: 1, timestamp: -1 })
```

### 5. Cache Layer (Redis)

#### Use Cases:
- **Session Storage**: User sessions and tokens
- **Job Queue**: BullMQ task queue
- **Rate Limiting**: API rate limit tracking
- **Caching**: Frequently accessed data

#### TTL Strategy:
- Session: 7 days
- Cache: 1 hour
- Job Results: 24 hours

### 6. Asynchronous Processing (AWS SQS)

#### Job Types:
1. **Note Generation**: AI-powered note creation
2. **Theory Generation**: Theory content generation
3. **Prompt Optimization**: Refining study materials
4. **Email Sending**: User notifications
5. **Analytics Processing**: Usage data aggregation

#### Flow:
```
User Request
    ↓
Create SQS Message
    ↓
Queue Message to AWS SQS
    ↓
Worker Consumes Message
    ↓
Process Task
    ├── Success → Update Database
    └── Failure → Retry with backoff
    ↓
Notify User (via WebSocket or Email)
```

### 7. External Integrations

#### Google Gemini API
- **Purpose**: AI-powered content generation
- **Use Cases**: Note generation, theory creation
- **Integration**: Python async client

#### Cloudinary
- **Purpose**: Image/media hosting
- **Use Cases**: Note images, theory diagrams
- **Integration**: REST API wrapper service

#### LeetCode API
- **Purpose**: Problem data and user stats
- **Use Cases**: Profile sync, problem details
- **Integration**: GraphQL/REST queries

## Data Flow Diagrams

### Note Generation Flow
```
Frontend
    │
    └─► POST /api/notes/generate
            │
            ├─► Validate Request (Schema)
            │
            ├─► Check User Authentication
            │
            ├─► Create Job Record
            │
            └─► Queue to AWS SQS
                    │
                    └─► SQS Worker
                            │
                            ├─► Fetch Problem Details
                            │
                            ├─► Call Gemini API
                            │
                            ├─► Parse AI Response
                            │
                            ├─► Save to MongoDB
                            │
                            └─► Return Success
                                    │
                                    └─► Frontend Polls Status
                                            │
                                            └─► Display Note
```

### User Authentication Flow
```
Frontend
    │
    └─► POST /api/auth/login
            │
            ├─► Validate Email/Password (Schema)
            │
            ├─► Query MongoDB for User
            │
            ├─► Compare Password Hash
            │
            ├─► Generate JWT Token
            │
            ├─► Store in Redis Session
            │
            └─► Return Token
                    │
                    └─► Store in Frontend LocalStorage
                            │
                            └─► Include in API Headers
                                    │
                                    └─► Middleware Validates Token
```

### Interview Prep Application Flow
```
Frontend
    │
    └─► POST /api/applications
            │
            ├─► Upload Resume (Cloudinary)
            │
            ├─► Create Application Record
            │
            ├─► Queue Job (BullMQ)
            │
            └─► Return Application ID
                    │
                    └─► Job Worker
                            │
                            ├─► Extract Resume Text
                            │
                            ├─► Extract JD Text
                            │
                            ├─► Call Gemini for Analysis
                            │
                            ├─► Generate Topics
                            │
                            ├─► Save to MongoDB
                            │
                            └─► Update Status to Ready
                                    │
                                    └─► Frontend Polls & Displays Topics
```

## Deployment Architecture

### Containerization (Docker)

```
Services:
├── Frontend Container
│   └── Node.js + React (Nginx)
│
├── Backend Container
│   └── Python + FastAPI
│
├── Interview Prep Container
│   └── Node.js + Express
│
├── MongoDB Container
│   └── Database
│
├── Redis Container
│   └── Cache/Queue
│
└── AWS SQS (External)
    └── Asynchronous Messaging
```

### Docker Compose Setup
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    environment:
      - REACT_APP_BACKEND_URL=http://backend:8000
    
  backend:
    build: ./backend
    ports: ["8000:8000"]
    environment:
      - DATABASE_URL=mongodb://mongo:27017
      - REDIS_URL=redis://redis:6379
    depends_on: [mongo, redis]
    
  interview-prep:
    build: ./interview-prep-backend
    ports: ["5000:5000"]
    depends_on: [mongo, redis]
    
  mongo:
    image: mongo:latest
    ports: ["27017:27017"]
    volumes: [mongo_data:/data/db]
    
  redis:
    image: redis:latest
    ports: ["6379:6379"]
```

## Performance Considerations

### Frontend Optimization
- **Code Splitting**: Route-based splitting
- **Lazy Loading**: Component-level lazy loading
- **Image Optimization**: Cloudinary transforms
- **Caching**: Browser cache headers
- **Minification**: Production bundle optimization

### Backend Optimization
- **Database Indexing**: Strategic index creation
- **Query Optimization**: Lean queries, pagination
- **Caching**: Redis for frequently accessed data
- **Async Processing**: Non-blocking operations
- **Connection Pooling**: Database connection management

### Scaling Strategy
- **Horizontal Scaling**: Multiple backend instances
- **Load Balancing**: Nginx/HAProxy distribution
- **Database Sharding**: Partition data by user
- **Cache Distribution**: Redis cluster
- **Queue Scaling**: Multiple SQS workers

## Security Architecture

### Authentication & Authorization
```
JWT Token Flow:
User Login
    ↓
Generate JWT (Header.Payload.Signature)
    ↓
Store in Redis Session
    ↓
Send to Frontend
    ↓
Include in API Requests (Authorization Header)
    ↓
Middleware Validates Signature
    ↓
Extract User ID
    ↓
Allow/Deny Request
```

### Encryption
- **Passwords**: bcrypt hashing
- **Secrets**: Environment variables
- **API Keys**: Encrypted storage
- **Database**: Encrypted at rest (optional)
- **Transport**: HTTPS/TLS

### Rate Limiting
```
Per IP: 100 requests/minute
Per User: 1000 requests/hour
Per Endpoint: Custom limits
```

## Monitoring & Logging

### Logging Strategy
```
Application → Logger
    ↓
    ├─► Console (Development)
    ├─► File (Production)
    └─► Centralized Service (Optional)

Log Levels:
├─ DEBUG: Detailed diagnostic info
├─ INFO: Informational messages
├─ WARNING: Warning messages
├─ ERROR: Error messages
└─ CRITICAL: Critical issues
```

### Metrics to Track
- Request latency
- Error rates
- API throughput
- Database query time
- Cache hit ratio
- Queue job duration
- User engagement

## Technology Rationale

| Technology | Why? |
|-----------|------|
| **React** | Component-driven, large ecosystem |
| **FastAPI** | High performance, async support, auto-docs |
| **MongoDB** | Flexible schema, scalable |
| **Redis** | Fast caching, job queue support |
| **Gemini AI** | Advanced text generation |
| **AWS SQS** | Reliable message queuing |
| **Docker** | Consistent environments, easy deployment |

---

For more information on specific components, see the individual service READMEs and API documentation.