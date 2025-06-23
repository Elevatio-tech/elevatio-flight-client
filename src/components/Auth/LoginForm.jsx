import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, Eye, EyeOff, Building, Shield, Clock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginForm = ({ userType, onToggleForm, onSwitchType, onForgotPassword, customLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rateLimited, setRateLimited] = useState(false);
  const [retryAfter, setRetryAfter] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const { login } = useAuth();

  // Load rate limit state from localStorage on component mount
  useEffect(() => {
    const savedRateLimit = localStorage.getItem(`rateLimit_${userType}`);
    if (savedRateLimit) {
      const { timestamp, retryAfter: savedRetryAfter, attempts } = JSON.parse(savedRateLimit);
      const now = Date.now();
      const timeElapsed = Math.floor((now - timestamp) / 1000);
      
      if (timeElapsed < savedRetryAfter) {
        setRateLimited(true);
        setRetryAfter(savedRetryAfter - timeElapsed);
        setAttemptCount(attempts || 0);
      } else {
        localStorage.removeItem(`rateLimit_${userType}`);
      }
    }
  }, [userType]);

  // Countdown timer for rate limiting
  useEffect(() => {
    let interval;
    if (rateLimited && retryAfter > 0) {
      interval = setInterval(() => {
        setRetryAfter(prev => {
          if (prev <= 1) {
            setRateLimited(false);
            setAttemptCount(0);
            localStorage.removeItem(`rateLimit_${userType}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [rateLimited, retryAfter, userType]);

  const handleRateLimit = (attempts = 1) => {
    const newAttempts = attemptCount + attempts;
    let waitTime;
    
    // Progressive wait times based on attempt count
    if (newAttempts <= 3) {
      waitTime = 60; // 1 minute
    } else if (newAttempts <= 5) {
      waitTime = 300; // 5 minutes
    } else {
      waitTime = 900; // 15 minutes
    }
    
    setRateLimited(true);
    setRetryAfter(waitTime);
    setAttemptCount(newAttempts);
    
    // Save to localStorage
    localStorage.setItem(`rateLimit_${userType}`, JSON.stringify({
      timestamp: Date.now(),
      retryAfter: waitTime,
      attempts: newAttempts
    }));
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 
      ? `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
      : `${remainingSeconds}s`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rateLimited) {
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      // Use the unified login function from AuthContext
      if (customLogin) {
        await customLogin(formData, userType);
      } else {
        await login(formData, userType);
      }
      
      // Clear any existing rate limit on successful login
      localStorage.removeItem(`rateLimit_${userType}`);
      setAttemptCount(0);
      
      // Handle redirect after successful login
      if (userType === 'admin') {
        window.location.href = '/admin';
      }
      
    } catch (err) {
      setError(err.message);
      
      // Handle rate limiting
      if (err.message.includes('Too many login attempts') || err.message.includes('429')) {
        handleRateLimit();
      } else if (err.message.includes('Invalid') || err.message.includes('credentials')) {
        // Increment attempt count for failed login attempts
        setAttemptCount(prev => prev + 1);
      }
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeIcon = () => {
    switch(userType) {
      case 'admin': return <Shield className="w-5 h-5" />;
      case 'partner': return <Building className="w-5 h-5" />;
      default: return <User className="w-5 h-5" />;
    }
  };

  const getUserTypeColor = () => {
    switch(userType) {
      case 'admin': return 'from-red-500 to-pink-600';
      case 'partner': return 'from-blue-500 to-indigo-600';
      default: return 'from-purple-500 to-indigo-600';
    }
  };

  const getErrorType = () => {
    if (rateLimited) return 'rate-limit';
    if (error.includes('Invalid') || error.includes('credentials')) return 'auth-error';
    if (error.includes('Server error')) return 'server-error';
    return 'general-error';
  };

  const renderError = () => {
    const errorType = getErrorType();
    
    if (errorType === 'rate-limit') {
      return (
        <div className="mb-4 p-4 bg-orange-500/20 border border-orange-500/50 rounded-lg">
          <div className="flex items-center space-x-2 text-orange-200 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Too Many Attempts</span>
          </div>
          <p className="text-orange-200 text-sm mb-2">
            Please wait before trying again. Multiple failed attempts detected.
          </p>
          <div className="flex items-center space-x-2 text-orange-300">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-mono">
              Retry in: {formatTime(retryAfter)}
            </span>
          </div>
        </div>
      );
    }
    
    if (error) {
      const bgColor = errorType === 'server-error' ? 'bg-yellow-500/20 border-yellow-500/50' : 'bg-red-500/20 border-red-500/50';
      const textColor = errorType === 'server-error' ? 'text-yellow-200' : 'text-red-200';
      
      return (
        <div className={`mb-4 p-3 ${bgColor} border rounded-lg ${textColor} text-sm`}>
          {error}
        </div>
      );
    }
    
    return null;
  };

  const isFormDisabled = loading || rateLimited;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className={`mx-auto h-16 w-16 bg-gradient-to-r ${getUserTypeColor()} rounded-full flex items-center justify-center mb-4`}>
            {getUserTypeIcon()}
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {userType.charAt(0).toUpperCase() + userType.slice(1)} Login
          </h2>
          <p className="text-gray-300">Sign in to your account</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
          {renderError()}

          {/* Attempt Counter Warning */}
          {attemptCount > 0 && !rateLimited && (
            <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-200 text-sm">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4" />
                <span>
                  {attemptCount === 1 ? '1 failed attempt' : `${attemptCount} failed attempts`}
                  {attemptCount >= 2 && ' - Please check your credentials'}
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  disabled={isFormDisabled}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    isFormDisabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={isFormDisabled}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className={`w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    isFormDisabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  disabled={isFormDisabled}
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-3 text-gray-400 hover:text-white ${
                    isFormDisabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isFormDisabled}
              className={`w-full py-3 px-4 bg-gradient-to-r ${getUserTypeColor()} text-white font-semibold rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : rateLimited ? (
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Wait {formatTime(retryAfter)}</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <button
              onClick={onForgotPassword}
              disabled={rateLimited}
              className={`text-purple-300 hover:text-purple-200 text-sm ${
                rateLimited ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Forgot your password?
            </button>

            {userType === 'user' && (
              <div>
                <p className="text-gray-300 text-sm">
                  Don't have an account?{' '}
                  <button
                    onClick={onToggleForm}
                    disabled={rateLimited}
                    className={`text-purple-300 hover:text-purple-200 font-medium ${
                      rateLimited ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Sign up
                  </button>
                </p>
              </div>
            )}

            <div className="flex justify-center space-x-4 pt-4 border-t border-white/20">
              <button
                onClick={() => onSwitchType('user')}
                disabled={rateLimited}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  userType === 'user' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                } ${rateLimited ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <User className="w-4 h-4 inline mr-2" />
                User
              </button>
              <button
                onClick={() => onSwitchType('partner')}
                disabled={rateLimited}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  userType === 'partner' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                } ${rateLimited ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Building className="w-4 h-4 inline mr-2" />
                Partner
              </button>
              <button
                onClick={() => onSwitchType('admin')}
                disabled={rateLimited}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  userType === 'admin' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                } ${rateLimited ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Shield className="w-4 h-4 inline mr-2" />
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;