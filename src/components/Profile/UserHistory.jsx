import React, { useState, useEffect } from 'react';
import { 
  Search, 
  CreditCard, 
  Plane, 
  Calendar, 
  MapPin, 
  Clock, 
  Filter,
  ChevronDown,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  DollarSign,
  Users,
  ArrowRight,
  User,
  Phone,
  Mail,
  Building,
  CreditCard as CardIcon,
  Ticket,
  Globe,
  Info,
  ChevronRight,
  Zap
} from 'lucide-react';
import Header from '../Navbar/Header';

const UserHistory = () => {
  // Mock auth context - replace with your actual auth implementation
  const [authState, setAuthState] = useState({
    token: 'token',
    userType: 'user',
    isAuthenticated: true,
    user: {
      id: 'b2dd26ce-5ab6-4e28-9033-7098d66b6412',
      email: 'abgnigerialtd@live.com',
      name: 'John Doe'
    }
  });

  const [activeTab, setActiveTab] = useState('search');
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState('all');
  const [error, setError] = useState(null);
  const [expandedItems, setExpandedItems] = useState(new Set());

  // Mock API endpoints - replace with your actual endpoints
  const API_BASE = 'http://localhost:5000/api';
  
  const summaryApi = {
    getSearchHistory: {
      url: `${API_BASE}/flights/history`,
      method: 'GET',
    },
    getPaymentHistory: {
      url: `${API_BASE}/payments/history`,
      method: 'GET',
    },
    getUserBookings: {
      url: `${API_BASE}/bookings`,
      method: 'GET',
    },
    deleteSearchHistory: {
      url: `${API_BASE}/flights/history/:searchId`,
      method: 'DELETE',
    },
  };

  // Helper function to get the correct token
  const getAuthToken = () => {
    if (!authState.isAuthenticated || !authState.token) return null;
    return authState.token;
  };

  // API call helper function with proper error handling
  const makeApiCall = async (endpoint, options = {}) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(endpoint, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        if (response.status === 404) {
          throw new Error('Data not found');
        }
        if (response.status === 500) {
          throw new Error('Server error. Please try again later.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API call failed:', error);
      
      // Return mock data for demonstration if API fails
      if (endpoint.includes('/flights/history')) {
        return getMockSearchHistory();
      } else if (endpoint.includes('/payments/history')) {
        return getMockPaymentHistory();
      } else if (endpoint.includes('/bookings')) {
        return getMockBookingHistory();
      }
      
      throw error;
    }
  };

  // Mock data generators for demonstration
  const getMockSearchHistory = () => ({
    searches: [
      {
        id: '1',
        origin: 'LOS',
        destination: 'ABV',
        departure_date: '2025-07-15',
        return_date: null,
        passengers: 1,
        cabin_class: 'Economy',
        trip_type: 'oneway',
        results_count: 25,
        created_at: '2025-06-16T10:30:00Z',
        search_parameters: {
          currency: 'NGN',
          airline_preference: null
        }
      },
      {
        id: '2',
        origin: 'ABV',
        destination: 'KAN',
        departure_date: '2025-08-01',
        return_date: '2025-08-15',
        passengers: 2,
        cabin_class: 'Business',
        trip_type: 'roundtrip',
        results_count: 12,
        created_at: '2025-06-15T14:20:00Z',
        search_parameters: {
          currency: 'NGN',
          airline_preference: 'Air Peace'
        }
      }
    ]
  });

  const getMockPaymentHistory = () => ({
    payments: [
      {
        id: '1',
        booking_id: 'BK001',
        amount: 85000,
        currency: 'NGN',
        payment_method: 'card',
        transaction_id: 'FLW_TX_123456',
        flutterwave_transaction_id: '9427425',
        status: 'completed',
        created_at: '2025-06-15T16:45:00Z',
        processed_at: '2025-06-15T16:46:00Z',
        bookings: {
          booking_reference: 'ABG001234',
          flight_offer: {
            flightNumber: 'P47301',
            airline: 'Air Peace',
            departure: { airport: 'LOS', time: '08:30' },
            arrival: { airport: 'ABV', time: '10:15' }
          }
        }
      }
    ]
  });

  const getMockBookingHistory = () => ({
    bookings: [
      {
        id: '1',
        booking_reference: 'ABG001234',
        status: 'confirmed',
        total_amount: 85000,
        created_at: '2025-06-15T16:45:00Z',
        flight_offer: {
          flightNumber: 'P47301',
          airline: 'Air Peace',
          departure: { airport: 'LOS', terminal: '2I', time: '08:30' },
          arrival: { airport: 'ABV', terminal: '1', time: '10:15' },
          duration: '1h 45m'
        },
        passengers: [
          {
            first_name: 'John',
            last_name: 'Doe',
            passenger_type: 'adult',
            gender: 'male',
            date_of_birth: '1990-01-01'
          }
        ],
        contact_info: {
          email: 'john@example.com',
          phone: '08171623432'
        }
      }
    ]
  });

  // Fetch functions
  const fetchSearchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await makeApiCall(summaryApi.getSearchHistory.url);
      console.log("search history", data)
      setSearchHistory(Array.isArray(data.searches) ? data.searches : Array.isArray(data) ? data : []);
    } catch (error) {
      setError('Failed to fetch search history. Showing sample data.');
      setSearchHistory(getMockSearchHistory().searches);
      console.error('Error fetching search history:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await makeApiCall(summaryApi.getPaymentHistory.url);
      console.log("payment history", data)
      // Handle nested data structure from your API
      const payments = data?.data?.payments || data?.payments || data || [];
      setPaymentHistory(Array.isArray(payments) ? payments : []);
    } catch (error) {
      setError('Failed to fetch payment history. Showing sample data.');
      setPaymentHistory(getMockPaymentHistory().payments);
      console.error('Error fetching payment history:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await makeApiCall(summaryApi.getUserBookings.url);
      console.log("booking history", data)
      setBookingHistory(Array.isArray(data.bookings) ? data.bookings : Array.isArray(data) ? data : []);
    } catch (error) {
      setError('Failed to fetch booking history. Showing sample data.');
      setBookingHistory(getMockBookingHistory().bookings);
      console.error('Error fetching booking history:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete search history item
  const deleteSearchItem = async (searchId) => {
    try {
      const url = summaryApi.deleteSearchHistory.url.replace(':searchId', searchId);
      await makeApiCall(url, { method: 'DELETE' });
      setSearchHistory(prev => prev.filter(item => item.id !== searchId));
    } catch (error) {
      setError('Failed to delete search item');
      console.error('Error deleting search item:', error);
    }
  };

  // Toggle expanded view
  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  // Fetch all data
  const fetchAllData = async () => {
    if (!authState.isAuthenticated) {
      setError('Please login to view your history');
      return;
    }

    await Promise.all([
      fetchSearchHistory(),
      fetchPaymentHistory(),
      fetchBookingHistory(),
    ]);
  };

  // Refresh data
  const refreshData = () => {
    if (!authState.isAuthenticated) {
      setError('Please login to refresh data');
      return;
    }

    switch (activeTab) {
      case 'search':
        fetchSearchHistory();
        break;
      case 'payments':
        fetchPaymentHistory();
        break;
      case 'bookings':
        fetchBookingHistory();
        break;
      default:
        fetchAllData();
    }
  };

  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchAllData();
    } else {
      setError('Please login to view your history');
    }
  }, [authState.isAuthenticated]);

  // Filter data based on date filter - Fixed to ensure array output
  const filterDataByDate = (data, dateField = 'created_at') => {
    // Ensure data is always an array
    const dataArray = Array.isArray(data) ? data : [];
    
    if (dateFilter === 'all') return dataArray;
    
    const now = new Date();
    const filterDate = new Date();
    
    switch (dateFilter) {
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return dataArray;
    }
    
    return dataArray.filter(item => {
      const itemDate = new Date(item[dateField] || item.searchDate || item.bookingDate);
      return itemDate >= filterDate;
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount, currency = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'confirmed':
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'pending':
      case 'processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
      case 'failed':
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'confirmed':
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
      case 'processing':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
      case 'failed':
      case 'error':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Fixed: Ensure filtered data is always arrays
  const filteredSearchHistory = filterDataByDate(searchHistory);
  const filteredPaymentHistory = filterDataByDate(paymentHistory);
  const filteredBookingHistory = filterDataByDate(bookingHistory);

  const tabs = [
    { id: 'search', label: 'Search History', icon: Search, count: filteredSearchHistory.length },
    { id: 'bookings', label: 'Bookings', icon: Plane, count: filteredBookingHistory.length },
    { id: 'payments', label: 'Payments', icon: CreditCard, count: filteredPaymentHistory.length },
  ];

  // Show login prompt if not authenticated
  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please login to view your history</p>
          <button 
            onClick={() => setAuthState(prev => ({ ...prev, isAuthenticated: true }))} 
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Simulate Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className='mb-4'>
           <Header/>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Your History
                {authState.userType === 'admin' && (
                  <span className="ml-2 text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full">
                    Admin View
                  </span>
                )}
                {authState.userType === 'partner' && (
                  <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Partner
                  </span>
                )}
              </h1>
              <p className="text-gray-600">Track all your flight searches, bookings, and payments</p>
              {error && (
                <div className="mt-2 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <div className="relative">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {filterOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                    <div className="p-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                      <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="all">All Time</option>
                        <option value="week">Last Week</option>
                        <option value="month">Last Month</option>
                        <option value="year">Last Year</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={refreshData}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
                <span className="ml-2 text-gray-600">Loading...</span>
              </div>
            )}

            {/* Search History Tab */}
            {activeTab === 'search' && !loading && (
              <div className="space-y-4">
                {filteredSearchHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No search history</h3>
                    <p className="text-gray-500">Your flight searches will appear here</p>
                  </div>
                ) : (
                  filteredSearchHistory.map((search) => (
                    <div key={search.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-5 h-5 text-indigo-600" />
                                <span className="font-semibold text-gray-900">{search.origin}</span>
                                <ArrowRight className="w-4 h-4 text-gray-400" />
                                <span className="font-semibold text-gray-900">{search.destination}</span>
                              </div>
                              {search.return_date && (
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                  Round Trip
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(search.departure_date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4" />
                                <span>{search.passengers} passenger{search.passengers > 1 ? 's' : ''}</span>
                              </div>
                              <div>
                                <span className="font-medium">{search.cabin_class}</span>
                              </div>
                              <div className="text-green-600">
                                {search.results_count} flights found
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 mt-4 md:mt-0">
                            <span className="text-sm text-gray-500">
                              {formatDate(search.created_at)}
                            </span>
                            <button
                              onClick={() => toggleExpanded(search.id)}
                              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                              <ChevronRight className={`w-4 h-4 transform transition-transform ${expandedItems.has(search.id) ? 'rotate-90' : ''}`} />
                            </button>
                            <button
                              onClick={() => deleteSearchItem(search.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Expanded Details */}
                        {expandedItems.has(search.id) && (
                          <div className="border-t border-gray-200 pt-4 mt-4">
                            <h4 className="font-medium text-gray-900 mb-3">Search Parameters</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                              {search.search_parameters?.currency && (
                                <div>
                                  <span className="text-gray-600">Currency:</span>
                                  <span className="ml-2 font-medium">{search.search_parameters.currency}</span>
                                </div>
                              )}
                              {search.search_parameters?.airline_preference && (
                                <div>
                                  <span className="text-gray-600">Preferred Airline:</span>
                                  <span className="ml-2 font-medium">{search.search_parameters.airline_preference}</span>
                                </div>
                              )}
                              {search.return_date && (
                                <div>
                                  <span className="text-gray-600">Return Date:</span>
                                  <span className="ml-2 font-medium">{new Date(search.return_date).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Bookings History Tab */}
            {activeTab === 'bookings' && !loading && (
              <div className="space-y-6">
                {filteredBookingHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <Plane className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                    <p className="text-gray-500">Your flight bookings will appear here</p>
                  </div>
                ) : (
                  filteredBookingHistory.map((booking) => {
                    const flightOffer = booking.flight_offer || {};
                    const departure = flightOffer.departure || {};
                    const arrival = flightOffer.arrival || {};
                    const contactInfo = booking.contact_info || {};
                    const passengers = booking.passengers || [];
                    
                    return (
                      <div key={booking.id} className="bg-white border-2 border-gray-100 rounded-xl p-6 hover:border-indigo-200 transition-colors">
                        <div className="flex flex-col">
                          {/* Main Booking Info */}
                          <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-6">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="flex items-center space-x-2">
                                  <Plane className="w-6 h-6 text-indigo-600" />
                                  <span className="font-bold text-xl text-gray-900">
                                    {flightOffer.flightNumber || 'N/A'}
                                  </span>
                                  <span className="text-gray-500">•</span>
                                  <span className="text-gray-700 font-medium">
                                    {flightOffer.airline || 'Unknown Airline'}
                                  </span>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(booking.status)}`}>
                                  {getStatusIcon(booking.status)}
                                  <span className="capitalize">{booking.status}</span>
                                </span>
                              </div>
                              
                              {/* Flight Details */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <label className="text-sm text-gray-600 font-medium flex items-center mb-2">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    Departure
                                  </label>
                                  <p className="text-gray-900 font-semibold">{departure.airport || 'N/A'}</p>
                                  {departure.terminal && (
                                    <p className="text-sm text-gray-600">Terminal {departure.terminal}</p>
                                  )}
                                  <p className="text-sm text-gray-600">{departure.time || 'N/A'}</p>
                                </div>
                                
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <label className="text-sm text-gray-600 font-medium flex items-center mb-2">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    Arrival
                                  </label>
                                  <p className="text-gray-900 font-semibold">{arrival.airport || 'N/A'}</p>
                                  {arrival.terminal && (
                                    <p className="text-sm text-gray-600">Terminal {arrival.terminal}</p>
                                  )}
                                  <p className="text-sm text-gray-600">{arrival.time || 'N/A'}</p>
                                </div>
                                
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <label className="text-sm text-gray-600 font-medium flex items-center mb-2">
                                    <Ticket className="w-4 h-4 mr-1" />
                                    Booking Details
                                  </label>
                                  <p className="text-gray-900 font-semibold">{booking.booking_reference || 'N/A'}</p>
                                  <p className="text-sm text-gray-600">
                                    {formatDate(booking.created_at)}
                                  </p>
                                  {flightOffer.duration && (
                                    <p className="text-sm text-gray-600">Duration: {flightOffer.duration}</p>
                                  )}
                                </div>
                              </div>
                              
                              {/* Price Information */}
                              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 mb-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm text-gray-600">Total Amount</p>
                                    <p className="text-2xl font-bold text-green-700">
                                      {formatCurrency(booking.total_amount, flightOffer.price?.currency || 'NGN')}
                                    </p>
                                  </div>
                                  {flightOffer.price?.breakdown && (
                                    <div className="text-right text-sm text-gray-600">
                                      <p>Base Fare: {formatCurrency(parseFloat(flightOffer.price.breakdown.baseFare), flightOffer.price.currency)}</p>
                                      <p>Taxes: {formatCurrency(parseFloat(flightOffer.price.breakdown.taxes), flightOffer.price.currency)}</p>
                                      <p>Fees: {formatCurrency(parseFloat(flightOffer.price.breakdown.fees), flightOffer.price.currency)}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Expandable Details */}
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => toggleExpanded(booking.id)}
                              className="flex items-center space-x-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                              <Info className="w-4 h-4" />
                              <span>
                                {expandedItems.has(booking.id) ? 'Hide Details' : 'View Details'}
                              </span>
                              <ChevronRight className={`w-4 h-4 transform transition-transform ${expandedItems.has(booking.id) ? 'rotate-90' : ''}`} />
                            </button>
                            
                            <div className="flex items-center space-x-2">
                              <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                <Download className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Expanded Details */}
                          {expandedItems.has(booking.id) && (
                            <div className="border-t border-gray-200 pt-6 mt-6 space-y-6">
                              {/* Flight Segments Details */}
                              {flightOffer.itineraries && flightOffer.itineraries.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                                    <Plane className="w-5 h-5 mr-2 text-indigo-600" />
                                    Flight Segments
                                  </h4>
                                  {flightOffer.itineraries.map((itinerary, itinIndex) => (
                                    <div key={itinIndex} className="space-y-3">
                                      {itinerary.segments && itinerary.segments.map((segment, segIndex) => (
                                        <div key={segIndex} className="bg-gray-50 rounded-lg p-4">
                                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div>
                                              <label className="text-xs text-gray-500 uppercase tracking-wide">Flight</label>
                                              <p className="font-semibold">{segment.carrierCode}{segment.number}</p>
                                              <p className="text-sm text-gray-600">{segment.aircraft?.code || 'Unknown Aircraft'}</p>
                                            </div>
                                            <div>
                                              <label className="text-xs text-gray-500 uppercase tracking-wide">Departure</label>
                                              <p className="font-semibold">{segment.departure?.iataCode}</p>
                                              <p className="text-sm text-gray-600">{segment.departure?.at}</p>
                                              {segment.departure?.terminal && (
                                                <p className="text-xs text-gray-500">Terminal {segment.departure.terminal}</p>
                                              )}
                                            </div>
                                            <div>
                                              <label className="text-xs text-gray-500 uppercase tracking-wide">Arrival</label>
                                              <p className="font-semibold">{segment.arrival?.iataCode}</p>
                                              <p className="text-sm text-gray-600">{segment.arrival?.at}</p>
                                              {segment.arrival?.terminal && (
                                                <p className="text-xs text-gray-500">Terminal {segment.arrival.terminal}</p>
                                              )}
                                            </div>
                                            <div>
                                              <label className="text-xs text-gray-500 uppercase tracking-wide">Duration</label>
                                              <p className="font-semibold">{segment.duration}</p>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Passenger Information */}
                              {passengers.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                                    <User className="w-5 h-5 mr-2 text-indigo-600" />
                                    Passengers ({passengers.length})
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {passengers.map((passenger, index) => (
                                      <div key={passenger.id || index} className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center space-x-3 mb-3">
                                          <div className="bg-indigo-100 rounded-full p-2">
                                            <User className="w-4 h-4 text-indigo-600" />
                                          </div>
                                          <div>
                                            <p className="font-semibold text-gray-900">
                                              {passenger.first_name} {passenger.last_name}
                                            </p>
                                            <p className="text-sm text-gray-600 capitalize">
                                              {passenger.passenger_type} • {passenger.gender}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="space-y-2 text-sm text-gray-600">
                                          <div className="flex justify-between">
                                            <span>Date of Birth:</span>
                                            <span>{new Date(passenger.date_of_birth).toLocaleDateString()}</span>
                                          </div>
                                          {passenger.nationality && (
                                            <div className="flex justify-between">
                                              <span>Nationality:</span>
                                              <span className="capitalize">{passenger.nationality}</span>
                                            </div>
                                          )}
                                          {passenger.passport_number && (
                                            <div className="flex justify-between">
                                              <span>Passport:</span>
                                              <span className="font-mono">{passenger.passport_number}</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Contact Information */}
                              {contactInfo && Object.keys(contactInfo).length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                                    <Phone className="w-5 h-5 mr-2 text-indigo-600" />
                                    Contact Information
                                  </h4>
                                  <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {contactInfo.email && (
                                        <div className="flex items-center space-x-3">
                                          <Mail className="w-4 h-4 text-gray-400" />
                                          <div>
                                            <label className="text-xs text-gray-500 uppercase tracking-wide">Email</label>
                                            <p className="text-sm font-medium">{contactInfo.email}</p>
                                          </div>
                                        </div>
                                      )}
                                      {contactInfo.phone && (
                                        <div className="flex items-center space-x-3">
                                          <Phone className="w-4 h-4 text-gray-400" />
                                          <div>
                                            <label className="text-xs text-gray-500 uppercase tracking-wide">Phone</label>
                                            <p className="text-sm font-medium">{contactInfo.phone}</p>
                                          </div>
                                        </div>
                                      )}
                                      {contactInfo.emergencyContact && (
                                        <div className="flex items-center space-x-3">
                                          <Phone className="w-4 h-4 text-gray-400" />
                                          <div>
                                            <label className="text-xs text-gray-500 uppercase tracking-wide">Emergency Contact</label>
                                            <p className="text-sm font-medium">{contactInfo.emergencyContact}</p>
                                          </div>
                                        </div>
                                      )}
                                      {contactInfo.address && (
                                        <div className="flex items-center space-x-3">
                                          <Building className="w-4 h-4 text-gray-400" />
                                          <div>
                                            <label className="text-xs text-gray-500 uppercase tracking-wide">Address</label>
                                            <p className="text-sm font-medium">{contactInfo.address || 'Not provided'}</p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Traveler Pricing Details */}
                              {flightOffer.travelerPricings && flightOffer.travelerPricings.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                                    <DollarSign className="w-5 h-5 mr-2 text-indigo-600" />
                                    Pricing Breakdown
                                  </h4>
                                  <div className="space-y-3">
                                    {flightOffer.travelerPricings.map((pricing, index) => (
                                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-2">
                                          <span className="font-medium capitalize">{pricing.travelerType} #{pricing.travelerId}</span>
                                          <span className="font-bold text-green-600">
                                            {formatCurrency(parseFloat(pricing.price?.total || 0), pricing.price?.currency || 'NGN')}
                                          </span>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                            {pricing.fareOption}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Additional Services */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Seat Selections */}
                                {booking.seat_selections && booking.seat_selections.length > 0 && (
                                  <div>
                                    <h5 className="font-medium text-gray-900 mb-2">Seat Selections</h5>
                                    <div className="space-y-1">
                                      {booking.seat_selections.map((seat, index) => (
                                        <p key={index} className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                          {seat}
                                        </p>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Baggage Selections */}
                                {booking.baggage_selections && booking.baggage_selections.length > 0 && (
                                  <div>
                                    <h5 className="font-medium text-gray-900 mb-2">Baggage</h5>
                                    <div className="space-y-1">
                                      {booking.baggage_selections.map((baggage, index) => (
                                        <p key={index} className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                          {baggage}
                                        </p>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Commission Info (for partners/admins) */}
                                {(authState.userType === 'partner' || authState.userType === 'admin') && booking.commission_rate && (
                                  <div>
                                    <h5 className="font-medium text-gray-900 mb-2">Commission</h5>
                                    <div className="text-sm text-gray-600 space-y-1">
                                      <p>Rate: {(booking.commission_rate * 100).toFixed(2)}%</p>
                                      {booking.commission_earned && (
                                        <p className="font-medium text-green-600">
                                          Earned: {formatCurrency(booking.commission_earned)}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Booking Metadata */}
                              <div className="bg-gray-50 rounded-lg p-4">
                                <h5 className="font-medium text-gray-900 mb-3">Booking Information</h5>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                  <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Booking Type</label>
                                    <p className="font-medium capitalize">{booking.booking_type || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Created</label>
                                    <p className="font-medium">{formatDate(booking.created_at)}</p>
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Last Updated</label>
                                    <p className="font-medium">{formatDate(booking.updated_at)}</p>
                                  </div>
                                  {booking.promo_code && (
                                    <div>
                                      <label className="text-xs text-gray-500 uppercase tracking-wide">Promo Code</label>
                                      <p className="font-medium">{booking.promo_code}</p>
                                    </div>
                                  )}
                                  {booking.discount_amount > 0 && (
                                    <div>
                                      <label className="text-xs text-gray-500 uppercase tracking-wide">Discount</label>
                                      <p className="font-medium text-green-600">
                                        -{formatCurrency(booking.discount_amount)}
                                      </p>
                                    </div>
                                  )}
                                  {booking.cancellation_reason && (
                                    <div>
                                      <label className="text-xs text-gray-500 uppercase tracking-wide">Cancellation Reason</label>
                                      <p className="font-medium text-red-600">{booking.cancellation_reason}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Payments History Tab */}
            {activeTab === 'payments' && !loading && (
              <div className="space-y-4">
                {filteredPaymentHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No payment history</h3>
                    <p className="text-gray-500">Your payment transactions will appear here</p>
                  </div>
                ) : (
                  filteredPaymentHistory.map((payment) => {
                    const bookingInfo = payment.bookings || {};
                    const flightOffer = bookingInfo.flight_offer || {};
                    
                    return (
                      <div key={payment.id} className="bg-white border-2 border-gray-100 rounded-xl p-6 hover:border-indigo-200 transition-colors">
                        <div className="flex flex-col">
                          {/* Payment Header */}
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <div className="bg-green-100 rounded-full p-2">
                                  <CreditCard className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-lg text-gray-900">
                                    {formatCurrency(payment.amount, payment.currency)}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    Transaction ID: {payment.transaction_id}
                                  </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(payment.status)}`}>
                                  {getStatusIcon(payment.status)}
                                  <span className="capitalize">{payment.status}</span>
                                </span>
                              </div>
                              
                              {/* Payment Details Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <label className="text-gray-500 font-medium">Payment Method</label>
                                  <p className="text-gray-900 capitalize flex items-center">
                                    <CardIcon className="w-4 h-4 mr-1" />
                                    {payment.payment_method}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-gray-500 font-medium">Created</label>
                                  <p className="text-gray-900">{formatDate(payment.created_at)}</p>
                                </div>
                                <div>
                                  <label className="text-gray-500 font-medium">Processed</label>
                                  <p className="text-gray-900">
                                    {payment.processed_at ? formatDate(payment.processed_at) : 'Pending'}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-gray-500 font-medium">Booking Ref</label>
                                  <p className="text-gray-900 font-mono">
                                    {bookingInfo.booking_reference || 'N/A'}
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                              <button
                                onClick={() => toggleExpanded(payment.id)}
                                className="flex items-center space-x-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              >
                                <Info className="w-4 h-4" />
                                <span>
                                  {expandedItems.has(payment.id) ? 'Hide Details' : 'View Details'}
                                </span>
                                <ChevronRight className={`w-4 h-4 transform transition-transform ${expandedItems.has(payment.id) ? 'rotate-90' : ''}`} />
                              </button>
                            </div>
                          </div>

                          {/* Flight Summary */}
                          {flightOffer && Object.keys(flightOffer).length > 0 && (
                            <div className="bg-blue-50 rounded-lg p-4 mb-4">
                              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                                <Plane className="w-4 h-4 mr-2 text-blue-600" />
                                Flight Details
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">Flight:</span>
                                  <span className="ml-2 font-medium">{flightOffer.flightNumber} ({flightOffer.airline})</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Route:</span>
                                  <span className="ml-2 font-medium">
                                    {flightOffer.departure?.airport} → {flightOffer.arrival?.airport}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Duration:</span>
                                  <span className="ml-2 font-medium">{flightOffer.duration}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Expanded Payment Details */}
                          {expandedItems.has(payment.id) && (
                            <div className="border-t border-gray-200 pt-4 mt-4 space-y-4">
                              {/* Gateway Information */}
                              <div>
                                <h5 className="font-medium text-gray-900 mb-3">Gateway Information</h5>
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    {payment.flutterwave_transaction_id && (
                                      <div>
                                        <label className="text-gray-500 font-medium">Flutterwave Transaction ID</label>
                                        <p className="text-gray-900 font-mono">{payment.flutterwave_transaction_id}</p>
                                      </div>
                                    )}
                                    <div>
                                      <label className="text-gray-500 font-medium">Webhook Status</label>
                                      <p className="text-gray-900">
                                        {payment.webhook_confirmed ? 'Confirmed' : 'Pending'}
                                        {payment.webhook_received_at && (
                                          <span className="text-gray-500 ml-2">
                                            ({formatDate(payment.webhook_received_at)})
                                          </span>
                                        )}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-gray-500 font-medium">Booking ID</label>
                                      <p className="text-gray-900 font-mono text-xs">{payment.booking_id}</p>
                                    </div>
                                    <div>
                                      <label className="text-gray-500 font-medium">Last Updated</label>
                                      <p className="text-gray-900">{formatDate(payment.updated_at)}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Gateway Response */}
                              {payment.gateway_response && Object.keys(payment.gateway_response).length > 0 && (
                                <div>
                                  <h5 className="font-medium text-gray-900 mb-3">Gateway Response</h5>
                                  <div className="bg-gray-50 rounded-lg p-4">
                                    <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                                      {JSON.stringify(payment.gateway_response, null, 2)}
                                    </pre>
                                  </div>
                                </div>
                              )}

                              {/* Flight Offer Details (if available) */}
                              {flightOffer && flightOffer.price && (
                                <div>
                                  <h5 className="font-medium text-gray-900 mb-3">Price Breakdown</h5>
                                  <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                      {flightOffer.price.breakdown && (
                                        <>
                                          <div>
                                            <label className="text-gray-500 font-medium">Base Fare</label>
                                            <p className="text-gray-900 font-medium">
                                              {formatCurrency(parseFloat(flightOffer.price.breakdown.baseFare), flightOffer.price.currency)}
                                            </p>
                                          </div>
                                          <div>
                                            <label className="text-gray-500 font-medium">Taxes</label>
                                            <p className="text-gray-900 font-medium">
                                              {formatCurrency(parseFloat(flightOffer.price.breakdown.taxes), flightOffer.price.currency)}
                                            </p>
                                          </div>
                                          <div>
                                            <label className="text-gray-500 font-medium">Fees</label>
                                            <p className="text-gray-900 font-medium">
                                              {formatCurrency(parseFloat(flightOffer.price.breakdown.fees), flightOffer.price.currency)}
                                            </p>
                                          </div>
                                        </>
                                      )}
                                      <div className="md:col-span-3 pt-3 border-t border-gray-200">
                                        <div className="flex justify-between items-center">
                                          <span className="font-medium text-gray-900">Total Amount</span>
                                          <span className="text-xl font-bold text-green-600">
                                            {formatCurrency(parseFloat(flightOffer.price.total), flightOffer.price.currency)}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHistory;