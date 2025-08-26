import React, { useState, useEffect } from 'react';
import { Homepage } from './components/Homepage';
import { Wishlist } from './components/Wishlist';
import { CashGifts } from './components/CashGifts';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { ErrorBoundary } from './components/ErrorBoundary';

type Page = 'home' | 'wishlist' | 'gifts' | 'admin-login' | 'admin-dashboard';

const ADMIN_PASSWORD = 'babybower2025'; // In production, this should be in environment variables
const ADMIN_SESSION_KEY = 'baby-shower-admin-session';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState<string>('');

  // Check for existing admin session on mount
  useEffect(() => {
    const savedSession = localStorage.getItem(ADMIN_SESSION_KEY);
    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession);
        const isExpired = Date.now() > sessionData.expiresAt;
        if (!isExpired) {
          setIsAdminAuthenticated(true);
          if (window.location.hash === '#admin' || window.location.pathname.includes('admin')) {
            setCurrentPage('admin-dashboard');
          }
        } else {
          localStorage.removeItem(ADMIN_SESSION_KEY);
        }
      } catch {
        localStorage.removeItem(ADMIN_SESSION_KEY);
      }
    }

    // Handle URL hash routing
    const handleHashChange = () => {
      const hash = window.location.hash;
      switch (hash) {
        case '#wishlist':
          setCurrentPage('wishlist');
          break;
        case '#gifts':
          setCurrentPage('gifts');
          break;
        case '#admin':
          if (isAdminAuthenticated) {
            setCurrentPage('admin-dashboard');
          } else {
            setCurrentPage('admin-login');
          }
          break;
        default:
          setCurrentPage('home');
      }
    };

    // Set initial page based on URL
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [isAdminAuthenticated]);

  const navigate = (page: Page) => {
    setCurrentPage(page);
    switch (page) {
      case 'home':
        window.location.hash = '';
        // Force update the URL without hash
        window.history.pushState('', '', window.location.pathname);
        break;
      case 'wishlist':
        window.location.hash = '#wishlist';
        break;
      case 'gifts':
        window.location.hash = '#gifts';
        break;
      case 'admin-login':
        window.location.hash = '#admin';
        break;
      case 'admin-dashboard':
        window.location.hash = '#admin';
        break;
    }
  };

  const handleAdminLogin = async (password: string) => {
    if (password === ADMIN_PASSWORD) {
      const sessionData = {
        authenticated: true,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      };
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData));
      setIsAdminAuthenticated(true);
      setLoginError('');
      navigate('admin-dashboard');
    } else {
      setLoginError('Incorrect password. Please try again.');
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAdminAuthenticated(false);
    navigate('home');
  };

  const handleNavigateToSection = (section: 'wishlist' | 'gifts') => {
    navigate(section);
  };

  const handleBackToHome = () => {
    navigate('home');
  };

  return (
    <ErrorBoundary>
      <div className="App">
        {currentPage === 'home' && (
          <Homepage onNavigate={handleNavigateToSection} />
        )}
        
        {currentPage === 'wishlist' && (
          <Wishlist 
            onBack={handleBackToHome} 
            isAdmin={isAdminAuthenticated}
          />
        )}
        
        {currentPage === 'gifts' && (
          <CashGifts onBack={handleBackToHome} />
        )}
        
        {currentPage === 'admin-login' && (
          <AdminLogin 
            onBack={handleBackToHome}
            onLogin={handleAdminLogin}
            error={loginError}
          />
        )}
        
        {currentPage === 'admin-dashboard' && isAdminAuthenticated && (
          <AdminDashboard onLogout={handleAdminLogout} />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
