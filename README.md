<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,12,20&height=200&section=header&text=Acadex&fontSize=70&fontColor=ffffff&animation=twinkling&fontAlignY=35&desc=Student%20Academic%20Project%20Management%20System&descAlignY=55&descSize=20" />

# 🎓 Student Academic Project Management System

### A Modern, Full-Featured Platform for Managing Academic Projects

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Admin Access](#-admin-credentials)

</div>

---

## 📋 Overview

The **Student Academic Project Management System** is a comprehensive web application designed to streamline the management of academic projects. Built with modern technologies, it provides an intuitive interface for students and administrators to collaborate, track progress, and evaluate projects efficiently.

### 🎯 Perfect For

- 🏫 Universities and Educational Institutions
- 👨‍🎓 Student Project Teams
- 👨‍🏫 Faculty and Administrators
- 📊 Academic Project Evaluation

---

## ✨ Features

### 🔐 **Authentication & User Management**
- Email/Password authentication
- Google Sign-In integration
- Role-based access control (Students, Team Leads, Admins)
- User profile management with avatars

### 👥 **Team Registration & Management**
- Create and register project teams
- Invite team members via email
- Team proposal system with acceptance workflow
- Automatic team lead assignment

### 📈 **Advanced Progress Tracking**
- **Multiple View Modes**: List, Kanban Board, and Calendar views
- Task assignment and due date management
- Real-time progress updates
- Task commenting system for collaboration
- Status tracking (To Do → In Progress → Done)

### 📄 **Report Submission System**
- Submit project reports with document links
- Version control for multiple submissions
- Download and review previous submissions
- Submission history tracking

### 💾 **Project Database**
- Centralized project repository
- Advanced search and filtering
- Project metadata management
- Team information display

### 🎯 **Comprehensive Evaluation Model**
- Multi-criteria evaluation system
  - Innovation & Originality
  - Execution & Functionality
  - Documentation Quality
- Weighted scoring mechanism
- Admin-only evaluation interface
- Detailed feedback system
- Real-time grade calculations

### 🎨 **Modern UI/UX**
- Dark/Light theme toggle
- Responsive design for all devices
- Glassmorphism effects
- Smooth animations and transitions
- Mobile-friendly navigation
- Toast notifications for user feedback

---

## 🔑 Admin Credentials

### Default Administrator Accounts

The system recognizes the following email addresses as administrators with full privileges:

```
📧 Email: admin@acadex.edu
🔐 Password: admin@123

📧 Email: admin@protrack.edu  
🔐 Password: (Set during first-time setup)
```

> **Note**: Admin users have access to:
> - Project evaluation interface
> - All team data and submissions
> - User management capabilities
> - System-wide analytics
> - Enhanced UI with admin branding (cyan accents)

### Setting Up Admin Account

1. Navigate to the signup page
2. Register using one of the admin email addresses above
3. Set your secure password
4. Admin privileges will be automatically granted

---

## 🛠️ Tech Stack

### Frontend
- **[React](https://reactjs.org/) 18.3.1** - Modern UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Vite](https://vitejs.dev/)** - Lightning-fast build tool
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library

### UI Components
- **[shadcn/ui](https://ui.shadcn.com/)** - High-quality component library
- **[Radix UI](https://www.radix-ui.com/)** - Accessible primitives
- **[React Router DOM](https://reactrouter.com/)** - Client-side routing
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

### State Management & Data
- **React Hooks** - Built-in state management
- **[TanStack Query](https://tanstack.com/query/)** - Server state management
- **[React Hook Form](https://react-hook-form.com/)** - Form handling
- **[Zod](https://zod.dev/)** - Schema validation

### Additional Features
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Dark Mode integration
- **[tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate)** - Animations
- **[date-fns](https://date-fns.org/)** - Date Handling
- **[Recharts](https://recharts.org/)** - Charts for data visualization

---

## 📦 Installation

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **bun** package manager
- Modern web browser

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/student-project-management.git
cd student-project-management
```

### Step 2: Install Dependencies

```bash
npm install
# or
bun install
```

### Step 3: Environment Configuration

Create a `.env` file in the root directory:

```env
# Firebase Configuration (if using external backend)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Step 4: Start Development Server

```bash
npm run dev
# or
bun run dev
```

The application will be available at `http://localhost:8080`

---

## 🚀 Usage

### For Students

1. **Sign Up**: Create an account using your institutional email
2. **Create/Join Team**: Register a new project team or accept an invitation
3. **Track Progress**: Add tasks, set deadlines, and update status
4. **Submit Reports**: Upload project documentation and reports
5. **View Evaluation**: Check your project scores and feedback

### For Team Leads

- All student capabilities, plus:
- Create and manage project teams
- Invite team members
- Assign tasks to team members
- Manage team submission deadlines

### For Administrators

- All student/lead capabilities, plus:
- Access evaluation interface
- Review all project submissions
- Provide detailed feedback and scores
- View system-wide analytics
- Manage user accounts

---

## 📱 Screenshots

### Dashboard
Modern, intuitive dashboard with quick access to all features.

### Team Registration
Streamlined team creation with member invitation system.

### Progress Tracking
Multiple views (List, Kanban, Calendar) for flexible task management.

### Evaluation Interface
Comprehensive scoring system with detailed feedback capabilities.

---

## 🗂️ Project Structure

```
student-project-management/
├── public/
│   ├── robots.txt
│   └── favicon.ico
├── src/
│   ├── assets/              # Static assets
│   ├── components/
│   │   ├── ui/              # Shadcn UI components
│   │   ├── Navigation.tsx   # Main navigation
│   │   └── NavLink.tsx      # Navigation links
│   ├── pages/
│   │   ├── Home.tsx         # Landing page
│   │   ├── Teams.tsx        # Team management
│   │   ├── Projects.tsx     # Project database
│   │   ├── Evaluation.tsx   # Evaluation interface
│   │   └── NotFound.tsx     # 404 page
│   ├── hooks/               # Custom React hooks
│   │   └── use-mobile.tsx
│   ├── lib/                 # Utility functions
│   │   └── utils.ts
│   ├── App.tsx              # Main app component
│   ├── App.css              # App styles
│   ├── index.css            # Global styles & design tokens
│   └── main.tsx             # Application entry point
├── index.html
├── tailwind.config.ts       # Tailwind configuration
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── package.json
└── README.md
```

---

## 🎨 Design System

The application uses a carefully crafted design system with:

- **Color Palette**: Dark blue and cyan accents for modern look
- **Typography**: System fonts with careful hierarchy
- **Spacing**: Consistent 4px/8px grid system
- **Components**: Reusable, themed components
- **Animations**: Smooth, performant transitions
- **Responsive**: Mobile-first approach

---

## 🔒 Security Features

- Secure authentication flow
- Role-based access control
- Protected routes
- Environment variable management
- Input validation and sanitization
- XSS protection

---

## 🌐 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

---

## 📈 Performance

- ⚡ Lightning-fast Vite build
- 🎯 Code splitting for optimal loading
- 📦 Optimized bundle size
- 🔄 Efficient re-rendering
- 💾 Smart caching strategies

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use semantic commit messages
- Write meaningful comments
- Test your changes thoroughly
- Update documentation as needed

---

## 🐛 Bug Reports

Found a bug? Please open an issue with:

- Detailed description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser/OS information

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Authors

Created with ❤️ by Sanchit & Kartik!

---

## 🙏 Acknowledgments

- [Lovable](https://lovable.dev) - Development platform
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Lucide](https://lucide.dev/) - Icon library
- All contributors and testers

---

## 📞 Support

Need help? Reach out:

- 📧 Email: notyouravgsulphur@gmail.com
- 🐛 Issues: [Report Bug](https://github.com/xsanchitgupta/acadex/issues)


---

<div align="center">

### ⭐ Star this repository if you find it helpful!

Made with 💙 using React, TypeScript, and Tailwind CSS

**[Back to Top](#-student-academic-project-management-system)**

---

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,12,20&height=150&section=footer&text=Thank%20You!&fontSize=50&fontColor=ffffff&animation=twinkling&fontAlignY=70" />

</div>
