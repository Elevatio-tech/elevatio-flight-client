import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  Calendar, 
  FileText, 
  DollarSign,
  Download,
  Eye,
  TrendingUp,
  BarChart3,
  AlertCircle
} from 'lucide-react';
import adminApi from '../services/adminApi';

const ReportsManagement = () => {
  const [selectedReport, setSelectedReport] = useState('bookings');
 const [dateRange, setDateRange] = useState(() => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0]
  };
});
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);

  const reportTypes = [
    { id: 'bookings', label: 'Bookings Report', icon: Calendar },
    { id: 'revenue', label: 'Revenue Report', icon: DollarSign },
    { id: 'partners', label: 'Partners Report', icon: Building2 },
    { id: 'users', label: 'Users Report', icon: Users }
  ];

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await adminApi.generateReport(selectedReport, dateRange);
      setReportData(data);
      console.log("adebisi", data)
    } catch (error) {
      console.error('Failed to generate report:', error);
      setError('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NG');
  };

  const exportReport = () => {
    if (!reportData) return;
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedReport}_report_${dateRange.startDate}_to_${dateRange.endDate}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderSummaryCards = () => {
    if (!reportData?.summary) return null;

    const { summary } = reportData;

    switch (selectedReport) {
      case 'bookings':
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Bookings</p>
                  <p className="text-2xl font-bold text-blue-900">{summary.totalBookings || 0}</p>
                </div>
                <Calendar className="text-blue-500" size={24} />
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Confirmed</p>
                  <p className="text-2xl font-bold text-green-900">{summary.confirmedBookings || 0}</p>
                </div>
                <TrendingUp className="text-green-500" size={24} />
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Pending</p>
                  <p className="text-2xl font-bold text-yellow-900">{summary.pendingBookings || 0}</p>
                </div>
                <AlertCircle className="text-yellow-500" size={24} />
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Total Value</p>
                  <p className="text-2xl font-bold text-purple-900">{formatCurrency(summary.totalValue || 0)}</p>
                </div>
                <DollarSign className="text-purple-500" size={24} />
              </div>
            </div>
          </div>
        );

      case 'revenue':
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-900">{formatCurrency(summary.totalValue || 0)}</p>
                </div>
                <DollarSign className="text-green-500" size={24} />
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Commissions</p>
                  <p className="text-2xl font-bold text-blue-900">{formatCurrency(summary.totalCommissions || 0)}</p>
                </div>
                <Building2 className="text-blue-500" size={24} />
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Confirmed Value</p>
                  <p className="text-2xl font-bold text-purple-900">{formatCurrency(summary.confirmedValue || 0)}</p>
                </div>
                <TrendingUp className="text-purple-500" size={24} />
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Avg Booking</p>
                  <p className="text-2xl font-bold text-orange-900">{formatCurrency(summary.averageBookingValue || 0)}</p>
                </div>
                <BarChart3 className="text-orange-500" size={24} />
              </div>
            </div>
          </div>
        );

      case 'partners':
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Partner Bookings</p>
                  <p className="text-2xl font-bold text-blue-900">{summary.partnerBookings || 0}</p>
                </div>
                <Building2 className="text-blue-500" size={24} />
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Direct Bookings</p>
                  <p className="text-2xl font-bold text-green-900">{summary.directBookings || 0}</p>
                </div>
                <TrendingUp className="text-green-500" size={24} />
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Total Commissions</p>
                  <p className="text-2xl font-bold text-purple-900">{formatCurrency(summary.totalCommissions || 0)}</p>
                </div>
                <DollarSign className="text-purple-500" size={24} />
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">One Way Trips</p>
                  <p className="text-2xl font-bold text-orange-900">{summary.oneWayBookings || 0}</p>
                </div>
                <BarChart3 className="text-orange-500" size={24} />
              </div>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Bookings</p>
                  <p className="text-2xl font-bold text-blue-900">{summary.totalBookings || 0}</p>
                </div>
                <Users className="text-blue-500" size={24} />
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Confirmed</p>
                  <p className="text-2xl font-bold text-green-900">{summary.confirmedBookings || 0}</p>
                </div>
                <TrendingUp className="text-green-500" size={24} />
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Pending</p>
                  <p className="text-2xl font-bold text-purple-900">{summary.pendingBookings || 0}</p>
                </div>
                <Eye className="text-purple-500" size={24} />
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Total Value</p>
                  <p className="text-2xl font-bold text-orange-900">{formatCurrency(summary.totalValue || 0)}</p>
                </div>
                <DollarSign className="text-orange-500" size={24} />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderDataTable = () => {
    if (!reportData?.data) return null;

    const data = reportData.data.slice(0, 10); // Show first 10 rows

    switch (selectedReport) {
      case 'bookings':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Passenger</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Partner</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((booking, index) => (
                  <tr key={booking.id || index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{booking.booking_reference}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {booking.users?.email || booking.customer_name || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {booking.passenger_names || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(booking.total_amount)}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        booking.status === 'pending_payment' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 capitalize">{booking.booking_type}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {booking.partners?.business_name || booking.partner_name || 'Direct'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatCurrency(booking.commission_earned || 0)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{formatDate(booking.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'revenue':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Partner</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.booking_reference}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{formatDate(item.created_at)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(item.total_amount)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.commission_earned || 0)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.discount_amount || 0)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.partners?.business_name || item.partner_name || 'Direct'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        item.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'partners':
        // For partners view, we'll aggregate data by partner
        const partnerData = data.reduce((acc, booking) => {
          const partnerName = booking.partners?.business_name || booking.partner_name || 'Direct';
          const partnerEmail = booking.partners?.email || 'N/A';
          
          if (!acc[partnerName]) {
            acc[partnerName] = {
              business_name: partnerName,
              email: partnerEmail,
              bookings: 0,
              revenue: 0,
              commissions: 0,
              commission_rate: booking.partners?.commission_rate || 0
            };
          }
          
          acc[partnerName].bookings += 1;
          acc[partnerName].revenue += booking.total_amount;
          acc[partnerName].commissions += booking.commission_earned || 0;
          
          return acc;
        }, {});

        const partnersArray = Object.values(partnerData);

        return (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bookings</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commissions</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {partnersArray.map((partner, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{partner.business_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{partner.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{partner.bookings}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(partner.revenue)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(partner.commissions)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{(partner.commission_rate * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'users':
        // For users view, we'll aggregate data by user
        const userData = data.reduce((acc, booking) => {
          const userEmail = booking.users?.email || 'N/A';
          
          if (!acc[userEmail]) {
            acc[userEmail] = {
              email: userEmail,
              first_name: booking.users?.first_name || '',
              last_name: booking.users?.last_name || '',
              phone: booking.users?.phone || 'N/A',
              status: 'active',
              email_verified: true,
              wallet_balance: 0,
              bookings: [],
              created_at: booking.created_at
            };
          }
          
          acc[userEmail].bookings.push(booking);
          
          return acc;
        }, {});

        const usersArray = Object.values(userData);

        return (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verified</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Bookings</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {usersArray.map((user, index) => {
                  const totalSpent = user.bookings.reduce((sum, booking) => sum + booking.total_amount, 0);
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {`${user.first_name} ${user.last_name}`.trim() || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{user.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{user.phone}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.email_verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.email_verified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{user.bookings.length}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(totalSpent)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{formatDate(user.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Reports Management</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Selection */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Select Report Type</h3>
          <div className="space-y-2">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              return (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`w-full flex items-center p-3 rounded-lg border-2 transition-colors ${
                    selectedReport === report.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon size={20} className="mr-3" />
                  {report.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Range & Generate */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Report Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={generateReport}
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <FileText size={16} className="mr-2" />
              )}
              Generate Report
            </button>
          </div>
        </div>

        {/* Report Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Report Actions</h3>
          {reportData ? (
            <div className="space-y-3">
              <div className="text-center text-green-600 py-4">
                <FileText size={48} className="mx-auto mb-2" />
                <p className="font-medium">Report Generated Successfully</p>
                <p className="text-sm text-gray-500">
                  {formatDate(reportData.period.startDate)} to {formatDate(reportData.period.endDate)}
                </p>
              </div>
              <button
                onClick={exportReport}
                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 flex items-center justify-center"
              >
                <Download size={16} className="mr-2" />
                Export Report
              </button>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              <FileText size={48} className="mx-auto mb-2" />
              <p>Generate a report to see actions</p>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="text-red-500 mr-2" size={20} />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Report Display */}
      {reportData && (
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">
                {reportTypes.find(r => r.id === selectedReport)?.label}
              </h3>
              <div className="text-sm text-gray-500">
                {formatDate(reportData.period.startDate)} - {formatDate(reportData.period.endDate)}
              </div>
            </div>

            {/* Summary Cards */}
            {renderSummaryCards()}

            {/* Data Table */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-4">Detailed Data</h4>
              {renderDataTable()}
              
              {reportData.data && reportData.data.length > 10 && (
                <div className="mt-4 text-center text-gray-500 text-sm">
                  Showing first 10 results out of {reportData.data.length} total records
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsManagement;