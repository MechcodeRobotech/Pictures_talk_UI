
import React, { useState, useEffect } from 'react';
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Common/Sidebar';
import Header from './components/Common/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Projects from './pages/Projects';
import Templates from './pages/Templates';
import Canvas from './pages/Canvas';
import Summary from './pages/Summary';
import ResultsPage from './pages/results/page';
import ResultDetailPage from './pages/results/[resultId]/page';
import SignUp from './pages/SignUp';
import ForgotPass from './pages/ForgotPass';
import { LanguageProvider } from './LanguageContext';

const AppContent: React.FC<{ isDarkMode: boolean; toggleTheme: () => void }> = ({ isDarkMode, toggleTheme }) => {
  const location = useLocation();
  const isCanvasPage = location.pathname === '/canvas';
  const isLoginPage = location.pathname === '/' || location.pathname === '/login';
  const isSsoCallbackPage = location.pathname === '/sso-callback';
  const isSignUpPage = location.pathname === '/signup';
  const isForgotPassPage = location.pathname === '/forgot-pass';

  // If it's a full-screen page like Canvas or Login, we don't show the standard sidebar/header layout
  if (isCanvasPage) {
    return <Canvas isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
  }

  if (isLoginPage) {
    return <Login isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
  }

  if (isSignUpPage) {
    return <SignUp isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
  }

  if (isForgotPassPage) {
    return <ForgotPass isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
  }

  if (isSsoCallbackPage) {
    return <AuthenticateWithRedirectCallback />;
  }

  return (
    <div className="h-screen font-display flex flex-col bg-background-light dark:bg-background-dark transition-colors duration-300 overflow-hidden">
      <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <div className="flex-1 flex flex-col md:flex-row min-w-0 overflow-hidden">
        <Sidebar isDarkMode={isDarkMode} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Routes>
            <Route path="/" element={<Login isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
            <Route path="/login" element={<Login isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
            <Route path="/signup" element={<SignUp isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
            <Route path="/forgot-pass" element={<ForgotPass isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
            <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />
            <Route path="/home" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/summary/:resultId" element={<ResultDetailPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/results/:resultId" element={<ResultDetailPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <LanguageProvider>
      <Router>
        <AppContent isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      </Router>
    </LanguageProvider>
  );
};

export default App;
