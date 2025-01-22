import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { 
  FaSignOutAlt, 
  FaUserShield, 
  FaBars, 
  FaTimes, 
  FaChartLine,
  FaCog,
  FaUser,
  FaBell
} from 'react-icons/fa';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  // Only show navigation on dashboard
  const showNavigation = ['/dashapp'].includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    history.push('/');
  };

  if (!showNavigation) {
    return null;
  }

  const NavLink = ({ to, icon: Icon, children }) => (
    <Link
      to={to}
      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 
                hover:text-black rounded-lg transition-colors"
    >
      <Icon className="text-lg" />
      <span>{children}</span>
    </Link>
  );

  return (
    <>
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-200
        ${isScrolled ? 'bg-white shadow-md' : 'bg-white/80 backdrop-blur-lg'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <img 
                  src="/Greenjets.webp" 
                  alt="Greenjets Logo" 
                  className="h-8"
                />
                <span className="text-lg font-bold text-gray-900">BladeRunner</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <NavLink to="/dashapp" icon={FaChartLine}>
                Dashboard
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" icon={FaUserShield}>
                  Admin Panel
                </NavLink>
              )}
            </div>

            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center gap-4">
              {/* Notifications */}
              <button className="w-10 h-10 flex items-center justify-center text-gray-500 
                               hover:bg-gray-100 rounded-lg relative transition-colors">
                <FaBell />
                <span className="absolute top-2 right-2 w-2 h-2 bg-black rounded-full"></span>
              </button>

              {/* Settings */}
              <button className="w-10 h-10 flex items-center justify-center text-gray-500 
                               hover:bg-gray-100 rounded-lg transition-colors">
                <FaCog />
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 
                           transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Profile</span>
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg 
                                py-2 border border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 
                              hover:bg-gray-100 transition-colors"
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-gray-500 
                       hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
            <div className="px-4 py-2 space-y-1">
              <NavLink to="/dashapp" icon={FaChartLine}>
                Dashboard
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" icon={FaUserShield}>
                  Admin Panel
                </NavLink>
              )}
              <div className="border-t border-gray-200 mt-2 pt-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 
                           hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16"></div>

      {/* Click outside handler for profile dropdown */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Navigation;