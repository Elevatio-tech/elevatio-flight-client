import React, { useState, useEffect } from 'react';
import { 
  User, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Bell,
  Menu,
  X,
  LogOut,
  Settings,
  Home,
  CreditCard,
  Users,
  BarChart3,
  Plane,
  Percent,
  ExternalLink
} from 'lucide-react';

import BookingsManager from '../components/BookingsManager';
import PayoutManager from '../components/PayoutManager';
import ProfileManager from '../components/ProfileManager';
import Analytics from '../components/Analytics';
import CommissionManager from '../components/CommissionManager';
import { useAuth } from '../../context/AuthContext'; 
import { backendUrl } from '../../config/config';

// API Configuration
const API_BASE_URL = `${backendUrl}/api/partners`;

// Utility function for API calls - now accepts token as parameter
const apiCall = async (endpoint, token, options = {}) => {
  if (!token) {
    throw new Error('No authentication token available');
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    // Handle different error types
    if (response.status === 401) {
      throw new Error('Authentication failed - please login again');
    } else if (response.status === 403) {
      throw new Error('Access forbidden - insufficient permissions');
    } else {
      throw new Error(`API call failed: ${response.statusText}`);
    }
  }
  
  return response.json();
};

// Stats Card Component
const StatsCard = ({ icon: Icon, title, value, change, changeType }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {change && (
          <div className={`flex items-center mt-2 text-sm ${
            changeType === 'positive' ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>{change}</span>
          </div>
        )}
      </div>
      <div className="p-3 bg-blue-50 rounded-lg">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
    </div>
  </div>
);

const RecentBookings = ({ bookings, loading }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
    {loading ? (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex space-x-4 p-4 border border-gray-200 rounded-lg">
              <div className="rounded-full bg-gray-200 h-12 w-12"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="text-right space-y-2">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : bookings && bookings.length > 0 ? (
      <div className="space-y-4">
        {bookings.slice(0, 5).map((booking) => {
          // Extract flight information
          const flightInfo = booking.flight_info || booking.flight_offer || {};
          const departure = flightInfo.departure || {};
          const arrival = flightInfo.arrival || {};
          const passengerName = booking.passengers && booking.passengers.length > 0 
            ? `${booking.passengers[0].first_name} ${booking.passengers[0].last_name}`
            : 'Guest';
          
          return (
            <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              {/* Mobile Layout */}
              <div className="block sm:hidden space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Plane className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{booking.booking_reference}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600 text-sm">
                      ${(booking.commission_earned || 0).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">Commission</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Passenger:</span>
                    <span className="font-medium">{passengerName}</span>
                  </div>
                  
                  {flightInfo.flight_number && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Flight:</span>
                      <span className="font-medium">{flightInfo.flight_number}</span>
                    </div>
                  )}
                  
                  {departure.iataCode && arrival.iataCode && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Route:</span>
                      <span className="font-medium">{departure.iataCode} → {arrival.iataCode}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-medium">${(booking.total_amount || 0).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Booking Date:</span>
                    <span className="text-gray-500">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden sm:flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Plane className="w-5 h-5 text-blue-600" />
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Booking Info */}
                  <div>
                    <p className="font-semibold text-gray-900">{booking.booking_reference}</p>
                    <p className="text-sm text-gray-600">{passengerName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {/* Flight Info */}
                  <div>
                    {flightInfo.flight_number && (
                      <p className="text-sm font-medium text-gray-900">
                        {flightInfo.flight_number}
                      </p>
                    )}
                    {departure.iataCode && arrival.iataCode && (
                      <p className="text-sm text-gray-600">
                        {departure.iataCode} → {arrival.iataCode}
                      </p>
                    )}
                    {departure.at && (
                      <p className="text-xs text-gray-500">
                        Dep: {departure.at}
                      </p>
                    )}
                  </div>
                  
                  {/* Amount Info */}
                  <div>
                    <p className="text-sm text-gray-600">
                      Total: ${(booking.total_amount || 0).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Rate: {((booking.commission_rate || 0) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                
                {/* Status and Commission */}
                <div className="text-right space-y-2">
                  <p className="font-bold text-green-600">
                    ${(booking.commission_earned || 0).toFixed(2)}
                  </p>
                  <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                    booking.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <div className="text-center py-8">
        <Plane className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No bookings yet</p>
      </div>
    )}
  </div>
);

// Quick Actions Component for Dashboard
const QuickActions = ({ onRequestPayout, onViewCommissions, availableBalance }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
    <div className="space-y-3">
      <button
        onClick={onRequestPayout}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        <DollarSign className="w-5 h-5" />
        <span>Request Payout</span>
      </button>
      <button
        onClick={onViewCommissions}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        <Percent className="w-5 h-5" />
        <span>View Commissions</span>
      </button>
      <div className="text-center">
        <p className="text-sm text-gray-500">Available Balance</p>
        <p className="text-2xl font-bold text-green-600">${availableBalance.toLocaleString()}</p>
      </div>
    </div>
  </div>
);

// Sidebar Navigation Component
const Sidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, onNavigateToLanding, onLogout }) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'bookings', icon: Calendar, label: 'Bookings' },
    { id: 'commissions', icon: Percent, label: 'Commissions' },
    { id: 'payouts', icon: CreditCard, label: 'Payouts' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
  ];

  const handleItemClick = (itemId) => {
    if (itemId === 'landing') {
      onNavigateToLanding();
    } else {
      setActiveTab(itemId);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">Partner Portal</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <nav className="px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
          
          {/* Separate Landing Page Navigation Button */}
          <button
            onClick={() => handleItemClick('landing')}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <ExternalLink className="w-5 h-5" />
            <span>Landing Page</span>
          </button>
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4">
          <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

// Main Dashboard Component
const PartnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [partnerProfile, setPartnerProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  // Use the auth context
  const { user, token, isAuthenticated, isPartner, logout } = useAuth();

  // Handle navigation to landing page
  const handleNavigateToLanding = () => {
    window.location.href = '/';
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      // Redirect will be handled by the auth context
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if logout API fails
      window.location.href = '/login';
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is authenticated and is a partner
      if (!isAuthenticated || !token) {
        throw new Error('Not authenticated');
      }

      if (!isPartner) {
        throw new Error('Access denied - not a partner account');
      }

      console.log('Fetching dashboard data with token:', token ? 'Token present' : 'No token');
      
      const [dashboardResponse, profileResponse, bookingsResponse] = await Promise.all([
        apiCall('/dashboard', token),
        apiCall('/profile', token),
        apiCall('/bookings', token)
      ]);
      
      console.log('Dashboard Response:', dashboardResponse);
      console.log('Bookings Response:', bookingsResponse);
      
      // Process dashboard data
      const dashboardData = dashboardResponse.data || dashboardResponse;
      
      setDashboardData({
        totalBookings: dashboardData.statistics?.totalBookings || 0,
        totalCommission: dashboardData.statistics?.totalCommissionEarned || 0,
        monthlyBookings: dashboardData.statistics?.monthlyBookingCount || 0,
        recentBookings: dashboardData.recentBookings || []
      });
      
      setPartnerProfile(profileResponse.data || profileResponse);
      
      // Handle bookings response format
      let bookingsArray = [];
      if (Array.isArray(bookingsResponse)) {
        bookingsArray = bookingsResponse;
      } else if (bookingsResponse && Array.isArray(bookingsResponse.data)) {
        bookingsArray = bookingsResponse.data;
      } else if (bookingsResponse && bookingsResponse.bookings && Array.isArray(bookingsResponse.bookings)) {
        bookingsArray = bookingsResponse.bookings;
      }
      
      setBookings(bookingsArray);
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError(error.message);
      
      // If it's an auth error, logout
      if (error.message.includes('Authentication') || error.message.includes('forbidden')) {
        console.log('Authentication error, logging out...');
        await logout();
        return;
      }
      
      // Set demo data for showcase
      setDashboardData({
        totalBookings: 24,
        totalCommission: 4250.00,
        monthlyBookings: 8,
        recentBookings: [
          {
            id: 1,
            booking_reference: 'ELV-2024-001',
            commission_earned: 125.50,
            status: 'confirmed',
            passengers: [{ first_name: 'John', last_name: 'Doe' }],
            created_at: new Date().toISOString(),
            total_amount: 1200.00,
            commission_rate: 0.05
          },
          {
            id: 2,
            booking_reference: 'ELV-2024-002',
            commission_earned: 89.25,
            status: 'pending',
            passengers: [{ first_name: 'Jane', last_name: 'Smith' }],
            created_at: new Date().toISOString(),
            total_amount: 950.00,
            commission_rate: 0.05
          }
        ]
      });
      setPartnerProfile({
        first_name: 'Demo',
        last_name: 'Partner',
        business_name: 'Demo Travel Agency',
        status: 'approved',
        email_verified: true,
        commission_rate: 0.05,
        available_balance: 2150.75
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle payout request
  const handleRequestPayout = () => {
    setActiveTab('payouts');
  };

  // Handle view commissions
  const handleViewCommissions = () => {
    setActiveTab('commissions');
  };

  useEffect(() => {
    // Only fetch data if authenticated and is partner
    if (isAuthenticated && isPartner && token) {
      fetchDashboardData();
    } else if (isAuthenticated && !isPartner) {
      setError('Access denied - not a partner account');
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, isPartner, token]);

  // Get page title based on active tab
  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'bookings': return 'Bookings';
      case 'commissions': return 'Commissions';
      case 'payouts': return 'Payouts';
      case 'profile': return 'Profile';
      case 'analytics': return 'Analytics';
      default: return 'Dashboard';
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading partner dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
          <button 
            onClick={() => window.location.href = '/login'}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Show unauthorized state
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Please log in to access the partner dashboard.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onNavigateToLanding={handleNavigateToLanding}
        onLogout={handleLogout}
      />
      
      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, {user?.first_name || user?.business_name || 'Partner'}
              </div>
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <Settings className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  icon={Calendar}
                  title="Total Bookings"
                  value={dashboardData?.totalBookings || 0}
                  change="+12% this month"
                  changeType="positive"
                />
                <StatsCard
                  icon={DollarSign}
                  title="Total Earnings"
                  value={`$${(dashboardData?.totalCommission || 0).toLocaleString()}`}
                  change="+8% this month"
                  changeType="positive"
                />
                <StatsCard
                  icon={TrendingUp}
                  title="Monthly Bookings"
                  value={dashboardData?.monthlyBookings || 0}
                  change="+5% vs last month"
                  changeType="positive"
                />
                <StatsCard
                  icon={Users}
                  title="Available Balance"
                  value={`$${(partnerProfile?.available_balance || 0).toLocaleString()}`}
                />
              </div>

              {/* Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <RecentBookings 
                    bookings={dashboardData?.recentBookings || bookings} 
                    loading={loading} 
                  />
                </div>
                <div className="space-y-6">
                  <QuickActions 
                    onRequestPayout={handleRequestPayout}
                    onViewCommissions={handleViewCommissions}
                    availableBalance={partnerProfile?.available_balance || 0}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Other Tabs */}
          {activeTab === 'bookings' && <BookingsManager />}
          {activeTab === 'commissions' && <CommissionManager />}
          {activeTab === 'payouts' && <PayoutManager />}
          {activeTab === 'profile' && <ProfileManager />}
          {activeTab === 'analytics' && <Analytics />}
        </main>
      </div>
    </div>
  );
};

export default PartnerDashboard;