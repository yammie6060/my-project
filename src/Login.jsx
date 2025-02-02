import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import global from './assets/global-aid.png';

const AuthHeader = ({ onLoginClick, onRegisterClick }) => {
  return (
    <div className="bg-gray-800 text-white py-3">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center space-x-3">
          <img src={global} alt="Hospital Sign" className="w-8 h-8" />
          <span className="text-lg font-semibold">Thanzilanga+</span>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onLoginClick}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-sm"
          >
            Login
          </button>
          <button
            onClick={onRegisterClick}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded text-sm"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

function Login({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    rememberMe: false,
  });
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const isRegistering = location.pathname === '/register';

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    const savedPassword = localStorage.getItem('password');
    if (savedUsername && savedPassword) {
      setFormData((prev) => ({
        ...prev,
        username: savedUsername,
        password: savedPassword,
        rememberMe: true,
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (formData.username === 'admin' && formData.password === '1234') {
      if (formData.rememberMe) {
        localStorage.setItem('username', formData.username);
        localStorage.setItem('password', formData.password);
      } else {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
      }
      onLogin(formData.username);
      navigate('/Dashboard', { state: { username: formData.username } });

    } else {
      alert('Invalid username or password');
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    alert(`A password reset link has been sent to ${resetEmail}`);
    setIsResetting(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AuthHeader
        onLoginClick={() => navigate('/login')}
        onRegisterClick={() => navigate('/register')}
      />
      <div className="flex items-center justify-center py-40 px-4 sm:px-6 lg:px-8">
        <div className="w-90 max-w-sm bg-white rounded-lg shadow-md p-12">
          {isResetting ? (
            <>
              <h2 className="text-xl font-bold text-center mb-4">Reset Password</h2>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="peer w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder=" "
                    required
                  />
                  <label className="absolute left-3 top-1.5 px-1 bg-white text-gray-500 text-sm transition-all duration-200 ease-in-out peer-placeholder-shown:text-sm peer-placeholder-shown:top-1.5 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-500">
                    Email
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-1.5 rounded-md text-sm"
                >
                  Send Reset Link
                </button>
                <div className="text-center">
                  <span
                    onClick={() => {
                      setIsResetting(false);
                      navigate('/login');
                    }}
                    className="text-blue-500 hover:text-blue-600 text-sm cursor-pointer"
                  >
                    Back to Login
                  </span>
                </div>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-center mb-4">
                {isRegistering ? 'Register with ThanziLanga+' : 'Login with ThanziLanga+'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="peer w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder=" "
                    required
                  />
                  <label className="absolute left-3 top-1.5 px-1 bg-white text-gray-500 text-sm transition-all duration-200 ease-in-out peer-placeholder-shown:text-sm peer-placeholder-shown:top-1.5 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-500">
                    Username
                  </label>
                </div>
                {isRegistering && (
                  <>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="peer w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder=" "
                        required
                      />
                      <label className="absolute left-3 top-1.5 px-1 bg-white text-gray-500 text-sm transition-all duration-200 ease-in-out peer-placeholder-shown:text-sm peer-placeholder-shown:top-1.5 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-500">
                        Email
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="peer w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder=" "
                        required
                      />
                      <label className="absolute left-3 top-1.5 px-1 bg-white text-gray-500 text-sm transition-all duration-200 ease-in-out peer-placeholder-shown:text-sm peer-placeholder-shown:top-1.5 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-500">
                        Phone
                      </label>
                    </div>
                  </>
                )}
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="peer w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder=" "
                    required
                  />
                  <label className="absolute left-3 top-1.5 px-1 bg-white text-gray-500 text-sm transition-all duration-200 ease-in-out peer-placeholder-shown:text-sm peer-placeholder-shown:top-1.5 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-500">
                    Password
                  </label>
                </div>
                {!isRegistering && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-600">Remember me</label>
                    </div>
                    <div>
                      <span
                        onClick={() => {
                          setIsResetting(true);
                          navigate('/password-reset');
                        }}
                        className="text-blue-500 hover:text-blue-600 text-sm cursor-pointer"
                      >
                        Forgot Password?
                      </span>
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full bg-gray-700 hover:bg-gray-800 text-white py-1.5 rounded-md text-sm"
                >
                  {isRegistering ? 'Register' : 'Login'}
                </button>
                <div className="text-center">
                  {isRegistering ? (
                    <>
                      Already have an account?{' '}
                      <span
                        onClick={() => navigate('/login')}
                        className="text-blue-500 hover:text-blue-600 text-sm cursor-pointer"
                      >
                        Login
                      </span>
                    </>
                  ) : (
                    <>
                      Don't have an account?{' '}
                      <span
                        onClick={() => navigate('/register')}
                        className="text-blue-500 hover:text-blue-600 text-sm cursor-pointer"
                      >
                        Register
                      </span>
                    </>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;