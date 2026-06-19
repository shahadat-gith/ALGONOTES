# AlgoNotes 🚀

AI-powered DSA and coding notes generation backend built with **Node.js, Express, MongoDB, Gemini API, AWS SQS, Cloudinary, and JWT authentication**.

---

## Features

* JWT-based authentication
* User registration and login
* Forgot/reset password flow
* AI-powered note generation
* Background jobs using AWS SQS
* MongoDB database with Mongoose
* image upload with cloudinary
* Email service using Nodemailer
* Gemini API integration
* Serverless backend `serverless-http`
* AWS Lambda for serverless hosting

---

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Zod
* Nodemailer
* Cloudinary
* Multer
* Google Gemini API
* AWS SQS
* Serverless HTTP

---

## Project Setup

Clone the repository:

```bash
git clone https://github.com/shahadat-gith/ALGONOTES.git
cd algonotes
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=8000

DATABASE_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/algonotes

JWT_SECRET=your_jwt_signature_hash_secret_key
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_FROM=no-reply@algonotes.in
MAIL_FROM_NAME=AlgoNotes

GEMINI_API_KEY=your_gemini_api_key

AWS_REGION=ap-south-1
AI_GENERATION_QUEUE_URL=your sqs url from aws console
```

Run development server:

```bash
npm run dev
```

Run production server:

```bash
npm start
```

---

## Available Scripts

```bash
npm run dev
```

Starts the backend using Nodemon.

```bash
npm start
```

Starts the backend using Node.js.

---

## Environment Variables

| Variable                  | Description                   |
| ------------------------- | ----------------------------- |
| `NODE_ENV`                | Application environment       |
| `PORT`                    | Server port                   |
| `DATABASE_URL`            | MongoDB connection URL        |
| `JWT_SECRET`              | Secret key for JWT signing    |
| `JWT_EXPIRES_IN`          | JWT expiry duration           |
| `CLOUDINARY_CLOUD_NAME`   | Cloudinary cloud name         |
| `CLOUDINARY_API_KEY`      | Cloudinary API key            |
| `CLOUDINARY_API_SECRET`   | Cloudinary API secret         |
| `MAIL_SERVER`             | SMTP server host              |
| `MAIL_PORT`               | SMTP server port              |
| `MAIL_USERNAME`           | SMTP email username           |
| `MAIL_PASSWORD`           | SMTP app password             |
| `MAIL_FROM`               | Sender email address          |
| `MAIL_FROM_NAME`          | Sender display name           |
| `GEMINI_API_KEY`          | Google Gemini API key         |
| `AWS_REGION`              | AWS region                    |
| `AI_GENERATION_QUEUE_URL` | AWS SQS queue URL for AI jobs |

---

# API Reference

All protected endpoints require a JWT token in the request header:

```http
Authorization: Bearer <your_jwt_token>
```

---

# Authentication Module

Base route:

```http
/api/v1/auth
```

---

## Register Account

```http
POST /api/v1/auth/register
```

Authentication: None

Request body:

```json
{
  "username": "shahadat_ali",
  "email": "shahadat@example.com",
  "password": "SecurePassword123"
}
```

Success response:

```json
{
  "success": true,
  "message": "User registered successfully."
}
```

---

## User Login

```http
POST /api/v1/auth/login
```

Authentication: None

Request body:

```json
{
  "email": "shahadat@example.com",
  "password": "SecurePassword123"
}
```

Success response:

```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "shahadat_ali",
    "email": "shahadat@example.com"
  }
}
```

---

## Forgot Password

```http
POST /api/v1/auth/forgot-password
```

Authentication: None

Request body:

```json
{
  "email": "shahadat@example.com"
}
```

Success response:

```json
{
  "success": true,
  "message": "Password reset token sent to your email registry."
}
```

---

## Reset Password

```http
POST /api/v1/auth/reset-password
```

Authentication: None

Request body:

```json
{
  "token": "reset_token_here",
  "new_password": "NewSecurePassword123"
}
```

Success response:

```json
{
  "success": true,
  "message": "Password reset completed successfully."
}
```

---

# Profile Module

Base route:

```http
/api/v1/users
```

---

## Get My Profile

```http
GET /api/v1/users/me
```

Authentication: Bearer Token

Success response:

```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "username": "shahadat_ali",
    "email": "shahadat@example.com",
    "createdAt": "2026-04-15T08:30:00.000Z"
  }
}
```

---

## Update My Profile

```http
PUT /api/v1/users/me
```

Authentication: Bearer Token

Request body:

```json
{
  "username": "shahadat_ali_updated"
}
```

Success response:

```json
{
  "success": true,
  "message": "Profile updated successfully.",
  "user": {
    "id": "user_id",
    "username": "shahadat_ali_updated",
    "email": "shahadat@example.com"
  }
}
```

---

# DSA Coding Notes Module

Base route:

