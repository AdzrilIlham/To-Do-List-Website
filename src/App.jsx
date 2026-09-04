import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';
import { useTaskContext } from './context/TaskContext';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import BottomNav from './components/layout/BottomNav';
import Toast from './components/ui/Toast';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './components/ui/Onboarding';
import useNotifications from './hooks/useNotifications';

const TodayView = lazy(() => import('./pages/TodayView'));
const Calendar = lazy(() => import('./pages/Calendar'));
const Statistics = lazy(() => import('./pages/Statistics'));
const Settings = lazy(() => import('./pages/Settings'));
const Archive = lazy(() => import('./pages/Archive'));
const TaskDetail = lazy(() => import('./pages/TaskDetail'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-sm text-gray-400 dark:text-gray-500">Memuat...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppContent() {
  const { theme } = useTaskContext();

  useNotifications();

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-dark-bg text-dark-text' : 'bg-light-bg text-light-text'}`}>
              <a href="#main-content" className="skip-link">
                Loncat ke konten utama
              </a>
              <Sidebar />
              <div className="lg:ml-64 min-h-screen">
                <Navbar />
                <main id="main-content" className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-7xl mx-auto" tabIndex={-1}>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/today" element={<TodayView />} />
                      <Route path="/calendar" element={<Calendar />} />
                      <Route path="/statistics" element={<Statistics />} />
                      <Route path="/archive" element={<Archive />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/task/:id" element={<TaskDetail />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </main>
              </div>
              <BottomNav />
              <Toast />
              <Onboarding />
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
