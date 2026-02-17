# Vercel Deployment Quick Start

## 🚀 Deploy in 5 Steps

### Step 1: Prepare Your Repository

```bash
# Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Select your GitHub repository
4. **Framework**: Next.js (auto-detected)
5. **Root Directory**: `frontend`
6. Click **"Deploy"**

**Wait for build to complete** ✅

### Step 3: Deploy Backend (Choose One)

#### 🚂 Option A: Railway (Easiest)

```bash
# 1. Go to https://railway.app
# 2. Click "New Project"
# 3. Select "Deploy from GitHub"
# 4. Choose your repo
# 5. Set root directory: backend
# 6. Add env vars:
#    - DATABASE_URL (auto-provided)
#    - JWT_SECRET (your secret)
#    - ENV = production
# 7. Deploy
# 8. Copy your Railway domain
```

#### 🎨 Option B: Render

```bash
# 1. Go to https://render.com
# 2. Click "New +" → "Web Service"
# 3. Connect GitHub repo
# 4. Root directory: backend
# 5. Build: pip install -r requirements.txt
# 6. Start: uvicorn main:app --host 0.0.0.0 --port 8000
# 7. Add env vars
# 8. Deploy
```

### Step 4: Connect Frontend to Backend

1. Go to your **Vercel Project**
2. Settings → Environment Variables
3. Add: `NEXT_PUBLIC_API_BASE`
4. Value: `https://your-railway-or-render-domain.com`
5. Click **Redeploy** from Deployments tab

### Step 5: Test Your App

- ✅ Visit your Vercel domain
- ✅ Create a task
- ✅ Test chat functionality
- ✅ Check browser console for errors

## 📋 URLs Reference

| Component | Provided By    | URL Example                                                         |
| --------- | -------------- | ------------------------------------------------------------------- |
| Frontend  | Vercel         | `https://myapp.vercel.app`                                          |
| Backend   | Railway/Render | `https://taskapi-xyz.railway.app` or `https://taskapi.onrender.com` |
| Database  | Railway/Render | Automatic (private)                                                 |

## 🔧 Environment Variables

### Frontend (Vercel)

- `NEXT_PUBLIC_API_BASE`: Your backend URL

### Backend (Railway/Render)

- `DATABASE_URL`: PostgreSQL connection (auto-provided)
- `JWT_SECRET`: Random secret key (optional)
- `ENV`: `production`
- `ALLOWED_ORIGINS`: Your Vercel domain

## ⚠️ Troubleshooting

| Error                    | Solution                                      |
| ------------------------ | --------------------------------------------- |
| Tasks not loading        | Check `NEXT_PUBLIC_API_BASE` is set correctly |
| CORS error               | Backend hasn't redeployed after config change |
| 500 error on chat        | Check database is running on backend platform |
| Chat messages not saving | Verify `conversation_id` is in API response   |

## 🔗 Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- Railway Dashboard: https://railway.app/dashboard
- Render Dashboard: https://dashboard.render.com
- Vercel Docs: https://vercel.com/docs

## 💡 Pro Tips

1. **Auto-deploy**: Push to main → automatic deployment
2. **Monitor**: Check logs in dashboard if something breaks
3. **Scale**: Popular? Upgrade plan for more resources
4. **Custom Domain**: Add your own domain in platform settings

## 📞 Need Help?

- See `DEPLOYMENT.md` for detailed instructions
- Check `DEPLOY_CHECKLIST.md` for step-by-step process
- Review deployment platform docs

---

**Deployed? Congratulations! 🎉**

Your Task App is now live on the internet!
