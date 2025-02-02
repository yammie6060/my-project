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

const THEME_KEY = 'theme';
const PROFILE_IMAGE_KEY = 'profileImage';

const Layout = ({ onLogout }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [isIconsOnly, setIsIconsOnly] = useState(false);
  const [isDark, setIsDark] = useState(localStorage.getItem(THEME_KEY) === 'dark');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(localStorage.getItem(PROFILE_IMAGE_KEY) || '');
  const [isFadingOut, setIsFadingOut] = useState(false);
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
      setIsFadingOut(true);
      setTimeout(() => {
        onLogout();
        navigate('/login');
      }, 300);
    }
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
        localStorage.setItem(PROFILE_IMAGE_KEY, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = () => {
    setProfileImage('');
    localStorage.removeItem(PROFILE_IMAGE_KEY);
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
      {isMobile && isSidebarOpen && (
        <div
          className="fixed bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isMobile || isIconsOnly ? 'w-20' : 'w-64'
        } ${
          isDark
            ? 'bg-gray-900 text-white border-gray-700'
            : 'bg-white text-gray-800 border-gray-200'
        } border-r shadow-lg rounded-r-xl`}
      >
        <div className="flex items-center justify-end p-4 border-b border-gray-700">
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
              className="flex items-center p-4 rounded cursor-pointer hover:bg-gray-700 transition-colors duration-200"
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
        className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 md:px-6 border-2 shadow-lg rounded-r-xl transition-all duration-300  ${
          isDark ? 'bg-gray-900 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-200'
        }`}
      >
        <div className="flex items-center space-x-4">
          <button
            className="text-gray-700 hover:text-gray-400 p-2 cursor-pointer"
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
      <h2 className="hidden md:block text-base md:text-lg font-bold text-gray-900 whitespace-nowrap">
        Thanzilanga+
      </h2>
    </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            className="w-8 h-8 flex items-center cursor-pointer justify-center rounded-full hover:bg-gray-600 transition-colors duration-200"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button className="hover:text-gray-400 cursor-pointer" aria-label="Notifications">
            <Bell size={20} />
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
                <FaUserCircle size={30} className="text-gray-400 cursor-pointer" />
              )}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-700 cursor-pointer rounded-lg shadow-lg">
                <label
                  htmlFor="profile-upload"
                  className="block px-4 py-2 text-sm text-white hover:text-gray-400 cursor-pointer"
                >
                  {profileImage ? 'Change' : 'Upload'} Profile
                </label>
                {profileImage && (
                  <button
                    onClick={removeProfileImage}
                    className="block w-full px-4 py-2 text-sm text-white hover:bg-gray-600 text-left"
                  >
                    Remove Profile
                  </button>
                )}
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
          <footer className="text-center text-sm text-gray-500 py-4">
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
  
  
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
    localStorage.setItem('username', username);
  }, [isLoggedIn, username]);
  
  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Login onLogin={handleLogin} />} />
        <Route path="/password-reset" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/*"
          element={
            isLoggedIn ? (
              <Layout onLogout={handleLogout} />
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