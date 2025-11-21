# 📘 Acadex — Student Academic Project Management System  
*A modern React + Firebase application for managing academic projects end-to-end.*

Acadex is a full-featured **Academic Project Management System** built using **React + Firebase**, designed for students, guides, and administrators to collaborate efficiently on academic or final-year projects.

---

## 🚀 Features

### 👤 Authentication
- Email/password login & signup  
- Google sign-in  
- Anonymous guest login  
- Auto-detect admin via email list  

### 🧑‍🤝‍🧑 Team & Project Management
- Create projects  
- Invite members via email  
- Accept/decline invitations  
- Track team formation status  
- Real-time project syncing via Firestore  

### 📊 Task Progress Tracking
- Assign tasks (Lead only)  
- Toggle completed status  
- Auto progress calculation  
- Live updates for all team members  

### 📝 Report Writing & Submission
- Markdown-style long text editor  
- Attach external file links (Drive/MediaFire)  
- Save drafts  
- Final submission lock  

### 🛡️ Admin Console
- View all projects & users  
- Edit project name / team name  
- Delete projects & user data  
- Open detailed submission view  
- Evaluate submissions (Rubric-based)  
- Provide feedback  
- Mark evaluation as complete  

### 🎨 Dynamic UI / UX
- TailwindCSS styling  
- Light & dark theme  
- Admin-specific accent theme  
- Responsive layout  
- Toast notifications  

---

## 🏗️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React + Hooks |
| Styling | TailwindCSS |
| Backend | Firebase Authentication |
| Database | Firebase Firestore |
| Deployment | Vercel / Netlify |

---

## 📂 Folder Structure (Simplified)

```
src/
 ├── App.jsx
 ├── index.js
 ├── styles.css
public/
 └── logo.png
```

> The entire application currently lives inside a single `App.jsx` file for simplicity.

---

## 🔧 Setup Guide (Beginner Friendly)

### 1️⃣ Install Node.js

Download from: https://nodejs.org

Check installation:

```bash
node -v
npm -v
```

---

### 2️⃣ Create Your Project (Vite)

```bash
npm create vite@latest acadex
cd acadex
npm install
```

Replace the default `App.jsx` with your own.

---

### 3️⃣ Install Dependencies

```bash
npm install firebase
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Enable Tailwind in **tailwind.config.js**:

```js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: { extend: {} },
  plugins: [],
}
```

Add Tailwind imports to **index.css**:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 🔐 Firebase Setup

Your Firebase config should look like this inside `App.jsx`:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
};
```

Ensure the following are enabled in Firebase Console:  
✔ Authentication  
✔ Firestore Database  

---

## ▶️ Running the App

```bash
npm run dev
```

Open the local URL shown in your terminal.

---

## 🛠️ Core Features Explained

### 1. User Profiles
Stored in Firestore at:

```
artifacts/{appId}/users/{userId}
```

### 2. Projects

Stored under:

```
artifacts/{appId}/public/data/projects
```

Each project includes tasks, report, members list, evaluation, and supporting files.

### 3. Task Structure

```json
{
  "id": "uuid",
  "title": "",
  "assigneeId": "",
  "assigneeName": "",
  "dueDate": "",
  "completed": false
}
```

---

## 🛡️ Admin Panel Features

Admins can:

- View all projects  
- View all registered users  
- Edit project/team name  
- Delete project or user data  
- Open project submission details  
- Evaluate using rubric  
- Mark evaluation status  

### Rubric:
- Innovation: 40 pts  
- Execution: 30 pts  
- Documentation: 30 pts  

---

## 🌐 Deployment (Vercel)

1. Push your repo to GitHub  
2. Go to https://vercel.com  
3. Import your repository  
4. Build command:

```
npm run build
```

5. Output directory:

```
dist
```

6. Deploy 🎉

---

## 🧩 Environment Variables (Optional)

To hide Firebase config, create:

```
.env
```

Add:

```
VITE_API_KEY=xxxx
VITE_AUTH_DOMAIN=xxxx
VITE_PROJECT_ID=xxxx
VITE_STORAGE_BUCKET=xxxx
VITE_MESSAGING_SENDER_ID=xxxx
VITE_APP_ID=xxxx
```

Use inside code:

```js
apiKey: import.meta.env.VITE_API_KEY
```

---

## 🤝 Contributing

1. Fork the repository  
2. Create feature branch  
3. Commit changes  
4. Push and open PR  

---

## 🧯 Troubleshooting

### Firebase Auth not working?
Enable:
- Email/Password  
- Google  
- Anonymous  

### Firestore Permission Denied?
Use this during development:

```js
allow read, write: if true;
```

---

## 🎉 Summary

Acadex is a powerful academic project management system supporting:

✔ Authentication  
✔ Team creation  
✔ Real-time task tracking  
✔ Report writing  
✔ Admin evaluation  
✔ Beautiful UI/UX with Tailwind  
✔ Fully Firebase-backed  

This app is ready for deployment and expansion.

---

## 📄 License

MIT License (recommended).  
Ask if you'd like me to generate one for you.
