# 🏨 Hotel Reservation Platform - Local Development Setup

Your Hotel Reservation Platform is now configured for **local development on port 5000**!

## 🚀 Quick Start

```bash
# 1. Install all dependencies
npm run install-deps

# 2. Start both frontend and backend servers
npm run dev
```

**Your application will run on:**

- 🖥️ **Frontend**: http://localhost:5173 (Vite dev server)
- 🔧 **Backend API**: http://localhost:5000 (Express server)
- 📊 **Health Check**: http://localhost:5000/api/health

---

## 🗄️ Database Configuration

### Current Setup: SQLite (Perfect for Local Development)

- ✅ **No installation required** - SQLite comes built-in
- ✅ **No configuration needed** - works out of the box
- ✅ **File-based database** - stored in `backend/hotel_reservation.sqlite`
- ✅ **Zero maintenance** - perfect for development and testing

### Database Location:

```
backend/hotel_reservation.sqlite
```

---

## 🛠️ Available Scripts

```bash
# Development (starts both servers)
npm run dev

# Backend only (port 5000)
npm run backend

# Frontend only (port 5173)
npm run frontend

# Install all dependencies
npm run install-deps

# Build frontend for production
npm run build

# Setup database (creates tables)
npm run setup-db
```

---

## 🧪 Testing Your Application

### 1. Health Check

```bash
curl http://localhost:5000/api/health
```

### 2. Test API Endpoints

```bash
# Create a user
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"test@example.com","phone":"+1234567890"}'

# Create a reservation
curl -X POST http://localhost:5000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"test@example.com","phone":"+1234567890","checkIn":"2024-12-01","checkOut":"2024-12-03","type":"daily"}'

# Search reservations (by name, email, phone, or ID)
curl "http://localhost:5000/api/reservations/search?query=John"
curl "http://localhost:5000/api/reservations/search?query=John%20Doe"
curl "http://localhost:5000/api/reservations/search?query=test@example.com"
```

### 3. Test Frontend Features

1. **📱 Homepage**: http://localhost:5173
2. **📝 Book Reservation**: Click "Book Now" button
3. **🔍 Search Reservations**: Click "Search Reservations" button
4. **📊 Mobile Responsive**: Test on different screen sizes

---

## 📁 Project Structure

```
Hotel_management/
├── backend/                 # Node.js + Express API
│   ├── server.js           # Main server file (port 5000)
│   ├── db.js               # SQLite database connection
│   ├── hotel_reservation.sqlite  # Your database file
│   ├── models/             # Database models
│   ├── controllers/        # API logic
│   ├── routes/             # API routes
│   └── .env                # Backend environment variables
├── frontend/               # React + Vite + Tailwind
│   ├── src/
│   │   ├── App.jsx         # Main app component
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   └── utils/api.js    # API configuration
│   └── .env.local          # Frontend environment variables
└── package.json            # Root package file
```

---

## ⚙️ Environment Variables

### Backend (`.env`)

```bash
PORT=5000
DATABASE_URL=postgresql://localhost:5432/hotel_reservation  # Fallback to SQLite if not available
NODE_ENV=development

# Future integrations (add your keys when ready)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
SENDGRID_API_KEY=your_sendgrid_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### Frontend (`.env.local`)

```bash
VITE_API_URL=http://localhost:5000/api
```

---

## 🔧 Development Features

### Hot Reload

- ✅ **Frontend**: Automatic refresh on file changes
- ✅ **Backend**: Manual restart required (or use `nodemon`)

### Database

- ✅ **Automatic table creation** on first run
- ✅ **Data persistence** across server restarts
- ✅ **No migrations needed** for development

### API Features

- ✅ **CORS enabled** for frontend-backend communication
- ✅ **JSON body parsing**
- ✅ **Error handling middleware**
- ✅ **Health check endpoint**

---

## 🚨 Troubleshooting

### Port Issues

```bash
# If port 5000 is busy, check what's using it:
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process or change port in .env file
```

### Database Issues

```bash
# Reset database (deletes all data)
rm backend/hotel_reservation.sqlite
npm run setup-db
```

### API Connection Issues

```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Check frontend environment
cat frontend/.env.local
```

### Build Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install-deps
```

---

## 🎯 Development Workflow

1. **Start Development**: `npm run dev`
2. **Make Changes**: Edit files in `frontend/src/` or `backend/`
3. **Test Features**: Use the web interface or API endpoints
4. **Check Database**: SQLite data persists automatically
5. **Debug Issues**: Check terminal logs for errors

---

## 🎉 Features Ready to Use

- ✅ **User Registration** (first name, last name, email + phone)
- ✅ **Reservation Creation** (daily/weekly/monthly)
- ✅ **Reservation Search** (by name, email, phone, or ID)
- ✅ **Hotel Management** (CRUD operations for hotels)
- ✅ **Room Management** (CRUD operations and availability search)
- ✅ **Responsive Design** (mobile-first)
- ✅ **Error Handling** (user-friendly messages)
- ✅ **Data Validation** (client and server-side)

---

## 🚀 Ready for Production?

When you're ready to deploy, you have several options:

- 🌐 **Railway** (recommended for full-stack)
- 🎯 **Heroku** (classic choice)
- 🔥 **Netlify** (frontend) + **Railway** (backend)

But for now, enjoy developing locally on **port 5000**! 🎉

Happy coding! 🏨✨
