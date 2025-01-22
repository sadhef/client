import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api, { apiEndpoints } from '../services/api';

const API_URL = process.env.REACT_APP_API_URL
const DASH_URL = process.env.REACT_APP_DASH_URL

const logger = {
  debug: (message, data) => console.log(`[Dashboard Debug] ${message}`, data || ''),
  error: (message, error) => console.error(`[Dashboard Error] ${message}`, error || ''),
  info: (message) => console.info(`[Dashboard Info] ${message}`),
};

const DashApp = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const history = useHistory();

  const checkDashboardHealth = useCallback(async () => {
    try {
      const response = await fetch(`${DASH_URL}/health`);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Dashboard health check failed');
      }
      return true;
    } catch (error) {
      logger.error('Dashboard health check failed', error);
      return false;
    }
  }, []);

  const initializeDashboard = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        logger.info('No token found - redirecting to login');
        history.push('/login');
        return;
      }

      await api.get(apiEndpoints.auth.verify);
      logger.info('Token verified successfully');

      const isDashboardHealthy = await checkDashboardHealth();
      if (!isDashboardHealthy) {
        throw new Error('Dashboard service is not accessible');
      }

      setIsLoading(false);
      setDashboardError(null);
    } catch (error) {
      logger.error('Dashboard initialization failed:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        history.push('/login');
      } else {
        setDashboardError(error.message || 'Failed to initialize dashboard');
        setIsLoading(false);
      }
    }
  }, [history, checkDashboardHealth]);

  useEffect(() => {
    logger.info('DashApp component mounted');
    let mounted = true;

    const initialize = async () => {
      if (mounted) {
        await initializeDashboard();
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, [initializeDashboard, retryCount]);

  const handleRetry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
    setIsLoading(true);
    setDashboardError(null);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center max-w-lg mx-auto p-6 bg-gray-800 rounded-lg shadow-xl">
          <div className="text-red-500 text-lg mb-4">{dashboardError}</div>
          <p className="text-gray-400 mb-6">
            Unable to connect to the dashboard service. Please try again later.
          </p>
          <div className="space-y-4">
            <button
              onClick={handleRetry}
              disabled={retryCount >= 3}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {retryCount >= 3 ? 'Too many retries' : 'Retry Connection'}
            </button>
            <button
              onClick={() => history.push('/')}
              className="block w-full px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="flex-grow">
        <iframe
          src={`${DASH_URL}/dashboard`}
          title="BladeRunner Dashboard"
          className="w-full h-full border-none"
          style={{
            minHeight: '100vh',
          }}
          onError={() => {
            logger.error('Dashboard iframe failed to load');
            setDashboardError('Failed to load dashboard content');
          }}
        />
      </div>
    </div>
  );
};

export default DashApp;
