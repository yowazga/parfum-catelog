import React from 'react';
import { Link } from 'react-router-dom';
import { sampleData } from '../data/sampleData';
import AdminLayout from '../components/AdminLayout';
import AdminStats from '../components/AdminStats';

const AdminDashboard = () => {
  // Calculate statistics from sample data
  const stats = {
    categories: sampleData.categories.length,
    brands: sampleData.categories.reduce((acc, cat) => acc + cat.brands.length, 0),
    perfumes: sampleData.categories.reduce((acc, cat) => 
      acc + cat.brands.reduce((brandAcc, brand) => brandAcc + brand.perfumes.length, 0), 0
    ),
    users: 1250 // Mock data
  };

  const quickActions = [
    {
      name: 'Add New Category',
      description: 'Create a new perfume category',
      href: '/admin/categories',
      icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      hoverGradient: 'from-blue-600 to-blue-700'
    },
    {
      name: 'Add New Brand',
      description: 'Add a new perfume brand',
      href: '/admin/brands',
      icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100',
      hoverGradient: 'from-emerald-600 to-emerald-700'
    },
    {
      name: 'Add New Perfume',
      description: 'Add a new perfume to existing brand',
      href: '/admin/perfumes',
      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      hoverGradient: 'from-purple-600 to-purple-700'
    },
    {
      name: 'Upload Images',
      description: 'Manage brand and perfume images',
      href: '/admin/images',
      icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
      gradient: 'from-indigo-500 to-indigo-600',
      bgGradient: 'from-indigo-50 to-indigo-100',
      hoverGradient: 'from-indigo-600 to-indigo-700'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      message: 'Created new category',
      target: 'Men\'s Cologne',
      date: '2023-10-27T10:00:00Z',
      time: '10:00 AM',
      icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
      iconBg: 'bg-gradient-to-r from-blue-500 to-blue-600',
      status: 'success'
    },
    {
      id: 2,
      message: 'Added new brand',
      target: 'Chanel',
      date: '2023-10-26T14:30:00Z',
      time: '02:30 PM',
      icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
      iconBg: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      status: 'success'
    },
    {
      id: 3,
      message: 'Added new perfume',
      target: 'Eau de Parfum',
      date: '2023-10-25T09:15:00Z',
      time: '09:15 AM',
      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      iconBg: 'bg-gradient-to-r from-purple-500 to-purple-600',
      status: 'success'
    },
    {
      id: 4,
      message: 'Updated image for brand',
      target: 'Dior',
      date: '2023-10-24T11:00:00Z',
      time: '11:00 AM',
      icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
      iconBg: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
      status: 'info'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Admin Dashboard</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Welcome to your perfume catalog administration panel. Manage categories, brands, and perfumes with ease.
          </p>
        </div>

        {/* Statistics Cards */}
        <AdminStats stats={stats} />

        {/* Quick Actions */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20">
          <div className="px-8 py-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Quick Actions</h3>
              <p className="text-slate-600">Get started with common administrative tasks</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action) => (
                <Link
                  key={action.name}
                  to={action.href}
                  className="group relative bg-white p-6 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
                >
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${action.gradient} text-white shadow-lg mb-4 group-hover:shadow-xl transition-all duration-300`}>
                      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors">
                      {action.name}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{action.description}</p>
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20">
          <div className="px-8 py-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Recent Activity</h3>
              <p className="text-slate-600">Stay updated with the latest changes in your catalog</p>
            </div>
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivity.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== recentActivity.length - 1 ? (
                        <span
                          className="absolute top-6 left-6 -ml-px h-full w-0.5 bg-gradient-to-b from-slate-200 to-transparent"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-6">
                        <div>
                          <span className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg ${activity.iconBg}`}>
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={activity.icon} />
                            </svg>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-slate-600">
                              {activity.message}{' '}
                              <span className="font-semibold text-slate-900">{activity.target}</span>
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-slate-500">
                            <time dateTime={activity.date} className="font-medium">{activity.time}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
