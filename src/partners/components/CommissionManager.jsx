// import React, { useState, useEffect } from 'react';
// import { 
//   DollarSign, 
//   TrendingUp, 
//   Calendar, 
//   Clock,
//   CheckCircle,
//   FileText,
//   Eye,
//   Download,
//   Filter,
//   Search,
//   ChevronDown,
//   BarChart3,
//   Plane,
//   Users,
//   CreditCard
// } from 'lucide-react';
// import { backendUrl } from '../../config/config';

// // API Configuration
// const API_BASE_URL = `${backendUrl}/api/partners`;

// // Utility function to get auth token
// const getAuthToken = () => {
//   return localStorage.getItem('authToken') || localStorage.getItem('token');
// };

// // Utility function for API calls
// const apiCall = async (endpoint, options = {}) => {
//   const token = getAuthToken();
//   const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//     headers: {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json',
//       ...options.headers,
//     },
//     ...options,
//   });
  
//   if (!response.ok) {
//     throw new Error(`API call failed: ${response.statusText}`);
//   }
  
//   return response.json();
// };

// // Commission Status Badge Component
// const CommissionStatusBadge = ({ status, commissionEarned }) => {
//   const getStatusConfig = () => {
//     if (commissionEarned && commissionEarned > 0) {
//       return {
//         icon: CheckCircle,
//         className: 'bg-green-100 text-green-800',
//         text: 'Earned'
//       };
//     } else if (status === 'confirmed') {
//       return {
//         icon: Clock,
//         className: 'bg-yellow-100 text-yellow-800',
//         text: 'Pending'
//       };
//     } else {
//       return {
//         icon: DollarSign,
//         className: 'bg-gray-100 text-gray-800',
//         text: 'Processing'
//       };
//     }
//   };

//   const config = getStatusConfig();
//   const Icon = config.icon;

//   return (
//     <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${config.className}`}>
//       <Icon className="w-3 h-3 mr-1" />
//       {config.text}
//     </span>
//   );
// };

// // Stats Card Component
// const CommissionStatsCard = ({ icon: Icon, title, value, change, changeType, subtitle }) => (
//   <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
//     <div className="flex items-center justify-between">
//       <div>
//         <p className="text-gray-500 text-sm font-medium">{title}</p>
//         <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
//         {subtitle && (
//           <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
//         )}
//         {change && (
//           <div className={`flex items-center mt-2 text-sm ${
//             changeType === 'positive' ? 'text-green-600' : 'text-red-600'
//           }`}>
//             <TrendingUp className="w-4 h-4 mr-1" />
//             <span>{change}</span>
//           </div>
//         )}
//       </div>
//       <div className="p-3 bg-blue-50 rounded-lg">
//         <Icon className="w-6 h-6 text-blue-600" />
//       </div>
//     </div>
//   </div>
// );

// // Commission Card Component
// const CommissionCard = ({ booking, onViewDetails }) => {
//   const commissionEarned = booking.commission_earned || 0;
//   const commissionRate = booking.commission_rate || 0;
  
//   return (
//     <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
//       <div className="flex items-start justify-between mb-4">
//         <div className="flex items-center space-x-3">
//           <div className="p-2 bg-green-100 rounded-full">
//             <DollarSign className="w-5 h-5 text-green-600" />
//           </div>
//           <div>
//             <h3 className="font-semibold text-gray-900">
//               ${commissionEarned.toFixed(2)}
//             </h3>
//             <p className="text-sm text-gray-500">
//               {booking.booking_reference || 'N/A'}
//             </p>
//           </div>
//         </div>
//         <CommissionStatusBadge 
//           status={booking.status} 
//           commissionEarned={commissionEarned} 
//         />
//       </div>

//       <div className="space-y-2 text-sm text-gray-600 mb-4">
//         <div className="flex items-center justify-between">
//           <span>Commission Rate:</span>
//           <span>{(commissionRate * 100).toFixed(1)}%</span>
//         </div>
//         <div className="flex items-center justify-between">
//           <span>Booking Amount:</span>
//           <span>${(booking.total_amount || 0).toFixed(2)}</span>
//         </div>
//         <div className="flex items-center justify-between">
//           <span>Booking Date:</span>
//           <span>{new Date(booking.created_at).toLocaleDateString()}</span>
//         </div>
//         <div className="flex items-center justify-between">
//           <span>Customer:</span>
//           <span>
//             {booking.passengers && booking.passengers.length > 0 
//               ? `${booking.passengers[0].first_name} ${booking.passengers[0].last_name}`
//               : 'N/A'
//             }
//           </span>
//         </div>
//         <div className="flex items-center justify-between">
//           <span>Booking Status:</span>
//           <span className="capitalize">{booking.status}</span>
//         </div>
//       </div>