```http
/api/v1/notes
```

---

## Generate AI Note

```http
POST /api/v1/notes/generate
```

Authentication: Bearer Token

Request body:

```json
{
  "problemLink": "https://leetcode.com/problems/two-sum/",
  "language": "C++",
  "userCode": "vector<int> twoSum(vector<int>& nums, int target) { ... }",
  "userNotes": "Tried using a hash map but edge cases with duplicates are tricky."
}
```

Success response:

```json
{
  "success": true,
  "message": "AI note generation queued.",
  "status": "processing",
  "id": "note_id"
}
```

---

## Check Note Generation Status

```http
GET /api/v1/notes/status/:note_id
```

Authentication: Bearer Token

Processing response:

```json
{
  "success": true,
  "status": "processing",
  "id": "note_id"
}
```

Failed response:

```json
{
  "success": true,
  "status": "failed",
  "message": "AI is currently experiencing high demand. Please try again in a few minutes.",
  "id": "note_id"
}
```

---

## Get All User Notes

```http
GET /api/v1/notes/user?page=1&size=10&search=LeetCode
```

Authentication: Bearer Token

Query parameters:

| Parameter |  Default | Description              |
| --------- | -------: | ------------------------ |
| `page`    |      `1` | Current page number      |
| `size`    |     `10` | Number of notes per page |
| `search`  | optional | Search keyword           |

Success response:

```json
{
  "success": true,
  "notes": [
    {
      "id": "note_id",
      "user_id": "user_id",
      "status": "draft",
      "problem": {
        "problemLink": "https://leetcode.com/problems/two-sum/",
        "title": "Two Sum",
        "platform": "LeetCode",
        "difficulty": "Easy"
      },
      "language": "C++",
      "createdAt": "2026-05-10T14:22:18.000Z",
      "updatedAt": "2026-05-10T14:23:05.000Z"
    }
  ],
  "pagination": {
    "totalItems": 1,
    "totalPages": 1,
    "currentPage": 1,
    "pageSize": 10,
    "hasNext": false,
    "hasPrevious": false
  }
}
```

---

## Get Single Note Details

```http
GET /api/v1/notes/:note_id
```

Authentication: Bearer Token

Success response:

```json
{
  "success": true,
  "note": {
    "id": "note_id",
    "status": "draft",
    "problem": {
      "problemLink": "https://leetcode.com/problems/two-sum/",
      "title": "Two Sum",
      "platform": "LeetCode",
      "difficulty": "Easy"
    },
    "note": {
      "intuition": "Use a hash map to look up the complement of each element instantly.",
      "edgeCases": ["Negative values", "Duplicate targets"],
      "mistakesToAvoid": ["Re-using the exact same index element twice."],
      "dryRun": ["nums = [2,7,11], target = 9 -> complement 7 found at index 1."],
      "bruteForce": "Nested loop strategy taking O(N^2) time.",
      "better": null,
      "optimalApproach": "Hash map single pass lookup taking O(N) time."
    },
    "language": "C++",
    "userCode": "vector<int> twoSum(vector<int>& nums, int target) { ... }",
    "userNotes": "Tried using a hash map but edge cases with duplicates are tricky."
  }
}
```

---

## Update Note

```http
PUT /api/v1/notes/:note_id
```

Authentication: Bearer Token

Request body:

```json
{
  "status": "final",
  "userNotes": "Reviewed and fully passed clean testing bounds."
}
```

Success response:

```json
{
  "success": true,
  "message": "Note updated successfully as final.",
  "note": {
    "id": "note_id",
    "status": "final"
  }
}
```

---

## Delete Note

```http
DELETE /api/v1/notes/:note_id
```

Authentication: Bearer Token

Success response:

```json
{
  "success": true,
  "message": "Note deleted successfully."
}
```

---

# Theory Guide Module

Base route:

```http
/api/v1/theory
```

---

## Generate AI Theory Note

```http
POST /api/v1/theory/generate
```

Authentication: Bearer Token

Request body:

```json
{
  "topic": "Compiler Design Precedence Graphs",
  "code_language": "C++",
  "instructions": "Explain basic node sequencing logic and trace assignment statement execution pipelines."
}
```

Success response:

```json
{
  "success": true,
  "message": "Your note is being created by our AI assistant.",
  "status": "processing",
  "id": "theory_id"
}
```

---

## Check Theory Generation Status

```http
GET /api/v1/theory/status/:theory_id
```

Authentication: Bearer Token

Success response:

```json
{
  "success": true,
  "status": "draft",
  "id": "theory_id"
}
```

---

## Upload Workspace Image

```http
POST /api/v1/theory/:theory_id/upload-image
```

Authentication: Bearer Token

Content type:

```http
multipart/form-data
```

File field:

```text
file
```

Success response:

```json
{
  "success": true,
  "imageUrl": "https://res.cloudinary.com/demo/image/upload/v12345/algonotes/theory_asset.png"
}
```

