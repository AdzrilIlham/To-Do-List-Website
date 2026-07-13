import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';
import { useTaskContext } from './context/TaskContext';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Toast from './components/ui/Toast';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Onboarding from './components/ui/Onboarding';

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

function AppContent() {
  const { theme } = useTaskContext();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-dark-bg text-dark-text' : 'bg-light-bg text-light-text'}`}>
      <a
        href="#main-content"
        className="skip-link"
      >
        Loncat ke konten utama
      </a>
      <Sidebar />
      <div className="lg:ml-64 min-h-screen">
        <Navbar />
        <main id="main-content" className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto" tabIndex={-1}>
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
      <Toast />
      <Onboarding />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
