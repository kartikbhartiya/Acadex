import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    getAuth, 
    signInAnonymously, 
    onAuthStateChanged,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile
} from 'firebase/auth';
import { 
    getFirestore, 
    doc, 
    collection, 
    query, 
    getDocs, 
    getDoc,
    addDoc,
    updateDoc, 
    setDoc,
    onSnapshot,
    serverTimestamp,
    deleteDoc
} from 'firebase/firestore';

// ==========================================
// CONFIGURATION
// ==========================================
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// ==========================================
// ANIMATION VARIANTS
// ==========================================
const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: "easeIn" } }
};

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

// ==========================================
// ICONS
// ==========================================
const Icon = ({ children, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{children}</svg>
);
const ProgressIcon = (props) => <Icon {...props}><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></Icon>;
const ReportIcon = (props) => <Icon {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></Icon>;
const DatabaseIcon = (props) => <Icon {...props}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12A9 9 0 0 0 21 12"/><path d="M3 19A9 9 0 0 0 21 19"/></Icon>;
const EvaluateIcon = (props) => <Icon {...props}><path d="M12 20h.01"/><path d="M8.2 11.2a2 2 0 1 0 2.8 2.8"/><path d="M14.8 11.2a2 2 0 1 0 2.8 2.8"/><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 18z"/></Icon>;
const PlusIcon = (props) => <Icon {...props}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Icon>;
const TrashIcon = (props) => <Icon {...props}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M15 6V4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2"/></Icon>;
const CheckCircleIcon = (props) => <Icon {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></Icon>;
const LogOutIcon = (props) => <Icon {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Icon>;
const UserIcon = (props) => <Icon {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Icon>;
const SunIcon = (props) => <Icon {...props}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></Icon>;
const MoonIcon = (props) => <Icon {...props}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></Icon>;
const ShieldIcon = (props) => <Icon {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></Icon>;
const LinkIcon = (props) => <Icon {...props}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></Icon>;
const FileIcon = (props) => <Icon {...props}><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></Icon>;
const SaveIcon = (props) => <Icon {...props}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></Icon>;
const SendIcon = (props) => <Icon {...props}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></Icon>;
const MailIcon = (props) => <Icon {...props}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></Icon>;
const ClockIcon = (props) => <Icon {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Icon>;
const CameraIcon = (props) => <Icon {...props}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></Icon>;
const EyeIcon = (props) => <Icon {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></Icon>;
const EyeOffIcon = (props) => <Icon {...props}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></Icon>;
const GoogleIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>;
const LinkExternalIcon = (props) => <Icon {...props}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></Icon>;
const HomeIcon = (props) => <Icon {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></Icon>;
const MenuIcon = (props) => <Icon {...props}><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></Icon>;
const XIcon = (props) => <Icon {...props}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Icon>;
const EditIcon = (props) => <Icon {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></Icon>;
const CodeIcon = (props) => <Icon {...props}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></Icon>;
const UsersIcon = (props) => <Icon {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Icon>;
const LayoutIcon = (props) => <Icon {...props}><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></Icon>;
const CalendarIcon = (props) => <Icon {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></Icon>;
const MessageSquareIcon = (props) => <Icon {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></Icon>;
const BellIcon = (props) => <Icon {...props}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></Icon>;
const DownloadIcon = (props) => <Icon {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></Icon>;
const PieChartIcon = (props) => <Icon {...props}><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></Icon>;
const ArrowRightIcon = (props) => <Icon {...props}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></Icon>;
const CheckIcon = (props) => <Icon {...props}><polyline points="20 6 9 17 4 12" /></Icon>;

// ==========================================
// UI COMPONENTS (Enhanced with Framer Motion)
// ==========================================

const Card = ({ children, className = "", theme, noHover }) => (
    <motion.div 
        whileHover={!noHover ? { y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)" } : {}}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`${theme?.card || 'bg-cyan dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl'} rounded-3xl p-6 transition-colors duration-300 ${className}`}
    >
        {children}
    </motion.div>
);

const Button = ({ children, variant = "primary", onClick, className = "", theme, disabled, isLoading, ...props }) => (
    <motion.button 
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        onClick={onClick} 
        disabled={disabled || isLoading}
        className={`px-6 py-3 rounded-xl font-semibold transition-colors duration-300 flex items-center justify-center space-x-2 
        disabled:opacity-50 disabled:cursor-not-allowed 
        ${variant === 'primary' 
            ? (theme?.accentPrimary || 'bg-indigo-600 text-white hover:bg-indigo-700') 
            : (theme?.accentSecondary || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700')} 
        ${className}`} 
        {...props}
    >
        {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        ) : children}
    </motion.button>
);

const Input = ({ className = "", theme, ...props }) => (
    <motion.input 
        whileFocus={{ scale: 1.01, boxShadow: "0px 0px 0px 2px rgba(99, 102, 241, 0.2)" }}
        {...props} 
        className={`w-full px-4 py-3 rounded-xl transition-all outline-none border 
        ${theme?.input || 'bg-cyan dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white'}
        placeholder-slate-400 dark:placeholder-slate-500
        focus:border-indigo-600 ${className}`} 
    />
);

const Skeleton = ({ className }) => <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl ${className}`}></div>;

const SkeletonCard = () => (
    <div className="w-full p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-4 pt-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
        </div>
    </div>
);

// ==========================================
// CONSTANTS
// ==========================================
const VIEWS = { DASHBOARD: 'Dashboard', REGISTRATION: 'Registration', TRACKING: 'Progress', REPORTS: 'Reports', DATABASE: 'Projects', EVALUATION: 'Evaluation', ADMIN: 'Admin', PROFILE: 'Profile' };
const AUTH_VIEWS = { INIT: 'Initial', LOGIN: 'Login', SIGNUP: 'SignUp' };
const INITIAL_EVALUATION = { score: 0, feedback: "Awaiting review.", status: "Pending", breakdown: { innovation: 0, execution: 0, documentation: 0 } };
const ADMIN_EMAILS = ["admin@acadex.edu", "admin@protrack.edu"];
const ANONYMOUS_NAME_PREFIX = "Guest_";

// ==========================================
// MAIN APP COMPONENT
// ==========================================
export default function App() {
    // -- State --
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userProfile, setUserProfile] = useState({ bio: '', title: 'Student', photoURL: '' });
    const [currentView, setCurrentView] = useState(VIEWS.DASHBOARD);
    const [projects, setProjects] = useState([]);
    const [allUsers, setAllUsers] = useState([]); 
    const [userTeam, setUserTeam] = useState(null);
    const [error, setError] = useState(null);
    const [authView, setAuthView] = useState(AUTH_VIEWS.INIT);
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const [adminSelectedProject, setAdminSelectedProject] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showRawData, setShowRawData] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);
    const [showWelcome, setShowWelcome] = useState(true);

    // -- Toast System --
    const [toasts, setToasts] = useState([]);
    const addToast = (type, msg) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, msg }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    const toggleTheme = () => setDarkMode(!darkMode);
    
    // -- Theme Config (Refined for High Contrast & Readability) --
    const theme = {
        appBg: darkMode ? 'bg-slate-950' : 'bg-gray-50', 
        navBg: darkMode 
            ? (isUserAdmin ? 'bg-slate-900 border-b border-cyan-900/50' : 'bg-slate-900 border-b border-slate-800')
            : 'bg-cyan border-b border-slate-200 shadow-sm',
        textPrimary: darkMode ? 'text-gray-100' : 'text-slate-900',
        textSecondary: darkMode ? 'text-slate-400' : 'text-slate-600',
        textHighlight: darkMode ? 'text-white' : 'text-indigo-900',
        heading: darkMode ? 'text-white tracking-tight' : 'text-slate-900 tracking-tight',
        card: darkMode 
            ? 'bg-slate-900 border border-slate-800 shadow-xl shadow-black/20' 
            : 'bg-cyan border border-slate-200 shadow-lg shadow-slate-200/60',
        input: darkMode 
            ? 'bg-slate-950 text-white border-slate-700 focus:border-indigo-500 placeholder-slate-600' 
            : 'bg-slate-50 text-slate-900 border-slate-300 focus:border-indigo-600 placeholder-slate-400',
        accentPrimary: isUserAdmin 
            ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20 border border-transparent' 
            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20 border border-transparent',
        accentSecondary: darkMode 
            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700' 
            : 'bg-cyan hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm',
        navActive: isUserAdmin 
            ? 'text-cyan-400 border border-cyan-500/20' 
            : 'text-indigo-600 border border-indigo-500/20',
        navItem: darkMode 
            ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50' 
            : 'text-slate-500 hover:text-indigo-700 hover:bg-slate-100',
    };

    const navItems = useMemo(() => {
        const items = [
            { id: VIEWS.DASHBOARD, label: 'Dashboard', IconComponent: HomeIcon },
        ];

        if (!isUserAdmin) {
            items.push(
                { id: VIEWS.REGISTRATION, label: 'Register', IconComponent: PlusIcon },
                { id: VIEWS.TRACKING, label: 'Tracking', IconComponent: ProgressIcon },
                { id: VIEWS.REPORTS, label: 'Reports', IconComponent: ReportIcon }
            );
        }

        items.push({ id: VIEWS.DATABASE, label: 'Projects', IconComponent: DatabaseIcon });

        if (isUserAdmin) {
            items.push({ id: VIEWS.ADMIN, label: 'Admin', IconComponent: ShieldIcon });
        } else {
            items.push({ id: VIEWS.EVALUATION, label: 'Results', IconComponent: EvaluateIcon });
        }

        return items;
    }, [isUserAdmin]);

    // -- Firebase Init --
    useEffect(() => {
        if (!firebaseConfig.apiKey) { setError("Env Vars Missing! Check .env file."); return; }
        try {
            const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
            setDb(getFirestore(app));
            setAuth(getAuth(app));
        } catch (e) { setError(`Init Failed: ${e.message}`); }
    }, []);

    // -- Auth State Listener & DB Sync --
    useEffect(() => {
        if (!auth || !db) return;
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserId(user.uid);
                const email = user.email || '';
                setUserEmail(email);
                const name = user.displayName || (user.isAnonymous ? `${ANONYMOUS_NAME_PREFIX}${user.uid.slice(0,4)}` : email.split('@')[0]);
                setUserName(name);
                setIsUserAdmin(ADMIN_EMAILS.includes(email.toLowerCase()));
                setShowWelcome(false); // Auto-hide welcome if logged in

                const userDocRef = doc(db, 'artifacts', appId, 'users', user.uid);
                try {
                    const docSnap = await getDoc(userDocRef);
                    if (!docSnap.exists()) {
                        await setDoc(userDocRef, {
                            displayName: name,
                            email: email,
                            photoURL: user.photoURL || '',
                            title: 'Student',
                            bio: '',
                            createdAt: serverTimestamp(),
                            updatedAt: serverTimestamp()
                        });
                    }
                } catch (e) {
                    console.error("Error syncing user to DB:", e);
                }

            } else {
                setUserId(null);
                setIsUserAdmin(false);
                setUserEmail('');
                setUserProfile({ bio: '', title: 'Student', photoURL: '' }); 
                setProjects([]);
                setUserTeam(null);
                setAllUsers([]);
            }
            setIsAuthReady(true);
        });
        return () => unsubscribe();
    }, [auth, db]);

    useEffect(() => {
        if (!db || !userId) return;
        const userDocRef = doc(db, 'artifacts', appId, 'users', userId);
        
        const fetchProfile = async () => {
            try {
                const docSnap = await getDoc(userDocRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setUserProfile({
                        bio: data.bio || '',
                        title: data.title === 'Admin' && !isUserAdmin ? 'Student' : (data.title || 'Student'),
                        photoURL: data.photoURL || ''
                    });
                    if (data.displayName) setUserName(data.displayName);
                }
            } catch (e) {
                console.warn("Profile fetch warning:", e);
            }
        };
        fetchProfile();
    }, [db, userId, appId, isUserAdmin]);

    useEffect(() => {
        if (!db || !isUserAdmin) return;
        const q = query(collection(db, 'artifacts', appId, 'users'));
        const unsub = onSnapshot(q, (snap) => {
            const users = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setAllUsers(users);
        });
        return () => unsub();
    }, [db, isUserAdmin, appId]);

    // Action Handler
    const handleAction = async (action, ...args) => {
        setAuthLoading(true);
        try {
            if (action === 'login') await signInWithEmailAndPassword(auth, ...args);
            if (action === 'signup') await createUserWithEmailAndPassword(auth, ...args);
            if (action === 'google') await signInWithPopup(auth, new GoogleAuthProvider());
            if (action === 'anon') await signInAnonymously(auth);
            if (action === 'logout') { 
                await signOut(auth); 
                setCurrentView(VIEWS.DASHBOARD); 
                setAuthView(AUTH_VIEWS.INIT);
                setShowWelcome(true); // Reset to welcome page on logout
            }
            
            addToast('success', action === 'logout' ? 'Logged out' : 'Success!');
            if (action !== 'logout') setAuthView(AUTH_VIEWS.INIT);
        } catch (e) { 
            let msg = e.message;
            if(msg.includes('auth/invalid-credential')) msg = "Invalid email or password.";
            if(msg.includes('auth/email-already-in-use')) msg = "Email already in use.";
            addToast('error', msg); 
        } finally {
            setAuthLoading(false);
        }
    };

    // Projects Listener
    useEffect(() => {
        if (!db || !userId) return;
        const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'projects'));
        const unsub = onSnapshot(q, (snap) => {
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setProjects(data);
            
            const myTeam = data.find(p => 
                p.members?.some(m => m.id === userId || (m.email && m.email === userEmail && userEmail !== ''))
            );
            setUserTeam(myTeam || null);
        });
        return () => unsub();
    }, [db, userId, appId, userEmail]);

    // -- Core Logic Functions --
    const registerTeam = async (tName, pName, memberEmails) => {
        if (!userEmail) return addToast('error', 'You must have an email to register a team.');
        if (memberEmails.length === 0) return addToast('error', 'You must invite at least one team member.');
        if (projects.some(p => p.name.toLowerCase() === pName.toLowerCase())) return addToast('error', 'Project name taken');
        
        const newMembers = [
            { id: userId, name: userName, email: userEmail, role: "Lead", status: "accepted" },
            ...memberEmails.map(email => ({ email: email.trim(), role: "Member", status: "pending", name: "Invited User" }))
        ];

        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'projects'), {
            teamName: tName, name: pName, members: newMembers, description: `Project ${pName}`,
            tasks: [], 
            report: "", reportStatus: "Draft", resources: [], files: [], evaluation: INITIAL_EVALUATION, createdAt: serverTimestamp()
        });
        addToast('success', 'Team Registered! Invitations sent.');
        setCurrentView(VIEWS.DASHBOARD);
    };

    const acceptInvite = async () => {
        if (!userTeam) return;
        const updatedMembers = userTeam.members.map(m => 
            (m.email === userEmail) ? { ...m, id: userId, name: userName, status: 'accepted' } : m
        );
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'projects', userTeam.id), { members: updatedMembers });
        addToast('success', 'Invitation Accepted!');
    };

    const declineInvite = async () => {
        if (!userTeam) return;
        const updatedMembers = userTeam.members.filter(m => m.email !== userEmail);
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'projects', userTeam.id), { members: updatedMembers });
        addToast('info', 'Invitation Declined');
        setUserTeam(null);
    };

    const updateReport = async (report, resources, files, status = "Draft") => {
        const isConfirmed = status !== 'Submitted' || window.confirm("Are you sure you want to submit the final report? It will be locked for editing.");
        if (status === 'Submitted' && !isConfirmed) return;
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'projects', userTeam.id), { report, resources, files, reportStatus: status });
        addToast('success', status === 'Submitted' ? 'Submitted Successfully!' : 'Draft Saved');
    };

    const deleteProj = async (id) => {
        if (window.confirm("Are you sure you want to permanently delete this project?")) {
            await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'projects', id));
            addToast('success', 'Project Deleted');
        }
    };
    
    const deleteUser = async (id) => {
        if (window.confirm("WARNING: This will delete the user's profile data. It will NOT delete their login account (Auth). Continue?")) {
            try {
                await deleteDoc(doc(db, 'artifacts', appId, 'users', id));
                addToast('success', 'User data deleted from directory.');
            } catch (e) {
                addToast('error', 'Failed to delete user data.');
            }
        }
    };

    const updateProjectName = async (id, newName, newTeamName) => {
        try {
             await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'projects', id), {
                 name: newName,
                 teamName: newTeamName
             });
             addToast('success', 'Project details updated.');
        } catch(e) {
            addToast('error', 'Failed update.');
        }
    };

    const isTeamActive = useMemo(() => {
        return userTeam && userTeam.members.every(m => m.status === 'accepted');
    }, [userTeam]);

    const notifications = useMemo(() => {
        if (!userTeam) return [];
        const alerts = [];
        if (userTeam.evaluation?.status === 'Completed') alerts.push({ id: 1, text: "Project Graded! Check results.", type: 'success' });
        const pendingTasks = (userTeam.tasks || []).filter(t => !t.completed).length;
        if (pendingTasks > 0) alerts.push({ id: 2, text: `You have ${pendingTasks} pending tasks.`, type: 'info' });
        return alerts;
    }, [userTeam]);

    // -- Nav Item Component (Localized) --
    // -- UPDATED: Removed layoutId to fix "strange blue color" issue --
    const NavItem = ({ view, label, IconComponent }) => (
        <button
            onClick={() => { setCurrentView(view); setIsMobileMenuOpen(false); }}
            className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-3 overflow-hidden z-10 
            ${currentView === view ? theme.navActive : theme.navItem}`}
        >
            {currentView === view && (
                <motion.div
                    // Removed layoutId="nav-bg" to prevent the morphing stretch effect
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute inset-0 z-0 ${isUserAdmin ? 'bg-cyan-500' : 'bg-indigo-500'}`}
                    transition={{ duration: 0.2 }}
                />
            )}
            <IconComponent className="w-5 h-5 flex-shrink-0 z-10 relative" />
            <span className="truncate z-10 relative">{label}</span>
        </button>
    );
    
    // -- Enhanced Theme Switch --
    const ThemeSwitch = () => (
        <div onClick={toggleTheme} className="flex items-center cursor-pointer">
            <div className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${darkMode ? 'bg-slate-800' : 'bg-slate-200'} shadow-inner p-1`}>
                <motion.div
                    className={`w-6 h-6 rounded-full shadow-md flex items-center justify-center ${darkMode ? 'bg-slate-600' : 'bg-white'}`}
                    layout
                    transition={{ type: "spring", stiffness: 700, damping: 30 }}
                    animate={{ x: darkMode ? 24 : 0 }} 
                >
                    <motion.div
                        key={darkMode ? "moon" : "sun"}
                        initial={{ scale: 0.5, rotate: -90, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0.5, rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {darkMode ? <MoonIcon className="w-4 h-4 text-slate-200" /> : <SunIcon className="w-4 h-4 text-amber-500" />}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );

    const Footer = () => (
        <footer className={`w-full py-8 mt-auto ${darkMode ? 'bg-slate-950 border-t border-slate-800 text-slate-400' : 'bg-slate-50 border-t border-slate-200 text-slate-500'}`}>
            <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="Acadex" className="h-6 w-auto opacity-50 grayscale" />
                    <span className="text-sm font-semibold">Acadex</span>
                </div>
                <p className="text-sm">© {new Date().getFullYear()} Acadex. All rights reserved.</p>
            </div>
        </footer>
    );

    // --- Enhanced Welcome Page ---
    const WelcomeLanding = ({ onGetStarted }) => {
        const scrollToFeatures = () => {
            const el = document.getElementById('features-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        };

        return (
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className={`min-h-screen flex flex-col ${theme.appBg} transition-colors duration-500 overflow-x-hidden`}>
                {/* Hero Section */}
                <div className="relative flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden">
                    {/* Background Decor */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 10, repeat: Infinity }} className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></motion.div>
                        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 12, repeat: Infinity, delay: 2 }} className="absolute top-1/2 -right-20 w-72 h-72 bg-fuchsia-500/20 rounded-full blur-3xl"></motion.div>
                        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
                    </div>

                    <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 pt-10">
                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="space-y-8"
                        >
                            <motion.div variants={itemVariants}>
                                <motion.div whileHover={{ rotate: 10 }} className="w-20 h-20 flex items-center justify-center mb-6 bg-gradient-to-br from-indigo-500 to-fuchsia-600 rounded-2xl shadow-lg text-white">
                                    <img src="/logo.png" alt="Acadex" className="h-12 w-auto object-contain brightness-0 invert" />
                                </motion.div>
                                <h1 className={`text-5xl md:text-7xl font-black leading-tight ${theme.heading}`}>
                                    Elevate Your <br/>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-fuchsia-500">Academic Journey</span>
                                </h1>
                                <p className={`text-lg md:text-xl ${theme.textSecondary} max-w-lg mt-6 leading-relaxed`}>
                                    The all-in-one platform for students and faculty to manage projects, track real-time progress, and streamline the grading process with ease.
                                </p>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                                <Button theme={theme} onClick={onGetStarted} className="px-8 py-4 text-lg shadow-lg shadow-indigo-500/30">
                                    Get Started <ArrowRightIcon className="w-5 h-5 ml-2" />
                                </Button>
                                <motion.button whileTap={{scale: 0.95}} onClick={scrollToFeatures} className={`px-8 py-4 rounded-xl font-semibold flex items-center justify-center border ${darkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
                                    Learn More
                                </motion.button>
                            </motion.div>

                            <motion.div variants={itemVariants} className="pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-6">
                                {[
                                    { label: 'Active Projects', val: '8' },
                                    { label: 'Users', val: '19' },
                                    { label: 'Satisfaction', val: '99%' }
                                ].map((stat, i) => (
                                    <div key={i}>
                                        <div className={`text-2xl font-bold ${theme.textPrimary}`}>{stat.val}</div>
                                        <div className={`text-xs uppercase tracking-wider ${theme.textSecondary}`}>{stat.label}</div>
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="hidden lg:grid grid-cols-2 gap-4"
                        >
                            <Card theme={theme} className="col-span-2 !p-8 bg-gradient-to-br from-slate-800 to-slate-900 border-none shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                                    <LayoutIcon width="120" height="120" />
                                </div>
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400"><LayoutIcon className="w-8 h-8"/></div>
                                    <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold animate-pulse">Live Demo</div>
                                </div>
                                <h3 className="text-white text-xl font-bold mb-2 relative z-10">Centralized Dashboard</h3>
                                <p className="text-slate-400 text-sm relative z-10">Track deadlines, manage tasks, and visualize progress in one intuitive interface.</p>
                            </Card>
                            <Card theme={theme} className="bg-slate-100 dark:bg-slate-800 border-none">
                                <div className="p-2 bg-fuchsia-100 dark:bg-fuchsia-900/30 w-fit rounded-lg text-fuchsia-600 mb-3"><EvaluateIcon className="w-6 h-6"/></div>
                                <h4 className={`font-bold ${theme.heading}`}>Smart Grading</h4>
                                <p className={`text-xs ${theme.textSecondary} mt-1`}>Automated rubrics & instant feedback.</p>
                            </Card>
                            <Card theme={theme} className="bg-slate-100 dark:bg-slate-800 border-none">
                                <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 w-fit rounded-lg text-cyan-600 mb-3"><UsersIcon className="w-6 h-6"/></div>
                                <h4 className={`font-bold ${theme.heading}`}>Team Sync</h4>
                                <p className={`text-xs ${theme.textSecondary} mt-1`}>Seamless collaboration for groups.</p>
                            </Card>
                        </motion.div>
                    </div>
                    
                    {/* Scroll Down Indicator */}
                    <motion.div 
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer opacity-50 hover:opacity-100" 
                        onClick={scrollToFeatures}
                    >
                         <Icon className="w-8 h-8 text-slate-500"><path d="M7 13l5 5 5-5M7 6l5 5 5-5"/></Icon>
                    </motion.div>
                </div>

                {/* Features Section */}
                <div id="features-section" className={`py-20 px-4 ${darkMode ? 'bg-slate-900/50' : 'bg-slate-100'}`}>
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <span className="text-indigo-500 font-bold tracking-wider uppercase text-sm">Features</span>
                            <h2 className={`text-4xl font-bold mt-2 ${theme.heading}`}>Everything you need to succeed</h2>
                            <p className={`mt-4 max-w-2xl mx-auto ${theme.textSecondary}`}>AcadEx streamlines the chaotic process of project management into a simple, coherent workflow.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                             {[
                                { title: "Kanban Tracking", desc: "Drag and drop tasks to manage workflow status efficiently.", icon: LayoutIcon, color: "text-blue-500", bg: "bg-blue-500/10" },
                                { title: "Real-time Collaboration", desc: "Comment on tasks and sync updates instantly with your team.", icon: UsersIcon, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                                { title: "Secure Submissions", desc: "Submit reports and link external resources in a locked-down environment.", icon: FileIcon, color: "text-fuchsia-500", bg: "bg-fuchsia-500/10" },
                                { title: "Analytics Dashboard", desc: "Admin insights into project completion rates and performance metrics.", icon: PieChartIcon, color: "text-orange-500", bg: "bg-orange-500/10" },
                                { title: "Automated Grading", desc: "Rubric-based evaluation system for standardized scoring.", icon: EvaluateIcon, color: "text-violet-500", bg: "bg-violet-500/10" },
                                { title: "Role Management", desc: "Distinct portals for Students, Team Leads, and Administrators.", icon: ShieldIcon, color: "text-cyan-500", bg: "bg-cyan-500/10" }
                             ].map((f, i) => (
                                 <Card key={i} theme={theme} className="border border-slate-200 dark:border-slate-800">
                                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.bg} ${f.color}`}>
                                         <f.icon className="w-6 h-6" />
                                     </div>
                                     <h3 className={`text-xl font-bold mb-2 ${theme.heading}`}>{f.title}</h3>
                                     <p className={`text-sm leading-relaxed ${theme.textSecondary}`}>{f.desc}</p>
                                 </Card>
                             ))}
                        </div>
                    </div>
                </div>

                {/* How It Works Section */}
                <div className="py-20 px-4">
                    <div className="max-w-5xl mx-auto">
                        <h2 className={`text-3xl font-bold mb-12 text-center ${theme.heading}`}>How It Works</h2>
                        <div className="relative">
                            {/* Connector Line */}
                            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0"></div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                                {[
                                    { step: "01", title: "Sign Up", desc: "Create your student or admin profile." },
                                    { step: "02", title: "Form Team", desc: "Invite members and register a project." },
                                    { step: "03", title: "Track", desc: "Manage tasks and submit updates." },
                                    { step: "04", title: "Evaluate", desc: "Get graded and receive feedback." }
                                ].map((s, i) => (
                                    <div key={i} className={`p-6 rounded-2xl text-center ${theme.card} border border-slate-200 dark:border-slate-700`}>
                                        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mx-auto mb-4 text-lg shadow-lg shadow-indigo-500/30">{s.step}</div>
                                        <h3 className={`text-lg font-bold mb-2 ${theme.heading}`}>{s.title}</h3>
                                        <p className={`text-sm ${theme.textSecondary}`}>{s.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="py-20 px-4">
                     <div className={`max-w-4xl mx-auto rounded-3xl p-12 text-center relative overflow-hidden ${isUserAdmin ? 'bg-gradient-to-r from-cyan-900 to-slate-900' : 'bg-gradient-to-r from-indigo-900 to-slate-900'} shadow-2xl`}>
                        <div className="absolute top-0 right-0 p-4 opacity-10"><DatabaseIcon width="300" height="300" className="text-white"/></div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">Ready to streamline your projects?</h2>
                        <p className="text-indigo-100 mb-8 max-w-2xl mx-auto relative z-10">Join thousands of students and faculty members who are already using AcadEx to achieve academic excellence.</p>
                        <Button theme={theme} onClick={onGetStarted} className="px-10 py-4 text-lg bg-cyan text-indigo-900 hover:bg-indigo-50 border-none shadow-xl mx-auto relative z-10">
                            Get Started Now
                        </Button>
                     </div>
                </div>

                <Footer />
            </motion.div>
        );
    };

    // --- Sub-Views ---
    
    const ProfileView = () => {
        const [formData, setFormData] = useState({
            displayName: userName,
            title: userProfile.title,
            bio: userProfile.bio,
            photoURL: userProfile.photoURL
        });
        const [loading, setLoading] = useState(false);

        const handleImageUpload = (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 1048576) { 
                    addToast('error', 'Image size must be less than 1MB');
                    return;
                }
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData(prev => ({ ...prev, photoURL: reader.result }));
                };
                reader.readAsDataURL(file);
            }
        };

        const saveProfile = async () => {
            if (!isUserAdmin && formData.title.toLowerCase() === 'admin') {
                addToast('error', "You are not authorized to use the title 'Admin'. Reverting to 'Student'.");
                setFormData(prev => ({ ...prev, title: 'Student' }));
                return;
            }

            setLoading(true);
            try {
                if (auth.currentUser) {
                    const profileUpdates = {
                        displayName: formData.displayName
                    };
                    if (formData.photoURL && !formData.photoURL.startsWith('data:')) {
                         profileUpdates.photoURL = formData.photoURL;
                    }
                    await updateProfile(auth.currentUser, profileUpdates);
                }
                
                await setDoc(doc(db, 'artifacts', appId, 'users', userId), {
                    displayName: formData.displayName,
                    title: formData.title,
                    bio: formData.bio,
                    photoURL: formData.photoURL, 
                    email: userEmail,
                    updatedAt: serverTimestamp()
                }, { merge: true });

                setUserName(formData.displayName);
                setUserProfile({ ...userProfile, bio: formData.bio, title: formData.title, photoURL: formData.photoURL });
                addToast('success', 'Profile updated successfully!');
            } catch (e) {
                console.error(e);
                addToast('error', 'Failed to save profile');
            }
            setLoading(false);
        };

        return (
            <div className="max-w-4xl mx-auto">
                <h1 className={`text-3xl font-bold mb-8 ${theme.heading}`}>User Profile Settings</h1>
                <Card theme={theme} className="overflow-hidden !p-0" noHover>
                    <div className={`relative h-40 rounded-t-3xl mb-16 shadow-inner ${isUserAdmin ? 'bg-gradient-to-tr from-cyan-700 to-teal-800' : 'bg-gradient-to-tr from-violet-700 to-fuchsia-800'}`}>
                        <div className="absolute -bottom-12 left-8">
                            <div className="relative group">
                                <div className={`w-28 h-28 rounded-full border-4 ${darkMode ? 'border-slate-950' : 'border-white'} overflow-hidden bg-gray-200 dark:bg-slate-700 flex items-center justify-center shadow-xl`}>
                                    {formData.photoURL ? (
                                        <img key={userId} src={formData.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl font-bold text-gray-400">{formData.displayName?.charAt(0)}</span>
                                    )}
                                </div>
                                <label htmlFor="pic-upload" className={`absolute bottom-0 right-0 p-3 rounded-full text-white cursor-pointer shadow-lg transition-colors transform translate-y-1 translate-x-1 ${isUserAdmin ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-fuchsia-600 hover:bg-fuchsia-700'}`}>
                                    <CameraIcon className="w-5 h-5" />
                                    <input type="file" id="pic-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <div className="px-8 pb-8 space-y-8">
                         <div className="pt-4">
                            <h2 className={`text-2xl font-bold ${theme.heading}`}>{formData.displayName}</h2>
                            <p className={`${isUserAdmin ? 'text-cyan-500' : 'text-fuchsia-500'} font-medium`}>{formData.title}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className={`text-sm font-medium ${theme.textSecondary}`}>Full Name</label>
                                <Input theme={theme} value={formData.displayName} onChange={e => setFormData({...formData, displayName: e.target.value})} />
                            </div>
                             <div className="space-y-2">
                                <label className={`text-sm font-medium ${theme.textSecondary}`}>Role / Title</label>
                                <Input theme={theme} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Senior Student" />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className={`text-sm font-medium ${theme.textSecondary}`}>Bio</label>
                                <textarea 
                                    value={formData.bio} 
                                    onChange={e => setFormData({...formData, bio: e.target.value})} 
                                    rows="4" 
                                    className={`w-full p-4 rounded-xl outline-none border ${theme.input}`}
                                    placeholder="Tell us about yourself..."
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className={`text-sm font-medium ${theme.textSecondary}`}>Email (Read-Only)</label>
                                <Input theme={theme} value={userEmail || 'N/A (Guest User)'} readOnly disabled />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button theme={theme} onClick={saveProfile} isLoading={loading}>
                                <SaveIcon className="w-5 h-5"/> Save Changes
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        );
    };

    // --- Enhanced Auth Screen ---
    const AuthScreen = () => {
        const [creds, setCreds] = useState({ email: '', pass: '' });
        const [showPass, setShowPass] = useState(false);

        return (
            <div className={`min-h-screen flex items-center justify-center p-4 ${theme.appBg} transition-colors duration-500`}>
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    className="w-full max-w-md relative"
                >
                    {/* Back to Home Button */}
                    <button 
                        onClick={() => setShowWelcome(true)}
                        className={`absolute -top-12 left-0 flex items-center text-sm font-medium ${theme.textSecondary} hover:text-indigo-500 transition-colors`}
                    >
                        <span className="mr-1">←</span> Back to Home
                    </button>

                    <div className="text-center mb-8">
                        <motion.div 
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="w-20 h-20 mx-auto flex items-center justify-center mb-4 bg-cyan rounded-2xl shadow-lg"
                        >
                            <img src="/logo.png" alt="Acadex" className="h-12 w-auto object-contain" />
                        </motion.div>
                        <h1 className={`text-3xl font-extrabold ${theme.heading}`}>Acadex</h1>
                        <p className={`mt-2 ${theme.textSecondary}`}>Academic Project Management Suite</p>
                    </div>

                    <Card theme={theme} className="!p-8 space-y-6 backdrop-blur-xl border-opacity-50" noHover>
                        <AnimatePresence mode="wait">
                        {authView === AUTH_VIEWS.INIT ? (
                            <motion.div key="init" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                                <h2 className={`text-xl font-bold text-center ${theme.heading}`}>Welcome Back</h2>
                                <Button theme={theme} onClick={() => setAuthView(AUTH_VIEWS.LOGIN)} className="w-full h-12 text-lg shadow-lg shadow-fuchsia-500/20">
                                    Sign In with Email
                                </Button>
                                <Button theme={theme} variant="secondary" onClick={() => setAuthView(AUTH_VIEWS.SIGNUP)} className="w-full h-12 text-lg">
                                    Create Account
                                </Button>
                                
                                <div className="relative py-4">
                                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-300 dark:border-slate-700"></span></div>
                                    <div className="relative flex justify-center text-xs uppercase"><span className={`bg-cyan dark:bg-slate-900 px-2 ${theme.textSecondary}`}>Or continue with</span></div>
                                </div>

                                <motion.button 
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleAction('google')} 
                                    disabled={authLoading}
                                    className="w-full h-12 flex items-center justify-center bg-cyan text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium shadow-sm"
                                >
                                    <GoogleIcon className="w-5 h-5 mr-3" />
                                    {authLoading ? 'Connecting...' : 'Continue with Google'}
                                </motion.button>
                                
                                <p className="text-center text-xs text-gray-400 mt-4 cursor-pointer hover:underline" onClick={() => handleAction('anon')}>Skip and continue as guest</p>
                            </motion.div>
                        ) : (
                            <motion.form key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={(e) => { e.preventDefault(); handleAction(authView === AUTH_VIEWS.LOGIN ? 'login' : 'signup', creds.email, creds.pass); }} className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <h2 className={`text-xl font-bold ${theme.heading}`}>{authView === AUTH_VIEWS.LOGIN ? 'Login' : 'Create Account'}</h2>
                                    <button type="button" onClick={() => setAuthView(AUTH_VIEWS.INIT)} className={`text-sm ${theme.textSecondary} hover:text-fuchsia-500`}>Back</button>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className={`block text-xs font-medium mb-1 ${theme.textSecondary}`}>Email Address</label>
                                        <Input theme={theme} type="email" placeholder="name@university.edu" value={creds.email} onChange={e => setCreds({...creds, email: e.target.value})} required />
                                    </div>
                                    <div>
                                        <label className={`block text-xs font-medium mb-1 ${theme.textSecondary}`}>Password</label>
                                        <div className="relative">
                                            <Input theme={theme} type={showPass ? "text" : "password"} placeholder="••••••••" value={creds.pass} onChange={e => setCreds({...creds, pass: e.target.value})} required />
                                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                                                {showPass ? <EyeOffIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <Button theme={theme} className="w-full h-12 shadow-lg shadow-fuchsia-500/20" isLoading={authLoading}>
                                    {authView === AUTH_VIEWS.LOGIN ? 'Sign In' : 'Sign Up'}
                                </Button>
                                
                                <div className="text-center pt-2">
                                    <button type="button" className={`text-sm font-medium ${theme.textPrimary} hover:text-fuchsia-500 transition-colors`} onClick={() => setAuthView(authView === AUTH_VIEWS.LOGIN ? AUTH_VIEWS.SIGNUP : AUTH_VIEWS.LOGIN)}>
                                        {authView === AUTH_VIEWS.LOGIN ? "Don't have an account? Sign up" : "Already have an account? Log in"}
                                    </button>
                                </div>
                            </motion.form>
                        )}
                        </AnimatePresence>
                    </Card>
                </motion.div>
            </div>
        );
    };

    const RegistrationView = () => {
        const [form, setForm] = useState({ team: '', project: '' });
        const [memberEmails, setMemberEmails] = useState(['']);

        if (userTeam) return <div className={`text-center p-10 ${theme.textSecondary}`}>You are already registered for the project: <span className="font-semibold text-fuchsia-500">{userTeam.name}</span></div>;
        if (!userEmail) return <div className={`text-center p-10 ${theme.textSecondary}`}>Please sign in with an email to create a team and invite members.</div>;
        
        const addEmailField = () => setMemberEmails([...memberEmails, '']);
        const updateEmail = (index, value) => {
            const newEmails = [...memberEmails];
            newEmails[index] = value;
            setMemberEmails(newEmails);
        };
        const removeEmail = (index) => {
            if (memberEmails.length > 1) {
                setMemberEmails(memberEmails.filter((_, i) => i !== index));
            }
        };

        return (
            <div className="max-w-2xl mx-auto">
                <Card theme={theme} noHover>
                    <h2 className={`text-3xl font-bold ${theme.heading} mb-6`}>Start a New Project</h2>
                    <p className={`mb-8 ${theme.textSecondary}`}>Define your team and project scope to begin tracking progress.</p>
                    <div className="space-y-6">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme.textSecondary}`}>Team Name</label>
                            <Input theme={theme} value={form.team} onChange={e => setForm({...form, team: e.target.value})} placeholder="e.g. Alpha Squad" />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme.textSecondary}`}>Project Title</label>
                            <Input theme={theme} value={form.project} onChange={e => setForm({...form, project: e.target.value})} placeholder="e.g. AI Traffic Control Simulation" />
                        </div>
                        
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme.textSecondary}`}>Invite Members (Emails)</label>
                            <div className="space-y-3">
                                <AnimatePresence>
                                {memberEmails.map((email, index) => (
                                    <motion.div 
                                        key={index}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex gap-2 items-center"
                                    >
                                        <Input theme={theme}
                                            type="email"
                                            value={email} 
                                            onChange={e => updateEmail(index, e.target.value)} 
                                            placeholder={`Member ${index + 1} Email (Required)`} 
                                        />
                                        {memberEmails.length > 1 && (
                                            <button onClick={() => removeEmail(index)} className="p-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        )}
                                    </motion.div>
                                ))}
                                </AnimatePresence>
                            </div>
                            <Button theme={theme} variant="secondary" onClick={addEmailField} className={`mt-4 text-sm font-medium flex items-center gap-1`}>
                                <PlusIcon className="w-4 h-4" /> Add another member
                            </Button>
                        </div>

                        <Button theme={theme} onClick={() => registerTeam(form.team, form.project, memberEmails.filter(x => x.trim()))} className="w-full mt-8">
                            <SendIcon className="w-5 h-5"/> Send Proposals & Create Project
                        </Button>
                    </div>
                </Card>
            </div>
        );
    };

    const ProjectRequiredMessage = ({ viewName }) => {
        if (!userTeam) return <div className={`text-center ${theme.textSecondary} p-12`}>
             <DatabaseIcon className="w-12 h-12 mx-auto mb-4 text-fuchsia-500" />
            <p className="text-lg font-medium">You need an active project to access {viewName}.</p>
            <Button theme={theme} onClick={() => setCurrentView(VIEWS.REGISTRATION)} className="mt-4 mx-auto">Register Project Now</Button>
        </div>;
        if (!isTeamActive) return (
            <div className={`text-center p-12`}>
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4"><ClockIcon className="w-8 h-8"/></div>
                <h3 className={`text-xl font-bold ${theme.heading}`}>Team Formation In Progress</h3>
                <p className={`mt-2 ${theme.textSecondary}`}>All members must accept the project proposal before you can access {viewName}.</p>
                <p className={`mt-4 text-sm font-medium ${theme.textPrimary}`}>Project: {userTeam.name}</p>
            </div>
        );
        return null;
    };

    // --- Enhanced Progress Tracking (Kanban + Calendar + Comments) ---
    const ProgressTrackingView = () => {
        if (!userTeam || !isTeamActive) return <ProjectRequiredMessage viewName={VIEWS.TRACKING} />;
        const [viewMode, setViewMode] = useState('list'); // list, board, calendar
        const isLead = userTeam.members.find(m => m.id === userId)?.role === 'Lead';
        const [newTask, setNewTask] = useState({ title: '', assigneeId: userTeam.members[0]?.id, date: '' });
        const [commentTask, setCommentTask] = useState(null); // Task ID for comment modal
        const [newComment, setNewComment] = useState('');

        const addTask = async () => {
            if (!newTask.title || !newTask.date) return addToast('error', 'Please fill details');
            const assignee = userTeam.members.find(m => m.id === newTask.assigneeId) || userTeam.members[0];
            const task = {
                id: crypto.randomUUID(),
                title: newTask.title,
                assigneeId: assignee.id,
                assigneeName: assignee.name,
                dueDate: newTask.date,
                completed: false,
                status: 'To Do', // New field for Kanban
                comments: [], // New field for comments
                createdAt: new Date().toISOString()
            };
            await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'projects', userTeam.id), { tasks: [...(userTeam.tasks || []), task] });
            setNewTask({ title: '', assigneeId: userId, date: '' });
        };

        // Update status (Kanban drag simulation)
        const moveTask = async (task, direction) => {
            const statuses = ['To Do', 'In Progress', 'Done'];
            const currentIndex = statuses.indexOf(task.status || (task.completed ? 'Done' : 'To Do'));
            const nextIndex = currentIndex + direction;
            if (nextIndex < 0 || nextIndex >= statuses.length) return;
            
            const newStatus = statuses[nextIndex];
            const updatedTasks = userTeam.tasks.map(t => t.id === task.id ? { ...t, status: newStatus, completed: newStatus === 'Done' } : t);
            await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'projects', userTeam.id), { tasks: updatedTasks });
        };

        const addComment = async () => {
            if(!newComment.trim()) return;
            const comment = { id: crypto.randomUUID(), text: newComment, author: userName, date: new Date().toLocaleDateString() };
            const updatedTasks = userTeam.tasks.map(t => t.id === commentTask.id ? { ...t, comments: [...(t.comments || []), comment] } : t);
            await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'projects', userTeam.id), { tasks: updatedTasks });
            setNewComment('');
        };

        // Render Logic
        return (
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className={`text-4xl font-extrabold ${theme.heading}`}>Project Tasks</h1>
                    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                        {['list', 'board', 'calendar'].map(m => (
                            <button key={m} onClick={() => setViewMode(m)} className={`px-4 py-2 rounded-md text-sm capitalize font-medium transition-all ${viewMode === m ? `bg-cyan dark:bg-slate-700 shadow ${isUserAdmin ? 'text-cyan-500' : 'text-fuchsia-500'}` : theme.textSecondary}`}>
                                {m === 'board' ? <LayoutIcon className="w-4 h-4 inline mr-1"/> : m === 'calendar' ? <CalendarIcon className="w-4 h-4 inline mr-1"/> : <ProgressIcon className="w-4 h-4 inline mr-1"/>} {m}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Add Task Form (Only visible to Lead or in List/Board view) */}
                {isLead && (
                    <Card theme={theme} className="mb-6" noHover>
                        <div className="flex flex-col md:flex-row gap-4">
                            <Input theme={theme} placeholder="New Task Title" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
                            <select className={`px-4 py-3 rounded-xl outline-none border ${theme.input}`} value={newTask.assigneeId} onChange={e => setNewTask({...newTask, assigneeId: e.target.value})}>
                                {userTeam.members.map(m => <option key={m.id} value={m.id} className="bg-cyan dark:bg-slate-800 text-slate-900 dark:text-white">{m.name}</option>)}
                            </select>
                            <div className="w-full" style={{ colorScheme: darkMode ? 'dark' : 'light' }}>
                                <Input theme={theme} type="date" value={newTask.date} onChange={e => setNewTask({...newTask, date: e.target.value})} />
                            </div>
                            <Button theme={theme} onClick={addTask}>Add</Button>
                        </div>
                    </Card>
                )}

                {/* LIST VIEW */}
                {viewMode === 'list' && (
                    <motion.div layout className="space-y-3">
                        <AnimatePresence>
                        {userTeam.tasks?.length === 0 && <div className="text-center py-10 opacity-50">No tasks yet. Add one above!</div>}
                        {userTeam.tasks?.map(t => (
                            <motion.div 
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                key={t.id} 
                                className={`flex items-center justify-between p-4 rounded-xl border ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-cyan border-slate-100 shadow-sm'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <button onClick={() => moveTask(t, 1)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${t.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-400'}`}>
                                        {t.completed && <CheckCircleIcon className="w-4 h-4" />}
                                    </button>
                                    <div>
                                        <p className={`font-medium ${t.completed ? 'line-through opacity-50' : ''} ${theme.textPrimary}`}>{t.title}</p>
                                        <p className="text-xs text-slate-500">{t.assigneeName} • {t.status || 'To Do'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setCommentTask(t)} className="p-2 text-slate-400 hover:text-fuchsia-500 relative">
                                        <MessageSquareIcon className="w-5 h-5"/>
                                        {t.comments?.length > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* KANBAN BOARD VIEW */}
                {viewMode === 'board' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['To Do', 'In Progress', 'Done'].map(status => (
                            <div key={status} className={`p-4 rounded-2xl ${darkMode ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                                <h3 className={`font-bold mb-4 ${theme.heading} flex justify-between`}>
                                    {status} <span className="bg-slate-200 dark:bg-slate-700 px-2 rounded text-xs py-1">{userTeam.tasks?.filter(t => (t.status || (t.completed ? 'Done' : 'To Do')) === status).length}</span>
                                </h3>
                                <motion.div layout className="space-y-3 min-h-[100px]">
                                    <AnimatePresence>
                                    {userTeam.tasks?.filter(t => (t.status || (t.completed ? 'Done' : 'To Do')) === status).map(t => (
                                        <motion.div 
                                            layoutId={t.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            key={t.id} 
                                            className={`p-3 rounded-xl border cursor-grab active:cursor-grabbing ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-cyan border-slate-200 shadow-sm'}`}
                                        >
                                            <p className={`text-sm font-medium mb-2 ${theme.textPrimary}`}>{t.title}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] uppercase tracking-wider text-slate-500">{t.assigneeName}</span>
                                                <div className="flex gap-1">
                                                    {status !== 'To Do' && <button onClick={() => moveTask(t, -1)} className="text-xs px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded hover:opacity-80">←</button>}
                                                    {status !== 'Done' && <button onClick={() => moveTask(t, 1)} className="text-xs px-2 py-1 bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/30 rounded hover:opacity-80">→</button>}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                    </AnimatePresence>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                )}

                {/* CALENDAR VIEW (Simplified List sorted by Date) */}
                {viewMode === 'calendar' && (
                    <div className="space-y-6">
                        {Object.entries(userTeam.tasks?.reduce((acc, task) => {
                            const d = task.dueDate || 'No Date';
                            if(!acc[d]) acc[d] = [];
                            acc[d].push(task);
                            return acc;
                        }, {}) || {}).sort().map(([date, tasks]) => (
                            <div key={date}>
                                <h3 className={`text-sm font-bold uppercase tracking-widest mb-3 ${theme.textSecondary}`}>{date === 'No Date' ? 'Unscheduled' : new Date(date).toDateString()}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {tasks.map(t => (
                                        <Card theme={theme} key={t.id} className={`p-4 border-l-4 ${t.completed ? 'border-l-emerald-500 opacity-60' : 'border-l-fuchsia-500'}`} noHover>
                                            <div className="flex justify-between">
                                                <span className={`font-medium ${theme.textPrimary}`}>{t.title}</span>
                                                <span className={`text-xs px-2 py-1 rounded ${t.status === 'Done' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{t.status || 'To Do'}</span>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* COMMENT MODAL */}
                <AnimatePresence>
                {commentTask && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full max-w-md">
                            <Card theme={theme} className="w-full" noHover>
                                <h3 className={`font-bold mb-4 ${theme.heading}`}>Comments: {commentTask.title}</h3>
                                <div className="h-48 overflow-y-auto space-y-3 mb-4 p-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                                    {commentTask.comments?.length === 0 && <p className="text-center text-slate-400 text-sm mt-10">No comments yet.</p>}
                                    {commentTask.comments?.map(c => (
                                        <div key={c.id} className="bg-cyan dark:bg-slate-800 p-2 rounded-lg shadow-sm text-sm">
                                            <p className="font-bold text-xs text-fuchsia-500">{c.author}</p>
                                            <p className={theme.textPrimary}>{c.text}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Input theme={theme} value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Type a comment..." />
                                    <Button theme={theme} onClick={addComment}>Post</Button>
                                </div>
                                <button onClick={() => setCommentTask(null)} className="w-full mt-2 text-xs text-slate-500 hover:underline">Close</button>
                            </Card>
                        </motion.div>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        );
    };

    const ReportView = () => {
        if (!userTeam || !isTeamActive) return <ProjectRequiredMessage viewName={VIEWS.REPORTS} />;
        const [content, setContent] = useState(userTeam.report || '');
        const [files, setFiles] = useState(userTeam.files || []);
        const [fileNameInput, setFileNameInput] = useState('');
        const [fileLinkInput, setFileLinkInput] = useState('');
        const reportStatus = userTeam.reportStatus || 'Draft';
        const isSubmitted = reportStatus === 'Submitted';

        useEffect(() => {
            if (userTeam) {
                setContent(userTeam.report || '');
                setFiles(userTeam.files || []);
            }
        }, [userTeam]);

        const addFileLink = () => {
             if (isSubmitted) return;
             if (!fileNameInput || !fileLinkInput) return addToast('error', 'File Name and Valid Link required');
             if (!fileLinkInput.startsWith('http://') && !fileLinkInput.startsWith('https://')) return addToast('error', 'Link must start with http/https');

             const newFile = { 
                 name: fileNameInput, 
                 url: fileLinkInput, 
                 date: new Date().toLocaleDateString(), 
                 size: 'Link' 
             };
             const updatedFiles = [...files, newFile];
             setFiles(updatedFiles);
             updateReport(content, [], updatedFiles, 'Draft'); 
             setFileNameInput('');
             setFileLinkInput('');
             addToast('success', 'File link added');
        };

        return (
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className={`text-4xl font-extrabold ${theme.heading}`}>Report Submission</h1>
                        <p className={`${theme.textSecondary}`}>Project: <span className="text-fuchsia-500 font-medium">{userTeam.name}</span></p>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${isSubmitted ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'}`}>Status: {reportStatus}</div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card theme={theme} className="lg:col-span-2 space-y-4" noHover>
                        <h3 className={`text-xl font-bold ${theme.heading}`}>Executive Summary / Abstract</h3>
                        <textarea 
                            value={content} 
                            onChange={e => setContent(e.target.value)} 
                            rows="18" 
                            disabled={isSubmitted} 
                            className={`w-full p-5 rounded-2xl outline-none resize-y font-mono text-sm leading-relaxed border ${theme.input} ${isSubmitted ? 'opacity-70 cursor-not-allowed' : ''}`} 
                            placeholder="Use Markdown to structure your report abstract. Include your methodology, results, and conclusion here..." 
                        />
                    </Card>
                    <div className="space-y-6">
                        <Card theme={theme} noHover>
                            <h3 className={`text-lg font-bold ${theme.heading} mb-4 flex items-center`}><FileIcon className="w-5 h-5 mr-2 text-fuchsia-500"/> Supporting Files</h3>
                            <p className={`text-xs ${theme.textSecondary} mb-4`}>Submit Google Drive or MediaFire links for your project files.</p>
                            {!isSubmitted && (
                                <div className={`border-2 border-dashed rounded-xl p-4 transition-colors mb-4 space-y-3 ${darkMode ? 'border-slate-700 bg-slate-800/20' : 'border-slate-300 bg-slate-50'}`}>
                                    <Input theme={theme}
                                        value={fileNameInput} 
                                        onChange={e => setFileNameInput(e.target.value)} 
                                        placeholder="File Name (e.g., Final Presentation)" 
                                        className="text-sm"
                                    />
                                    <Input theme={theme}
                                        value={fileLinkInput} 
                                        onChange={e => setFileLinkInput(e.target.value)} 
                                        placeholder="File Link (GDrive/MediaFire)" 
                                        className="text-sm"
                                    />
                                    <Button theme={theme} onClick={addFileLink} className="w-full py-2 text-sm">
                                        <PlusIcon className="w-4 h-4 mr-1"/> Add File Link
                                    </Button>
                                </div>
                            )}
                            <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                <AnimatePresence>
                                {files.map((f, i) => (
                                <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} key={i} className={`flex items-center justify-between p-3 rounded-lg group ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-50 border border-slate-100 hover:bg-slate-100'} transition-colors`}>
                                    <div className="overflow-hidden flex-1">
                                        <div className="flex items-center">
                                            <p className={`text-sm font-medium ${theme.textPrimary} truncate flex-1`}>{f.name}</p>
                                            <a href={f.url} target="_blank" rel="noopener noreferrer" className={`ml-2 p-1 rounded hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/30 text-fuchsia-500 transition-colors`} title="Open Link">
                                                <LinkExternalIcon className="w-4 h-4" />
                                            </a>
                                        </div>
                                        <p className={`text-[10px] ${theme.textSecondary}`}>{f.size} | {f.date}</p>
                                    </div>
                                    {!isSubmitted && <button onClick={() => {
                                        const newFiles = files.filter((_, idx) => idx !== i);
                                        setFiles(newFiles);
                                        updateReport(content, [], newFiles, 'Draft');
                                    }} className="text-slate-400 hover:text-rose-500 ml-2"><TrashIcon className="w-4 h-4"/></button>}
                                </motion.li>
                            ))}
                                </AnimatePresence>
                            </ul>
                        </Card>
                    </div>
                </div>
                {!isSubmitted && (
                    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`sticky bottom-0 p-5 mt-8 ${theme.card} border-t backdrop-blur-lg rounded-2xl flex justify-between items-center z-20`}>
                        <p className={`text-sm ${theme.textSecondary}`}>Last saved: {new Date().toLocaleTimeString()}</p>
                        <div className="flex space-x-4">
                            <Button theme={theme} variant="secondary" onClick={() => updateReport(content, [], files, 'Draft')}>
                                <SaveIcon className="w-5 h-5 mr-2" /> Save Draft
                            </Button>
                            <Button theme={theme} onClick={() => updateReport(content, [], files, 'Submitted')}>
                                <SendIcon className="w-5 h-5 mr-2" /> Submit Final
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>
        );
    };

    const AdminSubmissionView = ({ project, onBack }) => {
        const [evaluation, setEvaluation] = useState(project.evaluation || INITIAL_EVALUATION);
        const [loading, setLoading] = useState(false);
        const isCompleted = evaluation.status === 'Completed';

        const handleGradeChange = (category, value) => {
            const val = parseInt(value) || 0;
            const newBreakdown = { ...evaluation.breakdown, [category]: val };
            const total = (newBreakdown.innovation || 0) + (newBreakdown.execution || 0) + (newBreakdown.documentation || 0);
            setEvaluation({ ...evaluation, breakdown: newBreakdown, score: total });
        };

        const saveEvaluation = async () => {
            if (evaluation.score < 0 || evaluation.score > 100) {
                return addToast('error', 'Score must be between 0 and 100.');
            }
            if (!evaluation.feedback || evaluation.feedback.length < 10) {
                return addToast('error', 'Please provide meaningful feedback (min 10 characters).');
            }

            setLoading(true);
            const status = evaluation.status === 'Completed' ? 'Completed' : 'Pending';
            const updatedEvaluation = { ...evaluation, status };

            await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'projects', project.id), { evaluation: updatedEvaluation });
            setEvaluation(updatedEvaluation);
            addToast('success', 'Evaluation saved successfully!');
            setLoading(false);
        };
        
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between mb-4">
                     <button onClick={onBack} className={`text-base font-medium ${theme.textSecondary} hover:text-cyan-500 transition-colors flex items-center`}><span className="mr-2">←</span> Back to Projects</button>
                     <h2 className={`text-3xl font-bold ${theme.heading}`}>Reviewing: <span className="text-cyan-500">{project.name}</span></h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <Card theme={theme} className="lg:col-span-1 space-y-6 h-fit sticky top-24" noHover>
                        <h3 className={`text-xl font-bold ${theme.heading} border-b pb-3 ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>Grade Project</h3>
                        <div className="space-y-4">
                             <div className="space-y-2">
                                <label className={`text-sm font-medium ${theme.textSecondary}`}>Innovation (0-40)</label>
                                <Input theme={theme} type="number" min="0" max="40" value={evaluation.breakdown?.innovation || 0} onChange={e => handleGradeChange('innovation', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className={`text-sm font-medium ${theme.textSecondary}`}>Execution (0-30)</label>
                                <Input theme={theme} type="number" min="0" max="30" value={evaluation.breakdown?.execution || 0} onChange={e => handleGradeChange('execution', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className={`text-sm font-medium ${theme.textSecondary}`}>Documentation (0-30)</label>
                                <Input theme={theme} type="number" min="0" max="30" value={evaluation.breakdown?.documentation || 0} onChange={e => handleGradeChange('documentation', e.target.value)} />
                            </div>
                            <div className={`p-3 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-slate-100'} flex justify-between items-center`}>
                                <span className="font-bold">Total Score</span>
                                <span className="text-2xl font-black text-cyan-500">{evaluation.score}</span>
                            </div>

                            <div className="space-y-2">
                                <label className={`text-sm font-medium ${theme.textSecondary}`}>Overall Feedback</label>
                                <textarea 
                                    rows="6" 
                                    value={evaluation.feedback} 
                                    onChange={e => setEvaluation({...evaluation, feedback: e.target.value})} 
                                    className={`w-full p-3 rounded-xl outline-none border ${theme.input}`} 
                                    placeholder="Provide constructive feedback..."
                                />
                            </div>
                            <div className="flex items-center space-x-3">
                                <input 
                                    type="checkbox" 
                                    id="complete-check" 
                                    checked={isCompleted} 
                                    onChange={e => setEvaluation({...evaluation, status: e.target.checked ? 'Completed' : 'Pending'})}
                                    className="w-4 h-4 text-cyan-600 border-slate-300 rounded focus:ring-cyan-500"
                                />
                                <label htmlFor="complete-check" className={`text-sm font-medium ${theme.textPrimary}`}>Mark as Complete</label>
                            </div>
                        </div>
                        <Button theme={theme} onClick={saveEvaluation} disabled={loading} className="w-full">
                            {loading ? 'Saving...' : <><SaveIcon className="w-5 h-5 mr-2"/> Save Evaluation</>}
                        </Button>
                    </Card>

                    <div className="lg:col-span-3 space-y-8">
                        <Card theme={theme} className="space-y-4" noHover>
                            <h3 className={`text-2xl font-bold ${theme.heading} border-b pb-3 ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>Executive Summary</h3>
                            <div className={`w-full p-5 rounded-xl min-h-[300px] font-mono text-sm leading-relaxed whitespace-pre-wrap ${theme.input} border`}>
                                {project.report || "No report content submitted."}
                            </div>
                        </Card>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card theme={theme} noHover>
                                <h3 className={`text-lg font-bold ${theme.heading} mb-4 flex items-center`}><FileIcon className="w-5 h-5 mr-2 text-cyan-500"/> Submitted Files</h3>
                                <ul className="space-y-3">
                                    {(project.files || []).map((f, i) => (
                                        <li key={i} className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                            <div className="overflow-hidden flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-sm font-medium ${theme.textPrimary} truncate`}>{f.name}</span>
                                                    <a href={f.url} target="_blank" rel="noopener noreferrer" className="ml-2 p-1 text-cyan-500 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 rounded" title="Open Link">
                                                        <LinkExternalIcon className="w-4 h-4" />
                                                    </a>
                                                </div>
                                                <p className={`text-[10px] ${theme.textSecondary}`}>{f.size} • {f.date}</p>
                                            </div>
                                        </li>
                                    ))}
                                    {(!project.files || project.files.length === 0) && <p className={`text-sm ${theme.textSecondary}`}>No files uploaded.</p>}
                                </ul>
                            </Card>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    const AdminPanel = () => {
        const [tab, setTab] = useState('analytics'); 
        const [editProject, setEditProject] = useState(null); 

        if (adminSelectedProject) {
            return <AdminSubmissionView project={adminSelectedProject} onBack={() => setAdminSelectedProject(null)} />;
        }

        // Export CSV Logic
        const downloadCSV = () => {
            const headers = "Project Name,Team Name,Status,Score,Supervisor\n";
            const rows = projects.map(p => 
                `"${p.name}","${p.teamName}","${p.reportStatus || 'Draft'}","${p.evaluation?.score || 0}","${p.supervisor || 'Unassigned'}"`
            ).join("\n");
            const blob = new Blob([headers + rows], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `acadex_export_${new Date().toISOString().slice(0,10)}.csv`;
            a.click();
        };

        // Assign Supervisor Logic
        const assignSupervisor = async (projId, name) => {
            await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'projects', projId), { supervisor: name });
            addToast('success', 'Supervisor Assigned');
        };

        return (
            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card theme={theme} className="!p-4 flex items-center gap-4 border-l-4 border-cyan-500">
                        <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-500"><DatabaseIcon className="w-6 h-6"/></div>
                        <div><p className="text-2xl font-bold">{projects.length}</p><p className={`text-xs ${theme.textSecondary}`}>Projects</p></div>
                    </Card>
                    <Card theme={theme} className="!p-4 flex items-center gap-4 border-l-4 border-teal-500">
                        <div className="p-3 bg-teal-500/10 rounded-xl text-teal-500"><UsersIcon className="w-6 h-6"/></div>
                        <div><p className="text-2xl font-bold">{allUsers.length}</p><p className={`text-xs ${theme.textSecondary}`}>Users</p></div>
                    </Card>
                    <Card theme={theme} className="!p-4 flex items-center gap-4 border-l-4 border-purple-500">
                        <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500"><EvaluateIcon className="w-6 h-6"/></div>
                        <div><p className="text-2xl font-bold">{Math.round(projects.reduce((a,b) => a + (b.evaluation?.score||0), 0) / (projects.length || 1))}</p><p className={`text-xs ${theme.textSecondary}`}>Avg Score</p></div>
                    </Card>
                    <Card theme={theme} className="!p-4 flex items-center gap-4 border-l-4 border-amber-500">
                        <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500"><ReportIcon className="w-6 h-6"/></div>
                        <div><p className="text-2xl font-bold">{projects.filter(p => p.reportStatus === 'Submitted').length}</p><p className={`text-xs ${theme.textSecondary}`}>Submitted</p></div>
                    </Card>
                </div>

                <Card theme={theme} noHover>
                    <div className="flex justify-between items-center mb-6">
                        <h1 className={`text-4xl font-bold ${theme.heading} flex items-center`}><ShieldIcon className="w-8 h-8 mr-3 text-cyan-500"/> Admin Console</h1>
                        <div className="flex items-center gap-2">
                            <button onClick={downloadCSV} className="px-4 py-2 text-xs font-bold uppercase tracking-wider border border-cyan-500 text-cyan-500 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-colors flex items-center">
                                <DownloadIcon className="w-4 h-4 mr-2"/> Export CSV
                            </button>
                            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                                {['analytics', 'projects', 'users'].map(t => (
                                    <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-md text-sm capitalize font-medium transition-all ${tab === t ? 'bg-cyan dark:bg-slate-700 shadow text-cyan-600' : theme.textSecondary}`}>{t}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {tab === 'analytics' && (
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
                            <div className="text-center">
                                <h3 className={`text-lg font-bold mb-4 ${theme.heading}`}>Project Status</h3>
                                {/* Simple CSS/SVG Pie Chart */}
                                <div className="relative w-48 h-48 mx-auto rounded-full border-8 border-slate-100 dark:border-slate-800 flex items-center justify-center">
                                    <div className="text-center">
                                        <span className="block text-3xl font-black text-cyan-500">{Math.round((projects.filter(p => p.reportStatus === 'Submitted').length / (projects.length || 1)) * 100)}%</span>
                                        <span className="text-xs text-slate-500">Completion Rate</span>
                                    </div>
                                    <svg className="absolute top-0 left-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                        <motion.circle 
                                            initial={{ pathLength: 0 }} 
                                            animate={{ pathLength: (projects.filter(p => p.reportStatus === 'Submitted').length / (projects.length || 1)) }} 
                                            cx="50" cy="50" r="40" fill="none" stroke="#06b6d4" strokeWidth="8" strokeLinecap="round" 
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h3 className={`text-lg font-bold mb-4 ${theme.heading}`}>Top Performers</h3>
                                <div className="space-y-3">
                                    {projects.sort((a,b) => (b.evaluation?.score || 0) - (a.evaluation?.score || 0)).slice(0, 5).map((p, i) => (
                                        <div key={p.id} className="flex items-center justify-between p-2 border-b dark:border-slate-800">
                                            <div className="flex items-center gap-3">
                                                <span className="font-mono text-cyan-500 text-lg">#{i+1}</span>
                                                <span className={theme.textPrimary}>{p.name}</span>
                                            </div>
                                            <span className="font-bold">{p.evaluation?.score || 0}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {tab === 'projects' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className={`border-b ${darkMode ? 'border-slate-700 text-slate-300' : 'border-slate-200 text-slate-500'} text-sm uppercase`}>
                                        <th className="pb-3 pl-4">Project</th>
                                        <th className="pb-3 hidden sm:table-cell">Supervisor</th>
                                        <th className="pb-3 hidden md:table-cell">Status</th>
                                        <th className="pb-3">Score</th>
                                        <th className="pb-3 text-right pr-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className={`text-sm ${theme.textPrimary}`}>
                                    {projects.map(p => (
                                        <tr key={p.id} className={`border-b last:border-0 ${darkMode ? 'border-slate-800 hover:bg-slate-800/50' : 'border-slate-100 hover:bg-slate-50'} transition-colors`}>
                                            <td className="py-4 pl-4 font-medium">
                                                {p.name}
                                                {showRawData && <div className="mt-1 text-[10px] font-mono text-slate-500 bg-slate-900/50 p-1 rounded max-w-xs truncate">{JSON.stringify(p)}</div>}
                                            </td>
                                            <td className={`py-4 hidden sm:table-cell ${theme.textSecondary}`}>
                                                <input 
                                                    className="bg-transparent border-b border-transparent hover:border-cyan-500 focus:border-cyan-500 outline-none w-32 transition-colors placeholder-slate-500" 
                                                    placeholder="Unassigned" 
                                                    defaultValue={p.supervisor || ''}
                                                    onBlur={(e) => assignSupervisor(p.id, e.target.value)}
                                                />
                                            </td>
                                            <td className="py-4 hidden md:table-cell">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.reportStatus === 'Submitted' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
                                                    {p.reportStatus || 'Draft'}
                                                </span>
                                            </td>
                                            <td className="py-4 font-bold text-cyan-500">{p.evaluation?.score || '-'}</td>
                                            <td className="py-4 text-right pr-4 flex justify-end space-x-2">
                                                <button onClick={() => setEditProject(p)} className="text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/20 p-2 rounded-xl" title="Edit Project Name">
                                                    <EditIcon className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => setAdminSelectedProject(p)} className="text-cyan-500 hover:text-white dark:hover:bg-cyan-600/50 hover:bg-cyan-100 p-2 rounded-xl transition-colors" title="View Submission & Grade">
                                                    <EyeIcon className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => deleteProj(p.id)} className="text-rose-500 hover:text-white hover:bg-rose-500/20 dark:hover:bg-rose-900/20 p-2 rounded-xl transition-colors"><TrashIcon className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mt-4 pt-4 border-t border-slate-700 flex justify-end">
                                <button onClick={() => setShowRawData(!showRawData)} className={`flex items-center text-xs ${theme.textSecondary} hover:text-cyan-500`}>
                                    <CodeIcon className="w-3 h-3 mr-1"/> {showRawData ? 'Hide Raw Data' : 'Inspect Raw Data'}
                                </button>
                            </div>
                        </div>
                    )}

                    {tab === 'users' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className={`border-b ${darkMode ? 'border-slate-700 text-slate-300' : 'border-slate-200 text-slate-500'} text-sm uppercase`}>
                                        <th className="pb-3 pl-4">User Name</th>
                                        <th className="pb-3">Email</th>
                                        <th className="pb-3">Role</th>
                                        <th className="pb-3 text-right pr-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className={`text-sm ${theme.textPrimary}`}>
                                    {allUsers.map(u => (
                                        <tr key={u.id} className={`border-b last:border-0 ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                                            <td className="py-4 pl-4 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">{u.displayName?.charAt(0)}</div>
                                                {u.displayName}
                                            </td>
                                            <td className={`py-4 ${theme.textSecondary}`}>{u.email}</td>
                                            <td className="py-4"><span className="px-2 py-1 rounded text-xs bg-slate-800 text-slate-300">{u.title}</span></td>
                                            <td className="py-4 text-right pr-4">
                                                <button onClick={() => deleteUser(u.id)} className="text-rose-500 hover:bg-rose-900/20 p-2 rounded-xl"><TrashIcon className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
                
                <AnimatePresence>
                {editProject && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div initial={{scale:0.9}} animate={{scale:1}} exit={{scale:0.9}} className="w-full max-w-md">
                        <Card theme={theme} className="w-full space-y-4" noHover>
                            <h3 className={`text-xl font-bold ${theme.heading}`}>Edit Project</h3>
                            <div>
                                <label className="text-xs font-medium mb-1 block">Project Name</label>
                                <Input theme={theme} value={editProject.name} onChange={e => setEditProject({...editProject, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-xs font-medium mb-1 block">Team Name</label>
                                <Input theme={theme} value={editProject.teamName} onChange={e => setEditProject({...editProject, teamName: e.target.value})} />
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <Button theme={theme} variant="secondary" onClick={() => setEditProject(null)}>Cancel</Button>
                                <Button theme={theme} onClick={() => { updateProjectName(editProject.id, editProject.name, editProject.teamName); setEditProject(null); }}>Save</Button>
                            </div>
                        </Card>
                        </motion.div>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        );
    };

    const Dashboard = () => {
        // -- NEW STATE FOR POPUP --
        const [showTeamModal, setShowTeamModal] = useState(false);

        // 1. Handle Invitations
        if (userTeam) {
            const myStatus = userTeam.members.find(m => m.email === userEmail || m.id === userId)?.status;
            if (myStatus === 'pending') {
                return (
                    <div className="max-w-2xl mx-auto mt-10 animate-fade-in">
                        <Card theme={theme} className="text-center p-10 border-t-4 border-indigo-500" noHover>
                            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600 dark:text-indigo-400">
                                <MailIcon className="w-10 h-10" />
                            </div>
                            <h2 className={`text-3xl font-bold ${theme.heading} mb-2`}>Project Proposal Received</h2>
                            <p className={`text-lg ${theme.textSecondary} mb-8 max-w-md mx-auto`}>
                                You have been invited to join <span className="font-bold text-indigo-600 dark:text-indigo-400">{userTeam.teamName}</span> for the project <span className="font-bold text-indigo-600 dark:text-indigo-400">{userTeam.name}</span>.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Button theme={theme} onClick={acceptInvite} className="w-full sm:w-auto">Accept Proposal</Button>
                                <Button theme={theme} variant="secondary" onClick={declineInvite} className="w-full sm:w-auto text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20">Decline</Button>
                            </div>
                        </Card>
                    </div>
                );
            }
        }

        // 2. No Project / Admin State
        if (!userTeam) {
             return (
                <div className="space-y-8 animate-fade-in">
                    <Card theme={theme} className={`flex flex-col md:flex-row gap-8 p-10 ${isUserAdmin ? 'bg-gradient-to-br from-cyan-800 to-slate-900' : 'bg-gradient-to-br from-indigo-800 to-slate-900'} !border-none text-white relative overflow-hidden min-h-[300px] items-center`} noHover>
                        <div className="absolute right-0 bottom-0 opacity-10 transform translate-y-1/4 translate-x-1/4"><DatabaseIcon width="400" height="400" /></div>
                        <div className="relative z-10 flex-1 space-y-4">
                            <div className="inline-block px-3 py-1 rounded-full bg-cyan/10 backdrop-blur-md border border-white/20 text-xs font-bold tracking-wide uppercase">
                                {isUserAdmin ? 'Admin Console' : 'Student Portal'}
                            </div>
                            <h2 className="text-5xl font-extrabold tracking-tight">Welcome, {userName.split(' ')[0]}!</h2>
                            <p className="text-indigo-100 text-lg max-w-xl leading-relaxed">
                                {isUserAdmin 
                                    ? 'Manage submissions, grade projects, and oversee student progress from your central command center.' 
                                    : 'You are not currently assigned to a project. Register a new team or wait for an invitation to begin.'}
                            </p>
                            <div className="pt-4">
                                {!isUserAdmin && <Button theme={theme} onClick={() => setCurrentView(VIEWS.REGISTRATION)} className="bg-cyan text-indigo-900 hover:bg-indigo-50 border-none shadow-xl">Start New Project <PlusIcon className="w-5 h-5"/></Button>}
                                {isUserAdmin && <Button theme={theme} onClick={() => setCurrentView(VIEWS.ADMIN)} className="bg-cyan text-cyan-900 hover:bg-cyan-50 border-none shadow-xl">Go to Analytics <ShieldIcon className="w-5 h-5"/></Button>}
                            </div>
                        </div>
                    </Card>
                    {/* Admin Quick Stats Grid */}
                    {isUserAdmin && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: 'Active Projects', val: projects.length, icon: DatabaseIcon, color: 'text-cyan-500' },
                                { label: 'Total Users', val: allUsers.length, icon: UsersIcon, color: 'text-teal-500' },
                                { label: 'Pending Reviews', val: projects.filter(p => p.reportStatus === 'Submitted' && p.evaluation?.status !== 'Completed').length, icon: EvaluateIcon, color: 'text-amber-500' }
                            ].map((stat, i) => (
                                <Card theme={theme} key={i} className="flex items-center gap-4">
                                    <div className={`p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 ${stat.color}`}><stat.icon className="w-8 h-8"/></div>
                                    <div><div className="text-3xl font-black">{stat.val}</div><div className={`text-sm font-medium ${theme.textSecondary}`}>{stat.label}</div></div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        // 3. Active Student Dashboard Logic
        const myTasks = (userTeam.tasks || []).filter(t => t.assigneeId === userId && !t.completed);
        const nextDeadline = (userTeam.tasks || []).filter(t => !t.completed && t.dueDate).sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate))[0];
        const recentFiles = (userTeam.files || []).slice(-3).reverse();
        const completedCount = (userTeam.tasks || []).filter(t => t.completed).length;
        const totalCount = (userTeam.tasks || []).length || 1;
        const progress = Math.round((completedCount / totalCount) * 100);

        return (
            <div className="space-y-6 animate-fade-in">
                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card theme={theme} className="lg:col-span-2 !p-8 relative overflow-hidden flex flex-col justify-between min-h-[240px] bg-gradient-to-r from-indigo-600 to-violet-600 border-none dark:from-indigo-900 dark:to-slate-900" noHover>
                        <div className="absolute top-0 right-0 p-4 opacity-10"><LayoutIcon width="250" height="250" className="text-white"/></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2 text-indigo-100">
                                <span className="bg-cyan/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">{userTeam.teamName}</span>
                                <span className="text-xs">•</span>
                                <span className="text-xs font-medium">{isTeamActive ? 'Active' : 'Forming'}</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{userTeam.name}</h2>
                            <p className="text-indigo-100 max-w-lg line-clamp-2">{userTeam.description || "No description provided."}</p>
                        </div>
                        <div className="relative z-10 mt-8">
                             <div className="flex items-center justify-between text-white text-sm mb-2 font-medium">
                                <span>Project Completion</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full bg-cyan shadow-lg"></motion.div>
                            </div>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 gap-6">
                        <Card theme={theme} className="flex flex-col justify-center" noHover>
                            <h3 className={`text-sm font-bold uppercase tracking-wider ${theme.textSecondary} mb-4`}>My Pending Tasks</h3>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-5xl font-black ${theme.textPrimary}`}>{myTasks.length}</span>
                                <span className={`text-sm ${theme.textSecondary}`}>tasks remaining</span>
                            </div>
                            {nextDeadline && (
                                <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-xl flex items-start gap-3">
                                    <ClockIcon className="w-5 h-5 text-rose-500 shrink-0" />
                                    <div>
                                        <p className="text-xs text-rose-600 dark:text-rose-400 font-bold uppercase">Next Deadline</p>
                                        <p className={`text-sm font-medium ${theme.textPrimary}`}>{nextDeadline.title}</p>
                                        <p className="text-xs text-slate-500">{new Date(nextDeadline.dueDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Col: Quick Actions & My Tasks */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                             {[
                                { label: 'Tasks', icon: PlusIcon, action: () => setCurrentView(VIEWS.TRACKING), bg: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' },
                                { label: 'Upload', icon: FileIcon, action: () => setCurrentView(VIEWS.REPORTS), bg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' },
                                { label: 'Team', icon: UsersIcon, action: () => setShowTeamModal(true), bg: 'bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400' },
                                { label: 'Report', icon: ReportIcon, action: () => setCurrentView(VIEWS.REPORTS), bg: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' },
                             ].map((btn, i) => (
                                 <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} key={i} onClick={btn.action} className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all hover:shadow-lg ${theme.card}`}>
                                     <div className={`p-3 rounded-full ${btn.bg}`}><btn.icon className="w-6 h-6"/></div>
                                     <span className={`text-xs font-bold ${theme.textPrimary}`}>{btn.label}</span>
                                 </motion.button>
                             ))}
                        </div>

                        {/* -- TEAM MODAL -- */}
                        <AnimatePresence>
                        {showTeamModal && (
                            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowTeamModal(false)}>
                                <motion.div initial={{scale:0.9, y: 20}} animate={{scale:1, y:0}} exit={{scale:0.9, y: 20}} className={`w-full max-w-sm p-6 rounded-2xl shadow-2xl ${theme.card} relative`} onClick={e => e.stopPropagation()}>
                                    <h3 className={`text-xl font-bold mb-4 ${theme.heading}`}>Team Roster</h3>
                                    <div className="space-y-3">
                                        {userTeam.members.map((m, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${m.role === 'Lead' ? 'bg-indigo-500' : 'bg-slate-400'}`}>
                                                        {m.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className={`text-sm font-bold ${theme.textPrimary}`}>{m.name}</p>
                                                        <p className="text-[10px] text-slate-500">{m.email}</p>
                                                    </div>
                                                </div>
                                                <span className={`text-[10px] px-2 py-1 rounded ${m.status === 'accepted' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>{m.role}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={() => setShowTeamModal(false)} className="mt-6 w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Close</button>
                                </motion.div>
                            </motion.div>
                        )}
                        </AnimatePresence>
                        {/* -- END TEAM MODAL -- */}

                        <Card theme={theme} noHover>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className={`text-lg font-bold ${theme.heading}`}>My Priority List</h3>
                                <Button theme={theme} variant="secondary" onClick={() => setCurrentView(VIEWS.TRACKING)} className="!py-2 !px-4 text-xs">View Kanban</Button>
                            </div>
                            {myTasks.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                                    <div className="inline-block p-4 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 mb-2"><CheckCircleIcon className="w-8 h-8"/></div>
                                    <p className={theme.textSecondary}>You're all caught up! No pending tasks.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {myTasks.slice(0, 4).map(t => (
                                        <div key={t.id} className={`p-4 rounded-xl border flex items-center gap-4 hover:shadow-md transition-shadow ${theme.card} ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                                            <div className={`w-2 h-12 rounded-full ${t.status === 'In Progress' ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                                            <div className="flex-1">
                                                <h4 className={`font-bold ${theme.textPrimary}`}>{t.title}</h4>
                                                <p className="text-xs text-slate-500">Due: {t.dueDate} • {t.status || 'To Do'}</p>
                                            </div>
                                            <button onClick={() => setCurrentView(VIEWS.TRACKING)} className="p-2 text-slate-400 hover:text-indigo-500"><LinkExternalIcon className="w-5 h-5"/></button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Right Col: Activity & Files */}
                    <div className="space-y-6">
                        <Card theme={theme} noHover>
                            <h3 className={`text-lg font-bold ${theme.heading} mb-4`}>Recent Files</h3>
                            {recentFiles.length === 0 ? (
                                <p className={`text-sm ${theme.textSecondary}`}>No files uploaded yet.</p>
                            ) : (
                                <ul className="space-y-4">
                                    {recentFiles.map((f, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-lg"><FileIcon className="w-5 h-5"/></div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className={`text-sm font-medium truncate ${theme.textPrimary}`}>{f.name}</p>
                                                <p className="text-[10px] text-slate-500">{f.date}</p>
                                            </div>
                                            <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-500"><DownloadIcon className="w-4 h-4"/></a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button onClick={() => setCurrentView(VIEWS.REPORTS)} className={`text-sm font-medium ${isUserAdmin ? 'text-cyan-500' : 'text-indigo-500'} hover:underline`}>Go to Repository →</button>
                            </div>
                        </Card>

                         <Card theme={theme} noHover>
                            <h3 className={`text-lg font-bold ${theme.heading} mb-4`}>Team Status</h3>
                             <div className="flex items-center justify-between mb-2">
                                <span className={`text-sm ${theme.textSecondary}`}>Evaluation</span>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${userTeam.evaluation.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>{userTeam.evaluation.status}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className={`text-sm ${theme.textSecondary}`}>Report</span>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${userTeam.reportStatus === 'Submitted' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>{userTeam.reportStatus || 'Draft'}</span>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        );
    };

    if (error) return <div className="flex items-center justify-center min-h-screen bg-rose-900 text-rose-300 p-4 font-mono text-center">Initialization Error: {error}</div>;
    
    // -- Skeleton Loader --
    if (!isAuthReady) return (
        <div className={`flex items-center justify-center min-h-screen ${theme.appBg} ${theme.textPrimary}`}>
            <div className="w-full max-w-md">
                <SkeletonCard />
            </div>
        </div>
    );

    if (!userId) {
        if (showWelcome) {
            return <WelcomeLanding onGetStarted={() => setShowWelcome(false)} />;
        }
        return <AuthScreen />;
    }

    return (
        <div className={`flex flex-col min-h-screen ${theme.appBg} ${theme.textPrimary} transition-colors duration-500 font-sans selection:bg-indigo-500 selection:text-white`}>
            
            {/* Header */}
            <header className={`fixed top-0 w-full z-30 ${theme.navBg} px-4 lg:px-8 py-3 flex items-center justify-between shadow-lg`}>
                
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`md:hidden p-2 rounded-lg ${theme.navItem}`}>
                        {isMobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                    </button>
                    <button 
                        onClick={() => setCurrentView(VIEWS.DASHBOARD)} 
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none"
                    >
                        <img src="/logo.png" alt="Acadex" className="h-10 w-auto object-contain" />
                        <span className={`font-extrabold text-xl ${theme.heading}`}>Acadex</span>
                    </button>
                </div>

                <nav className="hidden md:flex items-center space-x-2">
                     {navItems.map((item) => (
                         <NavItem key={item.id} view={item.id} label={item.label} IconComponent={item.IconComponent} />
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    
                    {/* Notification Bell */}
                    <div className="relative">
                        <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
                            <BellIcon className="w-5 h-5" />
                            {notifications.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>}
                        </button>
                        
                        <AnimatePresence>
                        {showNotifications && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 top-12 w-64 bg-cyan dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 p-4 z-50"
                            >
                                <h4 className="text-sm font-bold mb-2">Notifications</h4>
                                {notifications.length === 0 ? (
                                    <p className="text-xs text-slate-500">No new alerts.</p>
                                ) : (
                                    <ul className="space-y-2">
                                        {notifications.map(n => (
                                            <li key={n.id} className={`text-xs p-2 rounded ${n.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                                {n.text}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </div>

                    <ThemeSwitch />
                    
                    <div 
                        onClick={() => setCurrentView(VIEWS.PROFILE)}
                        className="flex items-center gap-3 pl-3 border-l border-slate-700/50 dark:border-slate-700 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                         <div className="text-right hidden lg:block">
                            <p className={`text-sm font-bold ${theme.textPrimary}`}>{userName}</p>
                            <p className={`text-xs ${theme.textSecondary} uppercase`}>{isUserAdmin ? 'Admin' : (userProfile.title === 'Admin' ? 'Student' : userProfile.title)}</p>
                        </div>
                        {userProfile.photoURL ? (
                             <img key={userId} src={userProfile.photoURL} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500 shadow-md" />
                        ) : (
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${isUserAdmin ? 'from-cyan-500 to-teal-500' : 'from-violet-500 to-fuchsia-500'} flex items-center justify-center text-white text-base font-bold border-2 border-indigo-500 shadow-md`}>
                                {userName.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    
                     <button onClick={() => handleAction('logout')} className={`p-2 rounded-xl transition-colors text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20`} title="Sign Out">
                        <LogOutIcon className="w-6 h-6" />
                    </button>
                </div>
            </header>

            <AnimatePresence>
            {isMobileMenuOpen && (
                <motion.div 
                    initial={{ y: "-100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    className={`md:hidden fixed top-20 w-full h-auto z-20 ${theme.navBg} shadow-xl rounded-b-2xl p-4`}
                >
                    <div className="space-y-2">
                        {navItems.map((item) => (
                            <NavItem key={item.id} view={item.id} label={item.label} IconComponent={item.IconComponent} />
                        ))}
                    </div>
                </motion.div>
            )}
            </AnimatePresence>

            <main className={`flex-1 w-full max-w-7xl mx-auto px-4 lg:px-8 pt-28 pb-12 transition-all duration-300`}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentView}
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                    {currentView === VIEWS.DASHBOARD && <Dashboard />}
                    {currentView === VIEWS.REGISTRATION && <RegistrationView />}
                    {currentView === VIEWS.REPORTS && <ReportView />}
                    {currentView === VIEWS.ADMIN && isUserAdmin && <AdminPanel />}
                    {currentView === VIEWS.TRACKING && <ProgressTrackingView />}
                    {currentView === VIEWS.PROFILE && <ProfileView />}

                    {currentView === VIEWS.DATABASE && (
                        <div className="space-y-8">
                            <h1 className={`text-4xl font-extrabold ${theme.heading}`}>Project Directory</h1>
                            <p className={`text-lg ${theme.textSecondary}`}>Browse all registered projects and track their high-level progress.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {projects.length === 0 ? (
                                    // Skeleton Loading for Project Grid
                                    <>
                                        <SkeletonCard />
                                        <SkeletonCard />
                                        <SkeletonCard />
                                    </>
                                ) : (
                                    projects.map(p => {
                                        const progress = ((p.tasks || []).filter(t => t.completed).length / ((p.tasks || []).length || 1)) * 100;
                                        return (
                                        <Card theme={theme} key={p.id} className="relative overflow-hidden group hover:border-indigo-500/50">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><DatabaseIcon width="80" height="80" className="text-indigo-400"/></div>
                                            <h3 className={`text-xl font-bold ${theme.heading} mb-1`}>{p.name}</h3>
                                            <p className={`text-sm ${theme.textSecondary} mb-4`}>Team: {p.teamName}</p>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${p.evaluation?.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'}`}>
                                                    {p.evaluation?.status || 'Pending'}
                                                </div>
                                                {p.evaluation?.status === 'Completed' && <span className="font-bold text-indigo-500 text-sm">{p.evaluation.score}/100</span>}
                                            </div>
                                            <div className="text-sm font-medium mb-2 flex justify-between">
                                                <span className={theme.textSecondary}>Task Progress</span>
                                                <span className={theme.textPrimary}>{Math.round(progress)}%</span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden shadow-inner">
                                                <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-700" style={{width: `${progress}%`}}></div>
                                            </div>
                                        </Card>
                                    )})
                                )}
                            </div>
                        </div>
                    )}
                    
                    {currentView === VIEWS.EVALUATION && userTeam && (
                        <div className="max-w-3xl mx-auto">
                            <h1 className={`text-4xl font-extrabold mb-8 ${theme.heading}`}>Evaluation Results</h1>
                            <h2 className={`text-xl font-bold mb-8 ${theme.heading} text-fuchsia-500`}>{userTeam.name}</h2>
                            <Card theme={theme} noHover>
                                <div className={`p-8 rounded-2xl text-center ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                                    <EvaluateIcon className="w-12 h-12 mx-auto text-fuchsia-500 mb-4"/>
                                    <p className={`text-lg font-medium ${theme.textPrimary} mb-4`}>{userTeam.evaluation.status}</p>
                                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-600 mb-6">
                                        {userTeam.evaluation.score}/100
                                    </div>

                                    {userTeam.evaluation.breakdown && (
                                        <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
                                            <div className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-cyan border-slate-200 shadow-sm'}`}>
                                                <div className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Innovation</div>
                                                <div className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-800'}`}>{userTeam.evaluation.breakdown.innovation || 0}</div>
                                            </div>
                                            <div className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-cyan border-slate-200 shadow-sm'}`}>
                                                <div className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Execution</div>
                                                <div className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-800'}`}>{userTeam.evaluation.breakdown.execution || 0}</div>
                                            </div>
                                            <div className={`p-3 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-cyan border-slate-200 shadow-sm'}`}>
                                                <div className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Docs</div>
                                                <div className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-800'}`}>{userTeam.evaluation.breakdown.documentation || 0}</div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className={`text-left p-6 rounded-xl ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-cyan border border-slate-200'}`}>
                                        <p className={`text-sm font-bold ${theme.textSecondary} uppercase mb-3 border-b pb-2 ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>Instructor Feedback</p>
                                        <p className={theme.textPrimary}>{userTeam.evaluation.feedback}</p>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-center">
                                    <Button theme={theme} variant="secondary" onClick={() => setCurrentView(VIEWS.REPORTS)} className="text-sm">
                                        <ReportIcon className="w-4 h-4 mr-2"/> Review Submission
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    )}
                    </motion.div>
                </AnimatePresence>
            </main>
            <Footer />
            
            {/* TOAST CONTAINER */}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
                <AnimatePresence>
                {toasts.map(toast => (
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        key={toast.id} 
                        className={`px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 text-white ${toast.type === 'success' ? 'bg-emerald-500' : toast.type === 'error' ? 'bg-rose-500' : 'bg-indigo-500'}`}
                    >
                        <span className="font-medium">{toast.msg}</span>
                    </motion.div>
                ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
