# ALGONOTES API Documentation

Complete REST API reference for ALGONOTES backend services.

## Table of Contents
1. [Base URLs](#base-urls)
2. [Authentication](#authentication)
3. [Response Format](#response-format)
4. [Error Handling](#error-handling)
5. [Authentication Endpoints](#authentication-endpoints)
6. [Notes Endpoints](#notes-endpoints)
7. [Theory Endpoints](#theory-endpoints)
8. [User Endpoints](#user-endpoints)
9. [Dashboard Endpoints](#dashboard-endpoints)
10. [Analytics Endpoints](#analytics-endpoints)
11. [Rate Limiting](#rate-limiting)

---

## Base URLs

### Main Backend
- **Development**: `http://localhost:8000`
- **Production**: `https://api.algonotes.in`
- **API Docs**: `/docs` (Swagger UI)
- **Alternative Docs**: `/redoc` (ReDoc)

### Interview Prep Backend
- **Development**: `http://localhost:5000`
- **Production**: `https://interview-api.algonotes.in`

---

## Authentication

### JWT Bearer Token

All protected endpoints require JWT authentication in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Getting a Token

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

### Token Expiration

- **Expiration Time**: 7 days (configurable)
- **Refresh**: Re-login to get new token
- **Revocation**: Logout to invalidate token

---

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid request parameters",
    "details": {
      "field": "email",
      "issue": "Email format is invalid"
    }
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

---

## Error Handling

### Common Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 202 | Accepted | Request accepted (async processing) |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Service temporarily unavailable |

### Error Codes

| Error Code | HTTP | Meaning |
|-----------|------|----------|
| `INVALID_REQUEST` | 400 | Request validation failed |
| `INVALID_CREDENTIALS` | 401 | Email or password incorrect |
| `INVALID_TOKEN` | 401 | JWT token invalid or expired |
| `INSUFFICIENT_PERMISSIONS` | 403 | User lacks required permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `DUPLICATE_RESOURCE` | 409 | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Authentication Endpoints

### Register New User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation Rules**:
- Email: Valid email format, unique
- Password: Minimum 8 characters
- Name: Non-empty string

---

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-01T10:00:00Z"
    }
  }
}
```

---

### Logout

```http
POST /api/auth/logout
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Get Current User

```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "profile": {
      "avatar": "https://...",
      "bio": "Developer and algorithms enthusiast"
    },
    "settings": {
      "notifications": true,
      "theme": "dark"
    }
  }
}
```

---

## Notes Endpoints

### Generate Note

Generate AI-powered notes for a coding problem.

```http
POST /api/notes/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "problemUrl": "https://leetcode.com/problems/two-sum/",
  "platform": "leetcode",
  "notes": "Initial observations about the problem"
}
```

**Response** (202 Accepted):
```json
{
  "success": true,
  "data": {
    "jobId": "job-123456",
    "status": "processing",
    "message": "Note generation started, check status for updates"
  }
}
```

**Polling for Results**:
```http
GET /api/notes/generate/status/{jobId}
Authorization: Bearer <token>
```

**Response** (when ready, 200 OK):
```json
{
  "success": true,
  "data": {
    "noteId": "note-507f1f77bcf86cd799439011",
    "status": "completed",
    "content": { ... }
  }
}
```

---

### Save Note

Save a generated or custom note.

```http
POST /api/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Two Sum Solution",
  "content": {
    "problem": { ... },
    "note": { ... },
    "bruteForce": { ... },
    "optimalApproach": { ... }
  },
  "tags": ["array", "hash-table"],
  "difficulty": "Easy"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Two Sum Solution",
    "status": "published",
    "createdAt": "2024-01-01T12:00:00Z",
    "updatedAt": "2024-01-01T12:00:00Z"
  }
}
```

---

### Get Note by ID

```http
GET /api/notes/{noteId}
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "userId": "user-id",
    "title": "Two Sum Solution",
    "content": { ... },
    "tags": ["array", "hash-table"],
    "likes": 15,
    "views": 250,
    "status": "published",
    "createdAt": "2024-01-01T12:00:00Z",
    "updatedAt": "2024-01-01T12:00:00Z"
  }
}
```

---

### List User Notes

```http
GET /api/notes?page=1&size=10&sortBy=createdAt&order=desc
Authorization: Bearer <token>
```

**Query Parameters**:
- `page` (int): Page number (default: 1)
- `size` (int): Items per page (default: 10, max: 100)
- `sortBy` (string): Sort field (createdAt, title, views, likes)
- `order` (string): Sort order (asc, desc)
- `tags` (string): Filter by tags (comma-separated)
- `search` (string): Search in title and content

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "notes": [
      { ... },
      { ... }
    ],
    "pagination": {
      "totalItems": 25,
      "totalPages": 3,
      "currentPage": 1,
      "pageSize": 10,
      "hasNext": true,
      "hasPrevious": false
    }
  }
}
```

---

### Update Note

```http
PUT /api/notes/{noteId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": { ... },
  "tags": ["array"],
  "status": "draft"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Updated Title",
    "updatedAt": "2024-01-01T13:00:00Z"
  },
  "message": "Note updated successfully"
}
```

---

### Delete Note

```http
DELETE /api/notes/{noteId}
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Note deleted successfully"
}
```

---

### Like Note

```http
POST /api/notes/{noteId}/like
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "liked": true,
    "likeCount": 16
  }
}
```

---

## Rate Limiting

### Limits Applied

- **Per IP**: 100 requests/minute
- **Per User**: 1,000 requests/hour
- **Per Endpoint**: Varies by endpoint

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

### Exceeding Limits

When rate limit exceeded:

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Try again in 60 seconds."
  },
  "retryAfter": 60
}
```

---

## Best Practices

1. **Always include Authorization header** for protected endpoints
2. **Handle rate limiting** - implement exponential backoff
3. **Validate input** on client side before sending
4. **Use pagination** for large result sets
5. **Cache responses** where appropriate
6. **Monitor API quota** usage
7. **Report errors** with proper error codes
8. **Use HTTPS** in production

---

## Support

- **Issues**: https://github.com/shahadat-gith/ALGONOTES/issues
- **Email**: support@algonotes.in
- **Documentation**: https://docs.algonotes.in

---

**Last Updated**: January 2024
**API Version**: v1.0.0