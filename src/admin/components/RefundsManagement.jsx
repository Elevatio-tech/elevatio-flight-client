import React, { useState, useEffect } from 'react';
import { 
  X,
  Eye,
  Check,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import adminApi from '../services/adminApi';

// // AdminApiService class (embedded for the component)
// const API_BASE_URL = 'http://localhost:5000/api';

// class AdminApiService {
//   constructor() {
//     this.baseURL = `${API_BASE_URL}/admin`;
//   }

//   async makeRequest(endpoint, options = {}) {
//     const token = localStorage.getItem('adminToken'); 
    
//     const config = {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//         ...options.headers,
//       },
//       ...options,
//     };

//     try {
//       const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('API Request failed:', error);
//       throw error;
//     }
//   }

//   async getAllRefunds(page = 1, limit = 20, filters = {}) {
//     const queryParams = new URLSearchParams({
//       page: page.toString(),
//       limit: limit.toString(),
//       ...filters
//     });
    
//     return this.makeRequest(`/refunds?${queryParams}`);
//   }

//   async processRefund(refundId, action) {
//     return this.makeRequest(`/refunds/${refundId}/${action}`, {
//       method: 'PUT',
//     });
//   }
// }

// const adminApiService = new AdminApiService();

const RefundsManagement = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    status: ''
  });
  const [processingRefund, setProcessingRefund] = useState(null);
  const [notification, setNotification] = useState(null);

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Load refunds data
  const loadRefunds = async (page = 1, currentFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminApi.getAllRefunds(page, pagination.limit, currentFilters);
      
      setRefunds(response.refunds || []);
      setPagination(response.pagination || pagination);
    } catch (err) {
      setError(err.message || 'Failed to load refunds');
      showNotification('Failed to load refunds data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle refund action (approve/reject)
  const handleRefundAction = async (refundId, action) => {
    try {
      setProcessingRefund(refundId);
      
      await adminApi.processRefund(refundId, action);
      
      showNotification(`Refund ${action}d successfully`);
      
      // Reload current page to reflect changes
      await loadRefunds(pagination.page, filters);
    } catch (err) {
      showNotification(err.message || `Failed to ${action} refund`, 'error');
    } finally {
      setProcessingRefund(null);
    }
  };

  // Handle filter change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    loadRefunds(1, newFilters);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadRefunds(newPage, filters);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  // Format user name
  const formatUserName = (user) => {
    if (user && user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user?.email || 'Unknown User';
  };

  // Load data on component mount
  useEffect(() => {
    loadRefunds();
  }, []);

  // Calculate stats
  const pendingRefunds = refunds.filter(r => r.status === 'pending').length;
  const totalAmount = refunds.reduce((sum, r) => sum + (r.amount || 0), 0);

  return (
    <div className="p-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
          notification.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'error' && <AlertCircle size={20} />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Refunds Management</h2>
          <div className="text-sm text-gray-600 mt-1">
            Total: {pagination.total} refunds | Pending: {pendingRefunds} | Amount: ${totalAmount.toFixed(2)}
          </div>
        </div>
        <button
          onClick={() => loadRefunds(pagination.page, filters)}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange({ ...filters, status: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">User</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Booking Ref</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Created</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Processed</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                      <RefreshCw size={20} className="animate-spin" />
                      <span>Loading refunds...</span>
                    </div>
                  </td>
                </tr>
              ) : refunds.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    No refunds found
                  </td>
                </tr>
              ) : (
                refunds.map((refund) => (
                  <tr key={refund.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatUserName(refund.users)}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {refund.bookings?.booking_reference || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      ${refund.amount?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        refund.status === 'approved' ? 'bg-green-100 text-green-800' :
                        refund.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {refund.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatDate(refund.created_at)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {refund.processed_at ? formatDate(refund.processed_at) : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-500 hover:text-blue-700"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        {refund.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleRefundAction(refund.id, 'approve')}
                              disabled={processingRefund === refund.id}
                              className="text-green-500 hover:text-green-700 disabled:opacity-50"
                              title="Approve Refund"
                            >
                              <Check size={16} />
                            </button>
                            <button 
                              onClick={() => handleRefundAction(refund.id, 'reject')}
                              disabled={processingRefund === refund.id}
                              className="text-red-500 hover:text-red-700 disabled:opacity-50"
                              title="Reject Refund"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                        {processingRefund === refund.id && (
                          <RefreshCw size={16} className="animate-spin text-gray-400" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm text-gray-700">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RefundsManagement;