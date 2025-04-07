import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import global from './assets/global-aid.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define route constants to prevent typos
const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  PASSWORD_RESET: '/password-reset',
  DASHBOARD: '/dashboard'
};

const AuthHeader = ({ onLoginClick, onRegisterClick }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-violet-900 text-white py-4 shadow-xl">
      <div className="container mx-auto flex justify-between items-center px-6">
        <div className="flex items-center space-x-3">
          <motion.img 
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            src={global} 
            alt="Thanzilanga+ Logo" 
            className="w-10 h-10 rounded-full shadow-lg ring-2 ring-white/20" 
          />
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400"
          >
            Thanzilanga+
          </motion.span>
        </div>
        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onLoginClick}
            className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-indigo-500/30"
          >
            Login
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onRegisterClick}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-emerald-500/30"
          >
            Sign Up
          </motion.button>
        </div>
      </div>
    </div>
  );
};

const FormInput = ({ type, name, value, onChange, label, required = true }) => (
  <div className="relative group">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="peer w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-300 bg-white/90 backdrop-blur-sm group-hover:border-indigo-300"
      placeholder=" "
      required={required}
    />
    <label className="absolute left-3 -top-2.5 px-1 bg-white text-gray-600 text-xs transition-all duration-200 ease-in-out peer-focus:text-indigo-600 peer-focus:font-medium">
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
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState('initial');

  // Determine the current auth mode based on route
  const isRegistering = location.pathname === ROUTES.REGISTER;
  const isResetting = location.pathname === ROUTES.PASSWORD_RESET;

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    const savedPassword = localStorage.getItem('password');
    if (savedUsername && savedPassword && location.pathname === ROUTES.LOGIN) {
      setFormData((prev) => ({
        ...prev,
        username: savedUsername,
        password: savedPassword,
        rememberMe: true,
      }));
    }
  }, [location.pathname]);

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

    setTimeout(() => {
      setLoading(false);

      if (isRegistering) {
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords don't match");
          setFormState('error');
          return;
        }
        
        setFormState('success');
        toast.success("🎉 Registration successful! Please login");
        setTimeout(() => navigate(ROUTES.LOGIN), 2000);
      } else {
        if (formData.username && formData.password) {
          if (formData.rememberMe) {
            localStorage.setItem('username', formData.username);
            localStorage.setItem('password', formData.password);
          } else {
            localStorage.removeItem('username');
            localStorage.removeItem('password');
          }

          setFormState('success');
          toast.success(`✨ Welcome back, ${formData.username}!`);
          setTimeout(() => {
            onLogin(formData.username);
            navigate(ROUTES.DASHBOARD, { state: { username: formData.username } });
          }, 1500);
        } else {
          setFormState('error');
          toast.error('🔐 Invalid username or password');
        }
      }
    }, 1000);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setLoading(true);
    setFormState('submitting');

    setTimeout(() => {
      setLoading(false);
      setFormState('success');
      toast.info(`📧 A password reset link has been sent to ${resetEmail}`);
      setTimeout(() => navigate(ROUTES.LOGIN), 2000);
    }, 1000);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const buttonColorClass = "bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-cyan-50">
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        toastClassName="!bg-white !text-gray-800 !shadow-xl !rounded-xl !border !border-gray-200"
        progressClassName="!bg-gradient-to-r from-indigo-500 to-purple-600"
      />
      
      <AuthHeader
        onLoginClick={() => navigate(ROUTES.LOGIN)}
        onRegisterClick={() => navigate(ROUTES.REGISTER)}
      />
      
      <div className="flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div 
            key={location.pathname} // Use pathname as key for proper animations
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-md"
          >
            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/20">
              <div className="h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600"></div>
              
              <div className="bg-gradient-to-br from-indigo-700 to-purple-800 text-white px-8 py-6">
                <motion.h2 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl font-bold mb-2"
                >
                  {isResetting ? 'Reset Password' : (isRegistering ? 'Join Thanzilanga+' : 'Welcome Back')}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.3 } }}
                  className="text-indigo-200 text-sm"
                >
                  {isResetting 
                    ? 'Enter your email to receive reset instructions'
                    : (isRegistering 
                      ? 'Create an account and start your health journey today'
                      : 'Access personalized health services with your account')}
                </motion.p>
              </div>

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
                        whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className={`w-full ${buttonColorClass} text-white py-3 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-indigo-500/30 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center">
                            <motion.span 
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                            />
                            Sending...
                          </span>
                        ) : 'Send Reset Link'}
                      </motion.button>
                      
                      <div className="text-center mt-4">
                        <motion.span
                          whileHover={{ color: '#4F46E5' }}
                          onClick={() => navigate(ROUTES.LOGIN)}
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
                              onClick={() => navigate(ROUTES.PASSWORD_RESET)}
                              className="text-indigo-600 hover:text-indigo-800 text-sm cursor-pointer font-medium"
                            >
                              Forgot Password?
                            </motion.span>
                          </div>
                        </div>
                      )}
                      
                      <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className={`w-full mt-2 ${buttonColorClass} text-white py-3 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-indigo-500/30
                        ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center">
                            <motion.span 
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                            />
                            {isRegistering ? 'Creating Account...' : 'Signing In...'}
                          </span>
                        ) : (isRegistering ? 'Create Account' : 'Sign In')}
                      </motion.button>
                      
                      <div className="text-center mt-4">
                        {isRegistering ? (
                          <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <motion.span
                              whileHover={{ color: '#4F46E5' }}
                              onClick={() => navigate(ROUTES.LOGIN)}
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
                              onClick={() => navigate(ROUTES.REGISTER)}
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
              
              <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
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