import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import api, { apiEndpoints } from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const history = useHistory();
  const mounted = React.useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mounted.current) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.post(apiEndpoints.auth.login, formData);
      
      if (mounted.current) {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          if (rememberMe) {
            localStorage.setItem('email', formData.email);
          }
          history.push('/dashapp');
        }
      }
    } catch (err) {
      if (mounted.current) {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      if (mounted.current) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-50">
      {/* Left Section - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 bg-gradient-to-br from-black/90 to-gray-900/90"></div>
        </div>
        <div className="relative w-full h-full flex flex-col justify-center px-12">
          <div className="absolute top-8 left-8">
            <img 
              src="/Greenjets.webp" 
              alt="Greenjets Logo" 
              className="h-8"
            />
          </div>
          <div className="text-white">
            <h1 className="text-6xl font-bold mb-6">Welcome Back!</h1>
            <p className="text-xl text-white/80">
              Your gateway to advanced engine analytics and monitoring
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden flex justify-center">
            <img 
              src="/Greenjets.webp" 
              alt="Greenjets Logo" 
              className="h-8"
            />
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Login</h2>
            <p className="text-gray-600">
              Welcome back! Please login to your account.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
                <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
                <FaLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <span className="ml-2 text-sm text-gray-600">Remember Me</span>
              </label>
              <button
                type="button"
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-black hover:bg-gray-900 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Login'
              )}
            </button>

            <div className="text-center text-sm text-gray-600">
              New User?{' '}
              <button
                type="button"
                onClick={() => history.push('/signup')}
                className="text-black hover:text-gray-700 font-medium transition-colors"
              >
                Signup
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => history.push('/')}
                className="text-sm text-gray-500 hover:text-black transition-colors"
              >
                ← Back to Home
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;