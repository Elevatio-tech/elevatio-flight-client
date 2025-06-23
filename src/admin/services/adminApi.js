// services/adminApi.js
const API_BASE_URL = 'https://elevatio.onrender.com/api';

class AdminApiService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/admin`;
  }

  // Helper method to make authenticated requests
  async makeRequest(endpoint, options = {}) {
    const token = localStorage.getItem('adminToken'); 
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Dashboard methods
  async getDashboardStats() {
    return this.makeRequest('/dashboard');
  }

  // Users management methods
  async getAllUsers(page = 1, limit = 20, filters = {}) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });
    
    return this.makeRequest(`/users?${queryParams}`);
  }

  async manageUser(action, userId, data = {}) {
    return this.makeRequest(`/users/${action}/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Partners management methods
  async getAllPartners(page = 1, limit = 20, filters = {}) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });
    
    return this.makeRequest(`/partners?${queryParams}`);
  }

  async managePartner(action, partnerId, data = {}) {
    return this.makeRequest(`/partners/${action}/${partnerId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Bookings management methods
  async getAllBookings(page = 1, limit = 20, filters = {}) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });
    
    return this.makeRequest(`/bookings?${queryParams}`);
  }

  async getBookingDetails(bookingId) {
    return this.makeRequest(`/bookings/${bookingId}`);
  }

  // Refunds management methods
  async getAllRefunds(page = 1, limit = 20, filters = {}) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });
    
    return this.makeRequest(`/refunds?${queryParams}`);
  }

  async processRefund(refundId, action) {
    return this.makeRequest(`/refunds/${refundId}/${action}`, {
      method: 'PUT',
    });
  }

  // Reports methods
  async generateReport(reportType, dateRange) {
    const queryParams = new URLSearchParams({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });
    
    return this.makeRequest(`/reports/${reportType}?${queryParams}`);
  }

  // System methods
 async getSystemLogs(page = 1, limit = 50, filters = {}) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters
  });

  // Fixed: Use backticks for template literal
  return this.makeRequest(`/system/logs?${queryParams}`);
}

async getSystemSettings() {
  return this.makeRequest('/system/settings');
}

async updateSystemSettings(settings) {
  return this.makeRequest('/system/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  });
}

  async getAllPayouts(page = 1, limit = 20, filters = {}) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters
  });
  
  return this.makeRequest(`/payouts?${queryParams}`);
}

async getPayoutStatistics() {
  return this.makeRequest('/payouts/statistics/overview');
}

async handlePayoutAction(payoutId, action, data = {}) {
  return this.makeRequest(`/payouts/${payoutId}/${action}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

async handleBulkPayoutAction(payoutIds, action, rejectionReason = '') {
  return this.makeRequest('/payouts/bulk-action', {
    method: 'POST',
    body: JSON.stringify({
      payoutIds,
      action,
      rejectionReason
    }),
  });
}

async exportPayouts(filters = {}) {
  const queryParams = new URLSearchParams(filters);
  const token = localStorage.getItem('adminToken');
  
  try {
    const response = await fetch(`${this.baseURL}/payouts/export/csv?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.blob();
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
}

// Promo Codes management methods
   
  async getAllPromoCodes(page = 1, limit = 20, filters = {}) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });
    
    return this.makeRequest(`/promo-codes?${queryParams}`);
  }

  async createPromoCode(promoData) {
    return this.makeRequest('/promo-codes/create', {
      method: 'POST',
      body: JSON.stringify(promoData),
    });
  }

  async updatePromoCode(promoId, promoData) {
    return this.makeRequest('/promo-codes/update', {
      method: 'PUT',
      body: JSON.stringify({ ...promoData, promoId }),
    });
  }

  async activatePromoCode(promoId) {
    return this.makeRequest('/promo-codes/activate', {
      method: 'PUT',
      body: JSON.stringify({ promoId }),
    });
  }

  async deactivatePromoCode(promoId) {
    return this.makeRequest('/promo-codes/deactivate', {
      method: 'PUT',
      body: JSON.stringify({ promoId }),
    });
  }

  async deletePromoCode(promoId) {
    return this.makeRequest('/promo-codes/delete', {
      method: 'DELETE',
      body: JSON.stringify({ promoId }),
    });
  }


  // ============================================
  // NOTIFICATION MANAGEMENT METHODS
  // ============================================

  /**
   * Send broadcast notification
   * @param {Object} notificationData - Notification data
   * @param {string} notificationData.type - Notification type (info, warning, success, error)
   * @param {string} notificationData.title - Notification title
   * @param {string} notificationData.message - Notification message
   * @param {string} notificationData.recipients - Target recipients (all, active, partners, admins)
   * @returns {Promise<Object>} API response
   */
  async sendBroadcastNotification(notificationData) {
    const { type, title, message, recipients } = notificationData;
    
    // Validate required fields
    if (!type || !title || !message || !recipients) {
      throw new Error('All notification fields (type, title, message, recipients) are required');
    }

    return this.makeRequest('/notifications', {
      method: 'POST',
      body: JSON.stringify({
        type,
        title,
        message,
        recipients
      }),
    });
  }

  /**
   * Send notification (legacy method for backward compatibility)
   * @param {Object} notificationData - Notification data
   * @returns {Promise<Object>} API response
   */
  async sendNotification(notificationData) {
    return this.sendBroadcastNotification(notificationData);
  }

  /**
   * Get notification history with pagination and filters
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 20)
   * @param {Object} filters - Filter options
   * @param {string} filters.type - Filter by notification type
   * @param {string} filters.recipients - Filter by recipients
   * @param {string} filters.status - Filter by status
   * @param {string} filters.dateFrom - Filter from date (YYYY-MM-DD)
   * @param {string} filters.dateTo - Filter to date (YYYY-MM-DD)
   * @returns {Promise<Object>} API response with notification history
   */
  async getNotificationHistory(page = 1, limit = 20, filters = {}) {    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
      )
    });
    
    return this.makeRequest(`/notifications/history?${queryParams}`);
  }

  /**
   * Get notification statistics
   * @param {string} period - Period for statistics (7d, 30d, 90d)
   * @returns {Promise<Object>} API response with notification statistics
   */
  async getNotificationStatistics(period = '30d') {
    return this.makeRequest(`/notifications/statistics?period=${period}`);
  }

  /**
   * Get notification delivery details with pagination
   * @param {number} notificationId - Notification ID
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 50)
   * @returns {Promise<Object>} API response with delivery details
   */
  async getNotificationDeliveryDetails(notificationId, page = 1, limit = 50) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    return this.makeRequest(`/notifications/${notificationId}/delivery-details?${queryParams}`);
  }

  /**
   * Retry failed notification deliveries
   * @param {number} notificationId - Notification ID
   * @returns {Promise<Object>} API response
   */
  async retryFailedDeliveries(notificationId) {
    return this.makeRequest(`/notifications/${notificationId}/retry`, {
      method: 'POST',
    });
  }

  /**
   * Delete notification
   * @param {number} notificationId - Notification ID
   * @returns {Promise<Object>} API response
   */
  async deleteNotification(notificationId) {
    return this.makeRequest(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get notification templates
   * @returns {Promise<Object>} API response with notification templates
   */
  async getNotificationTemplates() {
    return this.makeRequest('/notifications/templates');
  }

  /**
   * Create or update notification template
   * @param {Object} templateData - Template data
   * @param {string} templateData.name - Template name
   * @param {string} templateData.type - Template type
   * @param {string} templateData.title - Template title
   * @param {string} templateData.message - Template message
   * @param {string} [templateData.description] - Template description
   * @returns {Promise<Object>} API response
   */
  async saveNotificationTemplate(templateData) {
    const { name, type, title, message, description } = templateData;
    
    // Validate required fields
    if (!name || !type || !title || !message) {
      throw new Error('Required fields: name, type, title, message');
    }

    return this.makeRequest('/notifications/templates', {
      method: 'POST',
      body: JSON.stringify({
        name,
        type,
        title,
        message,
        description
      }),
    });
  }

  /**
   * Create notification template (alias for saveNotificationTemplate)
   * @param {Object} templateData - Template data
   * @returns {Promise<Object>} API response
   */
  async createNotificationTemplate(templateData) {
    return this.saveNotificationTemplate(templateData);
  }

  /**
   * Update notification template
   * @param {number} templateId - Template ID
   * @param {Object} templateData - Updated template data
   * @returns {Promise<Object>} API response
   */
  async updateNotificationTemplate(templateId, templateData) {
    return this.makeRequest(`/notifications/templates/${templateId}`, {
      method: 'PUT',
      body: JSON.stringify(templateData),
    });
  }

  /**
   * Delete notification template
   * @param {number} templateId - Template ID
   * @returns {Promise<Object>} API response
   */
  async deleteNotificationTemplate(templateId) {
    return this.makeRequest(`/notifications/templates/${templateId}`, {
      method: 'DELETE',
    });
  }

  // ============================================
  // CONVENIENCE METHODS FOR COMMON OPERATIONS
  // ============================================

  /**
   * Send notification using template
   * @param {string} templateName - Template name
   * @param {string} recipients - Target recipients
   * @param {Object} variables - Template variables (optional)
   * @returns {Promise<Object>} API response
   */
  async sendNotificationFromTemplate(templateName, recipients, variables = {}) {
    // First get the template
    const templatesResponse = await this.getNotificationTemplates();
    const template = templatesResponse.data.find(t => t.name === templateName);
    
    if (!template) {
      throw new Error(`Template "${templateName}" not found`);
    }

    // Replace variables in template if provided
    let title = template.title;
    let message = template.message;
    
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      title = title.replace(new RegExp(placeholder, 'g'), value);
      message = message.replace(new RegExp(placeholder, 'g'), value);
    });

    return this.sendBroadcastNotification({
      type: template.type,
      title,
      message,
      recipients
    });
  }

  /**
   * Get notification summary for dashboard
   * @returns {Promise<Object>} Notification summary data
   */
  async getNotificationSummary() {
    try {
      const [statistics, recentNotifications] = await Promise.all([
        this.getNotificationStatistics('7d'),
        this.getNotificationHistory(1, 5)
      ]);

      return {
        statistics: statistics.data,
        recentNotifications: recentNotifications.data.notifications || []
      };
    } catch (error) {
      console.error('Error getting notification summary:', error);
      throw error;
    }
  }

  /**
   * Validate notification data before sending
   * @param {Object} notificationData - Notification data to validate
   * @returns {Object} Validation result
   */
  validateNotificationData(notificationData) {
    const { type, title, message, recipients } = notificationData;
    const errors = [];

    if (!type) errors.push('Type is required');
    if (!['info', 'warning', 'success', 'error'].includes(type)) {
      errors.push('Type must be one of: info, warning, success, error');
    }

    if (!title) errors.push('Title is required');
    if (title && title.length > 255) {
      errors.push('Title must be less than 255 characters');
    }

    if (!message) errors.push('Message is required');
    if (message && message.length > 1000) {
      errors.push('Message must be less than 1000 characters');
    }

    if (!recipients) errors.push('Recipients is required');
    if (!['all', 'active', 'partners', 'admins'].includes(recipients)) {
      errors.push('Recipients must be one of: all, active, partners, admins');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default new AdminApiService();