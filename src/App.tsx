
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Projects from './pages/Projects';
import Templates from './pages/Templates';
import Canvas from './pages/Canvas';
import { LanguageProvider } from './LanguageContext';

const AppContent: React.FC<{ isDarkMode: boolean; toggleTheme: () => void }> = ({ isDarkMode, toggleTheme }) => {
  const location = useLocation();
  const isCanvasPage = location.pathname === '/canvas';
  const isLoginPage = location.pathname === '/login';

  // If it's a full-screen page like Canvas or Login, we don't show the standard sidebar/header layout
  if (isCanvasPage) {
    return <Canvas isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
  }

  if (isLoginPage) {
    return <Login isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
  }

  return (
    <div className="h-screen font-display flex flex-col md:flex-row bg-background-light dark:bg-background-dark transition-colors duration-300 overflow-hidden">
      <Sidebar isDarkMode={isDarkMode} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/templates" element={<Templates />} />
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
