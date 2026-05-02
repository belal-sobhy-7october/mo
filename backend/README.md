# MoMasry Backend API

## 🚀 Overview
Complete REST API for MoMasry Fitness Assessment System with PostgreSQL database integration.

## 📋 Features
- **Clients Management**: Full CRUD operations
- **Sessions Management**: Complete assessment session handling
- **Mobility Tests**: Hip, shoulder, ankle, thoracic assessments
- **Stability Tests**: Core and balance assessments
- **Strength Tests**: Push, pull, lower body, core exercises
- **Strength Benchmarks**: 6 key exercise tracking
- **Analytics**: Progress tracking and data visualization
- **Health Checks**: API and database status monitoring

## 🛠 Technology Stack
- **Node.js** with Express.js
- **PostgreSQL** with pg library
- **CORS** for cross-origin requests
- **Environment variables** for configuration

## 📁 Project Structure
```
backend/
├── server.js              # Main Express server
├── package.json           # Dependencies and scripts
├── .env.example          # Environment variables template
└── README.md             # This file
```

## 🔧 Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env
```

Edit `.env` with your database configuration:
```env
DATABASE_URL=postgresql://username:password@hostname:port/database_name
PORT=3001
NODE_ENV=production
```

### 3. Database Setup
Run the SQL schema from `../database-schema.sql` in your PostgreSQL database.

### 4. Start the Server
```bash
# Development
npm run dev

# Production
npm start
```

## 📡 API Endpoints

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get client by ID
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Sessions
- `GET /api/sessions` - Get all sessions (optional: `?clientId=uuid`)
- `GET /api/sessions/:id` - Get session by ID
- `POST /api/sessions` - Create new session
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session

### Mobility Tests
- `GET /api/sessions/:sessionId/mobility` - Get mobility tests
- `POST /api/sessions/:sessionId/mobility` - Save mobility tests

### Stability Tests
- `GET /api/sessions/:sessionId/stability` - Get stability tests
- `POST /api/sessions/:sessionId/stability` - Save stability tests

### Strength Tests
- `GET /api/sessions/:sessionId/strength` - Get strength tests
- `POST /api/sessions/:sessionId/strength` - Save strength tests

### Strength Benchmarks
- `GET /api/sessions/:sessionId/benchmarks` - Get benchmarks
- `POST /api/sessions/:sessionId/benchmarks` - Save benchmarks

### Analytics
- `GET /api/clients/:clientId/analytics?metric=weight|measurements|benchmarks` - Get client analytics

### Health Check
- `GET /api/health` - API and database health status

## 📊 Data Models

### Client
```json
{
  "id": "uuid",
  "name": "string",
  "age": "number",
  "height": "number",
  "starting_weight": "number",
  "gender": "male|female",
  "marital_status": "single|married|divorced",
  "training_level": "beginner|intermediate|advanced",
  "goal": "string",
  "injury_history": "string",
  "smoking": "boolean",
  "alcohol": "boolean",
  "sleep_hours": "number"
}
```

### Session
```json
{
  "id": "uuid",
  "client_id": "uuid",
  "session_date": "timestamp",
  "pain_level": "number (1-10)",
  "sleep_quality": "number (1-10)",
  "general_condition": "string",
  "weight": "number",
  "body_fat": "number",
  "muscle_mass": "number",
  "waist": "number",
  "hips": "number",
  "chest": "number",
  "thigh": "number",
  "arm": "number",
  "calf": "number (optional)",
  "shoulders": "number (optional)",
  "photo_front": "string",
  "photo_side": "string",
  "photo_back": "string"
}
```

## 🔒 Security Features
- Input validation with PostgreSQL CHECK constraints
- UUID primary keys for security
- CORS configuration
- SQL injection prevention with parameterized queries
- Error handling and logging

## 🚀 Deployment

### Railway
1. Set `DATABASE_URL` environment variable
2. Set `PORT=3001`
3. Deploy with Railway's automatic detection

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)

## 🧪 Testing

### Health Check
```bash
curl http://localhost:3001/api/health
```

### Example API Calls
```bash
# Get all clients
curl http://localhost:3001/api/clients

# Create new client
curl -X POST http://localhost:3001/api/clients \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","age":30,"height":175,"starting_weight":80,"gender":"male","marital_status":"single","training_level":"beginner","goal":"Get fit","injury_history":"","smoking":false,"alcohol":false,"sleep_hours":7}'
```

## 📝 Logging
All API errors are logged to console with detailed error messages. Database connection status is logged on startup.

## 🔧 Troubleshooting

### Common Issues
1. **Database Connection Error**: Check DATABASE_URL format
2. **CORS Issues**: Verify frontend URL in CORS configuration
3. **Port Conflicts**: Change PORT in environment variables

### Database Schema
Run the complete schema from `../database-schema.sql` to ensure all tables and indexes are created.

## 📞 Support
For API issues, check the server logs and ensure all environment variables are properly configured.
