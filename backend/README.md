# Hotel Reservation Platform - Backend

A Node.js/Express backend API for the Hotel Reservation Platform.

## Features

- 🏨 Hotel reservation management
- 👥 User management (email and phone)
- 🔍 Advanced search functionality
- 📊 PostgreSQL database integration
- 🛡️ Input validation and error handling
- 📧 Ready for email integration (SendGrid)
- 📱 Ready for SMS integration (Twilio)
- 💳 Ready for payment integration (Stripe)

## API Endpoints

### Users

- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users
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

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:

   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. Set up PostgreSQL database:

   ```bash
   npm run setup-db
   ```

4. Start the server:
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

## Database Schema

### Users Table

- `id` - Serial primary key
- `email` - Unique email address
- `phone` - Unique phone number
- `created_at` - Timestamp

### Reservations Table

- `id` - UUID primary key
- `user_id` - Foreign key to users table
- `check_in` - Check-in date
- `check_out` - Check-out date
- `type` - Reservation type (daily, weekly, monthly)
- `created_at` - Timestamp

## Environment Variables

See `.env.example` for all required environment variables.

## Future Enhancements

- JWT authentication middleware
- SMS OTP verification
- Email notifications
- Payment processing
- Rate limiting
- API documentation with Swagger
