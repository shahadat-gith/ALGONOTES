# 🏗️ ALGONOTES - Architecture Documentation

This document describes the technical architecture of ALGONOTES in depth, including system topology, request/data flows, and database relationships.

## Table of Contents
1. [System Overview](#system-overview)
2. [Frontend Architecture](#frontend-architecture)
3. [Backend Architecture (Python/FastAPI)](#backend-architecture-pythonfastapi)
4. [Interview Prep Backend (Node.js/Express)](#interview-prep-backend-nodejsexpress)
5. [Core Flows](#core-flows)
6. [Database Schema & Relationships](#database-schema--relationships)
7. [Deployment Topology](#deployment-topology)

---

## System Overview

ALGONOTES is split into three independently deployable services that share a single MongoDB database and communicate asynchronously via AWS SQS.

```mermaid
graph TB
    subgraph Client
        FE["Frontend (React)<br/>localhost:3000"]
    end

    subgraph Services
        BE["Backend API<br/>(Python/FastAPI)<br/>:8000"]
        IPB["Interview Prep API<br/>(Node.js/Express)<br/>:5000"]
    end

    subgraph Data
        DB[("MongoDB<br/>Shared Database")]
    end

    subgraph Async
        SQS["AWS SQS<br/>(Job Queue)"]
        W1["Application Worker"]
        W2["Topic / Explanation Worker"]
    end

    FE -->|REST| BE
    FE -->|REST| IPB
    BE --> DB
    IPB --> DB
    IPB -->|publish jobs| SQS
    SQS --> W1
    SQS --> W2
    W1 --> DB
    W2 --> DB
```

---

## Frontend Architecture

**Location**: `frontend/`

```mermaid
graph LR
    App["App.jsx"] --> Pages["pages/"]
    App --> Ctx["context/"]
    Pages --> Comp["components/"]
    Pages --> Hooks["hooks/"]
    Pages --> Services["services/ (API clients)"]
    Comp --> Styles["styles/ (Tailwind)"]
    Ctx --> Comp
    Services -->|Axios| API["Backend APIs"]
```

**State management**
- React Context API for global app state
- Local component state for UI-specific concerns
- API-level caching for optimized data fetching

---

## Backend Architecture (Python/FastAPI)

**Location**: `backend/`

### Layered request pipeline

```mermaid
flowchart TD
    A[HTTP Request] --> B[Route Handler]
    B --> C[Validation - Pydantic Schema]
    C --> D[Authentication Middleware]
    D --> E[Service Logic]
    E --> F[Database Query - Model]
    F --> G[Response Schema]
    G --> H[HTTP Response]
```

### Key components

```mermaid
graph TB
    subgraph backend/app
        Models["models/<br/>User, Note, Theory, Analytics, Temp"]
        Routes["routes/<br/>auth, notes, theory, analytics, prompt, leetcode, user"]
        Services["services/<br/>email, security, analytics, cloudinary"]
        Middlewares["middlewares/<br/>auth, error, metrics"]
        Config["config/<br/>settings, gemini, cloudinary, mailer"]
        Sqs["sqs/<br/>worker, dispatcher, handler, router"]
    end

    Routes --> Middlewares
    Routes --> Services
    Services --> Models
    Services --> Config
    Sqs --> Services
```

---

## Interview Prep Backend (Node.js/Express)

**Location**: `interview-prep-backend/`
**Pattern**: MVC with job queue via AWS SQS

```mermaid
flowchart TD
    R[Routes - HTTP Endpoints] --> C[Controllers - Request handling]
    C --> S[Services - Business logic]
    S --> M[Models - Data access]
    M --> DB[(MongoDB)]

    C -.publish job.-> Q[AWS SQS Queue]
    Q --> AW[Application Worker]
    Q --> TW[Topic Worker]
    Q --> EW[Explanation Worker]
    AW --> DB
    TW --> DB
    EW --> DB
```

### Key directories

```
interview-prep-backend/src/
├── ai/                # AI integration & LLM calls
├── application/        # Application module (model, controller, routes)
├── topic/               # Topic + explanation module
├── chat/                # Chat module
├── jobs/                # BullMQ processors (legacy/alternative)
├── config/              # env, db connection, etc.
├── middlewares/         # auth, error handling
├── sqs/                 # SQS client, publishers, workers/dispatcher
├── prompts/             # LLM prompt templates
├── utils/               # helpers
├── llm/                 # OpenRouter SDK setup + response generation
├── app.js               # Express app setup
├── server.js            # Server entry point
└── lambda.js            # AWS Lambda handler (HTTP + SQS dual mode)
```

---

## Core Flows

### 1. Application Processing Flow

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend
    participant API as Interview Prep API
    participant DB as MongoDB
    participant SQS as AWS SQS
    participant Worker as Application Worker
    participant LLM as LLM Provider

    User->>FE: Upload Resume + Job Description
    FE->>API: POST /api/applications
    API->>DB: Create Application (status: processing)
    API->>SQS: Publish job
    API-->>FE: 202 Accepted (applicationId)
    SQS->>Worker: Deliver job
    Worker->>Worker: Parse resume + JD text
    Worker->>LLM: Analyze resume vs job description
    LLM-->>Worker: ATS score, skills, recommendations, topics
    Worker->>DB: Update Application (status: completed)
    FE->>API: GET /api/applications/:id/status (poll)
    API-->>FE: status: completed
```

### 2. Topic Explanation Flow

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend
    participant API as Interview Prep API
    participant DB as MongoDB
    participant SQS as AWS SQS
    participant Worker as Explanation Worker
    participant LLM as LLM Provider

    User->>FE: Open topic for discussion
    FE->>API: GET /api/topics/:topicId/explanation-status
    alt Explanation exists (completed)
        API-->>FE: Return explanation
    else Explanation in progress
        API-->>FE: 202 Accepted
    else No / failed explanation
        FE->>API: POST /api/topics/:topicId/generate-explanation
        API->>SQS: Publish explanation job
        SQS->>Worker: Deliver job
        Worker->>LLM: Generate structured explanation
        LLM-->>Worker: Sections, code blocks, diagrams, tips
        Worker->>DB: Save Explanation (status: completed)
    end
    FE->>API: GET /api/topics/:topicId/explanation
    API-->>FE: Return prepared interview guide
```

### 3. Chat Flow

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend
    participant API as Interview Prep API
    participant DB as MongoDB
    participant LLM as LLM Provider

    User->>FE: Send chat message
    FE->>API: POST /api/chat/:topicId
    API->>DB: Load topic context + application details
    API->>DB: Load chat history
    API->>LLM: Send message + context + system prompt
    LLM-->>API: Assistant response
    API->>DB: Save user message + assistant response
    API-->>FE: Return response
    FE-->>User: Display AI reply
```

---

## Database Schema & Relationships

ALGONOTES uses MongoDB with Mongoose. The core collections relate as follows:

```mermaid
erDiagram
    USER ||--o{ APPLICATION : owns
    APPLICATION ||--o{ TOPIC : generates
    TOPIC ||--o| EXPLANATION : has
    TOPIC ||--o| CHAT : has

    USER {
        ObjectId _id
        string email
        string passwordHash
    }
    APPLICATION {
        ObjectId _id
        ObjectId user
        string company
        string role
        object analysis
        string status
        string failureReason
    }
    TOPIC {
        ObjectId _id
        ObjectId application
        number order
        string title
        string priority
        string reason
    }
    EXPLANATION {
        ObjectId _id
        ObjectId topic
        string status
        array tableOfContents
        array sections
    }
    CHAT {
        ObjectId _id
        ObjectId topic
        array messages
    }
```

### Indexes

| Collection | Index | Purpose |
|---|---|---|
| Applications | `user: 1, createdAt: -1` | List a user's applications, newest first |
| Applications | `status: 1` | Filter by processing status |
| Applications | `user: 1, status: 1` | Combined user + status queries |
| Topics | `application: 1, order: 1` | Ordered topics within an application |
| Chat | `topic: 1` (unique) | One chat thread per topic |
| Explanations | `topic: 1` (unique) | One explanation per topic |

---

## Deployment Topology

```mermaid
graph TB
    subgraph Users
        Browser["User Browser"]
    end

    subgraph CDN / Static Hosting
        FE["Frontend (React build)"]
    end

    subgraph Compute
        BE["Backend API<br/>(FastAPI, containerized)"]
        Lambda["Interview Prep API<br/>(AWS Lambda via lambda.js)"]
    end

    subgraph AWS
        SQS["SQS Queue"]
        DLQ["Dead Letter Queue"]
    end

    subgraph Data Layer
        Atlas[("MongoDB Atlas")]
    end

    Browser --> FE
    FE --> BE
    FE --> Lambda
    BE --> Atlas
    Lambda --> Atlas
    Lambda --> SQS
    SQS -->|retry exhausted| DLQ
    SQS --> Lambda
```

**Notes**
- The Interview Prep API can run either as a long-lived Express server or as an AWS Lambda function (dual mode via `lambda.js`), handling both HTTP requests and SQS-triggered invocations.
- SQS visibility timeout is set to 300 seconds to accommodate long-running LLM calls; a Dead Letter Queue captures messages that fail repeatedly.
- MongoDB Atlas (or a self-hosted MongoDB instance) is shared across both backend services.

---

For API endpoint details, environment variables, and setup instructions, see [`DOCUMENTATION.md`](./DOCUMENTATION.md) and [`README.md`](./README.md).
