import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FaEnvelope, FaLock, FaShieldAlt } from 'react-icons/fa';
import api, { apiEndpoints } from '../services/api';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post(apiEndpoints.auth.adminLogin, formData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('isAdmin', 'true');
        history.push('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Admin login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
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
          {/* Logo */}
          <div className="absolute top-8 left-8">
            <img 
              src="/Greenjets.webp" 
              alt="Greenjets Logo" 
              className="h-8"
            />
          </div>
          <div className="text-white">
            <div className="mb-8">
              <FaShieldAlt className="text-6xl mb-6 text-white" />
            </div>
            <h1 className="text-6xl font-bold mb-6">Admin Portal</h1>
            <p className="text-xl text-white/80">
              Access the administrative dashboard to manage users and system settings
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo - Only visible on small screens */}
          <div className="mb-8 lg:hidden flex justify-center">
            <img 
              src="/Greenjets.webp" 
              alt="Greenjets Logo" 
              className="h-8"
            />
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                <FaShieldAlt className="text-2xl text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Admin Login</h2>
            </div>
            <p className="text-gray-600">
              Please enter your credentials to access the admin panel
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="admin@bladerunner.com"
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

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-black hover:bg-gray-900 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <FaShieldAlt />
                    <span>LOGIN AS ADMIN</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => history.push('/')}
                className="w-full mt-4 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-200 border border-gray-200"
              >
                Back to Home
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Need help? Contact system support
            </p>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaShieldAlt className="text-black" />
              <p>This is a secure admin access point. Unauthorized access is prohibited.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;