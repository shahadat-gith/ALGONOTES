# Preparation Service

AI-powered interview preparation microservice for ALGONOTES.

The service analyzes a candidate's resume and job description, generates a personalized preparation roadmap, creates detailed study discussions for each topic, and provides an AI-powered chat for follow-up questions.

---

## Features

- Resume PDF parsing
- Job description analysis
- AI-powered resume & JD extraction
- Resume vs JD gap analysis
- Personalized interview preparation roadmap
- Lazy discussion generation for every topic
- AI mentor chat per topic
- Asynchronous processing using BullMQ
- JWT authentication
- MongoDB storage
- Redis-backed job queues

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- BullMQ
- Redis
- Google Gemini API
- pdf-parse
- Multer

---

## Architecture

```
                Resume + JD
                      │
                      ▼
          Create Application API
                      │
                      ▼
                MongoDB (processing)
                      │
                      ▼
                BullMQ Queue
                      │
                      ▼
             Application Worker
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
 Resume Extraction           JD Extraction
        │                           │
        └─────────────┬─────────────┘
                      ▼
              Resume Analysis
                      ▼
             Generate Topics
                      ▼
              Save Application
                      ▼
                 Ready
```

---

## Project Structure

```
src
├── ai
├── application
├── chat
├── config
├── jobs
├── middlewares
├── prompts
├── topic
├── utils
├── app.js
└── server.js
```

---

## Application Flow

```
Upload Resume + JD
        │
        ▼
Create Application
        │
        ▼
Status = processing
        │
        ▼
Application Queue
        │
        ▼
Application Worker
        │
        ▼
Extract Resume
        │
        ▼
Extract Job Description
        │
        ▼
Analyze Candidate
        │
        ▼
Generate Topics
        │
        ▼
Save Application
        │
        ▼
Status = ready
```

---

## Topic Flow

```
Open Topic
      │
      ▼
Discussion Exists?
      │
 ┌────┴─────┐
 │          │
Yes        No
 │          │
 ▼          ▼
Return   Queue Job
            │
            ▼
      Topic Worker
            │
            ▼
 Generate Discussion
            │
            ▼
 Save Discussion
            │
            ▼
        Status Ready
```

---

## Chat Flow

```
User Message
      │
      ▼
Load Topic
      │
      ▼
Load Previous Messages
      │
      ▼
Gemini
      │
      ▼
Save Conversation
      │
      ▼
Return Response
```

---

## API Endpoints

### Applications

| Method | Endpoint |
|---------|----------|
| POST | `/api/applications` |
| GET | `/api/applications` |
| GET | `/api/applications/:id` |
| GET | `/api/applications/:id/status` |
| DELETE | `/api/applications/:id` |

---

### Topics

| Method | Endpoint |
|---------|----------|
| GET | `/api/topics/application/:applicationId` |
| GET | `/api/topics/:id` |
| POST | `/api/topics/:id/generate` |
| GET | `/api/topics/:id/discussion` |
| PATCH | `/api/topics/:id/complete` |

---

### Chat

| Method | Endpoint |
|---------|----------|
| GET | `/api/chat/:topicId` |
| POST | `/api/chat/:topicId` |

---

## Environment Variables

```env
PORT=

DATABASE_URL=

JWT_SECRET=

REDIS_URL=

GEMINI_API_KEY=
```

---

## Installation

```bash
git clone <repository>

cd preparation

npm install
```

---

## Run

```bash
npm run dev
```

---

## Background Workers

The service starts two BullMQ workers automatically.

### Application Worker

- Resume extraction
- Job description extraction
- Resume analysis
- Topic generation

### Topic Worker

- Generates detailed discussion for a topic
- Stores discussion for future requests

---

## Authentication

Every request is authenticated using the JWT issued by the main ALGONOTES backend.

The service verifies the JWT locally using the shared secret.

---

## Processing Strategy

### Application

```
Create
    │
processing
    │
Queue
    │
Worker
    │
ready / failed
```

### Topic

```
Generate Discussion
        │
processing
        │
Queue
        │
Worker
        │
ready / failed
```

---

## Future Improvements

- Streaming AI responses
- Topic regeneration
- Interview quiz generation
- Flashcards
- Revision notes
- Voice interview
- Mock interview mode
- Analytics dashboard
- AWS SQS migration
- AWS Lambda deployment

---

## License

MIT