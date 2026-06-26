# ALGONOTES

ALGONOTES is an advanced architectural tracker and sandbox platform designed to assist developers in generating, organizing, and managing algorithmic notes and theoretical concepts. It provides a structured environment for breaking down complex problems, exploring multiple solution approaches (brute force, optimized, optimal), and tracking progress with workspace metrics and compiler logs. The platform aims to streamline the learning and documentation process for competitive programming and general algorithm study, offering AI-assisted content generation and a user-friendly interface.

## Core Features

*   **AI-Powered Algorithmic Note Generation**: Automatically generates comprehensive notes for coding problems, including:
    *   Problem details: Title, link, platform, difficulty, description, constraints, test cases, expected complexities, and topics.
    *   Solution breakdown: Intuition, edge cases, common mistakes, and dry run steps.
    *   Multiple approach analysis: Detailed sections for Brute Force, Intermediate Optimized, and Optimal solutions, each with complexity analysis, descriptive text, code blocks, and step-by-step algorithms.
    *   User-friendly summaries: Polished, expanded, and layman-friendly translations of user observations.
*   **Theory Generation**: Capabilities for generating and managing theoretical concepts.
*   **LeetCode Integration**: Dedicated components for setting up and managing LeetCode problems.
*   **Dashboard & Analytics**: Provides user dashboards with summary statistics, recent activity, and analytics for tracking visits and engagement.
*   **Developer Tools**: Includes a dedicated developer page for advanced functionalities or insights.
*   **Workspace Metrics & Compiler Logs**: Offers "as-is" workspace metrics and compiler logs for tracking execution and performance.
*   **User & Authentication Management**: Supports user registration, login, and profile management.
*   **Dynamic Content Editing**: Features rich editors for notes and theory content.

## Tech Stack

| Category        | Component           | Description                                       |
| :-------------- | :------------------ | :------------------------------------------------ |
| **Languages**   | JavaScript          | Primary language for the frontend.                |
|                 | Python              | Primary language for the backend API.             |
| **Frontend**    | React               | JavaScript library for building user interfaces.  |
|                 | Tailwind CSS        | Utility-first CSS framework for styling.          |
|                 | Goober              | Small, fast, and modern CSS-in-JS library.        |
|                 | Lucide React        | Collection of beautiful and customizable SVG icons. |
|                 | Unified.js Ecosystem| Markdown parsing, processing, and rendering.      |
|                 | Highlight.js        | Syntax highlighting for code blocks.              |
| **Backend**     | Python Web Framework| (Inferred) Framework for building RESTful APIs.   |
| **Database**    | Unknown             | Database layer details are not specified.         |
| **Build Tools** | Rolldown            | (Inferred) Fast JavaScript bundler.               |

## Folder Structure

```
.
├── backend
│   ├── app
│   │   ├── config
│   │   ├── constants
│   │   ├── database
│   │   ├── middlewares
│   │   ├── models
│   │   ├── prompts
│   │   ├── routes
│   │   ├── schemas
│   │   ├── services
│   │   ├── sqs
│   │   └── utils
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   │   ├── auth
│   │   │   ├── common
│   │   │   ├── home
│   │   │   ├── layout
│   │   │   ├── leetcode
│   │   │   │   └── SetupForm.jsx
│   │   │   ├── logo
│   │   │   ├── modals
│   │   │   ├── notes
│   │   │   │   ├── details
│   │   │   │   └── editor
│   │   │   ├── skeletons
│   │   │   ├── theory
│   │   │   │   ├── editor
│   │   │   │   └── viewer
│   │   ├── constants
│   │   ├── context
│   │   ├── hooks
│   │   ├── pages
│   │   │   ├── auth
│   │   │   ├── dashboard
│   │   │   ├── developer
│   │   │   │   └── Developer.jsx
│   │   │   ├── disclaimers
│   │   │   │   └── Terms.jsx
│   │   │   ├── general
│   │   │   ├── home
│   │   │   ├── leetcode
│   │   │   ├── notes
│   │   │   ├── theory
│   │   ├── utils
```

## Installation & Setup Guide

Follow these steps to get ALGONOTES up and running on your local machine.

### Prerequisites

