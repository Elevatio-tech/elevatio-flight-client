import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Calendar, 
  Users, 
  Plane,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  MapPin,
  Star
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie } from 'recharts';
import { backendUrl } from '../../config/config';

// API Configuration
const API_BASE_URL = `${backendUrl}/api/partners`;

// Utility function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken') || 
         localStorage.getItem('token') || 
         localStorage.getItem('partnerToken') ||
         sessionStorage.getItem('authToken') ||
         sessionStorage.getItem('token') ||
         sessionStorage.getItem('partnerToken');
};

// Utility function for API calls with better error handling
const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token found. Please log in again.');
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    // Check if response is ok
    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = `API call failed: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        // If we can't parse the error response, use the default message
      }
      
      // Handle specific status codes
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        localStorage.removeItem('partnerToken');
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('partnerToken');
        throw new Error('Authentication failed. Please log in again.');
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check your connection and try again.');
    }
    throw error;
  }
};
// Metric Card Component
const MetricCard = ({ icon: Icon, title, value, change, changeType, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              changeType === 'positive' ? 'text-green-600' : 
              changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {changeType === 'positive' ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : changeType === 'negative' ? (
                <TrendingDown className="w-4 h-4 mr-1" />
              ) : (
                <Activity className="w-4 h-4 mr-1" />
              )}
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

// Chart Container Component
const ChartContainer = ({ title, children, description }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
    </div>
    {children}
  </div>
);

// Top Destinations Component
const TopDestinations = ({ destinations, loading }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Destinations</h3>
    {loading ? (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="space-y-4">
        {destinations.map((destination, index) => (
          <div key={`${destination.city}-${index}`} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{destination.city}</p>
                <p className="text-sm text-gray-500">{destination.country}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">{destination.bookings}</p>
              <p className="text-sm text-gray-500">bookings</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// Time Period Selector
const TimePeriodSelector = ({ selectedPeriod, onPeriodChange }) => {
  const periods = [
    { key: '7d', label: '7 Days' },
    { key: '30d', label: '30 Days' },
    { key: '90d', label: '90 Days' },
    { key: '1y', label: '1 Year' }
  ];

  return (
    <div className="flex space-x-2">
      {periods.map((period) => (
        <button
          key={period.key}
          onClick={() => onPeriodChange(period.key)}
          className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
            selectedPeriod === period.key
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
};

// Main Analytics Component
const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [analyticsData, setAnalyticsData] = useState(null);

  // Fetch real analytics data from API
  // Replace your fetchAnalyticsData function with this fixed version:

const fetchAnalyticsData = async () => {
  try {
    setLoading(true);
    
    // Fetch dashboard data and bookings for analytics
    const [dashboardResponse, bookingsResponse] = await Promise.all([
      apiCall('/dashboard'),
      apiCall('/bookings')
    ]);

    // Ensure bookings is always an array
    let bookings = [];
    
    if (bookingsResponse) {
      if (Array.isArray(bookingsResponse)) {
        bookings = bookingsResponse;
      } else if (bookingsResponse.bookings && Array.isArray(bookingsResponse.bookings)) {
        // In case the API returns { bookings: [...] }
        bookings = bookingsResponse.bookings;
      } else if (bookingsResponse.data && Array.isArray(bookingsResponse.data)) {
        // In case the API returns { data: [...] }
        bookings = bookingsResponse.data;
      }
    }
    
    console.log('Bookings data:', bookings); // Debug log
    
    // Process bookings data for analytics
    const processedData = processBookingsForAnalytics(bookings, selectedPeriod);
    
    setAnalyticsData({
      ...dashboardResponse,
      ...processedData
    });
  } catch (error) {
    console.error('Failed to fetch analytics data:', error);
    // Set default empty data structure on error
    setAnalyticsData({
      totalCommission: 0,
      totalBookings: 0,
      monthlyBookings: 0,
      revenueData: [],
      bookingStatusData: [],
      topDestinations: [],
      monthlyTrends: []
    });
  } finally {
    setLoading(false);
  }
};

// Also update your processBookingsForAnalytics function to be more defensive:

const processBookingsForAnalytics = (bookings, period) => {
  // Add explicit array check at the beginning
  if (!Array.isArray(bookings) || bookings.length === 0) {
    console.warn('Bookings is not an array or is empty:', bookings);
    return {
      revenueData: [],
      bookingStatusData: [],
      topDestinations: [],
      monthlyTrends: []
    };
  }

  // Filter bookings based on selected period
  const now = new Date();
  let startDate;
  
  switch (period) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case '1y':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  const filteredBookings = bookings.filter(booking => {
    // Add safety check for booking.created_at
    if (!booking.created_at) return false;
    return new Date(booking.created_at) >= startDate;
  });

  // Generate revenue data by month
  const revenueByMonth = {};
  filteredBookings.forEach(booking => {
    if (!booking.created_at) return; // Skip bookings without created_at
    
    const month = new Date(booking.created_at).toLocaleDateString('en-US', { month: 'short' });
    if (!revenueByMonth[month]) {
      revenueByMonth[month] = { revenue: 0, bookings: 0 };
    }
    revenueByMonth[month].revenue += booking.commission_earned || 0;
    revenueByMonth[month].bookings += 1;
  });

  const revenueData = Object.entries(revenueByMonth).map(([month, data]) => ({
    name: month,
    revenue: Math.round(data.revenue * 100) / 100,
    bookings: data.bookings
  }));

  // Generate booking status data
  const statusCounts = {};
  filteredBookings.forEach(booking => {
    const status = booking.status || 'unknown';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  const bookingStatusData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count
  }));

  // Generate top destinations from flight offers
  const destinationCounts = {};
  filteredBookings.forEach(booking => {
    if (booking.flight_offer && booking.flight_offer.itineraries) {
      const segments = booking.flight_offer.itineraries[0]?.segments;
      if (segments && segments.length > 0) {
        const lastSegment = segments[segments.length - 1];
        const destination = lastSegment.arrival?.iataCode;
        if (destination) {
          if (!destinationCounts[destination]) {
            destinationCounts[destination] = {
              city: destination,
              country: 'Unknown',
              bookings: 0
            };
          }
          destinationCounts[destination].bookings += 1;
        }
      }
    }
  });

  const topDestinations = Object.values(destinationCounts)
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 5);

  return {
    revenueData,
    bookingStatusData,
    topDestinations,
    monthlyTrends: revenueData
  };
};

  // Process bookings data for different analytics views
//   const processBookingsForAnalytics = (bookings, period) => {
//     if (!bookings || bookings.length === 0) {
//       return {
//         revenueData: [],
//         bookingStatusData: [],
//         topDestinations: [],
//         monthlyTrends: []
//       };
//     }

//     // Filter bookings based on selected period
//     const now = new Date();
//     let startDate;
    
//     switch (period) {
//       case '7d':
//         startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//         break;
//       case '30d':
//         startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
//         break;
//       case '90d':
//         startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
//         break;
//       case '1y':
//         startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
//         break;
//       default:
//         startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
//     }

//     const filteredBookings = bookings.filter(booking => 
//       new Date(booking.created_at) >= startDate
//     );

//     // Generate revenue data by month
//     const revenueByMonth = {};
//     filteredBookings.forEach(booking => {
//       const month = new Date(booking.created_at).toLocaleDateString('en-US', { month: 'short' });
//       if (!revenueByMonth[month]) {
//         revenueByMonth[month] = { revenue: 0, bookings: 0 };
//       }
//       revenueByMonth[month].revenue += booking.commission_earned || 0;
//       revenueByMonth[month].bookings += 1;
//     });

//     const revenueData = Object.entries(revenueByMonth).map(([month, data]) => ({
//       name: month,
//       revenue: Math.round(data.revenue * 100) / 100,
//       bookings: data.bookings
//     }));

//     // Generate booking status data
//     const statusCounts = {};
//     filteredBookings.forEach(booking => {
//       const status = booking.status || 'unknown';
//       statusCounts[status] = (statusCounts[status] || 0) + 1;
//     });

//     const bookingStatusData = Object.entries(statusCounts).map(([status, count]) => ({
//       name: status.charAt(0).toUpperCase() + status.slice(1),
//       value: count
//     }));

//     // Generate top destinations from flight offers
//     const destinationCounts = {};
//     filteredBookings.forEach(booking => {
//       if (booking.flight_offer && booking.flight_offer.itineraries) {
//         const segments = booking.flight_offer.itineraries[0]?.segments;
//         if (segments && segments.length > 0) {
//           const lastSegment = segments[segments.length - 1];
//           const destination = lastSegment.arrival?.iataCode;
//           if (destination) {
//             if (!destinationCounts[destination]) {
//               destinationCounts[destination] = {
//                 city: destination,
//                 country: 'Unknown',
//                 bookings: 0
//               };
//             }
//             destinationCounts[destination].bookings += 1;
//           }
//         }
//       }
//     });

//     const topDestinations = Object.values(destinationCounts)
//       .sort((a, b) => b.bookings - a.bookings)
//       .slice(0, 5);

//     return {
//       revenueData,
//       bookingStatusData,
//       topDestinations,
//       monthlyTrends: revenueData
//     };
//   };

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <div className="animate-pulse flex space-x-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 w-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
        <TimePeriodSelector 
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />
      </div>

      {/* Metrics Cards recharts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={DollarSign}
          title="Total Revenue"
          value={`$${(analyticsData?.totalCommission || 0).toLocaleString()}`}
          change="+12.5%"
          changeType="positive"
          color="green"
        />
        <MetricCard
          icon={Calendar}
          title="Total Bookings"
          value={analyticsData?.totalBookings || 0}
          change="+8.2%"
          changeType="positive"
          color="blue"
        />
        <MetricCard
          icon={Users}
          title="Monthly Bookings"
          value={analyticsData?.monthlyBookings || 0}
          change="+15.3%"
          changeType="positive"
          color="purple"
        />
        <MetricCard
          icon={TrendingUp}
          title="Avg. Commission"
          value={`$${analyticsData?.totalBookings > 0 ? 
            Math.round((analyticsData?.totalCommission / analyticsData?.totalBookings) * 100) / 100 : 0}`}
          change="+5.7%"
          changeType="positive"
          color="orange"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <ChartContainer 
          title="Revenue Trends" 
          description="Monthly revenue and booking trends"
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData?.revenueData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="right" dataKey="bookings" fill="#8884d8" name="Bookings" />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} name="Revenue ($)" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Booking Status Distribution */}
        <ChartContainer 
          title="Booking Status" 
          description="Distribution of booking statuses"
        >
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={analyticsData?.bookingStatusData || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {(analyticsData?.bookingStatusData || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trends Bar Chart */}
        <div className="lg:col-span-2">
          <ChartContainer 
            title="Monthly Performance" 
            description="Detailed monthly booking and revenue analysis"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData?.monthlyTrends || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#2563eb" name="Revenue ($)" />
                <Bar dataKey="bookings" fill="#10b981" name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Top Destinations */}
        <TopDestinations 
          destinations={analyticsData?.topDestinations || []} 
          loading={loading} 
        />
      </div>
    </div>
  );
};

export default Analytics;