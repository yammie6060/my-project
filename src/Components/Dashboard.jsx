import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBoxOpen, FaUsers, FaEnvelope, FaUserAlt, FaChartLine } from 'react-icons/fa';

const Dashboard = ({ isDark }) => {
  const location = useLocation();
  const username = location.state?.username || "User";
  
  // Mock data with animations
  const [totalStock, setTotalStock] = useState(0);
  const [totalStaff, setTotalStaff] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalEmails, setTotalEmails] = useState(0);
  
  // Simulate loading data
  useEffect(() => {
    const timer1 = setTimeout(300);
    const timer2 = setTimeout(600);
    const timer3 = setTimeout(900);
    const timer4 = setTimeout(1200);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  const navProgressData = [
    { title: 'Stock',  color: '#3b82f6' },
    { title: 'Staff',  color: '#f59e0b' },
    { title: 'Users',  color: '#ef4444' },
    { title: 'Emails',  color: '#10b981' },
  ];

  const cardData = [
    { 
      to: '/stock', 
      icon: FaBoxOpen, 
      label: 'Total Stock', 
      count: totalStock,
      color: '#3b82f6',
      lightBg: 'bg-blue-50',
      darkBg: 'bg-blue-900/20',
      lightBorder: 'border-blue-200',
      darkBorder: 'border-blue-800',
      hoverLight: 'hover:bg-blue-100',
      hoverDark: 'hover:bg-blue-900/30'
    },
    { 
      to: '/staff', 
      icon: FaUsers, 
      label: 'Total Staff', 
      count: totalStaff,
      color: '#f59e0b',
      lightBg: 'bg-orange-50',
      darkBg: 'bg-orange-900/20',
      lightBorder: 'border-orange-200',
      darkBorder: 'border-orange-800',
      hoverLight: 'hover:bg-orange-100',
      hoverDark: 'hover:bg-orange-900/30'
    },
    { 
      to: '/users', 
      icon: FaUserAlt, 
      label: 'Total Users', 
      count: totalUsers,
      color: '#ef4444',
      lightBg: 'bg-red-50',
      darkBg: 'bg-red-900/20',
      lightBorder: 'border-red-200',
      darkBorder: 'border-red-800',
      hoverLight: 'hover:bg-red-100',
      hoverDark: 'hover:bg-red-900/30'
    },
    { 
      to: '/emails', 
      icon: FaEnvelope, 
      label: 'Total Emails', 
      count: totalEmails,
      color: '#10b981',
      lightBg: 'bg-green-50',
      darkBg: 'bg-green-900/20',
      lightBorder: 'border-green-200',
      darkBorder: 'border-green-800',
      hoverLight: 'hover:bg-green-100',
      hoverDark: 'hover:bg-green-900/30'
    }
  ];

  return (
    <div className={`p-6 min-h-screen transition-all duration-300 `}>
      {/* Header with welcome message */}
      <div className="mb-8">
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 `}>
          <div className="flex items-center gap-3">
            <div>
              <p className={`text-xl font-bold ${isDark ? 'text-grey-600' : 'text-grey-600'}`}>Welcome, {username}👋👋</p>
            </div>
          </div>
          <div className={`mt-4 sm:mt-0 px-4 py-2 rounded-lg ${
            isDark ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-100 text-gray-700'
          }`}>
            <div className="flex items-center gap-2">
              <FaChartLine className={isDark ? 'text-blue-400' : 'text-blue-600'} />
              <span className="font-medium">Analytics Overview</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardData.map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className={`p-6 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl border ${
              isDark 
                ? `${item.darkBg} ${item.darkBorder} ${item.hoverDark}` 
                : `${item.lightBg} ${item.lightBorder} ${item.hoverLight}`
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              <div className={`p-3 rounded-full shadow-md ${
                isDark ? 'bg-gray-700/70' : 'bg-white'
              }`}>
                <item.icon 
                  size={24}
                  style={{ color: item.color }} 
                />
              </div>
              <div className="text-center">
                <h3 className={`font-medium text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {item.label}
                </h3>
                <p className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {item.count}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Progress Overview */}
      <div className={`mt-12 p-6 rounded-xl shadow-lg border ${
        isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-100'
      }`}>
        <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
          <FaChartLine /> Progress Overview
        </h3>
        <div className="space-y-6">
          {navProgressData.map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <p className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {item.title}
                </p>
                <span className={`font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {item.progress}%
                </span>
              </div>
              <div className={`h-3 w-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${item.progress}%`, 
                    backgroundColor: item.color,
                    boxShadow: `0 0 10px ${item.color}80`
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Activity summary */}
      <div className={`mt-8 p-6 rounded-xl shadow-lg border ${
        isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-100'
      }`}>
        <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-700'}`}>
          Recent Activity
        </h3>
        <div className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <p>Stock inventory updated</p>
              <span className="ml-auto text-sm opacity-70"></span>
            </div>
          </div>
          <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <p>New staff member added</p>
              <span className="ml-auto text-sm opacity-70"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;