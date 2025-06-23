import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, CheckCircle, XCircle, Wallet, Plus, Eye, X, RefreshCw } from 'lucide-react';
import { backendUrl } from '../../config/config';
import Header from '../../components/Navbar/Header';

const Refund = () => {
  const [activeTab, setActiveTab] = useState('history');
  const [refunds, setRefunds] = useState([]);
  const [eligibleBookings, setEligibleBookings] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Request form state
  const [requestForm, setRequestForm] = useState({
    bookingId: '',
    reason: '',
    amount: '',
    isPartialRefund: false
  });

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Fetch refunds
  const fetchRefunds = async (page = 1, status = '') => {
    setLoading(true);
    setError('');
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });
      if (status) queryParams.append('status', status);

      const response = await fetch(`${backendUrl}/api/refunds?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setRefunds(data.data.refunds || []);
        setPagination(data.data.pagination || { page: 1, totalPages: 1, total: 0 });
      } else {
        setError(data.message || 'Failed to fetch refunds');
      }
    } catch (error) {
      console.error('Error fetching refunds:', error);
      setError('Failed to fetch refunds. Please try again.');
    }
    setLoading(false);
  };

  // Fetch eligible bookings
  const fetchEligibleBookings = async () => {
    setError('');
    try {
      const response = await fetch(`${backendUrl}/api/refunds/eligible-bookings`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setEligibleBookings(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch eligible bookings');
      }
    } catch (error) {
      console.error('Error fetching eligible bookings:', error);
      setError('Failed to fetch eligible bookings');
    }
  };

  // Fetch wallet balance
  const fetchWalletBalance = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/refunds/wallet-balance`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setWalletBalance(data.data.balance || 0);
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };

  // Submit refund request
  const submitRefundRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${backendUrl}/api/refunds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          bookingId: requestForm.bookingId,
          reason: requestForm.reason.trim(),
          amount: requestForm.isPartialRefund ? parseFloat(requestForm.amount) : null
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Refund request submitted successfully!');
        setShowRequestModal(false);
        setRequestForm({ bookingId: '', reason: '', amount: '', isPartialRefund: false });
        fetchRefunds();
        fetchEligibleBookings();
      } else {
        setError(data.message || 'Failed to submit refund request');
      }
    } catch (error) {
      console.error('Error submitting refund request:', error);
      setError('Failed to submit refund request. Please try again.');
    }
    setLoading(false);
  };

  // Cancel refund request
  const cancelRefundRequest = async (refundId) => {
    if (!window.confirm('Are you sure you want to cancel this refund request?')) return;

    setError('');
    try {
      const response = await fetch(`${backendUrl}/api/refunds/${refundId}/cancel`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Refund request cancelled successfully');
        fetchRefunds(pagination.page, statusFilter);
      } else {
        setError(data.message || 'Failed to cancel refund request');
      }
    } catch (error) {
      console.error('Error cancelling refund:', error);
      setError('Failed to cancel refund request');
    }
  };

  // Get selected booking details
  const getSelectedBookingDetails = () => {
    if (!requestForm.bookingId) return null;
    return eligibleBookings.find(booking => booking.id === requestForm.bookingId);
  };

  useEffect(() => {
    fetchRefunds();
    fetchWalletBalance();
    if (activeTab === 'request') {
      fetchEligibleBookings();
    }
  }, [activeTab]);

  useEffect(() => {
    fetchRefunds(1, statusFilter);
  }, [statusFilter]);

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="w-4 h-4 text-yellow-500" />,
      approved: <CheckCircle className="w-4 h-4 text-green-500" />,
      rejected: <XCircle className="w-4 h-4 text-red-500" />,
      cancelled: <XCircle className="w-4 h-4 text-gray-500" />
    };
    return icons[status] || <AlertCircle className="w-4 h-4 text-gray-500" />;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const selectedBooking = getSelectedBookingDetails();

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className='mb-4'>
         <Header/>
      </div>
      <div className="mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Refund Management
              </h1>
              <p className="text-gray-600">Manage your refund requests and track their status</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg">
                <Wallet className="w-5 h-5" />
                <span className="font-semibold">₦{walletBalance.toLocaleString()}</span>
              </div>
              <button
                onClick={() => {
                  fetchRefunds(pagination.page, statusFilter);
                  fetchWalletBalance();
                  if (activeTab === 'request') fetchEligibleBookings();
                }}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="mb-6 animate-bounce">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center">
            <AlertCircle className="w-6 h-6 mr-3 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 animate-bounce">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center">
            <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0" />
            <span className="font-medium">{success}</span>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-2">
          <nav className="flex space-x-2">
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📊 Refund History
            </button>
            <button
              onClick={() => setActiveTab('request')}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeTab === 'request'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ➕ Request Refund
            </button>
          </nav>
        </div>
      </div>

      {/* Refund History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {/* Filters and Stats */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border-2 border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200"
                >
                  <option value="">🔍 All Status</option>
                  <option value="pending">⏳ Pending</option>
                  <option value="approved">✅ Approved</option>
                  <option value="rejected">❌ Rejected</option>
                  <option value="cancelled">🚫 Cancelled</option>
                </select>
              </div>
              <div className="flex items-center space-x-2 text-sm font-semibold text-gray-600">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full">
                  {pagination.total > 0 && `${pagination.total} total refund${pagination.total !== 1 ? 's' : ''}`}
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12">
              <div className="text-center">
                <RefreshCw className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading your refunds...</h3>
                <p className="text-gray-500">Please wait while we fetch your data</p>
              </div>
            </div>
          ) : refunds.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-12 h-12 text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">No Refunds Found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {statusFilter ? `No ${statusFilter} refund requests found.` : 'You haven\'t made any refund requests yet. Click on "Request Refund" to get started!'}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Booking Reference
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {refunds.map((refund, index) => (
                      <tr key={refund.id} className="hover:bg-blue-50/50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-bold text-gray-900">
                            {refund.bookings?.booking_reference || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-bold text-xl text-green-600">
                            ₦{refund.amount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            refund.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                            refund.status === 'approved' ? 'bg-green-100 text-green-800 border border-green-200' :
                            refund.status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-200' :
                            'bg-gray-100 text-gray-800 border border-gray-200'
                          }`}>
                            {refund.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                            {refund.status === 'approved' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                            {refund.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                            {refund.status === 'cancelled' && <X className="w-3 h-3 mr-1" />}
                            <span className="capitalize">{refund.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                          {new Date(refund.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                          <button
                            onClick={() => {
                              setSelectedRefund(refund);
                              setShowDetailsModal(true);
                            }}
                            className="inline-flex items-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </button>
                          {refund.status === 'pending' && (
                            <button
                              onClick={() => cancelRefundRequest(refund.id)}
                              className="inline-flex items-center bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden p-4 space-y-4">
                {refunds.map((refund) => (
                  <div key={refund.id} className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {refund.bookings?.booking_reference || 'N/A'}
                        </h3>
                        <p className="text-2xl font-bold text-green-600">
                          ₦{refund.amount.toLocaleString()}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        refund.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        refund.status === 'approved' ? 'bg-green-100 text-green-800' :
                        refund.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {refund.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                        {refund.status === 'approved' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {refund.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                        {refund.status === 'cancelled' && <X className="w-3 h-3 mr-1" />}
                        <span className="capitalize">{refund.status}</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600 font-medium">
                        {new Date(refund.created_at).toLocaleDateString()}
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedRefund(refund);
                            setShowDetailsModal(true);
                          }}
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {refund.status === 'pending' && (
                          <button
                            onClick={() => cancelRefundRequest(refund.id)}
                            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => fetchRefunds(pagination.page - 1, statusFilter)}
                        disabled={pagination.page === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                      </button>
                      <button
                        onClick={() => fetchRefunds(pagination.page + 1, statusFilter)}
                        disabled={pagination.page === pagination.totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                    <div className="hidden sm:flex sm:items-center sm:justify-between w-full">
                      <div>
                        <p className="text-sm text-gray-700 font-medium">
                          Showing page <span className="font-bold text-indigo-600">{pagination.page}</span> of{' '}
                          <span className="font-bold text-indigo-600">{pagination.totalPages}</span>
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => fetchRefunds(pagination.page - 1, statusFilter)}
                          disabled={pagination.page === 1}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg font-medium hover:from-gray-200 hover:to-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Previous
                        </button>
                        <button
                          onClick={() => fetchRefunds(pagination.page + 1, statusFilter)}
                          disabled={pagination.page === pagination.totalPages}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          Next
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Request Refund Tab */}
      {activeTab === 'request' && (
        <div className="space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Request New Refund
                </h2>
                <p className="text-gray-600 mt-1">Submit a new refund request for your eligible bookings</p>
              </div>
              <button
                onClick={() => setShowRequestModal(true)}
                disabled={eligibleBookings.length === 0}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Refund Request
              </button>
            </div>

            {eligibleBookings.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-8">
                  <AlertCircle className="w-16 h-16 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No Eligible Bookings</h3>
                <p className="text-gray-600 max-w-md mx-auto text-lg">
                  You don't have any bookings that are eligible for refund at the moment. 
                  Only confirmed or completed bookings can be refunded.
                </p>
                <div className="mt-8">
                  <button className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200">
                    Browse Available Bookings
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">
                    Eligible Bookings
                  </h3>
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full font-bold">
                    {eligibleBookings.length} Available
                  </div>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {eligibleBookings.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 hover:scale-105">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-bold text-gray-900 text-lg truncate">
                          {booking.booking_reference}
                        </h4>
                        <span className={`px-3 py-1 text-xs rounded-full font-bold border ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800 border-green-200' :
                          booking.status === 'completed' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          'bg-gray-100 text-gray-800 border-gray-200'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">Amount:</span>
                          <span className="text-xl font-bold text-green-600">₦{booking.total_amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">Booked:</span>
                          <span className="text-gray-800 font-medium">{new Date(booking.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setRequestForm(prev => ({ ...prev, bookingId: booking.id }));
                          setShowRequestModal(true);
                        }}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
                      >
                        Request Refund
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Request Refund Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 p-4">
          <div className="relative top-8 mx-auto border w-full max-w-lg shadow-2xl rounded-2xl bg-white">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Request Refund</h3>
                <button
                  onClick={() => {
                    setShowRequestModal(false);
                    setRequestForm({ bookingId: '', reason: '', amount: '', isPartialRefund: false });
                  }}
                  className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={submitRefundRequest} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Select Booking *
                </label>
                <select
                  value={requestForm.bookingId}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, bookingId: e.target.value }))}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-200"
                >
                  <option value="">Select a booking</option>
                  {eligibleBookings.map((booking) => (
                    <option key={booking.id} value={booking.id}>
                      {booking.booking_reference} - ₦{booking.total_amount.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {selectedBooking && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-700">
                      <span className="text-blue-600">Booking:</span> {selectedBooking.booking_reference}
                    </p>
                    <p className="text-sm font-semibold text-gray-700">
                      <span className="text-green-600">Total Amount:</span> ₦{selectedBooking.total_amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-xl">
                <label className="flex items-center text-sm font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={requestForm.isPartialRefund}
                    onChange={(e) => setRequestForm(prev => ({ 
                      ...prev, 
                      isPartialRefund: e.target.checked,
                      amount: e.target.checked ? prev.amount : ''
                    }))}
                    className="mr-3 h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  Request Partial Refund
                </label>
                <p className="text-xs text-gray-600 mt-2 ml-8">
                  Check this if you want to refund only part of the booking amount
                </p>
              </div>

              {requestForm.isPartialRefund && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Refund Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={selectedBooking?.total_amount || undefined}
                    value={requestForm.amount}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, amount: e.target.value }))}
                    required={requestForm.isPartialRefund}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-200"
                    placeholder="Enter amount to refund"
                  />
                  {selectedBooking && (
                    <p className="text-xs text-gray-600 mt-2 bg-yellow-50 p-2 rounded-lg">
                      💡 Maximum: ₦{selectedBooking.total_amount.toLocaleString()}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Reason for Refund *
                </label>
                <textarea
                  value={requestForm.reason}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, reason: e.target.value }))}
                  required
                  minLength="10"
                  rows="4"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-200"
                  placeholder="Please provide a detailed reason for your refund request (minimum 10 characters)"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-600">
                    {requestForm.reason.length}/10 characters minimum
                  </p>
                  {requestForm.reason.length >= 10 && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span className="text-xs font-semibold">Good to go!</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowRequestModal(false);
                    setRequestForm({ bookingId: '', reason: '', amount: '', isPartialRefund: false });
                  }}
                  className="flex-1 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 px-6 py-3 rounded-xl text-sm font-bold hover:from-gray-300 hover:to-gray-400 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || requestForm.reason.length < 10 || !requestForm.bookingId}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl text-sm font-bold hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                      Submitting...
                    </div>
                  ) : (
                    'Submit Request'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Refund Details Modal */}
      {showDetailsModal && selectedRefund && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 p-4">
          <div className="relative top-8 mx-auto border w-full max-w-lg shadow-2xl rounded-2xl bg-white">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Refund Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Booking Reference</label>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                  <p className="text-lg font-bold text-gray-900">
                    {selectedRefund.bookings?.booking_reference || 'N/A'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Refund Amount</label>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                  <p className="text-2xl font-bold text-green-600">
                    ₦{selectedRefund.amount.toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                <div className="p-4 rounded-xl bg-gray-50">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${
                    selectedRefund.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                    selectedRefund.status === 'approved' ? 'bg-green-100 text-green-800 border border-green-200' :
                    selectedRefund.status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-200' :
                    'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}>
                    {selectedRefund.status === 'pending' && <Clock className="w-4 h-4 mr-2" />}
                    {selectedRefund.status === 'approved' && <CheckCircle2 className="w-4 h-4 mr-2" />}
                    {selectedRefund.status === 'rejected' && <XCircle className="w-4 h-4 mr-2" />}
                    {selectedRefund.status === 'cancelled' && <X className="w-4 h-4 mr-2" />}
                    <span className="capitalize">{selectedRefund.status}</span>
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Reason</label>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="text-gray-900 leading-relaxed">
                    {selectedRefund.reason}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Request Date</label>
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(selectedRefund.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {selectedRefund.updated_at && selectedRefund.updated_at !== selectedRefund.created_at && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Last Updated</label>
                    <div className="bg-purple-50 p-3 rounded-xl border border-purple-200">
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(selectedRefund.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {selectedRefund.admin_note && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Admin Note</label>
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
                    <p className="text-gray-900 leading-relaxed font-medium">
                      {selectedRefund.admin_note}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-6">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 px-6 py-3 rounded-xl text-sm font-bold hover:from-gray-300 hover:to-gray-400 transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
};

export default Refund;