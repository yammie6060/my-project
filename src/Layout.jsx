import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { Menu, Bell, Moon, Sun, X, ChevronDown, ChevronRight } from 'lucide-react';
import { FaHome, FaBoxOpen, FaEnvelope, FaUsers, FaUserAlt, FaSignOutAlt, FaUserCircle, FaCog } from 'react-icons/fa';
import global from './assets/global-aid.png';
import Dashboard from './Components/Dashboard';
import Stock from './Components/Stock';
import Staff from './Components/Staff';
import Users from './Components/Users';
import Emails from './Components/Emails';
import Login from './Login';

// Toast Component
const Toast = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-emerald-500' : 
                 type === 'error' ? 'bg-rose-500' : 
                 type === 'info' ? 'bg-sky-500' : 'bg-gray-800';
  
  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-4 py-3 rounded-lg shadow-xl flex items-center justify-between z-50 min-w-64 animate-fade-in-up`}>
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200 transition-colors">
        <X size={18} />
      </button>
    </div>
  );
};

// Layout Component
const Layout = ({ onLogout, username }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(localStorage.getItem('profileImage') || '');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (!mobile && !isSidebarOpen) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

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
      setSidebarOpen(prev => !prev);
    } else {
      setIsCollapsed(prev => !prev);
    }
  };

  const toggleTheme = () => {
    setIsDark(prev => !prev);
    showToast(`Switched to ${isDark ? 'light' : 'dark'} mode`, 'info');
  };

  const handleLogout = () => {
    showToast('Logging out...', 'info');
    setIsFadingOut(true);
    setTimeout(() => {
      onLogout();
      navigate('/login');
    }, 500);
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Image size should be less than 2MB', 'error');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
        localStorage.setItem('profileImage', reader.result);
        showToast('Profile image updated!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = () => {
    setProfileImage('');
    localStorage.removeItem('profileImage');
    showToast('Profile image removed', 'info');
    setDropdownOpen(false);
  };

  const toggleSubmenu = (menu) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  const navItems = [
    { 
      title: 'Dashboard', 
      icon: <FaHome size={18} />, 
      path: '/dashboard',
      exact: true
    },
    { 
      title: 'Inventory', 
      icon: <FaBoxOpen size={18} />,
      submenu: [
        { title: 'Stock Overview', path: '/stock' },
        { title: 'Low Stock Alerts', path: '/stock/alerts' },
        { title: 'Categories', path: '/stock/categories' }
      ]
    },
    { 
      title: 'People', 
      icon: <FaUsers size={18} />,
      submenu: [
        { title: 'Staff Management', path: '/staff' },
        { title: 'User Accounts', path: '/users' }
      ]
    },
    { 
      title: 'Communications', 
      icon: <FaEnvelope size={18} />,
      submenu: [
        { title: 'Email Campaigns', path: '/emails' },
        { title: 'Templates', path: '/emails/templates' },
        { title: 'Subscribers', path: '/emails/subscribers' }
      ]
    },
    { 
      title: 'Settings', 
      icon: <FaCog size={18} />, 
      path: '/settings'
    }
  ];

  return (
    <div
      className={`flex h-screen overflow-hidden transition-opacity duration-300 ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      } ${isDark ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}
    >
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Backdrop for mobile sidebar */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isDark
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        } border-r shadow-xl flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <img
                src={global}
                alt="Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Thanzilanga+
              </span>
            </div>
          )}
          {isCollapsed && (
            <div className="mx-auto">
              <img
                src={global}
                alt="Logo"
                className="w-8 h-8 object-contain"
              />
            </div>
          )}
          {isMobile && (
            <button
              className="p-1 rounded-full hover:bg-gray-700/20"
              onClick={toggleSidebar}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          {navItems.map((item) => (
            <div key={item.title}>
              {item.path ? (
                <div
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
                    isDark 
                      ? 'hover:bg-gray-700/50' 
                      : 'hover:bg-gray-100'
                  } ${
                    location.pathname === item.path ? 
                    (isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600') : ''
                  }`}
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile) setSidebarOpen(false);
                  }}
                >
                  <span className={`${isCollapsed ? 'mx-auto' : 'mr-3'}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.title}</span>
                  )}
                </div>
              ) : (
                <div>
                  <div
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
                      isDark 
                        ? 'hover:bg-gray-700/50' 
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => toggleSubmenu(item.title)}
                  >
                    <div className="flex items-center">
                      <span className={`${isCollapsed ? 'mx-auto' : 'mr-3'}`}>
                        {item.icon}
                      </span>
                      {!isCollapsed && (
                        <span className="text-sm font-medium">{item.title}</span>
                      )}
                    </div>
                    {!isCollapsed && (
                      <span>
                        {activeSubmenu === item.title ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </span>
                    )}
                  </div>
                  
                  {activeSubmenu === item.title && !isCollapsed && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <div
                          key={subItem.title}
                          className={`p-2 pl-4 text-sm rounded cursor-pointer ${
                            isDark 
                              ? 'hover:bg-gray-700/30' 
                              : 'hover:bg-gray-100'
                          } ${
                            location.pathname === subItem.path ? 
                            (isDark ? 'text-blue-400' : 'text-blue-600') : ''
                          }`}
                          onClick={() => {
                            navigate(subItem.path);
                            if (isMobile) setSidebarOpen(false);
                          }}
                        >
                          {subItem.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div 
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
              isDark 
                ? 'hover:bg-gray-700/50' 
                : 'hover:bg-gray-100'
            }`}
            onClick={handleLogout}
          >
            <span className={`${isCollapsed ? 'mx-auto' : 'mr-3'}`}>
              <FaSignOutAlt size={18} />
            </span>
            {!isCollapsed && (
              <span className="text-sm font-medium">Log Out</span>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header
          className={`h-16 flex items-center justify-between px-6 border-b ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } sticky top-0 z-40`}
        >
          <div className="flex items-center space-x-4">
            <button
              className={`p-2 rounded-full hover:bg-opacity-80 ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-semibold">
              {location.pathname.split('/')[1]?.charAt(0).toUpperCase() + location.pathname.split('/')[1]?.slice(1) || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button 
              className={`relative p-2 rounded-full ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`} 
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="relative">
              <button
                className="flex items-center space-x-2 focus:outline-none"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="Profile options"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-blue-500">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${
                      isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <FaUserCircle size={20} className={isDark ? 'text-gray-300' : 'text-gray-500'} />
                    </div>
                  )}
                </div>
                {!isMobile && (
                  <ChevronDown size={16} className={`transition-transform ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`} />
                )}
              </button>

              {dropdownOpen && (
                <div 
                  className={`absolute right-0 mt-2 w-56 rounded-lg shadow-xl z-50 ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  } border`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-medium">{username || 'User'}</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                  <div className="py-1">
                    <label
                      htmlFor="profile-upload"
                      className={`block px-4 py-2 text-sm cursor-pointer ${
                        isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      }`}
                    >
                      {profileImage ? 'Change Profile Photo' : 'Upload Profile Photo'}
                    </label>
                    {profileImage && (
                      <button
                        onClick={removeProfileImage}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        Remove Photo
                      </button>
                    )}
                    <button
                      onClick={() => navigate('/settings')}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      }`}
                    >
                      Account Settings
                    </button>
                  </div>
                  <div className="py-1 border-t">
                    <button
                      onClick={handleLogout}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        isDark ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-100 text-red-600'
                      }`}
                    >
                      Sign Out
                    </button>
                  </div>
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

        {/* Main Content */}
        <main
          className={`flex-1 overflow-auto transition-margin duration-300 ${
            isSidebarOpen ? (isCollapsed ? 'ml-20' : 'ml-64') : 'ml-0'
          }`}
        >
          <div className="p-6 max-w-7xl mx-auto">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/stock" element={<Stock />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="/users" element={<Users />} />
              <Route path="/emails" element={<Emails />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
          
          <footer className={`py-4 px-6 border-t ${
            isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'
          } text-sm`}>
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-2 md:mb-0">
                &copy; {new Date().getFullYear()} Thanzilanga+. All rights reserved.
              </div>
              <div className="flex space-x-4">
                <a href="#" className="hover:underline">Privacy Policy</a>
                <a href="#" className="hover:underline">Terms of Service</a>
                <a href="#" className="hover:underline">Contact Support</a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Layout;