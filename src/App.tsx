import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import JournalPage from './pages/JournalPage';
import MoodPage from './pages/MoodPage';
import ToolsPage from './pages/ToolsPage';
import ProgressPage from './pages/ProgressPage';
import SettingsPage from './pages/SettingsPage';
import OnboardingPage from './pages/OnboardingPage';
import FAQPage from './pages/FAQPage';
import GroupSessionPage from './pages/GroupSessionPage';
import OceanPage from './pages/OceanPage';
import AuthPage from './pages/AuthPage';
import AuthGuard from './components/auth/AuthGuard';
import { useAuthStore } from './store/authStore';

function App() {
  const { isAuthenticated, currentUser } = useAuthStore();
  const isAuthed = Boolean(isAuthenticated && currentUser?.username && currentUser?.email);

  return (
    <BrowserRouter>
      <Routes>
        {/* Welcome / Root Page */}
        <Route path="/" element={isAuthed ? <Navigate to="/chat" replace /> : <OnboardingPage />} />
        <Route path="/welcome" element={<OnboardingPage />} />
        
        {/* Authentication Routes (Register / Sign In) */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/register" element={<Navigate to="/auth?mode=register" replace />} />
        <Route path="/login" element={<Navigate to="/auth?mode=signin" replace />} />
        <Route path="/signin" element={<Navigate to="/auth?mode=signin" replace />} />

        {/* App Protected Routes - Requires user to be registered / authenticated */}
        <Route
          element={
            <AuthGuard>
              <MainLayout />
            </AuthGuard>
          }
        >
          <Route path="/home" element={<HomePage />} />
          <Route path="/chat" element={<HomePage />} />
          <Route path="/group" element={<GroupSessionPage />} />
          <Route path="/ocean" element={<OceanPage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/mood" element={<MoodPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/faq" element={<FAQPage />} />
        </Route>

        {/* Catch-all redirect to Welcome Page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
