import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Plane, 
  User, 
  DollarSign, 
  Clock, 
  MapPin,
  Search,
  Filter,
  Eye,
  Download
} from 'lucide-react';
import { backendUrl } from '../../config/config';

// API Configuration
const API_BASE_URL = `${backendUrl}/api/partners`;

// Utility function to get auth token with fallbacks
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

// Booking Status Badge Component
const StatusBadge = ({ status }) => {
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusStyles(status)}`}>
      {status || 'Unknown'}
    </span>
  );
};

// Booking Card Component
const BookingCard = ({ booking, onViewDetails }) => {
  const flightInfo = booking.flight_info;
  const passengers = booking.passengers || [];
  const primaryPassenger = passengers[0];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <Plane className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{booking.booking_reference}</h3>
            <p className="text-sm text-gray-500">
              {new Date(booking.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {/* Flight Information */}
      {flightInfo && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{flightInfo.departure?.iataCode || 'N/A'}</span>
              <span className="text-gray-400">→</span>
              <span>{flightInfo.arrival?.iataCode || 'N/A'}</span>
            </div>
            {flightInfo.airline && (
              <span className="text-gray-600">{flightInfo.airline} {flightInfo.flight_number}</span>
            )}
          </div>
          {flightInfo.departure?.at && (
            <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
              <Clock className="w-3 h-3" />
              <span>{new Date(flightInfo.departure.at).toLocaleString()}</span>
            </div>
          )}
        </div>
      )}

      {/* Passenger Information */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
          <User className="w-4 h-4" />
          <span>Passengers ({passengers.length})</span>
        </div>
        {primaryPassenger && (
          <p className="text-sm font-medium text-gray-900">
            {primaryPassenger.first_name} {primaryPassenger.last_name}
            {passengers.length > 1 && <span className="text-gray-500"> +{passengers.length - 1} more</span>}
          </p>
        )}
      </div>

      {/* Financial Information */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 text-sm">
          <div>
            <span className="text-gray-500">Total Amount:</span>
            <span className="ml-1 font-medium">${(booking.total_amount || 0).toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-500">Commission:</span>
            <span className="ml-1 font-semibold text-green-600">
              ${(booking.commission_earned || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-2">
        <button
          onClick={() => onViewDetails(booking)}
          className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
        >
          <Eye className="w-4 h-4 mr-1" />
          View Details
        </button>
      </div>
    </div>
  );
};

// Booking Details Modal Component
const BookingDetailsModal = ({ booking, isOpen, onClose }) => {
  if (!isOpen || !booking) return null;

  const flightInfo = booking.flight_info;
  const passengers = booking.passengers || [];
  const payments = booking.payments || [];
  const seatSelections = booking.seat_selections || [];
  const baggageSelections = booking.baggage_selections || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Booking Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Booking Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Reference:</span>
                  <span className="font-medium">{booking.booking_reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <StatusBadge status={booking.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Created:</span>
                  <span>{new Date(booking.created_at).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Amount:</span>
                  <span className="font-semibold">${(booking.total_amount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Commission:</span>
                  <span className="font-semibold text-green-600">
                    ${(booking.commission_earned || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Flight Information */}
            {flightInfo && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Flight Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Route:</span>
                    <span>{flightInfo.departure?.iataCode} → {flightInfo.arrival?.iataCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Airline:</span>
                    <span>{flightInfo.airline} {flightInfo.flight_number}</span>
                  </div>
                  {flightInfo.departure?.at && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Departure:</span>
                      <span>{new Date(flightInfo.departure.at).toLocaleString()}</span>
                    </div>
                  )}
                  {flightInfo?.arrival?.at && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Arrival:</span>
                      <span>{new Date(flightInfo?.arrival?.at).toLocaleString()}</span>
                    </div>
                  )}
                  {flightInfo.duration && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Duration:</span>
                      <span>{flightInfo.duration}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Passengers */}
          {passengers.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Passengers ({passengers.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {passengers.map((passenger, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium">{passenger.first_name} {passenger.last_name}</p>
                    {passenger.email && (
                      <p className="text-sm text-gray-600">{passenger.email}</p>
                    )}
                    {passenger.phone && (
                      <p className="text-sm text-gray-600">{passenger.phone}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payments */}
          {payments.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Payments</h3>
              <div className="space-y-2">
                {payments.map((payment, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">${payment.amount}</p>
                      <p className="text-sm text-gray-600">{payment.payment_method}</p>
                    </div>
                    <StatusBadge status={payment.status} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Seat Selections */}
          {seatSelections.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Seat Selections</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {seatSelections.map((seat, index) => (
                  <div key={index} className="p-2 bg-blue-50 text-center rounded">
                    <span className="text-sm font-medium">{seat.seat_number}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Baggage Selections */}
          {baggageSelections.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Baggage</h3>
              <div className="space-y-2">
                {baggageSelections.map((baggage, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span>{baggage.type}: {baggage.weight}kg</span>
                    <span className="font-medium">${baggage.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Debug Component to show connection status
const EnhancedDebugInfo = ({ token, apiUrl, bookings, error }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [debugData, setDebugData] = useState(null);
  
  const runDebugTest = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/test-bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setDebugData(data);
    } catch (err) {
      setDebugData({ error: err.message });
    }
  };
  
  if (process.env.NODE_ENV === 'production') return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-red-500 text-white px-2 py-1 text-xs rounded mr-2"
      >
        DEBUG
      </button>
      <button
        onClick={runDebugTest}
        className="bg-orange-500 text-white px-2 py-1 text-xs rounded"
      >
        TEST
      </button>
      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-white border p-4 rounded shadow-lg text-xs max-w-lg max-h-96 overflow-auto">
          <div><strong>API URL:</strong> {apiUrl}</div>
          <div><strong>Token:</strong> {token ? `${token.substring(0, 20)}...` : 'None'}</div>
          <div><strong>Bookings Count:</strong> {bookings?.length || 0}</div>
          <div><strong>Current Error:</strong> {error || 'None'}</div>
          
          {debugData && (
            <div className="mt-4 border-t pt-2">
              <strong>Debug Test Results:</strong>
              <pre className="mt-2 text-xs overflow-auto max-h-40">
                {JSON.stringify(debugData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


// Main BookingsManager Component
const BookingsManager = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch bookings from API
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching bookings...');
      const data = await apiCall('/bookings');
      console.log('Bookings response:', data);
      
      // Handle different response formats
      let bookingsArray = [];
      if (Array.isArray(data)) {
        bookingsArray = data;
      } else if (data && Array.isArray(data.data)) {
        bookingsArray = data.data;
      } else if (data && data.bookings && Array.isArray(data.bookings)) {
        bookingsArray = data.bookings;
      } else {
        console.warn('Unexpected bookings response format:', data);
        bookingsArray = [];
      }
      
      setBookings(bookingsArray);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError(err.message || 'Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch booking details
  const fetchBookingDetails = async (bookingId) => {
    try {
      console.log('Fetching booking details for ID:', bookingId);
      const data = await apiCall(`/bookings/${bookingId}`);
      console.log('Booking details response:', data);
      
      // Handle different response formats
      if (data && data.data) {
        return data.data;
      } else if (data) {
        return data;
      } else {
        throw new Error('No booking data received');
      }
    } catch (err) {
      console.error('Failed to fetch booking details:', err);
      throw err;
    }
  };

  // Handle view booking details
  const handleViewDetails = async (booking) => {
    try {
      setError(null);
      const detailedBooking = await fetchBookingDetails(booking.id);
      setSelectedBooking(detailedBooking);
      setShowDetailsModal(true);
    } catch (err) {
      setError(`Failed to load booking details: ${err.message}`);
    }
  };

  // Filter bookings based on search and status
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.booking_reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.passengers?.some(p => 
        `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const token = getAuthToken();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Bookings</h2>
        </div>
        <div className="grid gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
        <div className="text-red-500 mb-4">
          <Calendar className="w-12 h-12 mx-auto mb-3" />
          <p className="text-lg font-medium">Error Loading Bookings</p>
          <p className="text-sm text-gray-600 mt-2">{error}</p>
          
          {/* Token debug info */}
          {!token && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-800 text-sm">
                No authentication token found. Please log in again.
              </p>
            </div>
          )}
        </div>
        <button
          onClick={fetchBookings}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Bookings</h2>
        <button
          onClick={fetchBookings}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by booking reference or passenger name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
          <Plane className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'all' ? 'No bookings match your filters' : 'No bookings found'}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Bookings made by partners will appear here once they are created.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Booking Details Modal */}
      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedBooking(null);
        }}
      />

      {/* Debug Info */}
      <EnhancedDebugInfo 
  token={token} 
  apiUrl={API_BASE_URL} 
  bookings={bookings}
  error={error}
/>
    </div>
  );
};

export default BookingsManager;