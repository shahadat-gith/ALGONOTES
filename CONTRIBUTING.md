# Contributing to ALGONOTES

Thank you for considering contributing to ALGONOTES! We're excited to have community members help improve the platform. This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:
- Be respectful and inclusive
- Welcome all skill levels
- Focus on constructive feedback
- Report harassment or inappropriate behavior

## Getting Started

### Fork and Clone
```bash
# Fork the repository on GitHub
# Then clone your fork locally
git clone https://github.com/YOUR_USERNAME/ALGONOTES.git
cd ALGONOTES

# Add upstream remote
git remote add upstream https://github.com/shahadat-gith/ALGONOTES.git
```

### Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# or for bug fixes:
git checkout -b fix/bug-description
```

## Development Setup

### Full Stack Development
```bash
# Follow the setup guide in SETUP.md
# Ensure all three parts are running:
# - Backend (Python/FastAPI)
# - Frontend (React)
# - Interview Prep Backend (Node.js)
```

### Running Tests
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test

# Interview prep backend tests
cd interview-prep-backend
npm test
```

## Contribution Types

### Bug Fixes
1. Identify the bug clearly
2. Create an issue first (if not already existing)
3. Reference the issue in your PR
4. Include test cases demonstrating the fix

### Features
1. Discuss the feature in an issue first
2. Get approval from maintainers
3. Implement following the coding standards
4. Add tests and documentation
5. Update README if necessary

### Documentation
1. Fix typos and improve clarity
2. Add missing documentation
3. Improve code comments
4. Update API documentation
5. Add helpful examples

### Performance Improvements
1. Profile and identify bottlenecks
2. Implement optimization
3. Show before/after metrics
4. Ensure no regression in functionality

## Coding Standards

### Python (Backend)
```python
# Follow PEP 8 conventions
# Use type hints
# Keep functions focused and small
# Add docstrings to functions and classes
# Use meaningful variable names

def process_note(note_id: str) -> dict:
    """
    Process and generate AI insights for a note.
    
    Args:
        note_id: The ID of the note to process
        
    Returns:
        dict: Processed note data with AI insights
    """
    pass
```

### JavaScript/React (Frontend)
```javascript
// Use ES6+ features
// Use meaningful component and variable names
// Add JSDoc comments for functions
// Keep components focused and reusable
// Use proper error handling

/**
 * NoteCard component - Displays a single note
 * @param {Object} note - The note data
 * @param {string} note.id - Note ID
 * @param {string} note.title - Note title
 * @param {Function} onEdit - Callback for edit action
 */
const NoteCard = ({ note, onEdit }) => {
  // Component implementation
};
```

### Commit Messages
```bash
# Use clear, concise commit messages
# Format: type(scope): subject

# Examples:
git commit -m "feat(notes): add note filtering functionality"
git commit -m "fix(auth): resolve token expiration issue"
git commit -m "docs: update API documentation"
git commit -m "refactor(backend): optimize database queries"
git commit -m "test(frontend): add tests for note editor"

# Types:
# - feat: new feature
# - fix: bug fix
# - docs: documentation
# - style: code style (no logic change)
# - refactor: code refactoring
# - perf: performance improvement
# - test: tests
# - chore: build, dependencies
```

## Pull Request Process

### Before Submitting
1. **Update your branch**: `git pull upstream main`
2. **Test thoroughly**: Run all tests locally
3. **Lint code**: Follow project standards
4. **Update documentation**: Include any relevant changes
5. **Add/update tests**: Ensure code coverage

### PR Template
```markdown
## Description
Brief description of changes

## Related Issue
Fixes #(issue number)

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran

## Testing Checklist
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] No console errors
- [ ] Responsive design verified (if UI change)

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests pass locally
```

### Review Process
1. At least one maintainer will review
2. Address feedback and re-request review
3. Squash commits if requested
4. Merge once approved

## Issue Reporting

### Bug Reports
Include:
- Clear title describing the bug
- Step-by-step reproduction
- Expected vs actual behavior
- Environment details (OS, browser, etc.)
- Screenshots if applicable
- Error logs or stack traces

### Feature Requests
Include:
- Clear description of feature
- Why this feature would be useful
- Possible implementation approach
- Any related issues or alternatives

## Development Workflow

### Backend Development
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # or .\venv\Scripts\activate on Windows

# Install dev dependencies
pip install -r requirements.txt
pip install pytest black flake8 mypy

# Format code
black app/

# Lint code
flake8 app/

# Type check
mypy app/

# Run tests
pytest

# Run server
python main.py
```

### Frontend Development
```bash
cd frontend

# Install dependencies
npm install

# Format code
npm run format

# Lint code
npm run lint

# Run tests
npm test

# Run dev server
npm run dev
```

### Interview Prep Backend Development
```bash
cd interview-prep-backend

# Install dependencies
npm install

# Format code
npm run format

# Lint code
npm run lint

# Run tests
npm test

# Run dev server
npm run dev
```

## Database Migrations

For any database schema changes:

### Python Backend
```bash
# Create migration
alembic revision --autogenerate -m "Add new field"

# Review the migration file
# Then apply it
alembic upgrade head
```

### Node.js Backend
Follow your migration tool's documentation (if applicable)

## Documentation Contributions

### Adding New Docs
1. Create markdown file in `docs/` directory
2. Follow markdown best practices
3. Include code examples where relevant
4. Add table of contents for longer docs
5. Link to related documentation

### Updating Existing Docs
1. Keep content accurate and current
2. Fix typos and improve clarity
3. Add missing information
4. Update examples when applicable

## Performance Guidelines

### Frontend
- Optimize images and assets
- Use code splitting for large bundles
- Minimize re-renders in React
- Lazy load components when possible
- Profile with Chrome DevTools

### Backend
- Use database indexes effectively
- Implement caching where appropriate
- Optimize API response payloads
- Use pagination for large datasets
- Profile with Python profilers

## Security Considerations

- Never commit secrets or API keys
- Use environment variables
- Validate all user inputs
- Sanitize database queries
- Follow OWASP guidelines
- Report security issues privately

## Getting Help

- **Documentation**: Check [docs/](./docs/) directory
- **Issues**: Search existing issues first
- **Discussions**: Start a discussion for questions
- **Chat**: Join our community chat (if applicable)

## Recognized Contributors

We recognize all contributions through:
- GitHub contributors list
- CONTRIBUTORS.md file
- Release notes acknowledgments

## Questions?

- Open a discussion in GitHub
- Check existing documentation
- Ask in PR reviews
- Reach out to maintainers

---

**Thank you for contributing to ALGONOTES! 🎉**

Your efforts help make technical education more accessible to everyone.