import React, { useState, useEffect } from 'react';
import {  
  X,  
  Plus,
  Edit,  
  Check,
  Ban,
  Loader2,
  AlertCircle
} from 'lucide-react';
import adminApi from '../services/adminApi';
import { toast } from 'react-toastify';



const PromoCodesManagement = () => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });

  // Form state$
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    usageLimit: '',
    expiryDate: ''
  });

  // Load promo codes on component mount
  useEffect(() => {
    loadPromoCodes();
  }, [pagination.page]);

  const transformPromoCode = (promo) => ({
  id: promo.id,
  code: promo.code,
  discountType: promo.discount_type,
  discountValue: promo.discount_value,
  usageLimit: promo.usage_limit,
  used: promo.used,
  status: promo.status,
  expiryDate: promo.expiry_date,
  createdAt: promo.created_at,
  updatedAt: promo.updated_at
});

// Update your loadPromoCodes function:
const loadPromoCodes = async () => {
  try {
    setLoading(true);
    setError(null);
    const response = await adminApi.getAllPromoCodes(
      pagination.page, 
      pagination.limit
    );
    
    // Transform the data to match frontend expectations
    const transformedPromoCodes = response.data.map(transformPromoCode);
    
    setPromoCodes(transformedPromoCodes);
    setPagination(prev => ({
      ...prev,
      total: response.pagination.total
    }));
  } catch (err) {
    setError(err.message || 'Failed to load promo codes');
    toast.error('Failed to load promo codes');
  } finally {
    setLoading(false);
  }
};

  const resetForm = () => {
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      usageLimit: '',
      expiryDate: ''
    });
  };

  const handleCreatePromo = async () => {
  if (!formData.code || !formData.discountValue || !formData.usageLimit || !formData.expiryDate) {
    toast.error('Please fill in all required fields');
    return;
  }

  try {
    setActionLoading(prev => ({ ...prev, create: true }));
    
    const promoData = {
      ...formData,
      discountValue: parseFloat(formData.discountValue),
      usageLimit: parseInt(formData.usageLimit),
      used: 0,
      status: 'active'
    };

    const response = await adminApi.createPromoCode(promoData);
    
    if (response.success) {
      toast.success('Promo code created successfully');
      // Transform and add to list
      const transformedPromo = transformPromoCode(response.data);
      setPromoCodes(prev => [transformedPromo, ...prev]);
      setShowCreateModal(false);
      resetForm();
    }
  } catch (err) {
    toast.error(err.message || 'Failed to create promo code');
  } finally {
    setActionLoading(prev => ({ ...prev, create: false }));
  }
};

  const handleEditPromo = async () => {
    if (!editingPromo) return;

    if (!formData.code || !formData.discountValue || !formData.usageLimit || !formData.expiryDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, edit: true }));
      
      const promoData = {
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        usageLimit: parseInt(formData.usageLimit)
      };

      const response = await adminApi.updatePromoCode(editingPromo.id, promoData);
      
      if (response.success) {
        toast.success('Promo code updated successfully');
        setPromoCodes(prev => 
          prev.map(promo => 
            promo.id === editingPromo.id 
              ? { ...promo, ...promoData }
              : promo
          )
        );
        setShowEditModal(false);
        setEditingPromo(null);
        resetForm();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update promo code');
    } finally {
      setActionLoading(prev => ({ ...prev, edit: false }));
    }
  };

  const handlePromoAction = async (promoId, action) => {
    try {
      setActionLoading(prev => ({ ...prev, [promoId]: true }));
      
      let response;
      if (action === 'activate') {
        response = await adminApi.activatePromoCode(promoId);
      } else if (action === 'deactivate') {
        response = await adminApi.deactivatePromoCode(promoId);
      }

      if (response.success) {
        setPromoCodes(prev => 
          prev.map(promo =>
            promo.id === promoId
              ? { ...promo, status: action === 'activate' ? 'active' : 'inactive' }
              : promo
          )
        );
        toast.success(`Promo code ${action}d successfully`);
      }
    } catch (err) {
      toast.error(err.message || `Failed to ${action} promo code`);
    } finally {
      setActionLoading(prev => ({ ...prev, [promoId]: false }));
    }
  };

  const openEditModal = (promo) => {
    setEditingPromo(promo);
    setFormData({
      code: promo.code,
      discountType: promo.discountType,
      discountValue: promo.discountValue.toString(),
      usageLimit: promo.usageLimit.toString(),
      expiryDate: promo.expiryDate
    });
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading && (!promoCodes || promoCodes.length === 0)) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        <span className="ml-2 text-gray-600">Loading promo codes...</span>
      </div>
    );
  }

  if (error && (!promoCodes || promoCodes.length === 0)) {
    return (
      <div className="flex items-center justify-center h-64">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <span className="ml-2 text-red-600">{error}</span>
        <button 
          onClick={loadPromoCodes}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Promo Codes Management</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Create Promo Code
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Code</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Value</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Usage</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Expires</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {promoCodes && promoCodes.length > 0 ? promoCodes.map((promo) => (
                <tr key={promo.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-medium text-gray-900">{promo.code}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 capitalize">{promo.discountType}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {promo.discountType === 'percentage' ? `${promo.discountValue}%` : `₦${promo.discountValue}`}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {promo.used}/{promo.usageLimit}
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${Math.min((promo.used / promo.usageLimit) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      promo.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {promo.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{promo.expiryDate}</td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => openEditModal(promo)}
                        className="text-blue-500 hover:text-blue-700"
                        disabled={actionLoading[promo.id]}
                      >
                        <Edit size={16} />
                      </button>
                      {promo.status === 'active' ? (
                        <button
                          onClick={() => handlePromoAction(promo.id, 'deactivate')}
                          className="text-red-500 hover:text-red-700 disabled:opacity-50"
                          disabled={actionLoading[promo.id]}
                        >
                          {actionLoading[promo.id] ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Ban size={16} />
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePromoAction(promo.id, 'activate')}
                          className="text-green-500 hover:text-green-700 disabled:opacity-50"
                          disabled={actionLoading[promo.id]}
                        >
                          {actionLoading[promo.id] ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Check size={16} />
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    {loading ? 'Loading promo codes...' : 'No promo codes found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Promo Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Create Promo Code</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Code *</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="NEWCODE10"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
                <select 
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount Value *</label>
                <input
                  type="number"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Usage Limit *</label>
                <input
                  type="number"
                  name="usageLimit"
                  value={formData.usageLimit}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="100"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={actionLoading.create}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreatePromo}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center"
                  disabled={actionLoading.create}
                >
                  {actionLoading.create ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    'Create'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Promo Modal */}
      {showEditModal && editingPromo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Promo Code</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingPromo(null);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Code *</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
                <select 
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount Value *</label>
                <input
                  type="number"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Usage Limit *</label>
                <input
                  type="number"
                  name="usageLimit"
                  value={formData.usageLimit}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingPromo(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={actionLoading.edit}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleEditPromo}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center"
                  disabled={actionLoading.edit}
                >
                  {actionLoading.edit ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    'Update'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromoCodesManagement;