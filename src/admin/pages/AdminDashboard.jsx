import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  Calendar, 
  RefreshCw, 
  FileText, 
  Tag, 
  Settings, 
  Bell,
  BarChart3,
  Menu,
  X
  
} from 'lucide-react';
import { toast } from 'react-toastify';
import DashboardOverview from '../components/DashboardOverview';
import UsersManagement from '../components/UsersManagement';
import PartnersManagement from '../components/PartnersManagement';
import BookingsManagement from '../components/BookingsManagement';
import RefundsManagement from '../components/RefundsManagement';
import ReportsManagement from '../components/ReportsManagement';
import PromoCodesManagement from '../components/PromoCodesManagement';
import SystemManagement from '../components/SystemManagement';
import NotificationsManagement from '../components/NotificationsManagement';
import AdminPayoutSystem from '../components/AdminPayoutSystem';
import LandingPage from '../../pages/LandingPage/index'; 

// Main Admin Dashboard Component
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'partners', label: 'Partners', icon: Building2 },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'refunds', label: 'Refunds', icon: RefreshCw },
    { id: 'payout', label: 'Payout', icon: RefreshCw },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'promo-codes', label: 'Promo Codes', icon: Tag },
    { id: 'system', label: 'System', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'home', label: 'LandingPage', icon: Bell },
  ];

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setDashboardStats({
          totalUsers: 1250,
          totalBookings: 3480,
          totalPartners: 45,
          totalRevenue: 125000,
          monthlyRevenue: 18500,
          pendingPartners: 8,
          pendingRefunds: 12
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Failed to fetch dashboard stats');
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview stats={dashboardStats} loading={loading} />;
      case 'users':
        return <UsersManagement />;
      case 'partners':
        return <PartnersManagement />;
      case 'bookings':
        return <BookingsManagement />;
      case 'refunds':
        return <RefundsManagement />;
      case 'payout':
        return <AdminPayoutSystem />;
      case 'reports':
        return <ReportsManagement />;
      case 'promo-codes':
        return <PromoCodesManagement />;
      case 'system':
        return <SystemManagement />;
      case 'notifications':
        return <NotificationsManagement />;
      case 'home':
        return <LandingPage />;
      default:
        return <DashboardOverview stats={dashboardStats} loading={loading} />;
    }
  };

  // If landing page is active, render it full screen
  if (activeTab === 'home') {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        {/* Optional: Add a back button or admin access button */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className="fixed top-4 right-4 z-60 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors shadow-lg"
        >
          Back to Admin
        </button>
        <LandingPage />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h1 className={`font-bold text-xl text-gray-800 ${!sidebarOpen && 'hidden'}`}>
              Admin Panel
            </h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        
        <nav className="p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center p-3 rounded-lg mb-2 transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="ml-3">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;