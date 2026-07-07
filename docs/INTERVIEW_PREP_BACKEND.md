# Interview Prep Backend - Architecture & Implementation Guide

Complete technical documentation for the interview-prep-backend service based on actual codebase implementation.

## Table of Contents
1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Data Models](#data-models)
5. [Job Processing](#job-processing)
6. [API Endpoints](#api-endpoints)
7. [Workflows](#workflows)
8. [AI Integration](#ai-integration)
9. [Setup & Deployment](#setup--deployment)

---

## Overview

The interview-prep-backend is a Node.js/Express service that processes interview preparation applications. It:

- Accepts resume uploads and job descriptions
- Analyzes candidate profiles against job requirements
- Generates personalized interview topics
- Creates detailed explanations for each topic
- Provides interactive chat for topic discussion

**Key Technologies:**
- **Node.js/Express** - HTTP server
- **MongoDB** - Data persistence
- **AWS SQS** - Asynchronous job queue
- **OpenRouter SDK** - AI integration
- **AWS Lambda** - Serverless execution (optional)
- **PDF.js** - Resume parsing

---

## Tech Stack

### Core Dependencies

```json
{
  "@aws-sdk/client-sqs": "^3.1079.0",           // AWS SQS client
  "@codegenie/serverless-express": "^4.17.1",  // Lambda integration
  "@openrouter/sdk": "^0.13.22",                // OpenRouter AI SDK
  "cors": "^2.8.6",                             // CORS middleware
  "dotenv": "^17.4.2",                          // Environment variables
  "express": "^5.2.1",                          // HTTP framework
  "jsonwebtoken": "^9.0.3",                     // JWT authentication
  "mongoose": "^9.7.3",                         // MongoDB ODM
  "multer": "^2.2.0",                           // File upload handling
  "pdfjs-dist": "^6.1.200"                      // PDF parsing
}
```

### Environment Variables

Required `.env` variables:

```env
# Server Configuration
PORT=5001
ENVIRONMENT=development
NODE_ENV=development

# Authentication
JWT_SECRET=your_jwt_secret_key

# Database
DATABASE_URL=mongodb://localhost:27017/interview-prep

# AWS SQS
SQS_QUEUE_URL=https://sqs.region.amazonaws.com/account/queue-name
AWS_REGION=us-east-1

# AI Service
OPENROUTER_API_KEY=sk-or-v1-your-api-key
OPENROUTER_MODEL=openai/gpt-4o

# Image Hosting
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Vector Database (Optional)
QDRANT_API_KEY=your_key
QDRANT_URL=http://localhost:6333

# Frontend
FRONTEND_URL=http://localhost:3000
```

---

## Architecture

### High-Level Flow

```
┌─────────────┐
│  Frontend   │
│ (React)     │
└──────┬──────┘
       │
       │ POST /api/applications
       │ (upload resume + JD)
       ▼
┌─────────────────────────────────┐
│ Interview Prep Backend          │
│ (Express)                       │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Application Controller      │ │
│ │ ┌───────────────────────────┤ │
│ │ │ 1. Parse Resume (PDF)     │ │
│ │ │ 2. Create Application     │ │
│ │ │ 3. Publish SQS Message    │ │
│ └─────────────────────────────┘ │
│ │
│ ▼
│ ┌─────────────────────────────┐
│ │ AWS SQS Queue               │
│ │ (Async Job Processing)      │
│ └─────────────────────────────┘
└──────────┬──────────────────────┘
           │
           │ SQS Event (Lambda/Local Worker)
           ▼
┌─────────────────────────────────────┐
│ Worker: processApplicationJob        │
│                                      │
│ 1. Fetch application data            │
│ 2. Call OpenRouter API               │
│ 3. Parse JSON response               │
│ 4. Create Interview Topics           │
│ 5. Update Application status         │
└─────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ MongoDB Collections                 │
│                                      │
│ ├─ Application (status, analysis)  │
│ ├─ Topic (interview topics)         │
│ ├─ Explanation (content + cache)    │
│ └─ Chat (conversation history)      │
└─────────────────────────────────────┘
```

### Request-Response Pattern

```
HTTP Request
    │
    ├─► Validate Request
    │
    ├─► Authenticate JWT
    │
    ├─► Check Authorization (User owns resource)
    │
    ├─► Process Request
    │   ├─► Database Operation
    │   ├─► (Optional) Publish SQS Message
    │   └─► Return 202 Accepted or 200 OK
    │
    └─► Error Handler
        └─► Return 4xx or 5xx
```

### Directory Structure

```
interview-prep-backend/src/
│
├── app.js                    # Express app setup
├── server.js                 # Server entry point
├── lambda.js                 # AWS Lambda handler
│
├── config/
│   ├── env.js               # Environment variables
│   └── db.js                # MongoDB connection
│
├── middlewares/
│   ├── auth.js              # JWT verification
│   ├── error.js             # Global error handling
│   └── logger.js            # Logging
│
├── application/
│   ├── controller.js        # Application endpoints
│   ├── routes.js            # Express routes
│   ├── model.js             # Mongoose schema
│   └── service.js           # Business logic (if used)
│
├── topic/
│   ├── controller.js        # Topic endpoints
│   ├── routes.js            # Express routes
│   ├── topic.model.js       # Topic schema
│   ├── explanation.model.js # Explanation schema
│   └── service.js           # Business logic (if used)
│
├── chat/
│   ├── controller.js        # Chat endpoints
│   ├── routes.js            # Express routes
│   ├── model.js             # Chat schema
│   └── service.js           # Business logic (if used)
│
├── sqs/
│   ├── config.js            # SQS client setup
│   ├── publishers.js        # Send messages to SQS
│   └── workers/
│       ├── dispatcher.js    # Route job types to workers
│       ├── application.worker.js  # Process application jobs
│       └── explanation.worker.js  # Generate explanations
│
├── llm/
│   ├── llm.js              # OpenRouter SDK setup
│   └── response.js         # Generate AI content
│
├── prompts/
│   ├── application.js      # Application analysis prompt
│   ├── explanation.js      # Explanation generation prompt
│   └── chat.js             # Chat system prompt
│
└── utils/
    ├── helpers.js          # Parse resume, JSON parsing
    └── validators.js       # Input validation
```

---

## Data Models

### Application Schema

**Purpose**: Store interview prep application metadata and analysis

```javascript
{
  _id: ObjectId,
  
  // User reference
  user: ObjectId,           // Reference to User (in main backend)
  
  // Job details
  company: String,          // Company name (e.g., "Google")
  role: String,             // Job title (e.g., "Senior Software Engineer")
  
  // Processing data (cleared after job completes)
  processingData: {
    resumeText: String,           // Extracted from PDF
    jobDescriptionText: String    // Provided by user
  },
  
  // Analysis results
  analysis: {
    atsScore: Number,             // 0-100
    summary: String,              // Executive summary
    strengths: [String],          // What candidate has
    weaknesses: [String],         // What's missing
    matchedSkills: [String],      // Skills from resume that match JD
    missingSkills: [String],      // Skills in JD but not resume
    recommendations: [String],    // How to improve
    interviewFocus: [String]      // What to emphasize in interview
  },
  
  // Status tracking
  status: "processing" | "completed" | "failed",
  failureReason: String,          // Error message if failed
  
  // Metadata
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `{ user: 1, createdAt: -1 }` - Fast user application lookup

---

### Topic Schema

**Purpose**: Store interview topics generated for an application

```javascript
{
  _id: ObjectId,
  
  // Reference to application
  application: ObjectId,           // Reference to Application
  
  // Topic metadata
  order: Number,                   // Sort order (1, 2, 3...)
  title: String,                   // "Binary Search Trees", "System Design"
  priority: "high" | "medium" | "low",
  reason: String,                  // Why this topic matters for this role
  
  // Metadata
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `{ application: 1, order: 1 }` - Fast topic retrieval by application

---

### Explanation Schema

**Purpose**: Store detailed explanations for topics (generated on-demand)

```javascript
{
  _id: ObjectId,
  
  // Reference to topic
  topic: ObjectId,                 // Reference to Topic (UNIQUE)
  
  // Content structure
  tableOfContents: [
    {
      id: String,                  // "sec-1-1"
      label: String                // "What is Binary Search?"
    }
  ],
  
  sections: [
    {
      id: String,                  // "sec-1"
      title: String,               // "Fundamentals"
      blocks: [
        {
          id: String,              // "block-1"
          type: "text" | "code" | "diagram" | "table" | "tip" | "warning" | "note",
          title: String,           // Optional
          content: String,         // HTML or code
          metadata: {
            // Language-specific for code blocks
            language: String,       // "python", "javascript"
            highlightLines: [Number],
            
            // Table-specific
            headers: [String],
            rows: [[String]]
          }
        }
      ]
    }
  ],
  
  // Status tracking
  status: "processing" | "completed" | "failed",
  failureReason: String,
  
  // Metadata
  createdAt: Date,
  updatedAt: Date
}
```

---

### Chat Schema

**Purpose**: Store conversation history for topic discussions

```javascript
{
  _id: ObjectId,
  
  // Reference to topic
  topic: ObjectId,                 // Reference to Topic (UNIQUE)
  
  // Conversation
  messages: [
    {
      role: "user" | "assistant",
      content: String,
      createdAt: Date,
      updatedAt: Date
    }
  ],
  
  // Metadata
  createdAt: Date,
  updatedAt: Date
}
```

---

## Job Processing

### SQS Queue Configuration

**Queue Name**: `interview-prep-queue` (or configured in `SQS_QUEUE_URL`)

**Message Format**:
```json
{
  "jobType": "process-application" | "generate-explanation",
  "applicationId": "id_string",      // For process-application
  "topicId": "id_string",            // For generate-explanation
  "codeLanguage": "python"           // For generate-explanation
}
```

### Job Types

#### 1. Process Application Job

**Trigger**: User uploads resume + job description

**Flow**:
```
1. Application.create() → {status: "processing"}
2. publishMessage() → AWS SQS
3. Worker receives event
4. Worker calls OpenRouter API with:
   - System prompt (analysis instructions)
   - Prompt with resume, JD, company, role
   - json: true (request structured JSON response)
5. Parse response → extract analysis + topics
6. Update Application:
   - analysis: {...}
   - status: "completed"
   - processingData: deleted
7. Batch insert Topics
8. Log success or error
```

**Worker File**: `src/sqs/workers/application.worker.js`

**Error Handling**:
- Catches exceptions
- Updates Application with status: "failed" + failureReason
- Logs error
- Re-throws for SQS retry logic

---

#### 2. Generate Explanation Job

**Trigger**: User requests explanation for a topic (POST `/api/topics/{topicId}/explanation`)

**Flow**:
```
1. Check if Explanation exists for topic:
   - If completed: return 200 (already done)
   - If processing: return 202 (being generated)
   - If failed: reset status to "processing"
   - If not exists: create with status: "processing"
   
2. publishMessage() → AWS SQS
3. Worker receives event
4. Worker calls OpenRouter API with:
   - System prompt (explanation structure rules)
   - Prompt with company, role, topic, code language
   - json: true (request structured JSON response)
5. Parse response → validate schema
6. Update Explanation:
   - tableOfContents: [...]
   - sections: [...]
   - status: "completed"
   - failureReason: ""
7. Log success or error
```

**Worker File**: `src/sqs/workers/explanation.worker.js`

**Schema Validation**:
```javascript
if (
  !parsed ||
  !Array.isArray(parsed.tableOfContents) ||
  !Array.isArray(parsed.sections)
) {
  throw new Error("Invalid schema structure returned from downstream LLM");
}
```

---

### Message Publishing

**File**: `src/sqs/publishers.js`

```javascript
export const publishMessage = async (message, delaySeconds = 0) => {
  // Sends JSON message to SQS queue
  // Returns { messageId, success: true }
  // Optional: delaySeconds for delayed job processing
}
```

### Message Dispatching

**File**: `src/sqs/workers/dispatcher.js`

```javascript
const workers = {
  "process-application": ({ applicationId }) =>
    processApplicationJob(applicationId),
  "generate-explanation": ({ topicId, codeLanguage }) =>
    processExplanationJob({ topicId, codeLanguage })
};

export const processSQSRecord = async (record) => {
  const body = JSON.parse(record.body);
  const worker = workers[body.jobType];
  if (!worker) throw new Error(`Unknown job type: ${body.jobType}`);
  return worker(body);
};
```

---

## API Endpoints

### Application Endpoints

#### Create Application

```http
POST /api/applications
Content-Type: multipart/form-data
Authorization: Bearer <JWT>

Form Data:
- company: "Google"
- role: "Software Engineer"
- jobDescription: "..."
- resume: <File>
```

**Response** (202 Accepted):
```json
{
  "success": true,
  "message": "Application submitted successfully.",
  "applicationId": "507f1f77bcf86cd799439011"
}
```

---

#### Get Application Status

```http
GET /api/applications/:id/status
Authorization: Bearer <JWT>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "status": "processing" | "completed" | "failed",
    "failureReason": ""
  }
}
```

---

#### Get Application Details

```http
GET /api/applications/:id
Authorization: Bearer <JWT>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "application": {
      "_id": "...",
      "company": "Google",
      "role": "Software Engineer",
      "analysis": {...},
      "status": "completed",
      "createdAt": "2024-01-01T..."
    },
    "topics": [
      {
        "_id": "...",
        "order": 1,
        "title": "Binary Search Trees",
        "priority": "high",
        "reason": "Critical for Google interviews"
      }
    ]
  }
}
```

---

#### List Applications

```http
GET /api/applications
Authorization: Bearer <JWT>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "company": "Google",
      "role": "Software Engineer",
      "status": "completed",
      "analysis": {...},
      "createdAt": "2024-01-01T..."
    }
  ]
}
```

---

### Topic Endpoints

#### Request Explanation

```http
POST /api/topics/:topicId/explanation
Content-Type: application/json
Authorization: Bearer <JWT>

{
  "codeLanguage": "python"
}
```

**Response** (202 Accepted):
```json
{
  "success": true,
  "message": "Explanation generation started."
}
```

---

#### Check Explanation Status

```http
GET /api/topics/:topicId/explanation/status
Authorization: Bearer <JWT>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "status": "processing" | "completed" | "failed" | "unrequested",
    "failureReason": ""
  }
}
```

---

#### Get Explanation

```http
GET /api/topics/:topicId/explanation
Authorization: Bearer <JWT>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "status": "completed",
    "tableOfContents": [...],
    "sections": [...]
  }
}
```

---

### Chat Endpoints

#### Get Chat History

```http
GET /api/chat/:topicId
Authorization: Bearer <JWT>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "role": "user",
      "content": "What is binary search?",
      "createdAt": "2024-01-01T..."
    },
    {
      "role": "assistant",
      "content": "Binary search is...",
      "createdAt": "2024-01-01T..."
    }
  ]
}
```

---

#### Send Message

```http
POST /api/chat/:topicId
Content-Type: application/json
Authorization: Bearer <JWT>

{
  "message": "Explain time complexity"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "answer": "Time complexity of binary search is O(log n) because..."
}
```

---

## Workflows

### Complete Interview Prep Workflow

```
┌─────────────────────────────────────────────────────┐
│ 1. USER UPLOADS RESUME + JOB DESCRIPTION            │
│    POST /api/applications                           │
│    → multer parses resume (PDF)                     │
│    → parseResume() extracts text                    │
│    → Application created (status: processing)      │
│    → SQS message published                         │
│    → Return 202 Accepted                           │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ 2. ASYNC WORKER PROCESSES APPLICATION               │
│    processApplicationJob(applicationId)             │
│    → Fetch application with processingData          │
│    → OpenRouter.generateContent() for analysis     │
│    → Parse JSON: {analysis, topics}                │
│    → Update application (status: completed)        │
│    → Batch insert topics                           │
│    → Delete processingData                         │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ 3. USER POLLS APPLICATION STATUS                    │
│    GET /api/applications/:id/status                │
│    → Check status: processing → completed          │
│    → Frontend displays topics                      │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ 4. USER REQUESTS EXPLANATION FOR A TOPIC            │
│    POST /api/topics/:topicId/explanation           │
│    → Create Explanation (status: processing)       │
│    → SQS message published                         │
│    → Return 202 Accepted                           │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ 5. ASYNC WORKER GENERATES EXPLANATION               │
│    processExplanationJob({topicId, codeLanguage})  │
│    → Fetch topic (populated with application)      │
│    → OpenRouter.generateContent() for content      │
│    → Parse JSON: {tableOfContents, sections}      │
│    → Update explanation (status: completed)        │
│    → Validate schema (throw if invalid)            │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ 6. USER VIEWS EXPLANATION & CHATS                   │
│    GET /api/topics/:topicId/explanation            │
│    POST /api/chat/:topicId                        │
│    GET /api/chat/:topicId                         │
│    → Display structured content                    │
│    → Send message → OpenRouter for answer         │
│    → Save conversation history                    │
└─────────────────────────────────────────────────────┘
```

---

## AI Integration

### OpenRouter SDK Setup

**File**: `src/llm/llm.js`

```javascript
import { OpenRouter } from "@openrouter/sdk";

export const llm = new OpenRouter({
  apiKey: env.OPENROUTER_API_KEY
});
```

### Content Generation

**File**: `src/llm/response.js`

```javascript
export const generateContent = async ({ system, prompt, json = false }) => {
  const response = await llm.chat.send({
    chatRequest: {
      model: env.OPENROUTER_MODEL,      // e.g., "openai/gpt-4o"
      temperature: 0.2,                 // Low for consistency
      response_format: json ? { type: "json_object" } : undefined,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt }
      ]
    }
  });

  return response.choices[0].message.content;
};
```

### Prompts

**Application Analysis** (`src/prompts/application.js`):
- System: Instructions for analyzing resume vs JD
- Returns: JSON with `{ analysis: {...}, topics: [...] }`

**Explanation Generation** (`src/prompts/explanation.js`):
- System: Rules for structured explanation format
- Includes: Block types (text, code, diagram, table, tip, warning, note)
- Returns: JSON with `{ tableOfContents: [...], sections: [...] }`

**Chat** (`src/prompts/chat.js`):
- System: Context-aware instructions for answering
- Includes: Company, role, topic, previous messages
- Returns: String (plain text answer)

---

## Setup & Deployment

### Local Development

```bash
cd interview-prep-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit with your values

# Start server
npm run dev
# Server runs on http://localhost:5001
```

### AWS Lambda Deployment

**Entry Point**: `src/lambda.js`

**Handler**: `handler`

```javascript
export const handler = async (event, context) => {
  await connectWithDatabase();

  // Process SQS events
  if (event.Records?.[0]?.eventSource === "aws:sqs") {
    for (const record of event.Records) {
      await processSQSRecord(record);
    }
    return;
  }

  // Process HTTP events
  if (!serverlessExpressInstance) {
    serverlessExpressInstance = serverlessExpress({ app });
  }
  return serverlessExpressInstance(event, context);
};
```

### Docker Deployment

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src ./src

EXPOSE 5001

CMD ["node", "src/server.js"]
```

---

## Error Handling

### Application Processing Errors

```javascript
try {
  // Processing
} catch (error) {
  await Application.findByIdAndUpdate(applicationId, {
    status: "failed",
    failureReason: error.message
  });
  throw error;
}
```

### Explanation Processing Errors

```javascript
catch (error) {
  await Explanation.findOneAndUpdate(
    { topic: topicId },
    {
      $set: {
        status: "failed",
        failureReason: error.message || "Unknown error"
      },
      $setOnInsert: { topic: topicId }
    },
    { upsert: true }
  );
  throw error;
}
```

### HTTP Error Handling

Global middleware in `src/middlewares/error.js`:
- Catches all errors
- Returns structured error response
- Logs errors

---

## Performance Considerations

### Database Indexing

```javascript
// Application: user_id + createdAt for fast lookup
ApplicationSchema.index({ user: 1, createdAt: -1 });

// Topic: application + order for ordering
TopicSchema.index({ application: 1, order: 1 });

// Explanation: topic (unique) for fast lookup
// Implicitly indexed due to unique constraint
```

### Query Optimization

```javascript
// Use .lean() for read-only queries (faster)
Application.find({...}).lean()

// Use Promise.all() for parallel queries
await Promise.all([
  Application.findOne(...),
  Topic.find(...)
])

// Select only needed fields
.select("-processingData")
```

### SQS Considerations

- **Visibility Timeout**: Set high enough for worker completion
- **Message Retention**: Default 4 days (sufficient for retry logic)
- **Batch Processing**: Lambda processes multiple records in parallel
- **Dead Letter Queue**: Recommended for failed messages

---

## Troubleshooting

### SQS Message Not Processing

1. Check SQS queue exists and `SQS_QUEUE_URL` is correct
2. Verify IAM permissions for SQS
3. Check Lambda/worker logs for errors
4. Ensure `OPENROUTER_API_KEY` is valid

### Job Status Stuck on "Processing"

1. Check worker logs for exceptions
2. Verify OpenRouter API is responsive
3. Check MongoDB connection
4. Review SQS visibility timeout settings

### Invalid JSON from OpenRouter

1. Verify `response_format: { type: "json_object" }` is set
2. Check system prompt for JSON instructions
3. Validate schema in prompt
4. Review OpenRouter model compatibility

---

**Last Updated**: January 2024
**Version**: 1.0.0
