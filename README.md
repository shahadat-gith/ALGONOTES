# ALGONOTES

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)

> **AI-Powered Learning Platform for Data Structures, Algorithms, and Computer Science Preparation**

ALGONOTES is an advanced platform designed to help students and professionals master algorithmic problem-solving, data structures, and computer science concepts through intelligent AI-powered note generation. Generate structured notes for LeetCode problems, theory concepts, and ace technical interviews with our comprehensive suite of tools.

## 🌟 Key Features

### 📝 AI-Powered Algorithmic Notes
- **Automated Note Generation**: Paste any LeetCode problem link and get beautifully structured study notes
- **Comprehensive Analysis**: 
  - Problem details (title, difficulty, constraints, test cases)
  - Solution intuition and edge cases
  - Brute force, optimized, and optimal approaches
  - Time and space complexity analysis
  - Clean, commented code solutions
  
### 📚 Theory Generation
- Generate detailed study guides for CS concepts (DSA, DBMS, OS, CN, etc.)
- Rich HTML formatted content with syntax-highlighted code blocks
- Organize and manage theoretical knowledge

### 💼 Interview Preparation
- Upload resume and job description for AI-powered interview roadmap
- Get personalized preparation topics
- AI-powered explanations for each interview topic
- Track interview preparation progress

### 🔗 LeetCode Integration
- Connect your LeetCode account
- Sync solved problems automatically
- Track contest rankings and skill tags
- Generate notes directly from your profile

### 📊 Dashboard & Analytics
- Personal dashboard with activity tracking
- Performance statistics and progress monitoring
- Recent activity timeline
- Problem-solving analytics

### 🎯 Additional Tools
- Prompt optimizer for refining study materials
- Code syntax highlighting
- Rich content editor for notes and theory
- User profile management

## 📊 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|----------|
| **Frontend** | React 18 | Modern UI framework |
| | Tailwind CSS | Utility-first styling |
| | Lucide React | Beautiful SVG icons |
| | Unified.js | Markdown processing |
| | Highlight.js | Code syntax highlighting |
| **Backend** | FastAPI/Python | REST API framework |
| | MongoDB | Document database |
| | Redis | Caching & job queue |
| | AWS SQS | Asynchronous messaging |
| **External Services** | Google Gemini API | AI note generation |
| | Cloudinary | Image/media hosting |
| **Dev Tools** | Docker | Containerization |
| | BullMQ | Job queue management |

### Language Composition
- **JavaScript**: 79.1% (Frontend)
- **Python**: 17.6% (Backend)
- **CSS**: 2.5% (Styling)
- **Other**: 0.8%

## 📁 Project Structure

```
ALGONOTES/
├── backend/                          # Python FastAPI backend
│   ├── app/
│   │   ├── config/                  # Configuration files (Gemini, Cloudinary, etc.)
│   │   ├── constants/               # Email templates and constants
│   │   ├── database/                # Database connection setup
│   │   ├── middlewares/             # Auth, error handling, metrics
│   │   ├── models/                  # MongoDB models (User, Note, Theory, etc.)
│   │   ├── routes/                  # API endpoints (auth, notes, theory, analytics, etc.)
│   │   ├── schemas/                 # Pydantic request/response schemas
│   │   ├── services/                # Business logic (email, security, analytics)
│   │   ├── sqs/                     # AWS SQS workers for async tasks
│   │   ├── prompts/                 # AI prompt templates
│   │   └── utils/                   # Helper utilities
│   ├── Dockerfile                   # Production Docker config
│   ├── docker-compose.yml           # Local development Docker setup
│   ├── main.py                      # FastAPI application entry point
│   └── requirements.txt             # Python dependencies
│
├── frontend/                         # React frontend
│   ├── src/
│   │   ├── api/                     # API client and endpoints
│   │   ├── components/
│   │   │   ├── auth/                # Login, signup, auth flows
│   │   │   ├── common/              # Shared components (header, footer, etc.)
│   │   │   ├── home/                # Homepage components
│   │   │   ├── layout/              # Layout wrappers
│   │   │   ├── leetcode/            # LeetCode integration components
│   │   │   ├── notes/               # Note generation and editing
│   │   │   ├── theory/              # Theory viewing and editing
│   │   │   ├── interview-prep/      # Interview preparation UI
│   │   │   ├── modals/              # Modal dialogs
│   │   │   └── skeletons/           # Loading skeleton screens
│   │   ├── pages/
│   │   │   ├── auth/                # Authentication pages
│   │   │   ├── dashboard/           # User dashboard
│   │   │   ├── notes/               # Notes management page
│   │   │   ├── theory/              # Theory management page
│   │   │   ├── leetcode/            # LeetCode setup page
│   │   │   ├── interview-prep/      # Interview prep page
│   │   │   ├── developer/           # Developer tools page
│   │   │   └── disclaimers/         # Terms and conditions
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── context/                 # React context for state management
│   │   ├── constants/               # App constants and config
│   │   ├── utils/                   # Utility functions
│   │   ├── App.jsx                  # Main app component
│   │   └── main.jsx                 # React DOM entry
│   ├── index.html                   # HTML template
│   └── package.json                 # Node dependencies
│
├── interview-prep-backend/          # Separate interview prep Node backend
│   ├── src/
│   │   ├── ai/                      # AI integration layer
│   │   ├── application/             # Application management
│   │   ├── chat/                    # Chat functionality
│   │   ├── topic/                   # Interview topic management
│   │   ├── jobs/                    # BullMQ job processors
│   │   ├── config/                  # Configuration
│   │   ├── middlewares/             # Express middlewares
│   │   ├── prompts/                 # AI prompts
│   │   └── utils/                   # Utilities
│   ├── app.js                       # Express app setup
│   └── server.js                    # Server entry point
│
├── docker-compose.yml               # Multi-service Docker orchestration
├── .gitignore                       # Git ignore rules
└── README.md                        # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 20+ (with npm)
- **Python** 3.8+
- **Docker** & **Docker Compose** (optional, for containerized setup)
- **Git**

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/shahadat-gith/ALGONOTES.git
cd ALGONOTES

# Copy environment template
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp interview-prep-backend/.env.example interview-prep-backend/.env

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# Interview Prep API: http://localhost:5000
```