*   **Node.js**: Version 20 or higher (as indicated by `package-lock.json`).
*   **npm**: Comes with Node.js.
*   **Python**: Version 3.8 or higher.
*   **pip**: Python package installer.

### Backend Setup

1.  **Navigate to the backend directory**:
    ```bash
    cd backend
    ```
2.  **Create a Python virtual environment** (recommended):
    ```bash
    python -m venv venv
    ```
3.  **Activate the virtual environment**:
    *   On macOS/Linux:
        ```bash
        source venv/bin/activate
        ```
    *   On Windows:
        ```bash
        .\venv\Scripts\activate
        ```
4.  **Install Python dependencies**:
    ```bash
    pip install -r requirements.txt # Placeholder: Assuming a requirements.txt exists
    ```
5.  **Apply database migrations** (if applicable, placeholder):
    ```bash
    # Example: flask db upgrade or alembic upgrade head
    ```
6.  **Run the backend server**:
    ```bash
    python app/main.py # Placeholder: Adjust based on actual entry point
    ```

### Frontend Setup

1.  **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```
2.  **Install Node.js dependencies**:
    ```bash
    npm install
    # or yarn install
    ```
3.  **Run the frontend development server**:
    ```bash
    npm start
    # or yarn start
    ```

The frontend application should now be accessible in your web browser, typically at `http://localhost:3000`.

## Environment Variables Configuration

Both the frontend and backend require specific environment variables to be configured. Create `.env` files in the respective `backend` and `frontend` directories based on the templates below.

### Backend (`backend/.env`)

```env
# Server Configuration
PORT=8000 # Default port for the backend API

# Database Configuration (Example - adjust based on actual DB)
DATABASE_URL="sqlite:///./sql_app.db" # Example for SQLite, use appropriate URL for PostgreSQL/MySQL

# Authentication & Security
SECRET_KEY="your_super_secret_key_here" # Used for session management, JWTs, etc.
ALGORITHM="HS256" # Algorithm for JWTs

# AWS SQS Configuration (if backend/app/sqs is active)
AWS_REGION="your-aws-region"
AWS_ACCESS_KEY_ID="your_aws_access_key_id"
AWS_SECRET_ACCESS_KEY="your_aws_secret_access_key"

# AI/LLM Service Configuration (if applicable for prompt generation)
# AI_API_KEY="your_ai_service_api_key"
# AI_MODEL_NAME="gpt-4o"
```

### Frontend (`frontend/.env`)

```env
# Frontend Server Configuration
PORT=3000 # Default port for the frontend application

# Backend API URL
REACT_APP_BACKEND_URL="http://localhost:8000" # URL of your running backend API
```

## API Documentation

The backend exposes various endpoints for managing users, notes, theory, and analytics. Below are the discovered schemas and inferred API functionalities.

### Schemas

*   **`UserResponse`**: Represents a user's profile or details.
*   **`DashboardSummaryStats`**: Aggregated statistics for the user dashboard.
*   **`DashboardRecentActivityItem`**: An individual item representing recent user activity.
*   **`DashboardResponse`**: The complete dashboard data structure, potentially combining summary stats and recent activity.
*   **`DashboardEnvelope`**: A wrapper for dashboard responses.
*   **`GenerateNoteRequest`**: Request payload for initiating the generation of an algorithmic note.
*   **`SaveNoteRequest`**: Request payload for saving a newly generated or updated note.
*   **`ProblemDetailSchema`**: Detailed structure for a coding problem, including title, link, platform, difficulty, description, constraints, test cases, and complexities.
*   **`NoteContentSchema`**: The comprehensive structure for the generated algorithmic note content.
    *   **`problem`**: Contains `ProblemDetailSchema` fields.
    *   **`note`**: Contains `intuition`, `edgeCases`, `mistakesToAvoid`, `dryRun` steps.
    *   **`bruteForce`**: Optional. Includes `complexity` (`time`, `space`), `description`, `codeBlock` (`language`, `code`), `algorithmSteps`.
    *   **`better`**: Optional. Includes `complexity` (`time`, `space`), `description`, `codeBlock` (`language`, `code`), `algorithmSteps`.
    *   **`optimalApproach`**: Optional. Includes `complexity` (`time`, `space`), `description`, `codeBlock` (`language`, `code`), `algorithmSteps`.
    *   **`userNotes`**: A string for polished user observations.
