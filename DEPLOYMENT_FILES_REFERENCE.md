# Deployment Files Reference

This document explains all the deployment-related files that have been added to help you deploy on Vercel.

## 📋 Configuration Files

### `vercel.json`

- **Purpose**: Vercel deployment configuration
- **What it does**: Tells Vercel how to build and deploy your Next.js app
- **Key settings**:
  - Specifies to use Next.js framework
  - Sets root directory as `frontend`
  - Configures production routes

### `frontend/.env.example`

- **Purpose**: Template for frontend environment variables
- **What it does**: Shows what environment variables are needed
- **Usage**: Copy to `.env.local` and fill in your values
- **Key variable**:
  - `NEXT_PUBLIC_API_BASE`: URL of your backend API

### `backend/.env.example`

- **Purpose**: Template for backend environment variables
- **What it does**: Shows what environment variables are needed for backend
- **Key variables**:
  - `DATABASE_URL`: PostgreSQL connection string
  - `JWT_SECRET`: (Optional) Secret for JWT tokens

### `Procfile`

- **Purpose**: Tells Render/Railway how to start your app
- **What it does**: Specifies the command to run your FastAPI server
- **Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`

### `backend/railway.toml`

- **Purpose**: Railway-specific configuration
- **What it does**: Sets Python version and system packages for Railway
- **Features**: Specifies Python 3.11 and PostgreSQL client

### `backend/render.yaml`

- **Purpose**: Render.com deployment configuration
- **What it does**: Complete deployment setup including database
- **Includes**:
  - Build and start commands
  - Environment variables
  - PostgreSQL database setup

## 📖 Documentation Files

### `VERCEL_QUICK_START.md` ⭐ START HERE

- **Purpose**: 5-step quick deployment guide
- **Contains**: Immediate steps to deploy on Vercel
- **Best for**: Developers who want to deploy quickly
- **Read time**: 5 minutes

### `DEPLOYMENT.md`

- **Purpose**: Comprehensive deployment instructions
- **Contains**:
  - Detailed setup for Vercel (frontend)
  - Detailed setup for Railway, Render, and Fly.io (backend)
  - CORS configuration
  - Database setup
  - Troubleshooting guides
- **Best for**: Understanding all options
- **Read time**: 15-20 minutes

### `DEPLOY_CHECKLIST.md`

- **Purpose**: Step-by-step checklist
- **Contains**:
  - Pre-deployment checks
  - Steps for each platform
  - Post-deployment testing
  - Common issues table
- **Best for**: Following directions step-by-step
- **Read time**: 10 minutes

### `ARCHITECTURE.md`

- **Purpose**: System architecture overview
- **Contains**:
  - Component diagrams
  - Data flow explanations
  - Deployment architecture
  - Security information
  - Scaling details
  - Cost breakdown
- **Best for**: Understanding how everything works
- **Read time**: 15 minutes

## 🚀 Setup Scripts

### `setup-deploy.sh` (Linux/Mac)

- **Purpose**: Automated setup for deployment
- **What it does**:
  - Verifies Git repository
  - Installs frontend dependencies
  - Tests frontend build
  - Installs backend dependencies
  - Provides next steps
- **How to use**: `bash setup-deploy.sh`

### `setup-deploy.bat` (Windows)

- **Purpose**: Same as setup-deploy.sh but for Windows
- **How to use**: `setup-deploy.bat`

## 🔧 Code Changes Made

### `frontend/next.config.js`

- **Changes**: Added API rewrites configuration
- **Purpose**: Allows frontend to communicate with backend
- **Features**:
  - API proxy configuration
  - Compression enabled
  - ETag generation

### `backend/main.py`

- **Changes**: Enhanced for production
- **Added**:
  - Environment variable support for CORS
  - Production/development mode detection
  - Health check endpoint (`/health`)
  - Better configuration flexibility

### `backend/models.py`

- **Changes**: Fixed chat message model
- **Added**: `conversation_id` field to ChatMessage
- **Purpose**: Properly link messages to conversations

### `backend/routes/chat.py`

- **Changes**: Fixed chat endpoints
- **Improved**:
  - Proper conversation filtering
  - Message validation
  - Error handling
  - Response structure

## 📂 File Organization

```
hack3outof5/
├── vercel.json                  ← Vercel config
├── Procfile                     ← Start command
├── VERCEL_QUICK_START.md       ← START HERE
├── DEPLOYMENT.md               ← Detailed guide
├── DEPLOY_CHECKLIST.md         ← Step checklist
├── ARCHITECTURE.md             ← How it works
├── setup-deploy.sh             ← Setup script (Linux/Mac)
├── setup-deploy.bat            ← Setup script (Windows)
│
├── frontend/
│   ├── .env.example            ← Frontend env vars
│   └── next.config.js          ← Next.js config
│
└── backend/
    ├── .env.example            ← Backend env vars
    ├── railway.toml            ← Railway config
    ├── render.yaml             ← Render config
    ├── main.py                 ← Updated with production support
    ├── models.py               ← Fixed chat models
    └── routes/
        └── chat.py             ← Fixed chat endpoints
```

## 🎯 Recommended Reading Order

1. **First time deploying?**
   → Read `VERCEL_QUICK_START.md` (5 min)

2. **Need more details?**
   → Read `DEPLOYMENT.md` (20 min)

3. **Want to follow steps?**
   → Use `DEPLOY_CHECKLIST.md`

4. **Curious about architecture?**
   → Read `ARCHITECTURE.md` (15 min)

## ✅ Pre-Deployment Checklist

- [ ] All code committed to Git
- [ ] `frontend` directory exists
- [ ] `backend` directory exists
- [ ] `package.json` in frontend
- [ ] `requirements.txt` in backend
- [ ] `.env.example` files reviewed
- [ ] GitHub account created
- [ ] Vercel account created (free)
- [ ] Railway.app or Render.com account created (free)

## 🚀 Quick Start Commands

```bash
# Setup dependencies
bash setup-deploy.sh              # Linux/Mac
setup-deploy.bat                  # Windows

# Test locally
npm run dev                        # Frontend (port 3000)
uvicorn main:app --reload         # Backend (port 8000)

# Deploy
# 1. Push to GitHub
# 2. Connect to Vercel
# 3. Connect backend to Railway/Render
```

## 🆘 If Something Goes Wrong

1. Check `DEPLOYMENT.md` → Troubleshooting section
2. Review deployment logs in platform dashboard
3. Verify environment variables are set
4. Check that services are running
5. Test API with curl or Postman

## 📞 Support Resources

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- FastAPI Docs: https://fastapi.tiangolo.com
- Next.js Docs: https://nextjs.org/docs

---

**You have everything you need to deploy!** 🎉

Start with `VERCEL_QUICK_START.md` for a 5-minute deploy experience.
