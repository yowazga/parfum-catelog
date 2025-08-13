import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { userService } from '../services/userService';
import AdminLayout from '../components/AdminLayout';

const UserManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState('profile');
  const [users, setUsers] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // User form state for creating/editing users
  const [userFormData, setUserFormData] = useState({
    username: '',
    email: '',
    password: '',
    enabled: true,
    roles: ['USER']
  });

  // Load current user profile and all users on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profile = await userService.getCurrentUser();
        setProfileData(prev => ({
          ...prev,
          username: profile.username || '',
          email: profile.email || ''
        }));
      } catch (error) {
        addNotification('Profile Load Error', 'Failed to load user profile', { type: 'error' });
      }
    };

    const loadUsers = async () => {
      // Only load users if the current user has admin role
      if (!user || !user.roles || !user.roles.includes('ADMIN')) {
        return;
      }
      
      try {
        const allUsers = await userService.getAllUsers();
        setUsers(allUsers);
      } catch (error) {
        addNotification('Users Load Error', 'Failed to load users list', { type: 'error' });
      }
    };

    loadUserProfile();
    loadUsers();
  }, [user]);

  // Reset to profile tab if non-admin user somehow gets to users tab
  useEffect(() => {
    if (activeTab === 'users' && (!user || !user.roles || !user.roles.includes('ADMIN'))) {
      setActiveTab('profile');
    }
  }, [activeTab, user]);

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Basic validation
      if (!profileData.username.trim()) {
        addNotification('Validation Error', 'Username is required', { type: 'error' });
        return;
      }

      if (!profileData.email.trim()) {
        addNotification('Validation Error', 'Email is required', { type: 'error' });
        return;
      }

      await userService.updateProfile({
        username: profileData.username,
        email: profileData.email
      });

      addNotification('Profile Updated', 'Your profile has been updated successfully!', { type: 'success' });
      
    } catch (error) {
      addNotification('Update Failed', error.message || 'Failed to update profile', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (!profileData.currentPassword) {
        addNotification('Validation Error', 'Current password is required', { type: 'error' });
        return;
      }

      if (!profileData.newPassword) {
        addNotification('Validation Error', 'New password is required', { type: 'error' });
        return;
      }

      if (profileData.newPassword.length < 6) {
        addNotification('Validation Error', 'New password must be at least 6 characters', { type: 'error' });
        return;
      }

      if (profileData.newPassword !== profileData.confirmPassword) {
        addNotification('Validation Error', 'Passwords do not match', { type: 'error' });
        return;
      }

      await userService.changePassword({
        currentPassword: profileData.currentPassword,
        newPassword: profileData.newPassword
      });

      addNotification('Password Changed', 'Your password has been updated successfully!', { type: 'success' });
      
      // Clear password fields
      setProfileData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

            } catch (error) {
            addNotification('Password Change Failed', error.message || 'Failed to change password', { type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // User form handlers
    const handleUserFormInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleRoleChange = (role) => {
        setUserFormData(prev => {
            // Ensure roles is always an array
            const currentRoles = Array.isArray(prev.roles) ? prev.roles : ['USER'];
            
            // Toggle the role
            let newRoles = currentRoles.includes(role) 
                ? currentRoles.filter(r => r !== role)
                : [...currentRoles, role];
            
                    // Ensure user always has at least USER
        if (newRoles.length === 0) {
          newRoles = ['USER'];
        }
            
            return {
                ...prev,
                roles: newRoles
            };
        });
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!userFormData.username.trim() || !userFormData.email.trim()) {
                addNotification('Validation Error', 'Username and email are required', { type: 'error' });
                return;
            }

            // Password validation
            if (!editingUser && !userFormData.password) {
                addNotification('Validation Error', 'Password is required for new users', { type: 'error' });
                return;
            }

            // Password length validation only applies when password is provided
            if (userFormData.password && userFormData.password.length < 6) {
                addNotification('Validation Error', 'Password must be at least 6 characters', { type: 'error' });
                return;
            }

            // Validate roles
            if (!userFormData.roles || userFormData.roles.length === 0) {
                addNotification('Validation Error', 'User must have at least one role', { type: 'error' });
                return;
            }

            if (editingUser) {
                // Update existing user
                const response = await userService.updateUser(editingUser.id, userFormData);
                setUsers(prev => prev.map(u => u.id === editingUser.id ? response.user : u));
                addNotification('User Updated', 'User updated successfully!', { type: 'success' });
                setEditingUser(null);
            } else {
                        // Create new user
        const response = await userService.createUser(userFormData);
        setUsers(prev => [...prev, response.user]);
        addNotification('User Created', 'User created successfully!', { type: 'success' });
            }

            setUserFormData({
                username: '',
                email: '',
                password: '',
                enabled: true,
                roles: ['USER']
            });
            setShowUserForm(false);

        } catch (error) {
            addNotification('User Save Failed', error.message || 'Failed to save user', { type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setUserFormData({
            username: user.username,
            email: user.email,
            password: '',
            enabled: user.enabled,
            roles: Array.isArray(user.roles) ? [...user.roles] : ['USER']
        });
        setShowUserForm(true);
    };

    const handleDeleteUser = async (userId, username) => {
        if (!window.confirm(`Are you sure you want to delete user "${username}"?`)) {
            return;
        }

        try {
            await userService.deleteUser(userId);
            setUsers(prev => prev.filter(u => u.id !== userId));
            addNotification('User Deleted', 'User deleted successfully!', { type: 'success' });
        } catch (error) {
            addNotification('Delete Failed', error.message || 'Failed to delete user', { type: 'error' });
        }
    };

    const handleCancelUserForm = () => {
        setShowUserForm(false);
        setEditingUser(null);
        setUserFormData({
            username: '',
            email: '',
            password: '',
            enabled: true,
            roles: ['USER']
        });
    };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">User Management</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage your account settings, update your profile information, and change your password.
          </p>
          

        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                key="profile-tab"
                onClick={() => setActiveTab('profile')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile Information
              </button>
              <button
                key="password-tab"
                onClick={() => setActiveTab('password')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'password'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Change Password
              </button>
              {user && user.roles && user.roles.includes('ADMIN') && (
                <button
                  key="users-tab"
                  onClick={() => setActiveTab('users')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'users'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  Manage Users
                </button>
              )}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto">
          {activeTab === 'profile' && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
              
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    required
                    value={profileData.username}
                    onChange={handleProfileInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={profileData.email}
                    onChange={handleProfileInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Update Profile
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h2>
              
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    required
                    value={profileData.currentPassword}
                    onChange={handleProfileInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    required
                    value={profileData.newPassword}
                    onChange={handleProfileInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">Password must be at least 6 characters long.</p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    value={profileData.confirmPassword}
                    onChange={handleProfileInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Changing...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Change Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'users' && user && user.roles && user.roles.includes('ADMIN') && (
            <div className="space-y-6">
              {/* Header with Add Button */}
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Manage Users</h2>
                <button
                  onClick={() => setShowUserForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add New User
                </button>
              </div>

              {/* User Form Modal */}
              {showUserForm && (
                <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {editingUser ? 'Edit User' : 'Create New User'}
                  </h3>
                  

                  
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="userUsername" className="block text-sm font-medium text-gray-700">
                          Username
                        </label>
                        <input
                          type="text"
                          id="userUsername"
                          name="username"
                          required
                          value={userFormData.username}
                          onChange={handleUserFormInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          id="userEmail"
                          name="email"
                          required
                          value={userFormData.email}
                          onChange={handleUserFormInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="userPassword" className="block text-sm font-medium text-gray-700">
                        Password {editingUser && '(leave blank to keep current)'}
                      </label>
                      <input
                        type="password"
                        id="userPassword"
                        name="password"
                        required={!editingUser}
                        value={userFormData.password}
                        onChange={handleUserFormInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Roles</label>
                      



                      <div className="space-y-2">
                        <div className="inline-flex items-center">
                          <input
                            type="checkbox"
                            id="role-user"
                            key={`role-user-${userFormData.roles?.includes('USER')}`}
                            defaultChecked={userFormData.roles?.includes('USER') || false}
                            onChange={() => handleRoleChange('USER')}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label htmlFor="role-user" className="ml-2 text-sm font-medium text-gray-900">
                            User
                          </label>
                        </div>
                        <div className="inline-flex items-center ml-6">
                          <input
                            type="checkbox"
                            id="role-admin"
                            key={`role-admin-${userFormData.roles?.includes('ADMIN')}`}
                            defaultChecked={userFormData.roles?.includes('ADMIN') || false}
                            onChange={() => handleRoleChange('ADMIN')}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label htmlFor="role-admin" className="ml-2 text-sm font-medium text-gray-900">
                            Admin
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          name="enabled"
                          checked={userFormData.enabled}
                          onChange={handleUserFormInputChange}
                          className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">Account Enabled</span>
                      </label>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={handleCancelUserForm}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        title={loading ? 'Loading...' : 'Click to update user'}

                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {editingUser ? 'Updating...' : 'Creating...'}
                          </>
                        ) : (
                          editingUser ? 'Update User' : 'Create User'
                        )}
                      </button>
                      

                      

                    </div>
                  </form>
                </div>
              )}

              {/* Users List */}
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Users ({users.length})</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Roles
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.username}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              {user.roles?.map((role, index) => (
                                <span
                                  key={`${user.id}-${role}-${index}`}
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    role === 'ADMIN' 
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-blue-100 text-blue-800'
                                  }`}
                                >
                                  {role.replace('ROLE_', '')}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.enabled 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.enabled ? 'Active' : 'Disabled'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id, user.username)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
