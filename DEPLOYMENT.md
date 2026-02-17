# Deployment Guide

This guide covers deploying your Task App (frontend + backend) to production.

## Project Structure

- `frontend/` - Next.js application (deploys to Vercel)
- `backend/` - FastAPI application (deploys to Railway/Render)

## Frontend Deployment on Vercel

### Prerequisites

- GitHub account with your repository
- Vercel account (free tier available)

### Steps

1. **Push to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Select "Next.js" framework
   - Configure build settings:
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Install Command**: `npm install`

3. **Set Environment Variables in Vercel**
   - In Vercel dashboard, go to your project settings
   - Navigate to "Environment Variables"
   - Add: `NEXT_PUBLIC_API_BASE` = `https://your-backend-url.com`
   - Redeploy after adding environment variables

## Backend Deployment

### Option 1: Railway (Recommended - Simple Setup)

Railway is the easiest option for deploying FastAPI applications.

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository

3. **Configure Backend**
   - Select the repo and it will auto-detect the Python app
   - Select `backend` directory as root
   - Add environment variables:
     - `DATABASE_URL`: PostgreSQL connection string (Railway provides this)
     - `JWT_SECRET`: Your secret key (optional)

4. **Deploy**
   - Railway will automatically deploy on every push to main
   - Get your backend URL from the Railway dashboard
   - Update `NEXT_PUBLIC_API_BASE` in Vercel with your Railway backend URL

### Option 2: Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repository
   - Select `backend` directory
   - Set Build Command: `pip install -r requirements.txt && alembic -c alembic.ini upgrade head`
   - Set Start Command: `uvicorn main:app --host 0.0.0.0 --port 8000`
   - Add environment variables (Database URL, JWT_SECRET)

3. **Deploy and Get URL**
   - Update `NEXT_PUBLIC_API_BASE` in Vercel

### Option 3: Fly.io

Similar to Railway/Render, Fly.io also supports FastAPI apps. Create a `fly.toml` file in the backend directory.

## CORS Configuration for Production

Make sure your backend CORS settings allow your Vercel domain:

In `backend/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://your-vercel-domain.vercel.app",  # Add your Vercel domain
        "*"  # Or be more specific
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Database Setup

1. **PostgreSQL Database**
   - Railway provides PostgreSQL automatically
   - Render and Fly.io also provide database options
   - Update `DATABASE_URL` environment variable with your connection string

2. **Run Migrations**
   - Most platforms allow you to run one-time commands
   - Run: `alembic -c alembic.ini upgrade head`

## SSL/HTTPS

All deployment platforms (Vercel, Railway, Render, Fly.io) provide free SSL certificates by default.

## Testing

After deployment:

1. **Test Frontend**
   - Visit your Vercel domain
   - Check browser console for errors
   - Test API calls in Network tab

2. **Test Backend**
   - Visit `https://your-backend-url.com/docs` (Swagger UI)
   - Test API endpoints

3. **Test Communication**
   - Create a task in the frontend
   - Check if it appears in the database
   - Test chat functionality

## Troubleshooting

### Frontend Errors

- Check Vercel build logs: `vercel logs`
- Verify environment variables are set correctly
- Check `NEXT_PUBLIC_API_BASE` is correct

### Backend Errors

- Check deployment platform logs
- Verify database connection string
- Ensure PORT is set to 8000 or auto-detected

### CORS Issues

- Update CORS allowed origins in backend
- Redeploy backend
- Clear browser cache

### Database Connection Issues

- Verify DATABASE_URL environment variable
- Check database is running
- Ensure migrations have run

## Monitoring & Logs

- **Vercel**: Dashboard → Deployments → Logs
- **Railway**: Dashboard → Logs tab
- **Render**: Dashboard → Logs tab

## Updating After Deployment

1. Push changes to GitHub
2. Platforms automatically redeploy
3. Environment variables persist

## Cost

- **Vercel Frontend**: Free tier includes generous limits
- **Railway Backend**: Free tier includes $5/month credit
- **Database**: Included in backend platform tier

---

For detailed environment setup, see:

- Frontend: `frontend/.env.example`
- Backend: `backend/.env.example`
