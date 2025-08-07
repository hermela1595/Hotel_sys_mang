# 🚀 Production Database Setup Guide

This guide helps you set up a production database for your Hotel Reservation Platform.

## 🎯 Database Options

### Option 1: PostgreSQL (Recommended)
**Best for**: Production applications, complex queries, ACID compliance

#### Free PostgreSQL Hosting Options:

1. **Vercel Postgres** (Recommended)
   ```bash
   # After deploying to Vercel
   vercel env add DATABASE_URL
   # Enter your PostgreSQL connection string
   ```

2. **Railway PostgreSQL**
   - Go to [railway.app](https://railway.app)
   - Create new project → Add PostgreSQL
   - Copy the DATABASE_URL from environment variables

3. **Heroku Postgres**
   ```bash
   # If using Heroku
   heroku addons:create heroku-postgresql:mini
   heroku config:get DATABASE_URL
   ```

4. **Supabase** (Free tier available)
   - Go to [supabase.com](https://supabase.com)
   - Create project → Settings → Database
   - Copy connection string

#### Setup Steps:
1. Get your PostgreSQL connection string
2. Set environment variable:
   ```bash
   DATABASE_URL=postgresql://user:password@host:port/database
   ```
3. Run setup script:
   ```bash
   npm run setup-postgresql
   ```

---

### Option 2: MongoDB (Alternative)
**Best for**: Flexible schemas, document-based data, rapid development

#### Free MongoDB Hosting:

1. **MongoDB Atlas** (500MB free)
   - Go to [cloud.mongodb.com](https://cloud.mongodb.com)
   - Create cluster → Connect → Connection string
   - Copy the connection string

#### Setup Steps:
1. Get your MongoDB connection string
2. Set environment variable:
   ```bash
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/hoteldb
   ```
3. Run setup script:
   ```bash
   npm run setup-mongodb
   ```

---

### Option 3: SQLite (Development Only)
**Best for**: Local development, testing, prototyping

- No setup required
- Automatically used when no DATABASE_URL or MONGODB_URI is provided
- **Not recommended for production**

---

## 🔧 Platform-Specific Setup

### Vercel Deployment
```bash
# 1. Set environment variables
vercel env add DATABASE_URL
vercel env add NODE_ENV production

# 2. Deploy
vercel --prod
```

### Railway Deployment
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login and deploy
railway login
railway link
railway up

# 3. Add PostgreSQL service
railway add postgresql
```

### Heroku Deployment
```bash
# 1. Create Heroku app
heroku create your-hotel-app

# 2. Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# 3. Deploy
git push heroku main
```

### Netlify (Frontend only)
```bash
# Set environment variables in Netlify dashboard
# Site settings → Environment variables
VITE_API_URL=https://your-backend-url.com/api
```

---

## 🛠️ Manual Database Setup

### PostgreSQL Manual Setup
```sql
-- Connect to your PostgreSQL database and run:
\i backend/scripts/setup-postgresql.sql
```

### MongoDB Manual Setup
```javascript
// Run the setup script
node backend/scripts/setupMongoDB.js
```

---

## 🔍 Testing Your Database

### Health Check
```bash
# Test database connection
curl https://your-app-url.com/health
```

### API Tests
```bash
# Test user creation
curl -X POST https://your-app-url.com/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","phone":"+1234567890"}'

# Test reservation creation
curl -X POST https://your-app-url.com/api/reservations \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","phone":"+1234567890","checkIn":"2024-12-01","checkOut":"2024-12-03","type":"daily"}'
```

---

## 🎉 Quick Start Commands

Add these to your `package.json` scripts:

```json
{
  "scripts": {
    "setup-postgresql": "node backend/scripts/setupPostgreSQL.js",
    "setup-mongodb": "node backend/scripts/setupMongoDB.js",
    "deploy:vercel": "vercel --prod",
    "deploy:railway": "railway up",
    "deploy:heroku": "git push heroku main"
  }
}
```

---

## 🚨 Important Notes

1. **Environment Variables**: Never commit `.env` files with real credentials
2. **SSL**: Production databases require SSL connections
3. **Backups**: Set up automated backups for production
4. **Monitoring**: Monitor database performance and connections
5. **Security**: Use strong passwords and restrict database access

---

## 🆘 Troubleshooting

### Common Issues:

1. **Connection Refused**
   - Check if DATABASE_URL is correct
   - Verify firewall/network settings
   - Ensure SSL configuration

2. **Authentication Failed**
   - Verify username/password
   - Check database permissions
   - Confirm SSL requirements

3. **Table Not Found**
   - Run database setup scripts
   - Check if migrations completed
   - Verify schema creation

### Get Help:
- Check application logs: `vercel logs` or `railway logs`
- Test connection locally first
- Verify environment variables are set correctly

---

Choose your preferred database option and follow the setup guide above! 🎯
