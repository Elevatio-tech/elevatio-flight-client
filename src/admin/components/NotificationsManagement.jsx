import React, { useState, useEffect } from 'react';
import {   
  Bell,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Filter,
  RefreshCw,
  Eye,
  Trash2,
  RotateCcw,
  Plus,
  Edit,
  FileText,
  BarChart3,
  Download,
  AlertCircle,
  Info,
  CheckCircle2,
  AlertTriangle,
  X,
  Search,
  Calendar,
  Target,
 
  ClipboardList,
  TrendingUp,
  Archive
} from 'lucide-react';
import adminApi from '../services/adminApi';

const NotificationsManagement = () => {
  const [notification, setNotification] = useState({
    title: '',
    message: '',
    type: 'info',
    recipients: 'all'
  });
  
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [statisticsLoading, setStatisticsLoading] = useState(false);
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  
  const [filters, setFilters] = useState({
    type: '',
    recipients: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('send'); // send, history, templates, analytics
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    type: 'info',
    title: '',
    message: '',
    description: ''
  });
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showNotificationDetails, setShowNotificationDetails] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState([]);
  const [deliveryDetailsLoading, setDeliveryDetailsLoading] = useState(false);

  // Load data on component mount and tab changes
  useEffect(() => {
    loadNotificationHistory();
    loadStatistics();
  }, [pagination.page, filters]);

  useEffect(() => {
    if (activeTab === 'templates') {
      loadTemplates();
    }
  }, [activeTab]);

  const loadNotificationHistory = async () => {
    setHistoryLoading(true);
    try {
      const response = await adminApi.getNotificationHistory(
        pagination.page,
        pagination.limit,
        filters
      );
      
      if (response.success) {
        setNotificationHistory(response.data.notifications);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total,
          totalPages: response.data.pagination.totalPages
        }));
      }
    } catch (error) {
      console.error('Error loading notification history:', error);
      showToast('Failed to load notification history', 'error');
    } finally {
      setHistoryLoading(false);
    }
  };

  const loadTemplates = async () => {
    setTemplatesLoading(true);
    try {
      const response = await adminApi.getNotificationTemplates();
      if (response.success) {
        setTemplates(response.data);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      showToast('Failed to load templates', 'error');
    } finally {
      setTemplatesLoading(false);
    }
  };

  const loadStatistics = async () => {
    setStatisticsLoading(true);
    try {
      const response = await adminApi.getNotificationStatistics('30d');
      if (response.success) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setStatisticsLoading(false);
    }
  };

  const sendNotification = async () => {
    const validation = adminApi.validateNotificationData(notification);
    if (!validation.isValid) {
      showToast(validation.errors.join(', '), 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await adminApi.sendBroadcastNotification(notification);
      
      if (response.success) {
        showToast(`Notification sent successfully! Delivered to ${response.data.deliveredCount} users.`, 'success');
        
        // Reset form
        setNotification({ 
          title: '', 
          message: '', 
          type: 'info', 
          recipients: 'all' 
        });
        
        // Reload data
        loadNotificationHistory();
        loadStatistics();
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      showToast('Failed to send notification: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const sendNotificationFromTemplate = async (templateName) => {
    try {
      setLoading(true);
      const response = await adminApi.sendNotificationFromTemplate(
        templateName, 
        notification.recipients
      );
      
      if (response.success) {
        showToast(`Template notification sent successfully!`, 'success');
        loadNotificationHistory();
        loadStatistics();
      }
    } catch (error) {
      console.error('Error sending template notification:', error);
      showToast('Failed to send template notification: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const saveTemplate = async () => {
    const validation = adminApi.validateNotificationData(templateForm);
    if (!validation.isValid || !templateForm.name.trim()) {
      showToast('Please fill all required fields correctly', 'error');
      return;
    }

    try {
      let response;
      if (editingTemplate) {
        response = await adminApi.updateNotificationTemplate(editingTemplate.id, templateForm);
      } else {
        response = await adminApi.createNotificationTemplate(templateForm);
      }
      
      if (response.success) {
        showToast(`Template ${editingTemplate ? 'updated' : 'created'} successfully!`, 'success');
        setShowTemplateModal(false);
        setTemplateForm({ name: '', type: 'info', title: '', message: '', description: '' });
        setEditingTemplate(null);
        loadTemplates();
      }
    } catch (error) {
      console.error('Error saving template:', error);
      showToast('Failed to save template: ' + error.message, 'error');
    }
  };

  const deleteTemplate = async (templateId) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    
    try {
      const response = await adminApi.deleteNotificationTemplate(templateId);
      if (response.success) {
        showToast('Template deleted successfully!', 'success');
        loadTemplates();
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      showToast('Failed to delete template: ' + error.message, 'error');
    }
  };

  const deleteNotification = async (notificationId) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;
    
    try {
      const response = await adminApi.deleteNotification(notificationId);
      if (response.success) {
        showToast('Notification deleted successfully!', 'success');
        loadNotificationHistory();
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      showToast('Failed to delete notification: ' + error.message, 'error');
    }
  };

  const retryFailedDeliveries = async (notificationId) => {
    try {
      const response = await adminApi.retryFailedDeliveries(notificationId);
      if (response.success) {
        showToast('Failed deliveries retry initiated!', 'success');
        loadNotificationHistory();
      }
    } catch (error) {
      console.error('Error retrying failed deliveries:', error);
      showToast('Failed to retry deliveries: ' + error.message, 'error');
    }
  };

  const loadDeliveryDetails = async (notificationId) => {
    setDeliveryDetailsLoading(true);
    try {
      const response = await adminApi.getNotificationDeliveryDetails(notificationId);
      if (response.success) {
        setDeliveryDetails(response.data.deliveries);
      }
    } catch (error) {
      console.error('Error loading delivery details:', error);
      showToast('Failed to load delivery details', 'error');
    } finally {
      setDeliveryDetailsLoading(false);
    }
  };

  const showToast = (message, type) => {
    // Simple alert for now - you can replace with a proper toast library
    alert(message);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'info':
        return 'border-blue-500 bg-blue-50';
      case 'success':
        return 'border-green-500 bg-green-50';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50';
      case 'error':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      recipients: '',
      status: '',
      dateFrom: '',
      dateTo: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const filteredHistory = notificationHistory.filter(notif =>
    notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notif.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Notifications Management</h2>
        
        {/* Tab Navigation */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { id: 'send', label: 'Send', icon: Send },
            { id: 'history', label: 'History', icon: Clock },
            { id: 'templates', label: 'Templates', icon: FileText },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Send Notification Tab */}
      {activeTab === 'send' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Send Notification Form */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Send className="w-5 h-5 mr-2 text-blue-500" />
              Send New Notification
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={notification.title}
                  onChange={(e) => setNotification({ ...notification, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter notification title"
                  maxLength={255}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {notification.title.length}/255 characters
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                <textarea
                  value={notification.message}
                  onChange={(e) => setNotification({ ...notification, message: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter notification message"
                  maxLength={1000}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {notification.message.length}/1000 characters
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={notification.type}
                    onChange={(e) => setNotification({ ...notification, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="success">Success</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                  <select
                    value={notification.recipients}
                    onChange={(e) => setNotification({ ...notification, recipients: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Users</option>
                    <option value="active">Active Users</option>
                    <option value="partners">Partners</option>
                    <option value="admins">Admins</option>
                  </select>
                </div>
              </div>

              <button
                onClick={sendNotification}
                disabled={loading || !notification.title.trim() || !notification.message.trim()}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center font-medium"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4 mr-2" />
                    Send Notification
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Quick Stats
            </h3>
            
            {statisticsLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin text-gray-500" />
              </div>
            ) : statistics ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {statistics.totalSent || 0}
                  </div>
                  <div className="text-sm text-blue-700">Sent This Month</div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {statistics.deliveryRate || 0}%
                  </div>
                  <div className="text-sm text-green-700">Delivery Rate</div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {statistics.avgResponseTime || 0}s
                  </div>
                  <div className="text-sm text-yellow-700">Avg Response Time</div>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {statistics.failureRate || 0}%
                  </div>
                  <div className="text-sm text-red-700">Failure Rate</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No statistics available</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-600" />
                Notification History
              </h3>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <button
                  onClick={loadNotificationHistory}
                  disabled={historyLoading}
                  className="flex items-center px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${historyLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>
              
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="success">Success</option>
                <option value="error">Error</option>
              </select>
              
              <select
                value={filters.recipients}
                onChange={(e) => handleFilterChange('recipients', e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Recipients</option>
                <option value="all">All Users</option>
                <option value="active">Active Users</option>
                <option value="partners">Partners</option>
                <option value="admins">Admins</option>
              </select>
              
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="sent">Sent</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="From date"
              />
              
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="To date"
              />
              
              {(filters.type || filters.recipients || filters.status || filters.dateFrom || filters.dateTo) && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-800 flex items-center"
                >
                  <X className="w-3 h-3 mr-1" />
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {historyLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-gray-500 mr-3" />
                <span className="text-gray-500">Loading notification history...</span>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Bell className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">No notifications found</p>
                <p className="text-sm">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredHistory.map((notif) => (
                  <div
                    key={notif.id}
                    className={`border-l-4 p-4 rounded-r-lg ${getTypeColor(notif.type)} hover:shadow-md transition-shadow`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getStatusIcon(notif.status)}
                          <h4 className="font-semibold text-gray-900">{notif.title}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${getTypeBadgeColor(notif.type)}`}>
                            {notif.type.charAt(0).toUpperCase() + notif.type.slice(1)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {notif.message}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Target className="w-3 h-3 mr-1" />
                            Recipients: {notif.recipients}
                          </span>
                          <span>Target: {notif.target_count}</span>
                          {notif.delivered_count !== undefined && (
                            <span className="text-green-600 font-medium">
                              ✓ Delivered: {notif.delivered_count}
                            </span>
                          )}
                          {notif.failed_count > 0 && (
                            <span className="text-red-600 font-medium">
                              ✗ Failed: {notif.failed_count}
                            </span>
                          )}
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(notif.sent_at)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => {
                            setSelectedNotification(notif);
                            setShowNotificationDetails(true);
                            loadDeliveryDetails(notif.id);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {notif.failed_count > 0 && (
                          <button
                            onClick={() => retryFailedDeliveries(notif.id)}
                            className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded"
                            title="Retry Failed Deliveries"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Delete Notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} notifications
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <span className="px-4 py-2 text-sm bg-gray-100 rounded">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold flex items-center">
                <ClipboardList className="w-5 h-5 mr-2 text-purple-500" />
                Notification Templates
              </h3>
              <button
                onClick={() => setShowTemplateModal(true)}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Template
              </button>
            </div>
          </div>

          <div className="p-6">
            {templatesLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-gray-500 mr-3" />
                <span className="text-gray-500">Loading templates...</span>
              </div>
            ) : templates.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">No templates found</p>
                <p className="text-sm">Create your first notification template</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-gray-900">{template.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getTypeBadgeColor(template.type)}`}>
                        {template.type}
                      </span>
                    </div>
                    
                    <h5 className="font-medium text-gray-700 mb-2">{template.title}</h5>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">{template.message}</p>
                    
                    {template.description && (
                      <p className="text-xs text-gray-500 mb-3">{template.description}</p>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => sendNotificationFromTemplate(template.name)}
                        disabled={loading}
                        className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        <Send className="w-3 h-3 mr-1" />
                        Send
                      </button>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setEditingTemplate(template);
                            setTemplateForm(template);
                            setShowTemplateModal(true);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTemplate(template.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-green-500" />
              Analytics Dashboard
            </h3>
            
            {statisticsLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-gray-500 mr-3" />
                <span className="text-gray-500">Loading analytics...</span>
              </div>
            ) : statistics ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
                  <div className="text-3xl font-bold">{statistics.totalSent || 0}</div>
                  <div className="text-blue-100">Total Sent</div>
                </div>
                
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
                  <div className="text-3xl font-bold">{statistics.deliveryRate || 0}%</div>
                  <div className="text-green-100">Delivery Rate</div>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-lg text-white">
                  <div className="text-3xl font-bold">{statistics.avgResponseTime || 0}s</div>
                  <div className="text-yellow-100">Avg Response Time</div>
                </div>
                
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-lg text-white">
                  <div className="text-3xl font-bold">{statistics.failureRate || 0}%</div>
                  <div className="text-red-100">Failure Rate</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">No analytics data available</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notification Details Modal */}
      {showNotificationDetails && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Notification Details</h3>
                <button
                  onClick={() => setShowNotificationDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Title</h4>
                  <p className="text-gray-600">{selectedNotification.title}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Message</h4>
                  <p className="text-gray-600">{selectedNotification.message}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Type</h4>
                    <span className={`px-3 py-1 rounded-full text-sm ${getTypeBadgeColor(selectedNotification.type)}`}>
                      {selectedNotification.type}
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Recipients</h4>
                    <p className="text-gray-600">{selectedNotification.recipients}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Delivery Details</h4>
                  {deliveryDetailsLoading ? (
                    <div className="flex items-center">
                      <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                      Loading delivery details...
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="font-medium text-gray-700">Target</div>
                          <div className="text-2xl font-bold text-gray-900">{selectedNotification.target_count}</div>
                        </div>
                        <div>
                          <div className="font-medium text-green-700">Delivered</div>
                          <div className="text-2xl font-bold text-green-600">{selectedNotification.delivered_count}</div>
                        </div>
                        <div>
                          <div className="font-medium text-red-700">Failed</div>
                          <div className="text-2xl font-bold text-red-600">{selectedNotification.failed_count}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">
                  {editingTemplate ? 'Edit Template' : 'Create New Template'}
                </h3>
                <button
                  onClick={() => {
                    setShowTemplateModal(false);
                    setEditingTemplate(null);
                    setTemplateForm({ name: '', type: 'info', title: '', message: '', description: '' });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Template Name *</label>
                  <input
                    type="text"
                    value={templateForm.name}
                    onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter template name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <input
                    type="text"
                    value={templateForm.description}
                    onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter template description"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={templateForm.type}
                    onChange={(e) => setTemplateForm({ ...templateForm, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="success">Success</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={templateForm.title}
                    onChange={(e) => setTemplateForm({ ...templateForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter notification title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea
                    value={templateForm.message}
                    onChange={(e) => setTemplateForm({ ...templateForm, message: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter notification message"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowTemplateModal(false);
                    setEditingTemplate(null);
                    setTemplateForm({ name: '', type: 'info', title: '', message: '', description: '' });
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveTemplate}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  {editingTemplate ? 'Update Template' : 'Create Template'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsManagement;