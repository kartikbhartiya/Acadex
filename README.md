# Acadex – Academic Project Management System

A beginner-friendly, full-stack academic project management web app built using **React**, **Firebase Authentication**, and **Firestore**. Acadex helps students create teams, manage project tasks, submit reports, and helps faculty/admins review and grade projects — all in one place.

---

## 🚀 Admin (Development) Login

These credentials are **only for testing/demo**.  
⚠️ Do NOT use these in production.

Email:    admin@acadex.edu
Password: admin@123

Admins are recognized using a list of approved admin emails inside the application code.

---

## 🎯 What Acadex Does (Simplest Explanation)

- Students sign up or log in.
- They create a project + team or join a team via email.
- Each member accepts the invitation → project becomes active.
- Students can:
  - Add tasks
  - Track team progress
  - Attach files/links
  - Write and submit reports
- Admins can:
  - View all projects
  - Read reports
  - Download exports
  - Give grades + feedback

Everything is stored in Firebase Firestore.

---

## 📦 Tech Stack

### Frontend
- React (Vite or CRA)
- HTML + CSS (Tailwind optional)
- Single-file main component `App.jsx`

### Backend (Serverless)
- Firebase Authentication
- Firestore Database

---

## 🛠️ Project Setup (Beginner Friendly)

### 1️⃣ Install Required Software
- Node.js
- npm
- A Firebase account (free)

### 2️⃣ Create or Clone Project

git clone <your-repo-url>
cd project-folder

Or create a new React app and place `App.jsx` inside `/src`.

### 3️⃣ Install Dependencies

npm install firebase

### 4️⃣ Setup Firebase

1. Go to Firebase Console
2. Create a project
3. Add Web App
4. Enable:
   - Email/Password Auth
   - Google Auth (optional)
5. Create Firestore (start in test mode for development)

### 5️⃣ Add Firebase Config to .env

VITE_FIREBASE_API_KEY=xxxx
VITE_FIREBASE_AUTH_DOMAIN=xxxx
VITE_FIREBASE_PROJECT_ID=xxxx
VITE_FIREBASE_STORAGE_BUCKET=xxxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxx
VITE_FIREBASE_APP_ID=xxxx
VITE_FIREBASE_MEASUREMENT_ID=xxxx

Restart the dev server after creating `.env`.

### 6️⃣ Run the App

npm run dev

Open the URL shown (usually http://localhost:5173).

---

## 🧠 How the App Works (Behind the Scenes)

### 🔐 Firebase Auth Flow
- User signs in → Auth updates
- User document is created in Firestore if missing
- Certain email addresses are flagged as admins

### 📁 Firestore Structure (Simplified)

artifacts/{appId}/users/{userId}
artifacts/{appId}/public/data/projects/{projectId}

### 👥 Team Management
- Member emails added as “pending”
- Members accept invite
- When all accept → full project features unlock

### 📝 Reports & Files
- Students save draft reports
- Final report stored in Firestore
- File links saved in a `files` array
- Admins view + grade submissions

---

## 🔧 Commands Guide

npm install   → installs dependencies
npm run dev   → runs local dev server
npm run build → production build
npm run preview → preview production build

---

## 🧩 Features Breakdown

### For Students
- Create/join project teams
- Accept invitations
- Manage tasks
- Write/edit reports
- Submit final report
- View grades/feedback

### For Admins
- Admin dashboard
- View all projects
- Review reports
- Give grades/feedback
- Export project details

---

## ⚠️ Security Notes
- Never upload `.env` to GitHub
- Use Firebase security rules in production
- Avoid hardcoding admin emails
- Replace demo credentials before deploying

---

## 🧪 Troubleshooting

### Missing Env Vars
Check `.env` and restart server.

### Admin Not Detected
Ensure email exists in `ADMIN_EMAILS`.

### Google Login Issues
Enable Google Auth in Firebase.

### Firestore Permission Denied
Check Firestore security rules.

---

## 📚 Recommended Learning Resources
- Firebase Auth
- Firestore Docs
- Vite + React Docs

---

## ❤️ Contribution Guide
1. Fork repo
2. Create branch
3. Make changes
4. Submit PR

---

## 📝 License
MIT License — free to use, modify, and distribute.
