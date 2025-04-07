import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import global from './assets/global-aid.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthHeader = ({ onLoginClick, onRegisterClick }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-800 to-purple-900 text-white py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-6">
        <div className="flex items-center space-x-3">
          <motion.img 
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.8 }}
            src={global} 
            alt="Thanzilanga+ Logo" 
            className="w-10 h-10 rounded-full shadow-md" 
          />
          <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-purple-400">
            Thanzilanga+
          </span>
        </div>
        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLoginClick}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Login
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRegisterClick}
            className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Sign Up
          </motion.button>
        </div>
      </div>
    </div>
  );
};

// Reusable Form Input component
const FormInput = ({ type, name, value, onChange, label, required = true }) => (
  <div className="relative">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="peer w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all duration-200 bg-white/80 backdrop-blur-sm"
      placeholder=" "
      required={required}
    />
    <label className="absolute left-3 -top-2.5 px-1 bg-white text-gray-600 text-xs transition-all duration-200 ease-in-out">
      {label}
    </label>
  </div>
);

function Login({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
  });
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [loading, setLoading] = useState(false);
  const isRegistering = location.pathname === '/register';
  const [formState, setFormState] = useState('initial'); // 'initial', 'submitting', 'success', 'error'

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
    setLoading(true);
    setFormState('submitting');

    // Simulate network request
    setTimeout(() => {
      setLoading(false);

      if (isRegistering) {
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords don't match");
          setFormState('error');
          return;
        }
        
        // Registration success
        setFormState('success');
        toast.success("Registration successful! Please login");
        setTimeout(() => navigate('/login'), 2000);
      } else {
        if (formData.username && formData.password) {
          // Store credentials if remember me is checked
          if (formData.rememberMe) {
            localStorage.setItem('username', formData.username);
            localStorage.setItem('password', formData.password);
          } else {
            localStorage.removeItem('username');
            localStorage.removeItem('password');
          }

          // Login success
          setFormState('success');
          toast.success(`Welcome back, ${formData.username}!`);
          setTimeout(() => {
            onLogin(formData.username);
            navigate('/Dashboard', { state: { username: formData.username } });
          }, 1500);
        } else {
          setFormState('error');
          toast.error('Invalid username or password');
        }
      }
    }, 1000);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setLoading(true);
    setFormState('submitting');

    // Simulate network request
    setTimeout(() => {
      setLoading(false);
      setFormState('success');
      toast.info(`A password reset link has been sent to ${resetEmail}`);
      setTimeout(() => {
        setIsResetting(false);
        navigate('/login');
      }, 2000);
    }, 1000);
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const buttonColorClass = "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700";

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-teal-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <AuthHeader
        onLoginClick={() => navigate('/login')}
        onRegisterClick={() => navigate('/register')}
      />
      
      <div className="flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div 
            key={isResetting ? 'reset' : (isRegistering ? 'register' : 'login')}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-md"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              {/* Top decorative bar */}
              <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
              
              {/* Header panel */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white px-8 py-6">
                <motion.h2 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-2xl font-bold mb-2"
                >
                  {isResetting ? 'Reset Password' : (isRegistering ? 'Join Thanzilanga+' : 'Welcome Back')}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.2 } }}
                  className="text-indigo-100 text-sm"
                >
                  {isResetting 
                    ? 'Enter your email to receive reset instructions'
                    : (isRegistering 
                      ? 'Create an account and start your health journey today'
                      : 'Access personalized health services with your account')}
                </motion.p>
              </div>

              {/* Form section */}
              <div className="p-8">
                {isResetting ? (
                  <>
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Reset Your Password</h3>
                    <form onSubmit={handleResetPassword} className="space-y-5">
                      <FormInput
                        type="email"
                        name="resetEmail"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        label="Email Address"
                      />
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className={`w-full ${buttonColorClass} text-white py-3 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                      </motion.button>
                      
                      <div className="text-center mt-4">
                        <motion.span
                          whileHover={{ color: '#4F46E5' }}
                          onClick={() => {
                            setIsResetting(false);
                            navigate('/login');
                          }}
                          className="text-indigo-600 hover:text-indigo-800 text-sm cursor-pointer font-medium"
                        >
                          Back to Login
                        </motion.span>
                      </div>
                    </form>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">
                      {isRegistering ? 'Create Your Account' : 'Sign In to Your Account'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <FormInput
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        label="Username"
                      />
                      
                      {isRegistering && (
                        <>
                          <FormInput
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            label="Email Address"
                          />
                          
                          <FormInput
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            label="Phone Number"
                          />
                        </>
                      )}
                      
                      <FormInput
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        label="Password"
                      />
                      
                      {isRegistering && (
                        <FormInput
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          label="Confirm Password"
                        />
                      )}
                      
                      {!isRegistering && (
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              name="rememberMe"
                              checked={formData.rememberMe}
                              onChange={handleChange}
                              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <label className="ml-2 text-sm text-gray-600">Remember me</label>
                          </div>
                          <div>
                            <motion.span
                              whileHover={{ color: '#4F46E5' }}
                              onClick={() => {
                                setIsResetting(true);
                                navigate('/password-reset');
                              }}
                              className="text-indigo-600 hover:text-indigo-800 text-sm cursor-pointer font-medium"
                            >
                              Forgot Password?
                            </motion.span>
                          </div>
                        </div>
                      )}
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className={`w-full mt-2 ${buttonColorClass} text-white py-3 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg
                        ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {loading ? 
                          (isRegistering ? 'Creating Account...' : 'Signing In...') : 
                          (isRegistering ? 'Create Account' : 'Sign In')}
                      </motion.button>
                      
                      <div className="text-center mt-4">
                        {isRegistering ? (
                          <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <motion.span
                              whileHover={{ color: '#4F46E5' }}
                              onClick={() => navigate('/login')}
                              className="text-indigo-600 hover:text-indigo-800 cursor-pointer font-medium"
                            >
                              Sign In
                            </motion.span>
                          </p>
                        ) : (
                          <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <motion.span
                              whileHover={{ color: '#4F46E5' }}
                              onClick={() => navigate('/register')}
                              className="text-indigo-600 hover:text-indigo-800 cursor-pointer font-medium"
                            >
                              Create Account
                            </motion.span>
                          </p>
                        )}
                      </div>
                    </form>
                  </>
                )}
              </div>
              
              {/* Bottom decorative bar */}
              <div className="h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
              className="text-center mt-8"
            >
              <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} Thanzilanga+. All rights reserved.
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Login;