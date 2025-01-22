import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  FaSearch,
  FaBars,
  FaTimes,
  FaUser,
  FaUserCog,
  FaSignOutAlt,
  FaCheck,
  FaTrash,
  FaBell,
  FaFilter
} from 'react-icons/fa';
import api, { apiEndpoints } from '../services/api';

const AdminPanel = () => {
  const history = useHistory();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Fetch users data
  const fetchUsers = async () => {
    try {
      const response = await api.get(apiEndpoints.users.getAll);
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await api.put(apiEndpoints.users.approve(userId), { approved: true });
      await fetchUsers();
    } catch (err) {
      setError('Failed to approve user');
    }
  };

  const handleDelete = async (userId) => {
    try {
      await api.delete(apiEndpoints.users.delete(userId));
      await fetchUsers();
      setShowConfirmModal(false);
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'approved' && user.approved) ||
      (filter === 'pending' && !user.approved);
    
    return matchesSearch && matchesFilter;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    history.push('/');
  };

  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-black text-white transform transition-transform duration-300 ease-in-out ${
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:relative lg:translate-x-0`}>
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <img 
              src="/Greenjets.webp" 
              alt="Greenjets Logo" 
              className="h-8"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="w-full flex items-center gap-3 px-4 py-3 text-white rounded-lg bg-gray-800 mb-2">
            <FaUserCog className="text-lg" />
            <span className="font-medium">User Management</span>
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 rounded-lg hover:bg-gray-800 transition-all duration-200"
          >
            <FaSignOutAlt />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );

  const ConfirmModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Confirm Delete
        </h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this user? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowConfirmModal(false)}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDelete(selectedUserId)}
            className="px-4 py-2 bg-black hover:bg-gray-900 text-white rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-lg"
              >
                {isSidebarOpen ? <FaTimes /> : <FaBars />}
              </button>
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            </div>

            <div className="flex items-center gap-4">
              <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-lg relative">
                <FaBell />
                <span className="absolute top-2 right-2 w-2 h-2 bg-black rounded-full"></span>
              </button>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div className="relative min-w-[150px]">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <FaFilter className="text-gray-400" />
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full pl-10 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="all">All Users</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              {error}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">
                    User
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">
                    Email
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">
                    Role
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <FaUser className="text-gray-500" />
                        </div>
                        <span className="font-medium text-gray-900">{user.username}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{user.email}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {!user.approved && (
                          <button
                            onClick={() => handleApprove(user.id)}
                            className="p-2 text-black hover:bg-gray-100 rounded-lg transition-colors"
                            title="Approve User"
                          >
                            <FaCheck />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedUserId(user.id);
                            setShowConfirmModal(true);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {showConfirmModal && <ConfirmModal />}
    </div>
  );
};

export default AdminPanel;