//       <div className="flex items-center justify-end space-x-2">
//         <button
//           onClick={() => onViewDetails(booking)}
//           className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
//         >
//           <Eye className="w-4 h-4 mr-1" />
//           View Details
//         </button>
//       </div>
//     </div>
//   );
// };

// // Commission Details Modal
// const CommissionDetailsModal = ({ booking, isOpen, onClose }) => {
//   if (!isOpen || !booking) return null;

//   const commissionEarned = booking.commission_earned || 0;
//   const commissionRate = booking.commission_rate || 0;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex items-center justify-between">
//             <h2 className="text-xl font-semibold text-gray-900">Commission Details</h2>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600"
//             >
//               ✕
//             </button>
//           </div>
//         </div>

//         <div className="p-6 space-y-6">
//           {/* Commission Information */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <h3 className="font-semibold text-gray-900 mb-3">Commission Information</h3>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Amount:</span>
//                   <span className="font-semibold text-lg text-green-600">
//                     ${commissionEarned.toFixed(2)}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Commission Rate:</span>
//                   <span>{(commissionRate * 100).toFixed(1)}%</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Status:</span>
//                   <CommissionStatusBadge 
//                     status={booking.status} 
//                     commissionEarned={commissionEarned} 
//                   />
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Booking Date:</span>
//                   <span>{new Date(booking.created_at).toLocaleString()}</span>
//                 </div>
//               </div>
//             </div>

//             <div>
//               <h3 className="font-semibold text-gray-900 mb-3">Booking Details</h3>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Reference:</span>
//                   <span className="font-mono text-xs">{booking.booking_reference || 'N/A'}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Total Amount:</span>
//                   <span>${(booking.total_amount || 0).toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Booking Status:</span>
//                   <span className="capitalize">{booking.status || 'N/A'}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Customer:</span>
//                   <span>
//                     {booking.passengers && booking.passengers.length > 0 
//                       ? `${booking.passengers[0].first_name} ${booking.passengers[0].last_name}`
//                       : 'N/A'
//                     }
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Flight:</span>
//                   <span>
//                     {booking.flight_offer ? 
//                       `${booking.flight_offer.airline} ${booking.flight_offer.flightNumber}` : 
//                       'N/A'
//                     }
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Commission Calculation Breakdown */}
//           <div>
//             <h3 className="font-semibold text-gray-900 mb-3">Commission Calculation</h3>
//             <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span>Booking Amount:</span>
//                 <span>${(booking.total_amount || 0).toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Commission Rate:</span>
//                 <span>{(commissionRate * 100).toFixed(1)}%</span>
//               </div>
//               <hr className="border-gray-200" />
//               <div className="flex justify-between font-semibold text-green-600">
//                 <span>Commission Earned:</span>
//                 <span>${commissionEarned.toFixed(2)}</span>
//               </div>
//             </div>
//           </div>

//           {/* Flight Information */}
//           {booking.flight_offer && (
//             <div>
//               <h3 className="font-semibold text-gray-900 mb-3">Flight Information</h3>
//               <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span>Flight:</span>
//                   <span>{booking.flight_offer.airline} {booking.flight_offer.flightNumber}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Route:</span>
//                   <span>
//                     {booking.flight_offer.departure?.airport} → {booking.flight_offer.arrival?.airport}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Departure:</span>
//                   <span>{booking.flight_offer.departure?.time}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Arrival:</span>
//                   <span>{booking.flight_offer.arrival?.time}</span>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
//           >
//             Close
//           </button>
//           <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center">
//             <Download className="w-4 h-4 mr-1" />
//             Download Statement
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Commission Summary Component
// const CommissionSummary = ({ summary }) => {
//   if (!summary) return null;