---

## Delete Workspace Image

```http
POST /api/v1/theory/:theory_id/delete-image
```

Authentication: Bearer Token

Request body:

```json
{
  "image_url": "https://res.cloudinary.com/demo/image/upload/v12345/algonotes/theory_asset.png"
}
```

Success response:

```json
{
  "success": true,
  "message": "Image asset completely cleared from remote storage."
}
```

---

## Get All User Theories

```http
GET /api/v1/theory/user?page=1&size=10&search=Precedence
```

Authentication: Bearer Token

Success response:

```json
{
  "success": true,
  "theories": [
    {
      "id": "theory_id",
      "user_id": "user_id",
      "status": "draft",
      "topic": "Compiler Design Precedence Graphs",
      "content": "# Precedence Graphs in Compilers..."
    }
  ],
  "pagination": {
    "totalItems": 1,
    "totalPages": 1,
    "currentPage": 1,
    "pageSize": 10
  }
}
```

---

## Get Single Theory Note Details

```http
GET /api/v1/theory/:theory_id
```

Authentication: Bearer Token

Success response:

```json
{
  "success": true,
  "theory": {
    "id": "theory_id",
    "status": "draft",
    "topic": "Compiler Design Precedence Graphs",
    "content": "# Precedence Graphs in Compilers\n\nPrecedence graphs illustrate statement execution constraints...",
    "createdAt": "2026-05-11T09:00:00.000Z",
    "updatedAt": "2026-05-11T09:01:15.000Z"
  }
}
```

---

## Update Theory Note

```http
PUT /api/v1/theory/:theory_id
```

Authentication: Bearer Token

Request body:

```json
{
  "content": "# Precedence Graphs in Compilers\n\nCorrect statement is y = x + z under undirected restrictions."
}
```

Success response:

```json
{
  "success": true,
  "message": "Study note updated successfully.",
  "theory": {
    "id": "theory_id",
    "status": "draft"
  }
}
```

---

## Delete Theory Note

```http
DELETE /api/v1/theory/:theory_id
```

Authentication: Bearer Token

Success response:

```json
{
  "success": true,
  "message": "Study note and all associated images deleted successfully."
}
```

---

# Prompt Optimization Module

Base route:

```http
/api/v1/prompt
```

---

## Start Prompt Optimization

```http
POST /api/v1/prompt/optimize-prompt
```

Authentication: Bearer Token

Request body:

```json
{
  "topic": "N-grams and Hidden Markov Models",
  "code_language": "Python",
  "instructions": "make a guide that shows probability chains and tag predictions"
}
```

Success response:

```json
{
  "success": true,
  "jobId": "job_id",
  "message": "Polishing task added successfully into background workers."
}
```

---

## Read Optimization Status

```http
GET /api/v1/prompt/optimize-prompt/status/:job_id
```

Authentication: Bearer Token

Success response:

```json
{
  "success": true,
  "status": "final",
  "optimizedInstructions": "### Optimized AI Request Instructions\n\n1. Core Fundamentals: Explain N-gram window sliding concepts clearly..."
}
```

---

# Health Routes

---

## Root Health Check

```http
GET /
```

Authentication: None

Success response:

```json
{
  "status": "healthy",
  "environment": "development"
}
```

---

## Service Health Check

```http
GET /health
```

Authentication: None

Success response:

```json
{
  "success": true,
  "status": "OK",
  "service": "algonotes-backend"
}
```

---

# Package Scripts

Your `package.json` contains:

```json
{
  "scripts": {
    "dev": "nodemon src/index.js",
    "start": "node src/index.js"
  }
}
```

---

# Dependencies

```json
{
  "@aws-sdk/client-sqs": "^3.1072.0",
  "@google/genai": "^2.9.0",
  "bcryptjs": "^3.0.3",
  "cloudinary": "^2.10.0",
  "cors": "^2.8.6",
  "dotenv": "^17.4.2",
  "express": "^5.2.1",
  "jsonwebtoken": "^9.0.3",
  "mongoose": "^9.7.1",
  "multer": "^2.2.0",
  "nodemailer": "^9.0.1",
  "serverless-http": "^4.0.0",
  "zod": "^4.4.3"
}
```

---

# Security Notes

Never commit your `.env` file to GitHub.

Add this to `.gitignore`:

```gitignore
node_modules
.env
.DS_Store
```

Use placeholder values in `.env.example`.

Example:

```env
NODE_ENV=development
PORT=8000
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM=no-reply@algonotes.in
MAIL_FROM_NAME=AlgoNotes
GEMINI_API_KEY=
AWS_REGION=ap-south-1
AI_GENERATION_QUEUE_URL=
```

---

# Author

Shahadat Ali
Computer Science and Engineering
National Institute of Technology, Silchar

---

# License

ISC
