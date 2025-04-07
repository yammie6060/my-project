import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import Login from './Login';

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
      showToast('You have been logged out', "info");
    };
  
    return (
      <BrowserRouter>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
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