//   return (
//     <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
//       <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission Summary</h3>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="text-center p-4 bg-green-50 rounded-lg">
//           <p className="text-2xl font-bold text-green-600">${(summary.totalCommissions || 0).toFixed(2)}</p>
//           <p className="text-sm text-gray-600">Total Commissions</p>
//         </div>
//         <div className="text-center p-4 bg-blue-50 rounded-lg">
//           <p className="text-2xl font-bold text-blue-600">{summary.totalBookings || 0}</p>
//           <p className="text-sm text-gray-600">Total Bookings</p>
//         </div>
//         <div className="text-center p-4 bg-purple-50 rounded-lg">
//           <p className="text-2xl font-bold text-purple-600">{(summary.averageRate || 0).toFixed(1)}%</p>
//           <p className="text-sm text-gray-600">Avg Commission Rate</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main Commission Manager Component
// const CommissionManager = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [summary, setSummary] = useState(null);
//   const [stats, setStats] = useState({
//     totalEarned: 0,
//     monthlyEarned: 0,
//     totalBookings: 0,
//     averageCommission: 0
//   });
//   const [dateFilter, setDateFilter] = useState({
//     startDate: '',
//     endDate: ''
//   });

//   // Fetch bookings data (which contains commission information)
//   const fetchCommissionData = async () => {
//     try {
//       setLoading(true);
      
//       // Fetch bookings since commission data is embedded in bookings
//       const bookingsResponse = await apiCall('/bookings');
//       console.log("melanie", bookingsResponse);
      
//       let bookingsData = [];
//       if (bookingsResponse) {
//         if (bookingsResponse.success && Array.isArray(bookingsResponse.data)) {
//           bookingsData = bookingsResponse.data;
//         } else if (Array.isArray(bookingsResponse)) {
//           bookingsData = bookingsResponse;
//         }
//       }
      
//       // Filter bookings that have commission earned
//       const commissionBookings = bookingsData.filter(booking => 
//         booking.commission_earned && booking.commission_earned > 0
//       );
      
//       setBookings(commissionBookings);
      
//       // Calculate stats from commission bookings
//       const totalEarned = commissionBookings.reduce((sum, booking) => 
//         sum + (booking.commission_earned || 0), 0
//       );
//       const totalBookings = commissionBookings.length;
//       const averageCommission = totalBookings > 0 ? totalEarned / totalBookings : 0;
      
//       // Monthly calculations
//       const currentMonth = new Date();
//       currentMonth.setDate(1);
//       currentMonth.setHours(0, 0, 0, 0);
      
//       const monthlyCommissionBookings = commissionBookings.filter(booking => 
//         new Date(booking.created_at) >= currentMonth
//       );
//       const monthlyEarned = monthlyCommissionBookings.reduce((sum, booking) => 
//         sum + (booking.commission_earned || 0), 0
//       );
      
//       setStats({
//         totalEarned,
//         monthlyEarned,
//         totalBookings,
//         averageCommission
//       });
      
//       // Set summary data
//       setSummary({
//         totalCommissions: totalEarned,
//         totalBookings: totalBookings,
//         averageRate: commissionBookings.length > 0 ? 
//           (commissionBookings.reduce((sum, booking) => sum + (booking.commission_rate || 0), 0) / commissionBookings.length) * 100 : 0
//       });
      
//     } catch (error) {
//       console.error('Failed to fetch commission data:', error);
      
//       // Set demo data if API fails
//       const demoBookings = [
//         {
//           id: '1',
//           booking_reference: 'ELV-2024-001',
//           commission_earned: 125.50,
//           commission_rate: 0.05,
//           total_amount: 2510,
//           status: 'confirmed',
//           created_at: new Date().toISOString(),
//           passengers: [{ first_name: 'John', last_name: 'Doe' }],
//           flight_offer: {
//             airline: 'AA',
//             flightNumber: 'AA123',
//             departure: { airport: 'JFK', time: '10:00' },
//             arrival: { airport: 'LAX', time: '14:00' }
//           }
//         },
//         {
//           id: '2',
//           booking_reference: 'ELV-2024-002',
//           commission_earned: 89.25,
//           commission_rate: 0.03,
//           total_amount: 2975,
//           status: 'confirmed',
//           created_at: new Date(Date.now() - 86400000).toISOString(),
//           passengers: [{ first_name: 'Jane', last_name: 'Smith' }],
//           flight_offer: {
//             airline: 'UA',
//             flightNumber: 'UA456',
//             departure: { airport: 'ORD', time: '08:00' },
//             arrival: { airport: 'SFO', time: '11:00' }
//           }
//         }
//       ];
      
