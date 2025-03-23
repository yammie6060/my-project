import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBoxOpen, FaUsers, FaEnvelope, FaUserAlt } from 'react-icons/fa';

const Dashboard = ({ isDark }) => {
  
  const location = useLocation();
  const username = location.state?.username ;
  const totalStock = "";  
  const totalStaff = "";
  const totalUsers = "";
  const totalEmails = "";

  const navProgressData = [
    { title: 'Stock',  color: '#007bff' },
    { title: 'Staff',  color: '#f39c12' },
    { title: 'Users',  color: '#dc3545' },
    { title: 'Emails', color: '#28a745' },
  ];

  const cardData = [
    { 
      to: '/stock', 
      icon: FaBoxOpen, 
      label: 'Total Stock', 
      count: totalStock,
      color: navProgressData[0].color,
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
      color: navProgressData[1].color,
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
      color: navProgressData[2].color,
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
      color: navProgressData[3].color,
      lightBg: 'bg-green-50',
      darkBg: 'bg-green-900/20',
      lightBorder: 'border-green-200',
      darkBorder: 'border-green-800',
      hoverLight: 'hover:bg-green-100',
      hoverDark: 'hover:bg-green-900/30'
    }
  ];

  return (
    <div className={`p-4 min-h-screen ${isDark ? 'bg-gray-900' : ''}`}>
      
        <h4 className={`flex items-center gap-2 font-bold ${isDark ? 'text-green-400' : 'text-green-800'}`}>
          <FaHome size={24} /> 
          <span>Dashboard</span>
        </h4>
     

      <div className="mt-6">
        <h3 className={`text font-bold ${isDark ? 'text-white' : 'text-gray-500'}`}> 
          Welcome, <span className={isDark ? 'text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-700' : 'text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-700'}>{username}</span>
        </h3>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardData.map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center border ${
              isDark 
                ? `${item.darkBg} ${item.darkBorder} ${item.hoverDark}` 
                : `${item.lightBg} ${item.lightBorder} ${item.hoverLight}`
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <item.icon 
                className="w-10 h-10"
                style={{ color: item.color }} 
              />
              <h3 className={`font-semibold text-lg ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                {item.label}
              </h3>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {item.count}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-500'}`}>
          Progress Overview
        </h3>
        <div className="space-y-4">
          {navProgressData.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <p className={`w-28 font-bold ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                {item.title}
              </p>
              <div className={`flex-1 h-3 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full`}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.progress}%`, backgroundColor: item.color }}
                ></div>
              </div>
              <span className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {item.progress}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;