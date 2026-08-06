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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Welcome Page is ALWAYS shown when opening the site root (/) */}
        <Route path="/" element={<OnboardingPage />} />
        <Route path="/welcome" element={<OnboardingPage />} />
        
        {/* App Main Layout Routes */}
        <Route element={<MainLayout />}>
          <Route path="/chat" element={<HomePage />} />
          <Route path="/group" element={<GroupSessionPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/mood" element={<MoodPage />} />
          <Route path="/tools" element={<ToolsPage />} />
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
