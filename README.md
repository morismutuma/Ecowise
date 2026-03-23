# 🌿 EcoWise — Smart Energy Monitor

A full-stack web app for monitoring home appliance energy consumption.
Built with **Django REST Framework** + **React (Vite)** + **TailwindCSS**.

---

## ⚡ QUICK START — Run Locally

### What you need installed first
- Python 3.9+ → https://python.org/downloads
- Node.js 18+ → https://nodejs.org
- Git → https://git-scm.com

---

### STEP 1 — Set up the Backend (Django)

Open a terminal and run these commands one by one:

```bash
cd ecowise/backend
python3 -m venv venv
source venv/bin/activate        # Mac/Linux
# OR on Windows:
# venv\Scripts\activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

✅ Backend is running at: http://localhost:8000

---

### STEP 2 — Set up the Frontend (React)

Open a **second terminal** (keep the first one running):

```bash
cd ecowise/frontend
npm install
npm run dev
```

✅ App is running at: http://localhost:5173

Open **http://localhost:5173** in your browser — that's EcoWise!

---

### STEP 3 — Create your account

1. Click **Create one** on the login screen
2. Fill in your name, username and password
3. You're in! Start adding your home appliances.

---

## 🚀 DEPLOY TO GITHUB + SHARE LINK

Follow these steps so others can sign up and use EcoWise from their own devices.

### Part A — Push code to GitHub

**1. Create a GitHub account** at https://github.com if you don't have one.

**2. Create a new repository**
- Go to https://github.com/new
- Name it: `ecowise`
- Set to **Public**
- Do NOT check "Add README" (we already have one)
- Click **Create repository**

**3. Push your code**

```bash
cd ecowise
git init
git add .
git commit -m "Initial EcoWise commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ecowise.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

### Part B — Deploy Backend (Railway — Free)

Railway hosts your Django API for free.

**1.** Go to https://railway.app and sign in with GitHub

**2.** Click **New Project** → **Deploy from GitHub repo** → select `ecowise`

**3.** Railway will detect Django. Set these environment variables in Railway dashboard:

| Variable | Value |
|----------|-------|
| `DJANGO_SETTINGS_MODULE` | `smart_energy_project.settings` |
| `SECRET_KEY` | any long random string |
| `DEBUG` | `False` |
| `ALLOWED_HOSTS` | `*.railway.app` |

**4.** Add a `Procfile` in the `backend/` folder:
```
web: python manage.py migrate && gunicorn smart_energy_project.wsgi
```

**5.** Add `gunicorn` to `requirements.txt`:
```
gunicorn>=21.0
```

**6.** Railway gives you a URL like: `https://ecowise-production.railway.app`

---

### Part C — Deploy Frontend (Vercel — Free)

Vercel hosts your React app for free.

**1.** Go to https://vercel.com and sign in with GitHub

**2.** Click **Add New Project** → import your `ecowise` repo

**3.** Set these settings:
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

**4.** Add environment variable:
| Variable | Value |
|----------|-------|
| `VITE_API_URL` | your Railway backend URL |

**5.** Update `frontend/src/utils/api.js`:
```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api' || '/api',
})
```

**6.** Vercel gives you a link like: `https://ecowise.vercel.app`

---

### 🎉 Share your link!

Send people **https://ecowise.vercel.app** — they can:
- Register their own account
- Add their home appliances
- Track their energy usage
- See tips and charts

Each user only sees their own data (fully isolated by JWT auth).

---

## 📱 Features

| Feature | Description |
|---------|-------------|
| 🔐 Auth | Register, login, logout with JWT |
| 🏠 Dashboard | Energy gauge, KES cost, 7-day trend |
| ⚡ Devices | Add/edit/delete appliances with quick presets |
| 📊 Charts | Daily usage area chart + appliance bar chart |
| 💡 Tips | Energy saving tips with WatchWise YouTube links |
| 🔔 Alerts | Auto notifications when usage exceeds threshold |
| ⚙️ Settings | Set KES rate per kWh, alert threshold |

---

## 🗂️ Project Structure

```
ecowise/
├── backend/                  # Django REST API
│   ├── manage.py
│   ├── requirements.txt
│   ├── smart_energy_project/
│   └── energy_api/           # Models, views, serializers
└── frontend/                 # React + Vite
    ├── package.json
    └── src/
        ├── pages/            # Dashboard, Devices, Charts, Tips, Settings
        ├── components/       # Layout, CircularGauge, ApplianceCard
        ├── context/          # AuthContext (JWT)
        └── utils/            # Axios API client
```

---

*Built with 🌿 by EcoWise — Saving energy, saving Kenya.*
