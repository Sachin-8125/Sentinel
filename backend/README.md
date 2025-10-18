# Sentinel Backend API

Space Health Monitoring System - Backend Server

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh) v1.3.0 or higher
- PostgreSQL database (Neon recommended)
- Node.js 18+ (if not using Bun)

### Installation

1. **Install dependencies:**
```bash
bun install
```

2. **Set up environment variables:**

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@your-neon-host.aws.neon.tech/neondb?sslmode=require"

# JWT Secret (generate a strong random string)
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-long"

# Server Configuration
PORT=3001
NODE_ENV=development
```

**⚠️ Important Notes:**
- For Neon databases, always use the **pooled connection string** (ends with `-pooler`)
- Add `?sslmode=require` to your DATABASE_URL
- Generate a secure JWT_SECRET using: `openssl rand -base64 32`

3. **Set up the database:**

```bash
# Generate Prisma Client
bun prisma generate

# Run migrations
bun prisma migrate deploy

# (Optional) View database in Prisma Studio
bun prisma studio
```

4. **Test the connection:**

```bash
bun run src/test-connection.ts
```

This will verify:
- Environment variables are set correctly
- Database connection is working
- All required tables exist

### Running the Server

**Development mode:**
```bash
bun run src/index.ts
```

**Production mode:**
```bash
NODE_ENV=production bun run src/index.ts
```

The server will start on `http://localhost:3001`

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/signup`
Register a new user

**Request Body:**
```json
{
  "email": "astronaut@sentinel.space",
  "password": "securepassword123",
  "name": "John Doe",
  "role": "user" // optional: "user" | "admin" | "mission_control"
}
```

**Response:**
```json
{
  "user": {
    "id": "...",
    "email": "astronaut@sentinel.space",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt-token-here"
}
```

#### POST `/api/auth/login`
Login with existing credentials

**Request Body:**
```json
{
  "email": "astronaut@sentinel.space",
  "password": "securepassword123"
}
```

#### GET `/api/auth/me`
Get current user information (requires authentication)

#### POST `/api/auth/logout`
Logout and clear session cookie

### Health Monitoring Endpoints

All health endpoints require authentication (Bearer token or cookie).

#### POST `/api/health/readings`
Add a new health reading

**Request Body:**
```json
{
  "heartRate": 72.5,
  "spO2": 98.0,
  "systolicBP": 120.0,
  "diastolicBP": 80.0,
  "skinTemp": 36.5,
  "respiratoryRate": 16.0
}
```

#### GET `/api/health/readings?limit=50`
Get health readings history

#### GET `/api/health/vitals`
Get latest vital signs

#### GET `/api/health/history?hours=24`
Get health readings for specified time period

### System Monitoring Endpoints

All system endpoints require authentication.

#### POST `/api/system/readings`
Add a new system reading

**Request Body:**
```json
{
  "cabinCO2": 0.4,
  "cabinO2": 21.0,
  "cabinPressure": 101.3,
  "cabinTemp": 22.0,
  "cabinHumidity": 45.0,
  "powerConsumption": 1500.0,
  "waterReclamationLevel": 85.0,
  "wasteManagementLevel": 40.0
}
```

#### GET `/api/system/readings?limit=50`
Get system readings history

#### GET `/api/system/status`
Get latest system status

### Alert Endpoints

#### GET `/api/system/alerts`
Get active (unresolved) alerts

#### GET `/api/system/alerts/all?limit=100`
Get all alerts including resolved ones

#### PATCH `/api/system/alerts/:alertId/resolve`
Mark an alert as resolved

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── controllers/       # Request handlers
│   │   ├── authController.ts
│   │   ├── healthController.ts
│   │   └── systemController.ts
│   ├── middlewares/       # Express middlewares
│   │   └── auth.ts        # JWT authentication
│   ├── routes/            # API routes
│   │   ├── auth.ts
│   │   ├── health.ts
│   │   └── system.ts
│   ├── utils/             # Utility functions
│   │   └── anomalyDetection.ts
│   ├── index.ts           # Main server file
│   └── test-connection.ts # Database test script
├── prisma/
│   └── schema.prisma      # Database schema
├── .env                   # Environment variables (create this)
├── package.json
└── README.md
```

## 🔧 Common Issues & Solutions

### "Can't reach database server" Error

**Problem:** Prisma can't connect to your Neon database.

**Solutions:**
1. Verify your DATABASE_URL is correct and includes `?sslmode=require`
2. Check if your Neon database is active (free tier may suspend after inactivity)
3. Ensure you're using the pooled connection string (with `-pooler`)
4. Test connection with: `bun prisma db pull`

### "JWT_SECRET is required" Error

**Problem:** JWT_SECRET environment variable is missing.

**Solution:**
Generate a secure secret and add it to `.env`:
```bash
echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env
```

### Prisma Client Not Generated

**Problem:** Import errors for `@prisma/client`

**Solution:**
```bash
bun prisma generate
```

### Port Already in Use

**Problem:** Port 3001 is already occupied.

**Solution:**
Change the port in your `.env` file:
```env
PORT=3002
```

## 🧪 Testing

### Test Database Connection
```bash
bun run src/test-connection.ts
```

### Test API Endpoints
```bash
# Health check
curl http://localhost:3001/api/ping

# Signup
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123","name":"Test User"}'
```

## 📊 Database Schema

The application uses the following models:
- **User**: Authentication and user management
- **HealthReading**: Astronaut vital signs
- **SystemReading**: Spacecraft system metrics
- **Alert**: Critical notifications
- **AuditLog**: Security audit trail

View the complete schema in `prisma/schema.prisma`

## 🔐 Security Features

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with 7-day expiration
- HTTP-only cookies for token storage
- Input validation with Zod schemas
- Audit logging for all user actions
- Role-based access control

## 🚀 Deployment

### Production Checklist

- [ ] Set strong JWT_SECRET (32+ characters)
- [ ] Set NODE_ENV=production
- [ ] Use production database credentials
- [ ] Enable HTTPS
- [ ] Set secure cookie options
- [ ] Configure CORS for production domain
- [ ] Run database migrations
- [ ] Set up monitoring and logging

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-production-jwt-secret"
NODE_ENV=production
PORT=3001
FRONTEND_URL="https://your-frontend-domain.com"
```

## 📝 License

Built for Astra 2025 Hackathon by Team SignShell

## 🤝 Contributing

This project supports the Gaganyaan Mission - India's first crewed orbital spacecraft program.

For issues or questions, please contact the development team.

---

**Team SignShell** • Astra 2025 • Gaganyaan Mission Support 🚀