*   **`NoteResponse`**: The response payload containing a generated or retrieved note.
*   **`NoteUpdate`**: Request payload for updating an existing note.
*   **`GenerateTheoryRequest`**: Request payload for initiating the generation of theoretical content.
*   **`TheoryResponse`**: The response payload containing generated or retrieved theory.
*   **`TheoryUpdate`**: Request payload for updating existing theory content.
*   **`AnalyticsStatsResponse`**: Statistics related to application analytics.
*   **`AnalyticsStatsEnvelope`**: A wrapper for analytics statistics responses.
*   **`AnalyticsVisitTrackingResponse`**: Response for tracking user visits or interactions.

### Inferred API Endpoints (Examples)

Based on the schemas and folder structure (`backend/app/routes`), the following API endpoints are inferred:

*   **`POST /api/notes/generate`**
    *   **Description**: Generates a new algorithmic note based on problem details.
    *   **Request Body**: `GenerateNoteRequest`
    *   **Response Body**: `NoteResponse` (containing `NoteContentSchema`)
*   **`POST /api/notes`**
    *   **Description**: Saves a new algorithmic note.
    *   **Request Body**: `SaveNoteRequest`
    *   **Response Body**: `NoteResponse`
*   **`PUT /api/notes/{note_id}`**
    *   **Description**: Updates an existing algorithmic note.
    *   **Request Body**: `NoteUpdate`
    *   **Response Body**: `NoteResponse`
*   **`GET /api/notes/{note_id}`**
    *   **Description**: Retrieves a specific algorithmic note.
    *   **Response Body**: `NoteResponse`
*   **`POST /api/theory/generate`**
    *   **Description**: Generates new theoretical content.
    *   **Request Body**: `GenerateTheoryRequest`
    *   **Response Body**: `TheoryResponse`
*   **`PUT /api/theory/{theory_id}`**
    *   **Description**: Updates existing theoretical content.
    *   **Request Body**: `TheoryUpdate`
    *   **Response Body**: `TheoryResponse`
*   **`GET /api/dashboard`**
    *   **Description**: Retrieves user dashboard summary and activity.
    *   **Response Body**: `DashboardResponse`
*   **`GET /api/analytics/stats`**
    *   **Description**: Retrieves application analytics statistics.
    *   **Response Body**: `AnalyticsStatsResponse`
*   **`POST /api/analytics/track-visit`**
    *   **Description**: Tracks user visits or specific interactions.
    *   **Response Body**: `AnalyticsVisitTrackingResponse`
*   **`GET /api/users/{user_id}`**
    *   **Description**: Retrieves user details.
    *   **Response Body**: `UserResponse`

## Usage Instructions

Once both the frontend and backend servers are running:

1.  **Access the Application**: Open your web browser and navigate to `http://localhost:3000` (or the port configured in `frontend/.env`).
2.  **Authentication**: Register a new account or log in if you already have one.
3.  **Generate Notes**:
    *   Navigate to the "LeetCode" or "Notes" section.
    *   Use the "Setup Form" (e.g., `frontend/src/components/leetcode/SetupForm.jsx`) to input problem details.
    *   Trigger the note generation process, which will leverage the AI backend to produce a detailed algorithmic note.
4.  **Explore Notes & Theory**: View, edit, and manage your generated algorithmic notes and theoretical content.
5.  **Monitor Progress**: Check the "Dashboard" for an overview of your activity and statistics.
6.  **Developer Insights**: Access the "Developer" page (`frontend/src/pages/developer/Developer.jsx`) for any specific tools or information provided for developers.
7.  **Review Disclaimers**: Familiarize yourself with the service scope limitations and terms on the "Disclaimers" page (`frontend/src/pages/disclaimers/Terms.jsx`).

## Contributing

We welcome contributions to ALGONOTES! If you'd like to contribute, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and ensure they adhere to the project's coding standards.
4.  Write clear, concise commit messages.
5.  Submit a pull request with a detailed description of your changes.

## License

This project is licensed under the MIT License. See the `LICENSE` file in the root of the repository for more details.