### Option 2: Local Development Setup

#### Backend Setup
```bash
cd backend

# Create Python virtual environment
python -m venv venv
source venv/bin/activate  # or .\venv\Scripts\activate on Windows

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run backend server
python main.py
# Backend will be available at http://localhost:8000
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm start
# Frontend will be available at http://localhost:3000
```

#### Interview Prep Backend Setup
```bash
cd interview-prep-backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the server
npm run dev
# Interview prep backend will be available at http://localhost:5000
```

## ⚙️ Environment Configuration

### Backend (.env)
```env
# Server
PORT=8000

# Database
DATABASE_URL=mongodb://localhost:27017/algonotes

# Authentication
SECRET_KEY=your_super_secret_key_here
ALGORITHM=HS256
JWT_EXPIRATION=7d

# External Services
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AWS SQS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

### Frontend (.env)
```env
REACT_APP_BACKEND_URL=http://localhost:8000
REACT_APP_INTERVIEW_PREP_URL=http://localhost:5000
```

### Interview Prep Backend (.env)
```env
PORT=5000
DATABASE_URL=mongodb://localhost:27017/interview-prep
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
GEMINI_API_KEY=your_gemini_api_key
```

## 📚 Documentation

- **[Setup Guide](./docs/SETUP.md)** - Detailed installation and configuration
- **[Architecture](./docs/ARCHITECTURE.md)** - System design and components
- **[API Documentation](./docs/API.md)** - Complete REST API reference
- **[Contributing](./CONTRIBUTING.md)** - How to contribute to the project

## 🔌 Core APIs

### Notes Management
```
POST   /api/notes/generate      - Generate AI notes for a problem
POST   /api/notes               - Save a new note
GET    /api/notes/{id}          - Retrieve a note
PUT    /api/notes/{id}          - Update a note
DELETE /api/notes/{id}          - Delete a note
GET    /api/notes               - List user's notes (paginated)
```

### Theory Management
```
POST   /api/theory/generate     - Generate AI theory content
POST   /api/theory              - Save theory
GET    /api/theory/{id}         - Retrieve theory
PUT    /api/theory/{id}         - Update theory
DELETE /api/theory/{id}         - Delete theory
GET    /api/theory              - List user's theory notes
```

### Authentication
```
POST   /api/auth/register       - Register new user
POST   /api/auth/login          - Login user
POST   /api/auth/logout         - Logout user
GET    /api/auth/me             - Get current user
```

For detailed API documentation, see [API.md](./docs/API.md)

## 🎯 Usage Examples

### Generate DSA Notes
1. Navigate to the "Notes" section
2. Paste a LeetCode problem URL
3. Click "Generate"
4. Wait for AI to process (typically 30-60 seconds)
5. Review and edit the generated notes
6. Save to your collection

### Create Interview Prep Roadmap
1. Go to "Interview Prep"
2. Upload your resume (PDF)
3. Paste job description
4. Click "Start Analysis"
5. Wait for roadmap generation
6. Study each topic with AI explanations

### Generate Theory Notes
1. Go to "Theory" section
2. Enter topic name (e.g., "Binary Search Trees")
3. Click "Generate"
4. Get comprehensive study guide
5. Bookmark or download for later

## 🔐 Security Features

- **JWT-based authentication** with secure token management
- **Password hashing** using bcrypt
- **Protected endpoints** with middleware authentication
- **Rate limiting** on API endpoints
- **CORS configuration** for cross-origin requests
- **Environment variable** secrets management
- **Input validation** on all endpoints

## 🤝 Contributing

We welcome contributions! Please follow our [Contributing Guidelines](./CONTRIBUTING.md) to get started.

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

## 💬 Support & Feedback

- **Issues**: Report bugs via [GitHub Issues](https://github.com/shahadat-gith/ALGONOTES/issues)
- **Discussions**: Join our [GitHub Discussions](https://github.com/shahadat-gith/ALGONOTES/discussions)
- **Email**: [Contact Support](mailto:support@algonotes.in)

## 📈 Roadmap

- [ ] Mobile app (React Native)
- [ ] Offline mode support
- [ ] Advanced analytics dashboard
- [ ] Collaborative study groups
- [ ] Video tutorials integration
- [ ] Problem recommendations engine
- [ ] Progress tracking and certificates
- [ ] Export notes as PDF

## 🙏 Acknowledgments

- Built with ❤️ by the ALGONOTES team
- Powered by Google Gemini AI
- UI icons by Lucide React
- Styling with Tailwind CSS

---

**[⬆ back to top](#algonotes)**