import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  Calendar, 
  RefreshCw, 
  FileText,   
  DollarSign,
  TrendingUp,
  Activity, 
  AlertCircle
} from 'lucide-react';
import adminApi from '../services/adminApi';
import { toast } from 'react-toastify';

const DashboardOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError(error.message);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchDashboardStats();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Dashboard</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={handleRetry}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  const statCards = [
    { 
      label: 'Total Users', 
      value: stats?.totalUsers?.toLocaleString() || '0', 
      icon: Users, 
      color: 'bg-blue-500',
      trend: '+12% from last month'
    },
    { 
      label: 'Total Bookings', 
      value: stats?.totalBookings?.toLocaleString() || '0', 
      icon: Calendar, 
      color: 'bg-green-500',
      trend: '+8% from last month'
    },
    { 
      label: 'Total Partners', 
      value: stats?.totalPartners?.toLocaleString() || '0', 
      icon: Building2, 
      color: 'bg-purple-500',
      trend: '+15% from last month'
    },
    { 
      label: 'Total Revenue', 
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, 
      icon: DollarSign, 
      color: 'bg-yellow-500',
      trend: '+22% from last month'
    },
    { 
      label: 'Monthly Revenue', 
      value: `$${(stats?.monthlyRevenue || 0).toLocaleString()}`, 
      icon: TrendingUp, 
      color: 'bg-indigo-500',
      trend: 'Current month'
    },
    { 
      label: 'Pending Partners', 
      value: stats?.pendingPartners?.toLocaleString() || '0', 
      icon: AlertCircle, 
      color: 'bg-orange-500',
      trend: 'Requires attention'
    },
    { 
      label: 'Pending Refunds', 
      value: stats?.pendingRefunds?.toLocaleString() || '0', 
      icon: RefreshCw, 
      color: 'bg-red-500',
      trend: 'Requires processing'
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <button 
          onClick={handleRetry}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
        >
          <RefreshCw size={16} className="mr-2" />
          Refresh
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`${card.color} p-3 rounded-lg`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">{card.label}</p>
                    <p className="text-2xl font-semibold text-gray-800">{card.value}</p>
                  </div>
                </div>
              </div>
              {card.trend && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">{card.trend}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium">Database Connection</span>
              </div>
              <span className="text-xs text-green-600">Healthy</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium">Payment Gateway</span>
              </div>
              <span className="text-xs text-green-600">Online</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium">Email Service</span>
              </div>
              <span className="text-xs text-yellow-600">Delayed</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium">API Status</span>
              </div>
              <span className="text-xs text-green-600">Operational</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors">
              <Users className="mx-auto mb-2 text-blue-500" size={24} />
              <p className="text-sm font-medium">Manage Users</p>
              <p className="text-xs text-gray-500">{stats?.totalUsers || 0} total</p>
            </button>
            <button className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors">
              <Building2 className="mx-auto mb-2 text-green-500" size={24} />
              <p className="text-sm font-medium">Review Partners</p>
              <p className="text-xs text-gray-500">{stats?.pendingPartners || 0} pending</p>
            </button>
            <button className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors">
              <FileText className="mx-auto mb-2 text-purple-500" size={24} />
              <p className="text-sm font-medium">Generate Report</p>
              <p className="text-xs text-gray-500">Export data</p>
            </button>
            <button className="p-4 bg-orange-50 rounded-lg text-center hover:bg-orange-100 transition-colors">
              <RefreshCw className="mx-auto mb-2 text-orange-500" size={24} />
              <p className="text-sm font-medium">Process Refunds</p>
              <p className="text-xs text-gray-500">{stats?.pendingRefunds || 0} pending</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;