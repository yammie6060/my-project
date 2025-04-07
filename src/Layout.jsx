import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { Menu, Bell, Moon, Sun, X } from 'lucide-react';
import { FaHome, FaBoxOpen, FaEnvelope, FaUsers, FaUserAlt, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import global from './assets/global-aid.png';
import Dashboard from './Components/Dashboard';
import Stock from './Components/Stock';
import Staff from './Components/Staff';
import Users from './Components/Users';
import Emails from './Components/Emails';
import Login from './Login';

// Simple custom toast component
const Toast = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : 
                 type === 'error' ? 'bg-red-500' : 
                 type === 'info' ? 'bg-blue-500' : 'bg-gray-800';
  
  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-4 py-2 rounded-md shadow-lg flex items-center justify-between z-50 min-w-64`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">×</button>
    </div>
  );
};

const THEME_KEY = 'theme';
const PROFILE_IMAGE_KEY = 'profileImage';

const Layout = ({ onLogout, username }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [isIconsOnly, setIsIconsOnly] = useState(false);
  const [isDark, setIsDark] = useState(localStorage.getItem(THEME_KEY) === 'dark');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(localStorage.getItem(PROFILE_IMAGE_KEY) || '');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile && !isSidebarOpen) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  useEffect(() => {
    document.body.classList.toggle('dark-theme', isDark);
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  }, [isDark]);

  // Clear toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen((prev) => !prev);
    } else {
      setIsIconsOnly((prev) => !prev);
    }
  };

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      showToast('Logging out...', 'info');
      setIsFadingOut(true);
      setTimeout(() => {
        onLogout();
        navigate('/login');
      }, 500);
    }
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
        localStorage.setItem(PROFILE_IMAGE_KEY, reader.result);
        showToast('Profile image updated successfully', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = () => {
    setProfileImage('');
    localStorage.removeItem(PROFILE_IMAGE_KEY);
    showToast('Profile image removed', 'info');
    setDropdownOpen(false);
  };

  const navItems = [
    { title: 'Dashboard', icon: <FaHome size={20} />, path: '/dashboard' },
    { title: 'Stock', icon: <FaBoxOpen size={20} />, path: '/stock' },
    { title: 'Staff', icon: <FaUsers size={20} />, path: '/staff' },
    { title: 'Users', icon: <FaUserAlt size={20} />, path: '/users' },
    { title: 'Emails', icon: <FaEnvelope size={20} />, path: '/emails' },
    { title: 'Log Out', icon: <FaSignOutAlt size={20} />, onClick: handleLogout },
  ];

  return (
    <div
      className={`flex h-screen overflow-hidden transition-opacity duration-300 ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      } ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}
    >
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 top-2 left-0 z-50 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isMobile || isIconsOnly ? 'w-20' : 'w-64'
        } ${
          isDark
            ? 'bg-gray-900 text-white border-gray-700'
            : 'bg-white text-gray-800 border-gray-200'
        } border-r shadow-lg rounded-r-xl`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {!isMobile && !isIconsOnly && (
            <div className="flex items-center space-x-2">
              <img
                src={global}
                alt="Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-purple-400">
                Thanzilanga+
              </span>
            </div>
          )}
          {isMobile && (
            <button
              className="text-white hover:text-gray-300"
              onClick={toggleSidebar}
              aria-label="Close sidebar"
            >
              <X size={24} />
            </button>
          )}
        </div>

        <nav className="p-4">
          {navItems.map((item) => (
            <div
              key={item.title}
              className={`flex items-center p-4 rounded cursor-pointer transition-colors duration-200 ${
                isDark 
                  ? 'hover:bg-gray-800 hover:text-white' 
                  : 'hover:bg-gray-100 hover:text-gray-700'
              }`}
              onClick={() => {
                if (item.onClick) item.onClick();
                else {
                  navigate(item.path);
                  if (isMobile) setSidebarOpen(false);
                }
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && (item.onClick ? item.onClick() : navigate(item.path))}
            >
              <span className="mr-3">{item.icon}</span>
              {!isMobile && !isIconsOnly && (
                <span className="text-sm font-medium">{item.title}</span>
              )}
            </div>
          ))}
        </nav>
      </aside>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 md:px-6 border-2 shadow-lg rounded-r-xl transition-all duration-300 ${
          isDark ? 'bg-gray-900 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-200'
        }`}
      >
        <div className="flex items-center space-x-4">
          <button
            className={`p-2 cursor-pointer rounded-full hover:bg-opacity-80 ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center space-x-3">
            <img
              src={global}
              alt="Hospital Sign"
              className="w-8 h-8 md:w-10 md:h-10 object-contain"
            />
            <h2 className="hidden md:block text-base md:text-lg font-bold whitespace-nowrap">
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-purple-400">
                Thanzilanga+ 
              </span>
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Welcome, {username || 'User'}
            </span>
          </div>
          
          <button
            className={`w-8 h-8 flex items-center cursor-pointer justify-center rounded-full transition-colors duration-200 ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button 
            className={`hover:text-gray-400 cursor-pointer relative ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            } rounded-full p-2`} 
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="relative">
            <button
              className="w-10 h-10 rounded-full overflow-hidden"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="Profile options"
            >
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <FaUserCircle size={30} className={`${isDark ? 'text-gray-300' : 'text-gray-500'} cursor-pointer`} />
              )}
            </button>

            {dropdownOpen && (
              <div 
                className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg ${
                  isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                } border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium">{username || 'User'}</p>
                  <p className="text-xs text-gray-500">Active user</p>
                </div>
                <label
                  htmlFor="profile-upload"
                  className={`block px-4 py-2 text-sm hover:bg-opacity-80 cursor-pointer ${
                    isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  {profileImage ? 'Change' : 'Upload'} Profile
                </label>
                {profileImage && (
                  <button
                    onClick={removeProfileImage}
                    className={`block w-full px-4 py-2 text-sm text-left ${
                      isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    Remove Profile
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className={`block w-full px-4 py-2 text-sm text-left border-t ${
                    isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  Sign out
                </button>
                <input
                  type="file"
                  id="profile-upload"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>
        </div>
      </header>

      <div
        className={`flex-1 overflow-auto transition-margin duration-300 ease-in-out ${
          isSidebarOpen ? (isMobile || isIconsOnly ? 'ml-20' : 'ml-64') : 'ml-0'
        } mt-16`}
      >
        <main className="p-6">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/users" element={<Users />} />
            <Route path="/emails" element={<Emails />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <footer className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} py-4`}>
            &copy; 2025 Thanzilanga+. All rights reserved
          </footer>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('username') || '';
  });
  
  const [toast, setToast] = useState(null);
  
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
    localStorage.setItem('username', username);
  }, [isLoggedIn, username]);
  
  // Clear toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type) => {
    setToast({ message, type });
  };
  
  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
    showToast(`Welcome back, ${username}!`, "success");
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    showToast('You have been logged out', "info");
  };

  return (
    <BrowserRouter>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Login onLogin={handleLogin} />} />
        <Route path="/password-reset" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/*"
          element={
            isLoggedIn ? (
              <Layout onLogout={handleLogout} username={username} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;