//       setBookings(demoBookings);
//       setStats({
//         totalEarned: 214.75,
//         monthlyEarned: 214.75,
//         totalBookings: 2,
//         averageCommission: 107.38
//       });
//       setSummary({
//         totalCommissions: 214.75,
//         totalBookings: 2,
//         averageRate: 4.0
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle view commission details
//   const handleViewDetails = (booking) => {
//     setSelectedBooking(booking);
//     setShowModal(true);
//   };

//   // Handle date filter change
//   const handleDateFilterChange = (field, value) => {
//     setDateFilter(prev => ({ ...prev, [field]: value }));
//   };

//   // Apply date filter
//   const applyDateFilter = () => {
//     if (dateFilter.startDate && dateFilter.endDate) {
//       const startDate = new Date(dateFilter.startDate);
//       const endDate = new Date(dateFilter.endDate);
//       endDate.setHours(23, 59, 59, 999); // Include the entire end date
      
//       const filteredBookings = bookings.filter(booking => {
//         const bookingDate = new Date(booking.created_at);
//         return bookingDate >= startDate && bookingDate <= endDate;
//       });
      
//       // Recalculate stats for filtered data
//       const totalEarned = filteredBookings.reduce((sum, booking) => 
//         sum + (booking.commission_earned || 0), 0
//       );
//       const totalBookings = filteredBookings.length;
//       const averageCommission = totalBookings > 0 ? totalEarned / totalBookings : 0;
      
//       setStats(prev => ({
//         ...prev,
//         totalEarned,
//         totalBookings,
//         averageCommission
//       }));
      
//       setSummary({
//         totalCommissions: totalEarned,
//         totalBookings: totalBookings,
//         averageRate: filteredBookings.length > 0 ? 
//           (filteredBookings.reduce((sum, booking) => sum + (booking.commission_rate || 0), 0) / filteredBookings.length) * 100 : 0
//       });
//     } else {
//       // Reset to all data if no filter
//       fetchCommissionData();
//     }
//   };

//   useEffect(() => {
//     fetchCommissionData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-gray-900">Commissions</h2>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {[...Array(4)].map((_, i) => (
//             <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
//               <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//               <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
//               <div className="h-3 bg-gray-200 rounded w-2/3"></div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold text-gray-900">Commission Management</h2>
//         <div className="flex items-center space-x-3">
//           <input
//             type="date"
//             value={dateFilter.startDate}
//             onChange={(e) => handleDateFilterChange('startDate', e.target.value)}
//             className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//           <input
//             type="date"
//             value={dateFilter.endDate}
//             onChange={(e) => handleDateFilterChange('endDate', e.target.value)}
//             className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//           <button
//             onClick={applyDateFilter}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm inline-flex items-center"
//           >
//             <Filter className="w-4 h-4 mr-1" />
//             Filter
//           </button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <CommissionStatsCard
//           icon={DollarSign}
//           title="Total Earned"
//           value={`$${stats.totalEarned.toFixed(2)}`}
//           subtitle="All time commissions"
//         />
//         <CommissionStatsCard
//           icon={TrendingUp}
//           title="This Month"
//           value={`$${stats.monthlyEarned.toFixed(2)}`}
//           subtitle="Current month earnings"
//         />
//         <CommissionStatsCard
//           icon={FileText}
//           title="Commission Bookings"
//           value={stats.totalBookings}
//           subtitle="Bookings with commissions"
//         />
//         <CommissionStatsCard
//           icon={BarChart3}
//           title="Average Commission"
//           value={`$${stats.averageCommission.toFixed(2)}`}
//           subtitle="Per booking average"
//         />
//       </div>

//       {/* Commission Summary */}
//       {summary && <CommissionSummary summary={summary} />}

//       {/* Commissions List */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100">
//         <div className="p-6 border-b border-gray-200">
//           <h3 className="text-lg font-semibold text-gray-900">Commission History</h3>
//         </div>
//         <div className="p-6">
//           {bookings.length === 0 ? (
//             <div className="text-center py-8">
//               <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//               <p className="text-gray-500">No commissions earned yet</p>
//               <p className="text-sm text-gray-400 mt-1">Commissions will appear here when bookings are confirmed</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {bookings.map((booking) => (
//                 <CommissionCard
//                   key={booking.id}
//                   booking={booking}
//                   onViewDetails={handleViewDetails}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Commission Details Modal */}
//       <CommissionDetailsModal
//         booking={selectedBooking}
//         isOpen={showModal}
//         onClose={() => {
//           setShowModal(false);
//           setSelectedBooking(null);
//         }}
//       />
//     </div>
//   );
// };

