import React, { useState, useEffect } from 'react';
import { 
  X,
  Edit,
  Eye,
  Check,
  Search,
  Filter,
  RefreshCw,
  Download
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext'; 
import { backendUrl } from '../../config/config';

// const backendUrl = 'http://localhost:5000';

const PartnersManagement = () => {
  const { token, isAdmin } = useAuth(); 
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });
  const [actionLoading, setActionLoading] = useState({});

  // Get admin token from auth context or localStorage
  const getAdminToken = () => {
    return token || localStorage.getItem('adminToken');
  };

  // Fetch partners from backend
  const fetchPartners = async (page = 1, currentFilters = filters) => {
    setLoading(true);
    try {
      const adminToken = getAdminToken();
      if (!adminToken) {
        throw new Error('No admin token found');
      }

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        status: currentFilters.status || '',
        search: currentFilters.search || ''
      });

      console.log('Fetching partners with params:', queryParams.toString());

      const response = await fetch(`${backendUrl}/api/admin/partners?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch partners');
      }

      const data = await response.json();
      console.log('Partners data received:', data);
      
      setPartners(data.partners || []);
      setPagination(prev => ({
        ...prev,
        total: data.total || 0,
        totalPages: Math.ceil((data.total || 0) / pagination.limit),
        page
      }));
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast.error(error.message || 'Failed to load partners');
    } finally {
      setLoading(false);
    }
  };

  // Handle partner actions (approve, reject, suspend, etc.)
  const handlePartnerAction = async (partnerId, action, additionalData = {}) => {
    setActionLoading(prev => ({ ...prev, [partnerId]: action }));
    
    try {
      const adminToken = getAdminToken();
      if (!adminToken) {
        throw new Error('No admin token found');
      }

      const url = `${backendUrl}/api/admin/partners/${action}/${partnerId}`;
      
      console.log(`Attempting to ${action} partner ${partnerId}`);
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(additionalData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${action} partner`);
      }

      const result = await response.json();
      console.log(`Partner ${action} result:`, result);
      
      toast.success(result.message || `Partner ${action} successful`);
      
      // Update the local state immediately for better UX
      setPartners(prevPartners => 
        prevPartners.map(partner => 
          partner.id === partnerId 
            ? { 
                ...partner, 
                status: action === 'approve' ? 'approved' : 
                        action === 'reject' ? 'rejected' : 
                        action === 'suspend' ? 'suspended' : 
                        action === 'activate' ? 'approved' : partner.status,
                updated_at: new Date().toISOString()
              }
            : partner
        )
      );
      
      // Also refresh the data from server to ensure consistency
      setTimeout(() => {
        fetchPartners(pagination.page);
      }, 1000);
      
    } catch (error) {
      console.error(`Error ${action} partner:`, error);
      toast.error(error.message || `Failed to ${action} partner`);
    } finally {
      setActionLoading(prev => ({ ...prev, [partnerId]: null }));
    }
  };

  // Handle approve with confirmation
  const handleApprove = async (partnerId, businessName) => {
    if (window.confirm(`Are you sure you want to approve ${businessName}?`)) {
      await handlePartnerAction(partnerId, 'approve');
    }
  };

  // Handle reject with reason
  const handleReject = async (partnerId, businessName) => {
    const reason = prompt(`Enter rejection reason for ${businessName}:`);
    if (reason && reason.trim()) {
      await handlePartnerAction(partnerId, 'reject', { reason: reason.trim() });
    }
  };

  // Handle search with debouncing
  const handleSearch = (searchTerm) => {
    const newFilters = { ...filters, search: searchTerm };
    setFilters(newFilters);
    
    // Debounce the search
    const timeoutId = setTimeout(() => {
      fetchPartners(1, newFilters);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  // Handle status filter
  const handleStatusFilter = (status) => {
    const newFilters = { ...filters, status };
    setFilters(newFilters);
    fetchPartners(1, newFilters);
  };

  // Export partners data
  const handleExport = async () => {
    try {
      const adminToken = getAdminToken();
      const response = await fetch(`${backendUrl}/api/admin/partners?export=true`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        }
      });
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `partners-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast.success('Partners data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  // Load partners on component mount
  useEffect(() => {
    if (isAdmin) {
      fetchPartners();
    }
  }, [isAdmin]);

  // Auto-refresh every 30 seconds to catch updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && !Object.keys(actionLoading).some(key => actionLoading[key])) {
        fetchPartners(pagination.page);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [loading, actionLoading, pagination.page]);

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
      suspended: 'bg-gray-100 text-gray-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Show loading or unauthorized message
  if (!isAdmin) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-red-600">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Partners Management</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => fetchPartners(pagination.page)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button 
            onClick={handleExport}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by business name, email, or contact person..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filters.status}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Loading partners...</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Business</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Contact</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Commission</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Registered</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {partners.map((partner) => (
                    <tr key={partner.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{partner.business_name}</p>
                          <p className="text-sm text-gray-500">{partner.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm text-gray-900">{partner.contact_person}</p>
                          {partner.phone && (
                            <p className="text-sm text-gray-500">{partner.phone}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(partner.status)}`}>
                          {partner.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {partner.commission_rate ? (partner.commission_rate * 100).toFixed(1) : '0.0'}%
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {formatDate(partner.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button 
                            className="text-blue-500 hover:text-blue-700"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          
                          {partner.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleApprove(partner.id, partner.business_name)}
                                className="text-green-500 hover:text-green-700"
                                disabled={actionLoading[partner.id] === 'approve'}
                                title="Approve Partner"
                              >
                                {actionLoading[partner.id] === 'approve' ? (
                                  <RefreshCw size={16} className="animate-spin" />
                                ) : (
                                  <Check size={16} />
                                )}
                              </button>
                              <button 
                                onClick={() => handleReject(partner.id, partner.business_name)}
                                className="text-red-500 hover:text-red-700"
                                disabled={actionLoading[partner.id] === 'reject'}
                                title="Reject Partner"
                              >
                                {actionLoading[partner.id] === 'reject' ? (
                                  <RefreshCw size={16} className="animate-spin" />
                                ) : (
                                  <X size={16} />
                                )}
                              </button>
                            </>
                          )}
                          
                          {partner.status === 'approved' && (
                            <button 
                              onClick={() => handlePartnerAction(partner.id, 'suspend')}
                              className="text-orange-500 hover:text-orange-700"
                              disabled={actionLoading[partner.id] === 'suspend'}
                              title="Suspend Partner"
                            >
                              {actionLoading[partner.id] === 'suspend' ? (
                                <RefreshCw size={16} className="animate-spin" />
                              ) : (
                                <X size={16} />
                              )}
                            </button>
                          )}
                          
                          {partner.status === 'suspended' && (
                            <button 
                              onClick={() => handlePartnerAction(partner.id, 'activate')}
                              className="text-green-500 hover:text-green-700"
                              disabled={actionLoading[partner.id] === 'activate'}
                              title="Activate Partner"
                            >
                              {actionLoading[partner.id] === 'activate' ? (
                                <RefreshCw size={16} className="animate-spin" />
                              ) : (
                                <Check size={16} />
                              )}
                            </button>
                          )}
                          
                          <button 
                            className="text-gray-500 hover:text-gray-700"
                            title="Edit Partner"
                          >
                            <Edit size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} partners
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => fetchPartners(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm text-gray-700">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => fetchPartners(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {partners.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500">No partners found</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PartnersManagement;