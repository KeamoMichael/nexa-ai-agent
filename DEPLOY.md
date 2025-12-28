# Deploying Manus AI Clone to Render.com

## Prerequisites
- GitHub account with this repository pushed
- Render.com account (free tier works)
- Google Gemini API key

## Deployment Steps

### 1. Connect Repository to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account if not already connected
4. Select the repository: `KeamoMichael/manus-ai-clone`

### 2. Configure the Web Service

Use these settings:

- **Name**: `manus-ai-clone` (or your preferred name)
- **Region**: Choose closest to you (e.g., Oregon)
- **Branch**: `master`
- **Root Directory**: Leave empty
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Plan**: `Free` (or Starter if you need more resources)

### 3. Add Environment Variables

Click **"Advanced"** and add these environment variables:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Required |
| `GEMINI_API_KEY` | `your-api-key-here` | Your Google Gemini API key |

> ⚠️ **Important**: Replace `your-api-key-here` with your actual Gemini API key

### 4. Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Install dependencies
   - Build the Vite frontend
   - Start the Express server
3. Wait for deployment to complete (~2-5 minutes)

### 5. Access Your App

Once deployed, Render will provide a URL like:
```
https://manus-ai-clone.onrender.com
```

## Important Notes

### Puppeteer on Render
- Puppeteer may have issues on free tier due to memory constraints
- If browser automation fails, consider upgrading to a paid plan
- The server already includes necessary Puppeteer flags for Render compatibility

### Cold Starts
- Free tier services spin down after 15 minutes of inactivity
- First request after inactivity will take ~30-60 seconds to wake up

### Logs & Debugging
- View logs in Render Dashboard → Your Service → Logs
- Check for any errors during build or runtime

## Alternative: Using render.yaml (Infrastructure as Code)

This repository includes a `render.yaml` file. To use it:

1. Go to Render Dashboard → **"New +"** → **"Blueprint"**
2. Connect your repository
3. Render will auto-detect `render.yaml` and configure everything
4. Just add your environment variables and deploy!

## Local Development

To run locally:
```bash
npm install
npm run dev
```

This starts:
- Frontend on http://localhost:3000
- Backend on http://localhost:3001

## Troubleshooting

### Build fails
- Check that all dependencies are in `package.json`
- Verify Node version compatibility (18+ recommended)

### Server won't start
- Ensure `PORT` environment variable is not hardcoded
- Check logs for specific error messages

### Socket.IO connection issues
- Verify CORS settings allow your Render domain
- Check that WebSocket connections are enabled (they are on Render)

## Support
For issues, check the Render documentation: https://render.com/docs
