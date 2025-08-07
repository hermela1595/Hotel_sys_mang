# Hotel Reservation Platform

A full-stack hotel reservation platform built with React frontend and Node.js backend.

## 🏗️ Architecture

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + PostgreSQL
- **Features**: User management, reservations, search functionality

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Install dependencies for all projects:**

   ```bash
   npm run install-deps
   ```

2. **Set up environment variables:**

   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Set up the database:**

   ```bash
   cd backend
   npm run setup-db
   ```

4. **Start the development servers:**

   ```bash
   # From root directory
   npm run dev

   # Or start individually:
   # Backend (port 5000):
   npm run backend

   # Frontend (port 3000):
   npm run frontend
   ```

## 📚 Project Structure

```
hotel-reservation-platform/
├── 📄 package.json (workspace config)
├── 📁 backend/
│   ├── 📁 controllers/
│   │   ├── userController.js
│   │   └── reservationController.js
│   ├── 📁 routes/
│   │   ├── userRoutes.js
│   │   └── reservationRoutes.js
│   ├── 📁 models/
│   │   ├── User.js
│   │   └── Reservation.js
│   ├── 📁 scripts/
│   │   └── setupDatabase.js
│   ├── 📄 server.js
│   ├── 📄 db.js
│   └── 📄 package.json
└── 📁 frontend/
    ├── 📁 src/
    │   ├── 📁 components/
    │   │   ├── Navbar.jsx
    │   │   └── Footer.jsx
    │   ├── 📁 pages/
    │   │   ├── Home.jsx
    │   │   ├── Book.jsx
    │   │   └── Search.jsx
    │   ├── 📄 App.jsx
    │   └── 📄 main.jsx
    ├── 📄 index.html
    └── 📄 package.json
```

## 🔗 API Endpoints

### Users

- `POST /api/users` - Create a new user
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/email/:email` - Get user by email
- `GET /api/users/phone/:phone` - Get user by phone

### Reservations

- `POST /api/reservations` - Create a new reservation
- `GET /api/reservations` - Get all reservations
- `GET /api/reservations/:id` - Get reservation by ID
- `GET /api/reservations/search?query=...` - Search reservations
- `PUT /api/reservations/:id` - Update reservation
- `DELETE /api/reservations/:id` - Delete reservation

## 🎨 Frontend Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Navigation**: Clean navigation with active states
- **Booking Form**: Comprehensive reservation form with validation
- **Search Interface**: Advanced search with multiple criteria
- **Error Handling**: User-friendly error messages
- **Loading States**: Visual feedback for async operations

## 🛠️ Backend Features

- **RESTful API**: Clean and organized API endpoints
- **Database Models**: PostgreSQL models for users and reservations
- **Validation**: Input validation and error handling
- **Search**: Advanced search functionality
- **UUID Support**: Secure reservation IDs

## 🔧 Database Schema

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Reservations Table

```sql
CREATE TABLE reservations (
  id UUID PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  type VARCHAR(10) CHECK (type IN ('daily', 'weekly', 'monthly')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Future Enhancements

The platform is ready for these integrations:

- **SMS OTP**: Twilio integration for phone verification
- **Email Notifications**: SendGrid for booking confirmations
- **Payment Processing**: Stripe integration for secure payments
- **Authentication**: JWT-based user authentication
- **Admin Dashboard**: Management interface for hotel staff
- **Real-time Updates**: WebSocket notifications
- **Multi-language Support**: Internationalization
- **Mobile App**: React Native version

## 🔐 Environment Variables

Copy `backend/.env.example` to `backend/.env` and configure:

- Database connection
- Twilio credentials (for SMS)
- SendGrid API key (for emails)
- Stripe keys (for payments)
- JWT secret (for authentication)

## 📝 Development

### Backend Development

```bash
cd backend
npm run dev  # Start with nodemon for auto-reload
```

### Frontend Development

```bash
cd frontend
npm run dev  # Start Vite dev server
```

### Database Operations

```bash
cd backend
npm run setup-db  # Create tables and indexes
```

## 🧪 Testing the Application

1. **Start both servers** (backend on :5000, frontend on :3000)
2. **Visit** http://localhost:3000
3. **Test booking** by filling the reservation form
4. **Test search** with email, phone, or reservation ID
5. **Check backend** API at http://localhost:5000/api/health

## 📦 Build for Production

```bash
# Build frontend
cd frontend
npm run build

# Backend is production-ready
cd backend
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.
