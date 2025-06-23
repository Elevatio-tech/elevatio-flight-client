import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar,
  Eye,
  MoreHorizontal,
  AlertCircle,
  FileText,
  RefreshCw
} from 'lucide-react';
import { backendUrl } from '../../config/config';
import adminApi from '../services/adminApi';

const AdminPayoutSystem = () => {
  // State management
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPayouts, setSelectedPayouts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statistics, setStatistics] = useState(null);
  const [showPayoutDetails, setShowPayoutDetails] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionType, setActionType] = useState('');
  const [targetPayoutId, setTargetPayoutId] = useState('');

  // Filters
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    startDate: '',
    endDate: '',
    sortBy: 'requested_at',
    sortOrder: 'desc'
  });

  // Mock API functions (replace with actual API calls)
 const fetchPayouts = async () => {
  setLoading(true);
  try {
    const data = await adminApi.getAllPayouts(currentPage, 20, filters);
    setPayouts(data.payouts || []);
    setTotalPages(data.pagination?.totalPages || 1);
  } catch (error) {
    console.error('Error fetching payouts:', error);
    alert('Failed to fetch payouts: ' + error.message);
  } finally {
    setLoading(false);
  }
};

  const fetchStatistics = async () => {
  try {
    const data = await adminApi.getPayoutStatistics();
    setStatistics(data);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    alert('Failed to fetch statistics: ' + error.message);
  }
};


  const handlePayoutAction = async (payoutId, action, data = {}) => {
  try {
    const result = await adminApi.handlePayoutAction(payoutId, action, data);
    alert(`Payout ${action}ed successfully!`);
    fetchPayouts();
    fetchStatistics();
  } catch (error) {
    console.error('Payout action error:', error);
    alert(`Error: ${error.message}`);
  }
};


  const handleBulkAction = async (action, reason = '') => {
  if (selectedPayouts.length === 0) {
    alert('Please select payouts first');
    return;
  }

  try {
    const result = await adminApi.handleBulkPayoutAction(selectedPayouts, action, reason);
    alert(`Bulk ${action} completed. ${result.data.successful.length}/${result.data.total} successful.`);
    setSelectedPayouts([]);
    fetchPayouts();
    fetchStatistics();
  } catch (error) {
    console.error('Bulk action error:', error);
    alert(`Error: ${error.message}`);
  }
};


 const exportPayouts = async () => {
  try {
    const blob = await adminApi.exportPayouts(filters);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payouts_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export error:', error);
    alert('Export failed: ' + error.message);
  }
};

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      approved: <CheckCircle className="w-4 h-4" />,
      rejected: <XCircle className="w-4 h-4" />,
      completed: <CheckCircle className="w-4 h-4" />
    };
    return icons[status] || <Clock className="w-4 h-4" />;
  };

  // Effects
  useEffect(() => {
    fetchPayouts();
  }, [currentPage, filters]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const openRejectModal = (payoutId, isBulk = false) => {
    setTargetPayoutId(payoutId);
    setActionType(isBulk ? 'bulk_reject' : 'reject');
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    if (actionType === 'bulk_reject') {
      handleBulkAction('reject', rejectionReason);
    } else {
      handlePayoutAction(targetPayoutId, 'reject', { rejectionReason });
    }
    setShowRejectModal(false);
    setRejectionReason('');
  };

  // Mock data for demonstration
  useEffect(() => {
    setPayouts([
      {
        id: 'PO-001',
        amount: 1250.00,
        net_amount: 1200.00,
        processing_fee: 50.00,
        status: 'pending',
        requested_at: '2024-01-15T10:30:00Z',
        payment_method: 'Bank Transfer',
        partners: {
          business_name: 'Tech Solutions Inc',
          email: 'admin@techsolutions.com',
          first_name: 'John',
          last_name: 'Doe'
        }
      },
      {
        id: 'PO-002',
        amount: 850.00,
        net_amount: 820.00,
        processing_fee: 30.00,
        status: 'approved',
        requested_at: '2024-01-14T15:45:00Z',
        approved_at: '2024-01-15T09:20:00Z',
        payment_method: 'PayPal',
        partners: {
          business_name: 'Creative Agency',
          email: 'contact@creativeagency.com',
          first_name: 'Jane',
          last_name: 'Smith'
        }
      },
      {
        id: 'PO-003',
        amount: 2100.00,
        net_amount: 2040.00,
        processing_fee: 60.00,
        status: 'rejected',
        requested_at: '2024-01-13T08:15:00Z',
        rejected_at: '2024-01-14T12:30:00Z',
        rejection_reason: 'Insufficient documentation provided',
        payment_method: 'Bank Transfer',
        partners: {
          business_name: 'Marketing Pro',
          email: 'info@marketingpro.com',
          first_name: 'Mike',
          last_name: 'Johnson'
        }
      }
    ]);
    setStatistics({
      total_payouts: 45,
      pending_payouts: 12,
      approved_payouts: 25,
      rejected_payouts: 5,
      completed_payouts: 3,
      total_amount: 125000,
      pending_amount: 25000,
      approved_amount: 85000,
      avg_payout_amount: 2777.78
    });
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payout Management</h1>
          <p className="text-gray-600">Manage partner payouts, approvals, and financial transactions</p>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Payouts</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.total_payouts}</p>
                  <p className="text-sm text-gray-500">{formatCurrency(statistics.total_amount)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.pending_payouts}</p>
                  <p className="text-sm text-gray-500">{formatCurrency(statistics.pending_amount)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.approved_payouts}</p>
                  <p className="text-sm text-gray-500">{formatCurrency(statistics.approved_amount)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Avg. Amount</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(statistics.avg_payout_amount)}</p>
                  <p className="text-sm text-gray-500">Per payout</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by partner name or email..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                </div>

                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="completed">Completed</option>
                </select>

                <input
                  type="date"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                />

                <input
                  type="date"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={exportPayouts}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>

                <button
                  onClick={() => fetchPayouts()}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedPayouts.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">
                    {selectedPayouts.length} payout(s) selected
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBulkAction('approve')}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      Bulk Approve
                    </button>
                    <button
                      onClick={() => openRejectModal('', true)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      Bulk Reject
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payouts Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Loading payouts...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="p-4 text-left">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={selectedPayouts.length === payouts.length && payouts.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPayouts(payouts.map(p => p.id));
                            } else {
                              setSelectedPayouts([]);
                            }
                          }}
                        />
                      </th>
                      <th className="p-4 text-left text-sm font-medium text-gray-900">Partner</th>
                      <th className="p-4 text-left text-sm font-medium text-gray-900">Amount</th>
                      <th className="p-4 text-left text-sm font-medium text-gray-900">Status</th>
                      <th className="p-4 text-left text-sm font-medium text-gray-900">Requested</th>
                      <th className="p-4 text-left text-sm font-medium text-gray-900">Payment Method</th>
                      <th className="p-4 text-left text-sm font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {payouts.map((payout) => (
                      <tr key={payout.id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                            checked={selectedPayouts.includes(payout.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedPayouts([...selectedPayouts, payout.id]);
                              } else {
                                setSelectedPayouts(selectedPayouts.filter(id => id !== payout.id));
                              }
                            }}
                          />
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-gray-900">{payout.partners?.business_name}</p>
                            <p className="text-sm text-gray-500">{payout.partners?.email}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-gray-900">{formatCurrency(payout.amount)}</p>
                            <p className="text-sm text-gray-500">
                              Net: {formatCurrency(payout.net_amount)}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payout.status)}`}>
                            {getStatusIcon(payout.status)}
                            {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-gray-900">{formatDate(payout.requested_at)}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-gray-900">{payout.payment_method || 'Bank Transfer'}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedPayout(payout);
                                setShowPayoutDetails(true);
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {payout.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handlePayoutAction(payout.id, 'approve')}
                                  className="p-1 text-green-600 hover:text-green-800 transition-colors"
                                  title="Approve"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => openRejectModal(payout.id)}
                                  className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                  title="Reject"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Payout Details Modal */}
        {showPayoutDetails && selectedPayout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Payout Details</h2>
                  <button
                    onClick={() => setShowPayoutDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Payout Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payout ID:</span>
                        <span className="font-medium">{selectedPayout.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-medium">{formatCurrency(selectedPayout.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Net Amount:</span>
                        <span className="font-medium">{formatCurrency(selectedPayout.net_amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Processing Fee:</span>
                        <span className="font-medium">{formatCurrency(selectedPayout.processing_fee)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPayout.status)}`}>
                          {getStatusIcon(selectedPayout.status)}
                          {selectedPayout.status.charAt(0).toUpperCase() + selectedPayout.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Partner Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Business Name:</span>
                        <span className="font-medium">{selectedPayout.partners?.business_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Partner Name:</span>
                        <span className="font-medium">
                          {selectedPayout.partners?.first_name} {selectedPayout.partners?.last_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{selectedPayout.partners?.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="font-medium">{selectedPayout.payment_method || 'Bank Transfer'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Timeline</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Requested:</span>
                      <span className="font-medium">{formatDate(selectedPayout.requested_at)}</span>
                    </div>
                    {selectedPayout.approved_at && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Approved:</span>
                        <span className="font-medium">{formatDate(selectedPayout.approved_at)}</span>
                      </div>
                    )}
                    {selectedPayout.rejected_at && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rejected:</span>
                        <span className="font-medium">{formatDate(selectedPayout.rejected_at)}</span>
                      </div>
                    )}
                    {selectedPayout.processed_at && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Processed:</span>
                        <span className="font-medium">{formatDate(selectedPayout.processed_at)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedPayout.rejection_reason && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Rejection Reason</h3>
                    <p className="text-sm text-gray-600 bg-red-50 p-3 rounded-lg border border-red-200">
                      {selectedPayout.rejection_reason}
                    </p>
                  </div>
                )}

                {/* Action Buttons in Modal */}
                {selectedPayout.status === 'pending' && (
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => {
                        handlePayoutAction(selectedPayout.id, 'approve');
                        setShowPayoutDetails(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve Payout
                    </button>
                    <button
                      onClick={() => {
                        openRejectModal(selectedPayout.id);
                        setShowPayoutDetails(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject Payout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Reject Payout</h2>
                  <button
                    onClick={() => {
                      setShowRejectModal(false);
                      setRejectionReason('');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="4"
                    placeholder="Please provide a reason for rejecting this payout..."
                    required
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      setShowRejectModal(false);
                      setRejectionReason('');
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmReject}
                    disabled={!rejectionReason.trim()}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Rejection
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

export default AdminPayoutSystem;