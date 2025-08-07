<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Hotel Reservation Platform - Copilot Instructions

This is a full-stack hotel reservation platform built with React frontend and Node.js backend.

## Project Structure & Architecture

### Backend (Node.js + Express + PostgreSQL)

- **Database**: PostgreSQL with users and reservations tables
- **API Routes**: RESTful endpoints for users and reservations
- **Models**: Database interaction layer using node-postgres
- **Controllers**: Business logic for handling requests
- **UUID**: Reservations use UUIDs for security

### Frontend (React + Vite + Tailwind CSS)

- **Components**: Reusable UI components (Navbar, Footer)
- **Pages**: Home, Book, Search pages with routing
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React hooks for local state
- **API Communication**: Axios for HTTP requests

## Code Style & Conventions

### Backend

- Use async/await for database operations
- Implement proper error handling with try/catch
- Validate input data before database operations
- Return consistent JSON response formats
- Use meaningful HTTP status codes

### Frontend

- Use functional components with hooks
- Implement proper loading and error states
- Use Tailwind utility classes for styling
- Follow React best practices for state management
- Implement proper form validation

### Database

- Use prepared statements to prevent SQL injection
- Implement proper foreign key relationships
- Use indexes for performance optimization
- Follow PostgreSQL naming conventions

## Key Features to Maintain

1. **User Management**: Email and phone-based user creation
2. **Reservations**: Daily, weekly, monthly booking types
3. **Search**: Multi-criteria search functionality
4. **Validation**: Client and server-side validation
5. **Responsive Design**: Mobile-first approach

## Integration Points (Future)

The codebase is prepared for:

- Twilio SMS integration
- SendGrid email notifications
- Stripe payment processing
- JWT authentication middleware

## API Patterns

- POST /api/[resource] - Create
- GET /api/[resource] - List all
- GET /api/[resource]/:id - Get by ID
- PUT /api/[resource]/:id - Update
- DELETE /api/[resource]/:id - Delete
- GET /api/[resource]/search - Search with query params

When suggesting code changes:

1. Maintain the existing architecture patterns
2. Follow the established error handling approach
3. Keep API responses consistent
4. Ensure mobile responsiveness in UI changes
5. Implement proper loading states for async operations
