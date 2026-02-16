# 🚀 Deployment Guide for DermAI

This guide will traverse you through deploying your **DermAI Skin Cancer Detection System** so it is accessible to everyone on the internet.

We will deploy the **Backend (Python API)** on **Render** (Free tier available) and the **Frontend (React App)** on **Vercel** (Free tier available).

---

## ✅ Prerequisites

1.  **GitHub Account**: You need to push your code to a GitHub repository.
2.  **Render Account**: Sign up at [render.com](https://render.com).
3.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).

---

## Step 1: Push Code to GitHub

1.  Create a new repository on GitHub (e.g., `derm-ai-project`).
2.  Push your code to this repository.
    ```bash
    git init
    git add .
    git commit -m "Initial commit for deployment"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/derm-ai-project.git
    git push -u origin main
    ```
    *Note: Ensure your `best_densenet121_model.keras` file is included. It is approx 60MB, which fits within GitHub's standard limits.*

---

## Step 2: Deploy Backend to Render

1.  Log in to your **Render Dashboard**.
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub repository (`derm-ai-project`).
4.  Configure the service:
    *   **Name**: `derm-ai-backend` (or similar)
    *   **Region**: Closest to you (e.g., Singapore, Frankfurt)
    *   **Branch**: `main`
    *   **Root Directory**: `.` (leave empty or set to `webpage` if your root is the folder above) -> **IMPORTANT**: Since your `backend.py` is in the `webpage` folder inside your repo (if you pushed the whole deskop folder), set Root Directory to `webpage`. If you pushed just the contents of `webpage`, leave it empty.
    *   **Runtime**: **Python 3**
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `gunicorn backend:app`
5.  Click **Create Web Service**.
6.  Wait for the deployment to finish. Once live, Render will give you a URL (e.g., `https://derm-ai-backend.onrender.com`).
    *   **Copy this URL**. You will need it for the frontend.

---

## Step 3: Deploy Frontend to Vercel

1.  Log in to your **Vercel Dashboard**.
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository (`derm-ai-project`).
4.  Configure the project:
    *   **Framework Preset**: Create React App (should be auto-detected).
    *   **Root Directory**: `webpage` (if your package.json is inside this folder).
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `build`
5.  **Environment Variables**:
    *   Click to expand **Environment Variables**.
    *   Add a new variable:
        *   **Key**: `REACT_APP_API_URL`
        *   **Value**: The Render Backend URL you copied (e.g., `https://derm-ai-backend.onrender.com`). **Do not add a trailing slash `/`**.
6.  Click **Deploy**.

---

## Step 4: Final Verification

1.  Once Vercel finishes, click the domain provided (e.g., `https://derm-ai-project.vercel.app`).
2.  Your app should load!
3.  Test the **Clinical Assessment** or **Image Analysis** features.
    *   Try uploading an image.
    *   It should send the request to your Render backend and return the results.
    *   *Note: Free tier on Render spins down after inactivity. The first request might take 30-50 seconds to wake up the server.*

---

## Troubleshooting

*   **Backend failed to build?** Check the logs in Render. Ensure `requirements.txt` is present and correct.
*   **"Network Error" on Frontend?**
    *   Check if the `REACT_APP_API_URL` is set correctly in Vercel.
    *   Ensure the backend is running (visit the backend URL directly, you should see the health check JSON).
    *   Check the browser console (F12) for CORS errors. (The current backend is configured with `CORS(app)` which allows all origins, so this should work).