// export default CommissionManager;

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Clock,
  CheckCircle,
  FileText,
  Eye,
  Download,
  Filter,
  Search,
  ChevronDown,
  BarChart3,
  Plane,
  Users,
  CreditCard
} from 'lucide-react';
import { backendUrl } from '../../config/config';

// API Configuration
const API_BASE_URL = `${backendUrl}/api/partners`;

// Utility function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken') || localStorage.getItem('token');
};

// Utility function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  
  return response.json();
};

// Commission Status Badge Component
const CommissionStatusBadge = ({ status, commissionAmount }) => {
  const getStatusConfig = () => {
    if (status === 'earned' && commissionAmount > 0) {
      return {
        icon: CheckCircle,
        className: 'bg-green-100 text-green-800',
        text: 'Earned'
      };
    } else if (status === 'pending') {
      return {
        icon: Clock,
        className: 'bg-yellow-100 text-yellow-800',
        text: 'Pending'
      };
    } else if (status === 'paid_out') {
      return {
        icon: CheckCircle,
        className: 'bg-blue-100 text-blue-800',
        text: 'Paid Out'
      };
    } else {
      return {
        icon: DollarSign,
        className: 'bg-gray-100 text-gray-800',
        text: 'Processing'
      };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${config.className}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.text}
    </span>
  );
};

