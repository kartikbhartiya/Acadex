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

src/
├── App.jsx
├── index.js
├── styles.css
public/
└── logo.png

yaml
Copy code

> The entire application currently lives inside a single `App.jsx` file for simplicity.

---

## 🔧 Setup Guide (Beginner Friendly)

### 1️⃣ Install Node.js  
Download from: https://nodejs.org  

Check installation:

```sh
node -v
npm -v
2️⃣ Create Your Project (Vite)
sh
Copy code
npm create vite@latest acadex
cd acadex
npm install
Replace the default App.jsx with your own.

3️⃣ Install Dependencies
sh
Copy code
npm install firebase
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
Enable Tailwind in tailwind.config.js:

js
Copy code
content: [
  "./index.html",
  "./src/**/*.{js,jsx}",
]
Add Tailwind imports to index.css:

css
Copy code
@tailwind base;
@tailwind components;
@tailwind utilities;
4️⃣ Firebase Configuration
Inside App.jsx, the Firebase config already exists:

js
Copy code
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
};
Ensure Firebase Authentication & Firestore are enabled in the console.

5️⃣ Run the App
sh
Copy code
npm run dev
Open the URL shown in your terminal.

🔐 Authentication Flow
Available login options:

Email/Password

Google OAuth

Guest account

Admins are detected using:

js
Copy code
const ADMIN_EMAILS = ["admin@acadex.edu", "admin@protrack.edu"];
🛠️ Core Features Explained
🧍 1. User Profiles
Every user can configure:

Display name

Title / Role

Bio

Profile picture (Base64 stored)

Stored in Firestore under:

bash
Copy code
artifacts/{appId}/users/{userId}
🧩 2. Project Creation
Each project includes:

Team name

Project title

List of members

Tasks

Reports

Files (Drive/MediaFire links)

Evaluation data

Stored under:

swift
Copy code
artifacts/{appId}/public/data/projects
⏳ 3. Tasks (Progress Tracking)
A task object looks like:

json
Copy code
{
  "id": "uuid",
  "title": "",
  "assigneeId": "",
  "assigneeName": "",
  "dueDate": "",
  "completed": false
}
Real-time updates are triggered using Firestore onSnapshot.

🛡️ Admin Panel Features
Admins can:

View all submissions

Edit project/team name

Delete projects

Delete users

Open detailed submission view

Evaluate reports using rubric

Enter feedback

Mark evaluation as “Completed”

Rubric:
Innovation (40 pts)

Execution (30 pts)

Documentation (30 pts)

Total auto-calculated.

🌐 Deployment (Vercel Guide)
Push your repo to GitHub

Visit https://vercel.com

Import the repo

Build command:

arduino
Copy code
npm run build
Output directory:

nginx
Copy code
dist
Deploy 🚀

📄 Environment Variables (Optional)
To hide Firebase config, create:

bash
Copy code
.env
Add:

ini
Copy code
VITE_API_KEY=xxxx
VITE_AUTH_DOMAIN=xxxx
VITE_PROJECT_ID=xxxx
VITE_STORAGE_BUCKET=xxxx
VITE_MESSAGING_SENDER_ID=xxxx
VITE_APP_ID=xxxx
Then use:

js
Copy code
apiKey: import.meta.env.VITE_API_KEY
🤝 Contributing
Fork the repository

Create a feature branch

Run the project locally

Commit improvements

Open a pull request

Good contributions:

Splitting large App.jsx into components

Adding true file uploads

Adding guides/instructor roles

UI/UX polish

Adding notifications / email triggers

🧯 Troubleshooting
Firebase Auth not working?
Enable:

Email/Password

Google

Anonymous

Firestore Permission Denied?
During testing:

js
Copy code
allow read, write: if true;
Project won't save?
Regenerate Firestore indexes if needed.

🎉 Summary
Acadex is a complete, production-ready Academic Project Management System featuring:

✔ Authentication
✔ Team management
✔ Real-time task tracking
✔ Report writing & submission
✔ Full admin review system
✔ Beautiful UI/UX with Tailwind
✔ Auto theme + admin UI

Ready to deploy, extend, and use.

⭐ License
You may choose MIT, Apache-2.0, or any license you prefer.
