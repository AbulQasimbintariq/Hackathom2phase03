# Quick Deployment Checklist

## Pre-Deployment

- [ ] All code committed to GitHub
- [ ] Environment variables documented
- [ ] Database migrations tested locally
- [ ] Frontend builds successfully: `npm run build`
- [ ] Backend runs without errors
- [ ] Test all features locally

## Frontend (Next.js) on Vercel

- [ ] Connect GitHub repository to Vercel
  - Go to https://vercel.com/new
  - Select your repository
  - Framework: Next.js
  - Root Directory: `frontend`
- [ ] Configure environment variables
  - `NEXT_PUBLIC_API_BASE`: Your backend URL (e.g., `https://api.yourdomain.com`)
- [ ] Deploy
  - Vercel automatically deploys on push to main
  - Check deployment logs for errors

## Backend (FastAPI) Deployment

### Choose Platform:

#### Option A: Railway (Recommended)

- [ ] Create Railway account (railway.app)
- [ ] Connect GitHub
- [ ] Create new project
- [ ] Set root directory: `backend`
- [ ] Add environment variables:
  - `DATABASE_URL`: PostgreSQL connection URL
  - `JWT_SECRET`: Random string (or leave empty for dev)
- [ ] Deploy

#### Option B: Render

- [ ] Create Render account (render.com)
- [ ] Create Web Service
- [ ] Connect GitHub repository
- [ ] Set root directory: `backend`
- [ ] Build command: `pip install -r requirements.txt`
- [ ] Start command: `uvicorn main:app --host 0.0.0.0 --port 8000`
- [ ] Add environment variables
- [ ] Deploy

#### Option C: Fly.io

- [ ] Create Fly account (fly.io)
- [ ] Install `flyctl`
- [ ] Run `fly launch` from project root
- [ ] Follow prompts to deploy Python app

## Post-Deployment

- [ ] Test frontend at Vercel URL
- [ ] Test backend API at backend URL
- [ ] Test task creation/deletion
- [ ] Test chat functionality
- [ ] Check browser console for errors
- [ ] Verify CORS is working

## Important URLs to Update

### In Vercel Dashboard

- Set `NEXT_PUBLIC_API_BASE` = `<your-backend-url>`

### In Backend CORS Settings

- Add your Vercel domain to `allow_origins`
- Format: `https://your-app.vercel.app`

## Common Issues

| Issue                     | Solution                                          |
| ------------------------- | ------------------------------------------------- |
| 404 on API calls          | Check `NEXT_PUBLIC_API_BASE` in Vercel env vars   |
| CORS errors               | Update backend CORS list and redeploy             |
| Database connection fails | Verify `DATABASE_URL` env var on backend platform |
| Build fails on Vercel     | Check build logs, ensure Node.js version compat   |
| Chat not working          | Verify backend is running and accessible          |

## Monitoring

- **Frontend**: Vercel Dashboard → Deployments
- **Backend**: Platform dashboard (Railway/Render) → Logs
- **Errors**: Check browser console → Network tab

## Updating After Deployment

1. Make code changes
2. Commit and push to GitHub
3. Platforms auto-redeploy
4. Done! No manual deployment needed.

---

See `DEPLOYMENT.md` for detailed instructions.
