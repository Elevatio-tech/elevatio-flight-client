import React, { useState, useEffect } from 'react';
import {   
  Settings,   
  Activity,  
  Download,
  Loader2,
  AlertCircle
} from 'lucide-react';
import adminApi from '../services/adminApi';

const SystemManagement = () => {
  const [activeSection, setActiveSection] = useState('settings');
  const [systemSettings, setSystemSettings] = useState({
    siteName: '',
    maintenanceMode: false,
    allowRegistration: true,
    maxFileSize: 5,
    sessionTimeout: 30
  });
  const [systemLogs, setSystemLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsPagination, setLogsPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  });

  // const adminApi = adminApiService;

  const sections = [
    { id: 'settings', label: 'System Settings', icon: Settings },
    { id: 'logs', label: 'System Logs', icon: Activity },
    { id: 'backup', label: 'Backup & Restore', icon: Download }
  ];

  // Load system settings on component mount
  useEffect(() => {
    loadSystemSettings();
  }, []);

  // Load system logs when logs section is active
  useEffect(() => {
    if (activeSection === 'logs') {
      loadSystemLogs();
    }
  }, [activeSection, logsPagination.page]);

  const loadSystemSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Checking if admin token exists
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Admin authentication required. Please log in.');
      }
      
      const settings = await adminApi.getSystemSettings();
      
      // Handle case where settings might not exist yet (first time setup)
      if (settings) {
        setSystemSettings({
          siteName: settings.siteName || 'Elevatio',
          maintenanceMode: settings.maintenanceMode || false,
          allowRegistration: settings.allowRegistration !== undefined ? settings.allowRegistration : true,
          maxFileSize: settings.maxFileSize || 5,
          sessionTimeout: settings.sessionTimeout || 30
        });
      }
    } catch (err) {
      console.error('Settings load error:', err);
      
      // Handle specific error cases
      if (err.message.includes('404') || err.message.includes('does not exist')) {
        // Settings table/data don't exist yet, use defaults
        setSystemSettings({
          siteName: 'Elevatio',
          maintenanceMode: false,
          allowRegistration: true,
          maxFileSize: 5,
          sessionTimeout: 30
        });
        setError('⚠️ System settings table not found. Using default values. Please create the database table or save these settings to initialize.');
      } else if (err.message.includes('401') || err.message.includes('403')) {
        setError('Authentication failed. Please log in as admin.');
      } else {
        setError(`Failed to load system settings: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadSystemLogs = async (page = 1) => {
    try {
      setLogsLoading(true);
      setError(null);
      
      const response = await adminApi.getSystemLogs(page, logsPagination.limit);
      setSystemLogs(response.logs || []);
      setLogsPagination(response.pagination || {
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 0
      });
    } catch (err) {
      console.error('Logs load error:', err);
      setError(`Failed to load system logs: ${err.message}`);
      setSystemLogs([]);
    } finally {
      setLogsLoading(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSystemSettings({ ...systemSettings, [key]: value });
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const response = await adminApi.updateSystemSettings(systemSettings);
      
      // Show success message - you can replace this with your preferred notification method
      console.log('Settings saved successfully:', response);
      
      // You might want to show a temporary success message
      setError(null);
      
      // Optionally refresh the settings to ensure they're up to date
      // await loadSystemSettings();
      
    } catch (err) {
      console.error('Settings save error:', err);
      setError(`Failed to save settings: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getLogLevelColor = (level) => {
    switch (level) {
      case 'error': return 'border-red-500 bg-red-50';
      case 'warning': return 'border-yellow-500 bg-yellow-50';
      case 'info': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        <span className="ml-2">Loading system settings...</span>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">System Management</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      <div className="flex space-x-6">
        {/* Section Navigation */}
        <div className="w-64">
          <div className="bg-white rounded-lg shadow p-4">
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={16} className="mr-3" />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Section Content */}
        <div className="flex-1">
          {activeSection === 'settings' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-6">System Settings</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                  <input
                    type="text"
                    value={systemSettings.siteName || ''}
                    onChange={(e) => handleSettingChange('siteName', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter site name"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Maintenance Mode</label>
                    <p className="text-sm text-gray-500">Put the site in maintenance mode</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={systemSettings.maintenanceMode || false}
                      onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Allow User Registration</label>
                    <p className="text-sm text-gray-500">Allow new users to register</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={systemSettings.allowRegistration || false}
                      onChange={(e) => handleSettingChange('allowRegistration', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max File Size (MB)</label>
                  <input
                    type="number"
                    value={systemSettings.maxFileSize || 5}
                    onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value) || 5)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    value={systemSettings.sessionTimeout || 30}
                    onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value) || 30)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="5"
                    max="480"
                  />
                </div>

                <button
                  onClick={saveSettings}
                  disabled={saving}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 flex items-center"
                >
                  {saving && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          )}

          {activeSection === 'logs' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">System Logs</h3>
                <button
                  onClick={() => loadSystemLogs(1)}
                  className="text-blue-500 hover:text-blue-600 flex items-center"
                >
                  <Activity size={16} className="mr-1" />
                  Refresh
                </button>
              </div>
              
              {logsLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
                  <span className="ml-2">Loading logs...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {systemLogs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No logs found
                    </div>
                  ) : (
                    systemLogs.map((log, index) => (
                      <div key={log.id || index} className={`flex items-start p-4 border-l-4 rounded ${getLogLevelColor(log.level)}`}>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">{log.action || log.message}</p>
                            <span className="text-xs text-gray-500">
                              {formatDate(log.created_at)}
                            </span>
                          </div>
                          {log.details && (
                            <p className="text-xs text-gray-600 mt-1">{log.details}</p>
                          )}
                          {log.user_id && (
                            <p className="text-xs text-gray-600 mt-1">User ID: {log.user_id}</p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  
                  {logsPagination.totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <p className="text-sm text-gray-600">
                        Showing {((logsPagination.page - 1) * logsPagination.limit) + 1} to {Math.min(logsPagination.page * logsPagination.limit, logsPagination.total)} of {logsPagination.total} logs
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => loadSystemLogs(logsPagination.page - 1)}
                          disabled={logsPagination.page === 1}
                          className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => loadSystemLogs(logsPagination.page + 1)}
                          disabled={logsPagination.page === logsPagination.totalPages}
                          className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeSection === 'backup' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-6">Backup & Restore</h3>
              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Download className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-lg font-medium text-gray-900 mb-2">Create System Backup</p>
                  <p className="text-gray-600 mb-4">Download a complete backup of your system data</p>
                  <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 flex items-center mx-auto">
                    <Download size={16} className="mr-2" />
                    Create Backup
                  </button>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">Recent Backups</h4>
                  <div className="space-y-3">
                    <div className="text-center py-4 text-gray-500">
                      Backup functionality coming soon
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemManagement;