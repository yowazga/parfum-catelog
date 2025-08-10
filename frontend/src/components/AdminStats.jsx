import React from 'react';

const AdminStats = ({ stats }) => {
  const statCards = [
    {
      name: 'Total Categories',
      value: stats.categories,
      change: '+2.5%',
      changeType: 'increase',
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      iconBg: 'bg-blue-500'
    },
    {
      name: 'Total Brands',
      value: stats.brands,
      change: '+12.3%',
      changeType: 'increase',
      icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100',
      iconBg: 'bg-emerald-500'
    },
    {
      name: 'Total Perfumes',
      value: stats.perfumes,
      change: '+8.1%',
      changeType: 'increase',
      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      iconBg: 'bg-purple-500'
    },
    {
      name: 'Active Users',
      value: stats.users,
      change: '+5.2%',
      changeType: 'increase',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
      iconBg: 'bg-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((item) => (
        <div
          key={item.name}
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${item.bgGradient} p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          </div>
          
          <div className="relative">
            {/* Icon */}
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${item.gradient} shadow-lg mb-4`}>
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
            </div>
            
            {/* Content */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-600">{item.name}</p>
              <div className="flex items-baseline space-x-2">
                <p className="text-3xl font-bold text-slate-900">{(item.value || 0).toLocaleString()}</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                  item.changeType === 'increase' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {item.change}
                </span>
              </div>
            </div>
            
            {/* Bottom accent */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient}`}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;