// Stats Card Component
const CommissionStatsCard = ({ icon: Icon, title, value, change, changeType, subtitle }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        )}
        {change && (
          <div className={`flex items-center mt-2 text-sm ${
            changeType === 'positive' ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>{change}</span>
          </div>
        )}
      </div>
      <div className="p-3 bg-blue-50 rounded-lg">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
    </div>
  </div>
);

// Commission Card Component
const CommissionCard = ({ commission, onViewDetails }) => {
  const commissionAmount = commission.commission_amount || 0;
  const commissionRate = commission.commission_rate || 0;
  const bookingData = commission.bookings || {};
  const totalAmount = bookingData.total_amount || commission.booking_amount || 0;
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-full">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              ${commissionAmount.toFixed(2)}
            </h3>
            <p className="text-sm text-gray-500">
              {bookingData.booking_reference || commission.booking_id?.slice(0, 8) || 'N/A'}
            </p>
          </div>
        </div>
        <CommissionStatusBadge 
          status={commission.status} 
          commissionAmount={commissionAmount} 
        />
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center justify-between">
          <span>Commission Rate:</span>
          <span>{(commissionRate * 100).toFixed(1)}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Booking Amount:</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Earned Date:</span>
          <span>{new Date(commission.earned_at || commission.created_at).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Booking Date:</span>
          <span>
            {bookingData.created_at 
              ? new Date(bookingData.created_at).toLocaleDateString()
              : 'N/A'
            }
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Status:</span>
          <span className="capitalize">{commission.status}</span>
        </div>
        {commission.paid_out_at && (
          <div className="flex items-center justify-between">
            <span>Paid Out:</span>
            <span>{new Date(commission.paid_out_at).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end space-x-2">
        <button
          onClick={() => onViewDetails(commission)}
          className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
        >
          <Eye className="w-4 h-4 mr-1" />
          View Details
        </button>
      </div>
    </div>
  );
};

// Commission Details Modal
const CommissionDetailsModal = ({ commission, isOpen, onClose }) => {
  if (!isOpen || !commission) return null;

  const commissionAmount = commission.commission_amount || 0;
  const commissionRate = commission.commission_rate || 0;
  const bookingData = commission.bookings || {};
  const totalAmount = bookingData.total_amount || commission.booking_amount || 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Commission Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Commission Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Commission Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount:</span>
                  <span className="font-semibold text-lg text-green-600">
                    ${commissionAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Commission Rate:</span>
                  <span>{(commissionRate * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <CommissionStatusBadge 
                    status={commission.status} 
                    commissionAmount={commissionAmount} 
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Earned Date:</span>
                  <span>{new Date(commission.earned_at || commission.created_at).toLocaleString()}</span>
                </div>
                {commission.paid_out_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Paid Out Date:</span>
                    <span>{new Date(commission.paid_out_at).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Booking Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Reference:</span>
                  <span className="font-mono text-xs">
                    {bookingData.booking_reference || commission.booking_id || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Amount:</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Booking Status:</span>
                  <span className="capitalize">{bookingData.status || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Booking Date:</span>
                  <span>
                    {bookingData.created_at 
                      ? new Date(bookingData.created_at).toLocaleString()
                      : 'N/A'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Commission ID:</span>
                  <span className="font-mono text-xs">{commission.id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Commission Calculation Breakdown */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Commission Calculation</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Booking Amount:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Commission Rate:</span>
                <span>{(commissionRate * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Calculation:</span>
                <span>${totalAmount.toFixed(2)} × {(commissionRate * 100).toFixed(1)}%</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between font-semibold text-green-600">
                <span>Commission Earned:</span>
                <span>${commissionAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {(commission.partner_id || commission.payout_id) && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Additional Information</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                {commission.partner_id && (
                  <div className="flex justify-between">
                    <span>Partner ID:</span>
                    <span className="font-mono text-xs">{commission.partner_id}</span>
                  </div>
                )}
                {commission.payout_id && (
                  <div className="flex justify-between">
                    <span>Payout ID:</span>
                    <span className="font-mono text-xs">{commission.payout_id}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <span>{new Date(commission.updated_at).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center">
            <Download className="w-4 h-4 mr-1" />
            Download Statement
          </button>
        </div>
      </div>
    </div>
  );
};

// Commission Summary Component
const CommissionSummary = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">${(summary.totalCommissions || 0).toFixed(2)}</p>
          <p className="text-sm text-gray-600">Total Commissions</p>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{summary.totalCommissions || 0}</p>
          <p className="text-sm text-gray-600">Commission Records</p>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <p className="text-2xl font-bold text-purple-600">{(summary.averageRate || 0).toFixed(1)}%</p>
          <p className="text-sm text-gray-600">Avg Commission Rate</p>
        </div>
      </div>
    </div>
  );
};

// Main Commission Manager Component
const CommissionManager = () => {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommission, setSelectedCommission] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalEarned: 0,
    monthlyEarned: 0,
    totalCommissions: 0,
    averageCommission: 0,
    availableBalance: 0
  });
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  const fetchCommissionData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching commission data...');
      
      // Fetch commission and balance data
      const [commissionsResponse, balanceResponse] = await Promise.all([
        apiCall('/commissions'),
        apiCall('/balance')
      ]);
      
      console.log('Raw commissions response:', commissionsResponse);
      console.log('Raw balance response:', balanceResponse);
      
      // Handle commissions response
      let commissionsData = [];
      if (commissionsResponse) {
        if (commissionsResponse.success && Array.isArray(commissionsResponse.data)) {
          commissionsData = commissionsResponse.data;
        } else if (Array.isArray(commissionsResponse)) {
          commissionsData = commissionsResponse;
        }
      }
      
      console.log('Processed commissions data:', commissionsData);
      setCommissions(commissionsData);
      
      // Calculate totals from commission data using correct field names
      const totalEarned = commissionsData.reduce((sum, commission) => 
        sum + (commission.commission_amount || 0), 0
      );
      
      // Handle balance response
      let availableBalance = 0;
      let balanceCommissionCount = 0;
      
      if (balanceResponse && balanceResponse.success && balanceResponse.data) {
        availableBalance = balanceResponse.data.available_balance || 0;
        balanceCommissionCount = balanceResponse.data.commission_count || 0;
      }
      
      // Monthly calculations
      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setHours(0, 0, 0, 0);
      
      const monthlyCommissions = commissionsData.filter(commission => 
        new Date(commission.created_at || commission.earned_at).getTime() >= currentMonth.getTime()
      );
      const monthlyEarned = monthlyCommissions.reduce((sum, commission) => 
        sum + (commission.commission_amount || 0), 0
      );
      
      const totalCommissions = commissionsData.length;
      const averageCommission = totalCommissions > 0 ? totalEarned / totalCommissions : 0;
      
      const calculatedStats = {
        totalEarned,
        monthlyEarned,
        totalCommissions,
        averageCommission,
        availableBalance
      };
      
      console.log('Calculated commission stats:', calculatedStats);
      setStats(calculatedStats);
      
      // Set summary data
      setSummary({
        totalCommissions: totalEarned,
        totalRecords: totalCommissions,
        averageRate: commissionsData.length > 0 ? 
          (commissionsData.reduce((sum, commission) => 
            sum + (commission.commission_rate || 0), 0
          ) / commissionsData.length) * 100 : 0
      });
      
    } catch (error) {
      console.error('Failed to fetch commission data:', error);
      setError(error.message);
      
      // Set demo data if API fails
      const demoCommissions = [
        {
          id: '1',
          booking_id: 'demo-booking-1',
          commission_amount: 125.50,
          commission_rate: 0.05,
          status: 'earned',
          created_at: new Date().toISOString(),
          earned_at: new Date().toISOString(),
          bookings: {
            booking_reference: 'ELV-2024-001',
            total_amount: 2510,
            status: 'confirmed',
            created_at: new Date().toISOString()
          }
        }
      ];
      
      setCommissions(demoCommissions);
      setStats({
        totalEarned: 125.50,
        monthlyEarned: 125.50,
        totalCommissions: 1,
        averageCommission: 125.50,
        availableBalance: 125.50
      });
      setSummary({
        totalCommissions: 125.50,
        totalRecords: 1,
        averageRate: 5.0
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle view commission details
  const handleViewDetails = (commission) => {
    setSelectedCommission(commission);
    setShowModal(true);
  };

  // Handle date filter change
  const handleDateFilterChange = (field, value) => {
    setDateFilter(prev => ({ ...prev, [field]: value }));
  };

  // Apply date filter
  const applyDateFilter = () => {
    if (dateFilter.startDate && dateFilter.endDate) {
      const startDate = new Date(dateFilter.startDate);
      const endDate = new Date(dateFilter.endDate);
      endDate.setHours(23, 59, 59, 999);
      
      const filteredCommissions = commissions.filter(commission => {
        const commissionDate = new Date(commission.created_at || commission.earned_at);
        return commissionDate >= startDate && commissionDate <= endDate;
      });
      
      // Recalculate stats for filtered data
      const totalEarned = filteredCommissions.reduce((sum, commission) => 
        sum + (commission.commission_amount || 0), 0
      );
      const totalCommissions = filteredCommissions.length;
      const averageCommission = totalCommissions > 0 ? totalEarned / totalCommissions : 0;
      
      setStats(prev => ({
        ...prev,
        totalEarned,
        totalCommissions,
        averageCommission
      }));
      
      setSummary({
        totalCommissions: totalEarned,
        totalRecords: totalCommissions,
        averageRate: filteredCommissions.length > 0 ? 
          (filteredCommissions.reduce((sum, commission) => 
            sum + (commission.commission_rate || 0), 0
          ) / filteredCommissions.length) * 100 : 0
      });
    } else {
      // Reset to all data if no filter
      fetchCommissionData();
    }
  };

  useEffect(() => {
    fetchCommissionData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Commissions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Commission Management</h2>
        <div className="flex items-center space-x-3">
          <input
            type="date"
            value={dateFilter.startDate}
            onChange={(e) => handleDateFilterChange('startDate', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="date"
            value={dateFilter.endDate}
            onChange={(e) => handleDateFilterChange('endDate', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={applyDateFilter}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm inline-flex items-center"
          >
            <Filter className="w-4 h-4 mr-1" />
            Filter
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CommissionStatsCard
          icon={DollarSign}
          title="Total Earned"
          value={`$${stats.totalEarned.toFixed(2)}`}
          subtitle="All time commissions"
        />
        <CommissionStatsCard
          icon={TrendingUp}
          title="This Month"
          value={`$${stats.monthlyEarned.toFixed(2)}`}
          subtitle="Current month earnings"
        />
        <CommissionStatsCard
          icon={FileText}
          title="Commission Records"
          value={stats.totalCommissions}
          subtitle="Total commission entries"
        />
        <CommissionStatsCard
          icon={BarChart3}
          title="Available Balance"
          value={`$${stats.availableBalance.toFixed(2)}`}
          subtitle="Ready for payout"
        />
      </div>

      {/* Commission Summary */}
      {summary && <CommissionSummary summary={summary} />}

      {/* Commissions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Commission History</h3>
        </div>
        <div className="p-6">
          {commissions.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No commissions earned yet</p>
              <p className="text-sm text-gray-400 mt-1">Commissions will appear here when bookings are confirmed</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {commissions.map((commission) => (
                <CommissionCard
                  key={commission.id}
                  commission={commission}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Commission Details Modal */}
      <CommissionDetailsModal
        commission={selectedCommission}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedCommission(null);
        }}
      />
    </div>
  );
};

export default CommissionManager;