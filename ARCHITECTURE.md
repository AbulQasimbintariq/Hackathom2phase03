# Architecture & Deployment Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Internet Users                          │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴───────────────┐
                │                             │
         ┌──────▼──────┐               ┌─────▼──────┐
         │   Frontend   │               │   Backend  │
         │   (Vercel)   │◄─────────────►│(Railway)   │
         │   Next.js    │   HTTP API    │   FastAPI  │
         │              │               │            │
         └──────┬──────┘               └─────┬──────┘
                │                             │
                │ Serves HTML/JS              │ Manages Data
                │ (CDN)                       │ Runs Logic
                │                             │
                │                        ┌────▼────────┐
                │                        │  Database   │
                │                        │ PostgreSQL  │
                │                        └─────────────┘
```

## Components & Technologies

### Frontend (Next.js on Vercel)

- **Framework**: Next.js 15
- **Language**: TypeScript/React
- **Styling**: Tailwind CSS
- **Hosting**: Vercel (serverless)
- **Features**:
  - Task management (create, read, update, delete)
  - Chat interface
  - Responsive design
  - Client-side rendering

### Backend (FastAPI)

- **Framework**: FastAPI
- **Language**: Python 3.11
- **Database**: PostgreSQL
- **Hosting**: Railway.app or Render.com
- **Features**:
  - RESTful API endpoints
  - JWT authentication
  - Database ORM (SQLModel)
  - Chat functionality with simple NLP

### Database

- **Type**: PostgreSQL 15
- **Provider**: Included with Railway/Render
- **Manages**: Users, Tasks, Chat messages, Conversations

## Deployment Architecture

### Local Development

```
Your Computer
├── Frontend: npm start (localhost:3000)
├── Backend: uvicorn main:app (localhost:8000)
└── Database: PostgreSQL (localhost:5432)
```

### Production (Deployed)

```
Global Cloud Infrastructure

┌─────────────────────────────────────────┐
│ Vercel (Frontend)                       │
├─────────────────────────────────────────┤
│ ✓ Auto-scales based on traffic          │
│ ✓ Global CDN (99.95% uptime SLA)       │
│ ✓ Automatic deployments on git push     │
│ ✓ Free SSL/HTTPS certificates          │
│ ✓ Built-in analytics & monitoring      │
└──────────────────┬──────────────────────┘
                   │ CORS-enabled API calls
                   │ (HTTPS/TLS encrypted)
                   │
┌──────────────────▼──────────────────────┐
│ Railway/Render (Backend)                │
├──────────────────────────────────────────┤
│ ✓ Containerized deployment              │
│ ✓ Auto-restart on failure               │
│ ✓ Integrated PostgreSQL database        │
│ ✓ Environment variable management       │
│ ✓ Log aggregation & monitoring          │
├──────────────────────────────────────────┤
│ PostgreSQL Database                      │
│ ✓ Automatic backups                      │
│ ✓ Replication for reliability            │
└──────────────────────────────────────────┘
```

## Data Flow

### Creating a Task

```
1. User fills form in browser
2. Frontend (Next.js) validates input
3. Sends POST /api/tasks to backend
4. Backend validates & saves to PostgreSQL
5. Returns created task
6. Frontend updates UI
```

### Chat Conversation

```
1. User sends message in chat
2. Frontend sends POST /api/chat/messages
3. Backend:
   - Saves user message
   - Processes with ChatBot service
   - Saves bot response
   - Returns messages
4. Frontend refreshes chat display
5. Messages appear on screen
```

## Request Flow (HTTPS Security)

```
Frontend Request:
1. User action (click, submit)
2. Browser prepares HTTP request
3. Vercel →(HTTPS)→ Railway
4. Railway processes request
5. Railway →(HTTPS)→ Database
6. Response flows back through chain
7. Browser updates UI

Security:
- TLS 1.3 encryption in transit
- JWT tokens for authentication
- CORS validation on backend
- Environment variables for secrets
```

## Deployment Pipeline

### Git to Production

```
1. Developer pushes code to GitHub
   ↓
2. Vercel webhook triggered
   ├─ npm install (install dependencies)
   ├─ npm run build (compile Next.js)
   ├─ Run tests (if configured)
   ├─ Deploy to CDN
   └─ Get new URL
   ↓
3. Railway webhook triggered
   ├─ pip install (install Python packages)
   ├─ Run alembic migrations (if needed)
   ├─ Build Docker image
   └─ Deploy new version
   ↓
4. DNS updated
5. SSL certificates verified
6. Live! 🎉
```

## Scaling & Performance

### Frontend Scaling (Vercel)

- **CDN**: Deployed to 300+ edge locations
- **Auto-scaling**: Handles traffic spikes
- **Caching**: Static assets cached globally
- **Performance**: <100ms first-byte time

### Backend Scaling (Railway/Render)

- **Load balancing**: Automatic
- **Environment isolation**: Separate instances
- **Resource limits**: Scaled to tier
- **Health checks**: Auto-restart on failure

## Monitoring & Health Checks

### Vercel Monitoring

- Build logs: vercel logs
- Runtime errors: Browser console
- Analytics: Vercel dashboard
- Performance metrics: Next.js analytics

### Railway/Render Monitoring

- Application logs: Platform dashboard
- Database logs: SQL query logs
- Resource usage: CPU, memory, disk
- Uptime: 99%+ guaranteed

## Security Considerations

### Authentication

- JWT tokens (if JWT_SECRET set)
- Token passed in Authorization header
- Fallback to token-as-user-id (dev mode)

### Data Protection

- HTTPS/TLS in transit
- PostgreSQL encryption at rest (optional)
- Environment variables for secrets
- No hardcoded credentials

### API Security

- CORS enabled for Vercel domain
- Rate limiting (configurable)
- SQL injection protection (SQLModel)
- Input validation on all endpoints

## Cost Breakdown

| Component         | Cost         | Notes                                    |
| ----------------- | ------------ | ---------------------------------------- |
| Frontend (Vercel) | Free         | Free tier includes generous limits       |
| Backend (Railway) | Free-$5/mo   | Free $5/month credit, then pay-as-you-go |
| Database          | Free         | Included with backend tier               |
| Domain            | $10-15/yr    | Optional (use provided subdomain)        |
| **Total Minimum** | **Free**     | Everything runs free                     |
| **Typical Cost**  | **$0-10/yr** | If you buy custom domain                 |

## Troubleshooting by Layer

### Frontend Layer (Vercel)

- Check Vercel logs
- Verify environment variables
- Test with browser DevTools
- Check NEXT_PUBLIC_API_BASE

### APILayer (Railway/Render)

- Check backend logs
- Verify database connection
- Test /health endpoint
- Check CORS settings

### Database Layer

- Verify DATABASE_URL
- Check connection limits
- View database logs
- Test SQL queries directly

---

For deployment help, see:

- `VERCEL_QUICK_START.md` - Quick 5-step guide
- `DEPLOYMENT.md` - Detailed instructions
- `DEPLOY_CHECKLIST.md` - Step-by-step checklist
