// import React, { useState, useEffect } from 'react';
// import { 
//   CreditCard, 
//   DollarSign, 
//   Calendar, 
//   Clock,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   Plus,
//   Eye,
//   Download,
//   TrendingUp
// } from 'lucide-react';
// import { backendUrl } from '../../config/config';

// // API Configuration - Using environment or default localhost
// const API_BASE_URL = `${backendUrl}/api/partners`;

// // Utility function to get auth token
// const getAuthToken = () => {
//   return localStorage.getItem('authToken') || localStorage.getItem('token');
// };

// // Utility function for API calls
// const apiCall = async (endpoint, options = {}) => {
//   const token = getAuthToken();
  
//   if (!token) {
//     throw new Error('No authentication token found');
//   }

//   try {
//     const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//         ...options.headers,
//       },
//       ...options,
//     });

//     console.log(`API Call: ${endpoint}`, response.status);
    
//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error(`API Error ${response.status}:`, errorText);
//       throw new Error(`API call failed: ${response.status} ${response.statusText}`);
//     }
    
//     const data = await response.json();
//     console.log(`API Response for ${endpoint}:`, data);
//     return data;
//   } catch (error) {
//     console.error(`API call error for ${endpoint}:`, error);
//     throw error;
//   }
// };

// // Payout Status Badge Component
// const PayoutStatusBadge = ({ status }) => {
//   const getStatusConfig = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'completed':
//         return {
//           icon: CheckCircle,
//           className: 'bg-green-100 text-green-800',
//           text: 'Completed'
//         };
//       case 'pending':
//         return {
//           icon: Clock,
//           className: 'bg-yellow-100 text-yellow-800',
//           text: 'Pending'
//         };
//       case 'processing':
//         return {
//           icon: AlertCircle,
//           className: 'bg-blue-100 text-blue-800',
//           text: 'Processing'
//         };
//       case 'failed':
//       case 'cancelled':
//         return {
//           icon: XCircle,
//           className: 'bg-red-100 text-red-800',
//           text: status === 'failed' ? 'Failed' : 'Cancelled'
//         };
//       default:
//         return {
//           icon: AlertCircle,
//           className: 'bg-gray-100 text-gray-800',
//           text: 'Unknown'
//         };
//     }
//   };

//   const config = getStatusConfig(status);
//   const Icon = config.icon;

//   return (
//     <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${config.className}`}>
//       <Icon className="w-3 h-3 mr-1" />
//       {config.text}
//     </span>
//   );
// };

// // Stats Card Component
// const PayoutStatsCard = ({ icon: Icon, title, value, change, changeType }) => (
//   <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
//     <div className="flex items-center justify-between">
//       <div>
//         <p className="text-gray-500 text-sm font-medium">{title}</p>
//         <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
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

// // Payout Card Component
// const PayoutCard = ({ payout, onViewDetails }) => {
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       return new Date(dateString).toLocaleDateString();
//     } catch (error) {
//       return 'Invalid Date';
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
//       <div className="flex items-start justify-between mb-4">
//         <div className="flex items-center space-x-3">
//           <div className="p-2 bg-green-100 rounded-full">
//             <CreditCard className="w-5 h-5 text-green-600" />
//           </div>
//           <div>
//             <h3 className="font-semibold text-gray-900">
//               ${Number(payout.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//             </h3>
//             <p className="text-sm text-gray-500">
//               Requested: {formatDate(payout.requested_at)}
//             </p>
//           </div>
//         </div>
//         <PayoutStatusBadge status={payout.status} />
//       </div>

//       <div className="space-y-2 text-sm text-gray-600 mb-4">
//         {payout.processed_at && (
//           <div className="flex items-center justify-between">
//             <span>Processed:</span>
//             <span>{formatDate(payout.processed_at)}</span>
//           </div>
//         )}
//         {payout.commission_count && (
//           <div className="flex items-center justify-between">
//             <span>Commissions:</span>
//             <span>{payout.commission_count} items</span>
//           </div>
//         )}
//         {payout.id && (
//           <div className="flex items-center justify-between">
//             <span>ID:</span>
//             <span className="font-mono text-xs">#{payout.id.toString().slice(-8)}</span>
//           </div>
//         )}
//       </div>

//       <div className="flex items-center justify-end space-x-2">
//         <button
//           onClick={() => onViewDetails(payout)}
//           className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
//         >
//           <Eye className="w-4 h-4 mr-1" />
//           View Details
//         </button>
//       </div>
//     </div>
//   );
// };

// // Payout Details Modal Component
// const PayoutDetailsModal = ({ payout, isOpen, onClose }) => {
//   if (!isOpen || !payout) return null;

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       return new Date(dateString).toLocaleString();
//     } catch (error) {
//       return 'Invalid Date';
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex items-center justify-between">
//             <h2 className="text-xl font-semibold text-gray-900">Payout Details</h2>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600 text-xl font-bold"
//             >
//               ✕
//             </button>
//           </div>
//         </div>

//         <div className="p-6 space-y-6">
//           {/* Basic Information */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <h3 className="font-semibold text-gray-900 mb-3">Payout Information</h3>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Amount:</span>
//                   <span className="font-semibold text-lg">${Number(payout.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Status:</span>
//                   <PayoutStatusBadge status={payout.status} />
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Requested:</span>
//                   <span>{formatDate(payout.requested_at)}</span>
//                 </div>
//                 {payout.processed_at && (
//                   <div className="flex justify-between">
//                     <span className="text-gray-500">Processed:</span>
//                     <span>{formatDate(payout.processed_at)}</span>
//                   </div>
//                 )}
//                 {payout.processing_fee && (
//                   <div className="flex justify-between">
//                     <span className="text-gray-500">Processing Fee:</span>
//                     <span>${Number(payout.processing_fee).toFixed(2)}</span>
//                   </div>
//                 )}
//                 {payout.net_amount && (
//                   <div className="flex justify-between">
//                     <span className="text-gray-500">Net Amount:</span>
//                     <span className="font-semibold">${Number(payout.net_amount).toFixed(2)}</span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div>
//               <h3 className="font-semibold text-gray-900 mb-3">Commission Details</h3>
//               <div className="space-y-2 text-sm">
//                 {payout.commission_count && (
//                   <div className="flex justify-between">
//                     <span className="text-gray-500">Commissions:</span>
//                     <span>{payout.commission_count} items</span>
//                   </div>
//                 )}
//                 {payout.commission_details && payout.commission_details.length > 0 && (
//                   <div className="mt-3">
//                     <span className="text-gray-500 block mb-2">Commission Breakdown:</span>
//                     <div className="bg-gray-50 p-3 rounded max-h-32 overflow-y-auto">
//                       {payout.commission_details.map((commission, index) => (
//                         <div key={commission.id || index} className="flex justify-between text-xs mb-1">
//                           <span>{commission.booking_reference || `Commission ${index + 1}`}</span>
//                           <span>${Number(commission.commission_amount || commission.amount || 0).toFixed(2)}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//                 {payout.notes && (
//                   <div className="mt-3">
//                     <span className="text-gray-500 block mb-1">Notes:</span>
//                     <p className="text-gray-700 text-sm bg-gray-50 p-2 rounded">{payout.notes}</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Timeline */}
//           <div>
//             <h3 className="font-semibold text-gray-900 mb-3">Timeline</h3>
//             <div className="space-y-3">
//               <div className="flex items-start space-x-3">
//                 <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium text-gray-900">Payout Requested</p>
//                   <p className="text-xs text-gray-500">{formatDate(payout.requested_at)}</p>
//                 </div>
//               </div>
//               {payout.status !== 'pending' && (
//                 <div className="flex items-start space-x-3">
//                   <div className={`w-2 h-2 rounded-full mt-2 ${
//                     payout.status === 'completed' ? 'bg-green-500' : 
//                     payout.status === 'processing' ? 'bg-yellow-500' : 'bg-red-500'
//                   }`}></div>
//                   <div className="flex-1">
//                     <p className="text-sm font-medium text-gray-900 capitalize">{payout.status}</p>
//                     {payout.processed_at && (
//                       <p className="text-xs text-gray-500">{formatDate(payout.processed_at)}</p>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
//           >
//             Close
//           </button>
//           {payout.status === 'completed' && (
//             <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center">
//               <Download className="w-4 h-4 mr-1" />
//               Download Receipt
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // New Payout Request Component - FIXED
// const NewPayoutRequest = ({ availableBalance, onRequestPayout, onCancel }) => {
//   const [amount, setAmount] = useState('');
//   const [requesting, setRequesting] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const payoutAmount = parseFloat(amount);
    
//     if (!amount || payoutAmount <= 0) {
//       alert('Please enter a valid amount');
//       return;
//     }
//     if (payoutAmount > availableBalance) {
//       alert('Amount exceeds available balance');
//       return;
//     }
//     if (payoutAmount < 10) {
//       alert('Minimum payout amount is $10');
//       return;
//     }

//     setRequesting(true);
//     try {
//       await onRequestPayout(payoutAmount);
//       setAmount('');
//       onCancel();
//     } catch (error) {
//       console.error('Payout request error:', error);
//       alert('Failed to submit payout request: ' + error.message);
//     } finally {
//       setRequesting(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg border border-gray-200 p-6">
//       <h3 className="text-lg font-semibold text-gray-900 mb-4">Request New Payout</h3>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <div className="block text-sm font-medium text-gray-700 mb-2">
//             Available Balance: ${Number(availableBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//           </div>
//           <input
//             type="number"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             placeholder="Enter amount (minimum $10)"
//             min="10"
//             max={availableBalance}
//             step="0.01"
//             disabled={requesting}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
//             required
//           />
//         </div>
        
//         <div className="flex justify-end space-x-3">
//           <button
//             type="button"
//             onClick={onCancel}
//             disabled={requesting}
//             className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={requesting || !amount || parseFloat(amount) < 10 || parseFloat(amount) > availableBalance}
//             className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 inline-flex items-center"
//           >
//             {requesting && (
//               <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//             )}
//             {requesting ? 'Submitting...' : 'Request Payout'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// // Main PayoutManager Component
// const PayoutManager = () => {
//   const [payouts, setPayouts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedPayout, setSelectedPayout] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [showNewPayout, setShowNewPayout] = useState(false);
//   const [availableBalance, setAvailableBalance] = useState(0);
//   const [stats, setStats] = useState({
//     totalPaid: 0,
//     pendingAmount: 0,
//     completedPayouts: 0,
//     averagePayout: 0
//   });

//   // Fetch payouts data
//   const fetchPayouts = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       console.log('Fetching payouts and balance...');
      
//       // Make API calls with proper error handling
//       const [payoutsResponse, balanceResponse] = await Promise.all([
//         apiCall('/payouts'),
//         apiCall('/balance')
//       ]);
      
//       console.log('Raw payouts response:', payoutsResponse);
//       console.log('Raw balance response:', balanceResponse);
      
//       // Handle payouts response
//       let payoutsData = [];
//       if (payoutsResponse) {
//         if (payoutsResponse.success && Array.isArray(payoutsResponse.data)) {
//           payoutsData = payoutsResponse.data;
//         } else if (Array.isArray(payoutsResponse)) {
//           payoutsData = payoutsResponse;
//         } else if (payoutsResponse.data && Array.isArray(payoutsResponse.data)) {
//           payoutsData = payoutsResponse.data;
//         }
//       }
      
//       console.log('Processed payouts data:', payoutsData);
//       setPayouts(payoutsData);
      
//       // Handle balance response
//       let balance = 0;
//       if (balanceResponse) {
//         if (balanceResponse.success && balanceResponse.data) {
//           balance = balanceResponse.data.available_balance || balanceResponse.data.available || 0;
//         } else if (balanceResponse.data) {
//           balance = balanceResponse.data.available_balance || balanceResponse.data.available || 0;
//         } else {
//           balance = balanceResponse.available_balance || balanceResponse.available || 0;
//         }
//       }
      
//       console.log('Processed available balance:', balance);
//       setAvailableBalance(Number(balance));
      
//       // Calculate stats
//       const validPayouts = Array.isArray(payoutsData) ? payoutsData : [];
      
//       const totalPaid = validPayouts
//         .filter(p => p.status === 'completed')
//         .reduce((sum, p) => sum + Number(p.amount || 0), 0);
        
//       const pendingAmount = validPayouts
//         .filter(p => p.status === 'pending')
//         .reduce((sum, p) => sum + Number(p.amount || 0), 0);
        
//       const completedPayouts = validPayouts.filter(p => p.status === 'completed').length;
//       const averagePayout = completedPayouts > 0 ? totalPaid / completedPayouts : 0;
      
//       const calculatedStats = {
//         totalPaid,
//         pendingAmount,
//         completedPayouts,
//         averagePayout
//       };
      
//       console.log('Calculated stats:', calculatedStats);
//       setStats(calculatedStats);
      
//     } catch (error) {
//       console.error('Failed to fetch payouts:', error);
//       setError(error.message);
//       // Set empty array as fallback to prevent map/filter errors
//       setPayouts([]);
//       setAvailableBalance(0);
//       setStats({
//         totalPaid: 0,
//         pendingAmount: 0,
//         completedPayouts: 0,
//         averagePayout: 0
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle new payout request
//   const handleRequestPayout = async (amount) => {
//     try {
//       console.log('Requesting payout for amount:', amount);
      
//       const response = await apiCall('/payout', {
//         method: 'POST',
//         body: JSON.stringify({ amount }),
//       });
      
//       console.log('Payout request response:', response);
      
//       // Check if the response indicates success
//       if (response.success || response.message) {
//         // Refresh data after successful payout
//         await fetchPayouts();
//         alert('Payout request submitted successfully!');
//       } else {
//         throw new Error(response.error || 'Payout request failed');
//       }
//     } catch (error) {
//       console.error('Payout request failed:', error);
//       throw error;
//     }
//   };

//   // Handle view payout details
//   const handleViewDetails = (payout) => {
//     console.log('Viewing details for payout:', payout);
//     setSelectedPayout(payout);
//     setShowModal(true);
//   };

//   useEffect(() => {
//     fetchPayouts();
//   }, []);

//   if (loading) {
//     return (
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-gray-900">Payouts</h2>
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
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
//           <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
//           <div className="h-32 bg-gray-200 rounded"></div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-gray-900">Payouts</h2>
//         </div>
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6">
//           <div className="flex items-center space-x-3">
//             <XCircle className="w-8 h-8 text-red-600" />
//             <div>
//               <h3 className="text-lg font-semibold text-red-900">Error Loading Payouts</h3>
//               <p className="text-red-700 mt-1">{error}</p>
//               <button
//                 onClick={fetchPayouts}
//                 className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//               >
//                 Try Again
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold text-gray-900">Payouts</h2>
//         <button
//           onClick={() => setShowNewPayout(true)}
//           className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//         >
//           <Plus className="w-4 h-4 mr-2" />
//           Request Payout
//         </button>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <PayoutStatsCard
//           icon={DollarSign}
//           title="Total Paid Out"
//           value={`$${Number(stats.totalPaid).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
//         />
//         <PayoutStatsCard
//           icon={Clock}
//           title="Pending Amount"
//           value={`$${Number(stats.pendingAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
//         />
//         <PayoutStatsCard
//           icon={CheckCircle}
//           title="Completed Payouts"
//           value={stats.completedPayouts}
//         />
//         <PayoutStatsCard
//           icon={TrendingUp}
//           title="Available Balance"
//           value={`$${Number(availableBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
//         />
//       </div>

//       {/* New Payout Request Form */}
//       {showNewPayout && (
//         <NewPayoutRequest
//           availableBalance={availableBalance}
//           onRequestPayout={handleRequestPayout}
//           onCancel={() => setShowNewPayout(false)}
//         />
//       )}

//       {/* Payouts List */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100">
//         <div className="p-6 border-b border-gray-200">
//           <h3 className="text-lg font-semibold text-gray-900">Payout History</h3>
//         </div>
//         <div className="p-6">
//           {payouts.length === 0 ? (
//             <div className="text-center py-8">
//               <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//               <p className="text-gray-500">No payouts yet</p>
//               <p className="text-sm text-gray-400 mt-1">Request your first payout to get started</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {payouts.map((payout) => (
//                 <PayoutCard
//                   key={payout.id}
//                   payout={payout}
//                   onViewDetails={handleViewDetails}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Payout Details Modal */}
//       <PayoutDetailsModal
//         payout={selectedPayout}
//         isOpen={showModal}
//         onClose={() => {
//           setShowModal(false);
//           setSelectedPayout(null);
//         }}
//       />
//     </div>
//   );
// };

// export default PayoutManager;


import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Eye,
  Download,
  TrendingUp,
  User,
  Building,
  Mail,
  Receipt,
  Hash,
  Banknote
} from 'lucide-react';
import { backendUrl } from '../../config/config';

// API Configuration - Using environment or default localhost
const API_BASE_URL = `${backendUrl}/api/partners`;

// Utility function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken') || localStorage.getItem('token');
};

// Utility function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    console.log(`API Call: ${endpoint}`, response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error ${response.status}:`, errorText);
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`API Response for ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`API call error for ${endpoint}:`, error);
    throw error;
  }
};

// Payout Status Badge Component
const PayoutStatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return {
          icon: CheckCircle,
          className: 'bg-green-100 text-green-800',
          text: 'Completed'
        };
      case 'pending':
        return {
          icon: Clock,
          className: 'bg-yellow-100 text-yellow-800',
          text: 'Pending'
        };
      case 'processing':
        return {
          icon: AlertCircle,
          className: 'bg-blue-100 text-blue-800',
          text: 'Processing'
        };
      case 'failed':
      case 'cancelled':
        return {
          icon: XCircle,
          className: 'bg-red-100 text-red-800',
          text: status === 'failed' ? 'Failed' : 'Cancelled'
        };
      default:
        return {
          icon: AlertCircle,
          className: 'bg-gray-100 text-gray-800',
          text: 'Unknown'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${config.className}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.text}
    </span>
  );
};

// Stats Card Component
const PayoutStatsCard = ({ icon: Icon, title, value, change, changeType, subtitle }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
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

// Enhanced Payout Card Component
const PayoutCard = ({ payout, onViewDetails }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'bank_transfer':
        return <Building className="w-4 h-4" />;
      case 'paypal':
        return <Mail className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-full">
            <CreditCard className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              ${Number(payout.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <p className="text-sm text-gray-500">
              Requested: {formatDate(payout.requested_at)}
            </p>
            {payout.net_amount && (
              <p className="text-xs text-green-600 font-medium">
                Net: ${Number(payout.net_amount).toFixed(2)}
              </p>
            )}
          </div>
        </div>
        <PayoutStatusBadge status={payout.status} />
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        {payout.processed_at && (
          <div className="flex items-center justify-between">
            <span>Processed:</span>
            <span>{formatDate(payout.processed_at)}</span>
          </div>
        )}
        
        {payout.commission_count && (
          <div className="flex items-center justify-between">
            <span>Commissions:</span>
            <span className="font-medium">{payout.commission_count} items</span>
          </div>
        )}

        {payout.commission_breakdown && (
          <div className="flex items-center justify-between">
            <span>Total Commission:</span>
            <span className="font-medium text-green-600">
              ${Number(payout.commission_breakdown.total_commission || 0).toFixed(2)}
            </span>
          </div>
        )}

        {payout.processing_fee && (
          <div className="flex items-center justify-between">
            <span>Processing Fee:</span>
            <span className="text-red-600">-${Number(payout.processing_fee).toFixed(2)}</span>
          </div>
        )}

        {payout.payment_method && (
          <div className="flex items-center justify-between">
            <span>Method:</span>
            <div className="flex items-center space-x-1">
              {getPaymentMethodIcon(payout.payment_method)}
              <span className="capitalize">{payout.payment_method.replace('_', ' ')}</span>
            </div>
          </div>
        )}

        {payout.partners && (
          <div className="flex items-center justify-between">
            <span>Business:</span>
            <span className="font-medium">{payout.partners.business_name}</span>
          </div>
        )}

        {payout.id && (
          <div className="flex items-center justify-between">
            <span>ID:</span>
            <span className="font-mono text-xs">#{payout.id.toString().slice(-8)}</span>
          </div>
        )}
      </div>

      {/* Commission Preview */}
      {payout.commission_details && payout.commission_details.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Commission Breakdown</h4>
          <div className="space-y-1">
            {payout.commission_details.slice(0, 2).map((commission, index) => (
              <div key={commission.id || index} className="flex justify-between text-xs">
                <span className="text-gray-600">
                  {commission.bookings?.booking_reference || `Booking ${index + 1}`}
                </span>
                <span className="font-medium">
                  ${Number(commission.commission_amount || 0).toFixed(2)}
                </span>
              </div>
            ))}
            {payout.commission_details.length > 2 && (
              <div className="text-xs text-gray-500 italic">
                +{payout.commission_details.length - 2} more commissions
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-end space-x-2">
        <button
          onClick={() => onViewDetails(payout)}
          className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
        >
          <Eye className="w-4 h-4 mr-1" />
          View Details
        </button>
      </div>
    </div>
  );
};

// Enhanced Payout Details Modal Component
const PayoutDetailsModal = ({ payout, isOpen, onClose }) => {
  if (!isOpen || !payout) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Payout Details</h2>
              <p className="text-sm text-gray-500 mt-1">
                ID: #{payout.id?.toString().slice(-12)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Enhanced Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Payout Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500">Gross Amount:</span>
                  <span className="font-semibold text-lg">${Number(payout.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                
                {payout.processing_fee && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500">Processing Fee:</span>
                    <span className="text-red-600">-${Number(payout.processing_fee).toFixed(2)}</span>
                  </div>
                )}
                
                {payout.net_amount && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500">Net Amount:</span>
                    <span className="font-semibold text-green-600">${Number(payout.net_amount).toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500">Status:</span>
                  <PayoutStatusBadge status={payout.status} />
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500">Payment Method:</span>
                  <span className="capitalize">{payout.payment_method?.replace('_', ' ') || 'N/A'}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500">Requested:</span>
                  <span>{formatDate(payout.requested_at)}</span>
                </div>
                
                {payout.processed_at && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-500">Processed:</span>
                    <span>{formatDate(payout.processed_at)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Partner Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Partner Information
              </h3>
              <div className="space-y-3 text-sm">
                {payout.partners && (
                  <>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-500">Business Name:</span>
                      <span className="font-medium">{payout.partners.business_name}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-500">Email:</span>
                      <span className="font-medium">{payout.partners.email}</span>
                    </div>
                  </>
                )}
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500">Partner ID:</span>
                  <span className="font-mono text-xs">{payout.partner_id?.slice(-12)}</span>
                </div>
                
                {payout.commission_breakdown && (
                  <>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-500">Commission Count:</span>
                      <span className="font-medium">{payout.commission_breakdown.count}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-500">Total Commission:</span>
                      <span className="font-medium text-green-600">${Number(payout.commission_breakdown.total_commission).toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Commission Details */}
          {payout.commission_details && payout.commission_details.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Receipt className="w-5 h-5 mr-2" />
                Commission Breakdown ({payout.commission_details.length} items)
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                <div className="space-y-3">
                  {payout.commission_details.map((commission, index) => (
                    <div key={commission.id || index} className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            {commission.bookings?.booking_reference || `Booking ${index + 1}`}
                          </h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex justify-between">
                              <span>Booking Total:</span>
                              <span className="font-medium">${Number(commission.bookings?.total_amount || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Commission:</span>
                              <span className="font-medium text-green-600">${Number(commission.commission_amount || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Earned:</span>
                              <span>{formatDateOnly(commission.earned_at)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500 mb-1">Commission ID</div>
                          <div className="font-mono text-xs text-gray-700">{commission.id?.slice(-12)}</div>
                          <div className="text-xs text-gray-500 mt-2 mb-1">Booking ID</div>
                          <div className="font-mono text-xs text-gray-700">{commission.booking_id?.slice(-12)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {payout.notes && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Notes</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">{payout.notes}</p>
              </div>
            </div>
          )}

          {/* Enhanced Timeline */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Timeline
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Payout Requested</p>
                  <p className="text-xs text-gray-500">{formatDate(payout.requested_at)}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Amount: ${Number(payout.amount).toFixed(2)} for {payout.commission_count} commissions
                  </p>
                </div>
              </div>
              
              {payout.approved_at && (
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Payout Approved</p>
                    <p className="text-xs text-gray-500">{formatDate(payout.approved_at)}</p>
                    {payout.approved_by && (
                      <p className="text-xs text-gray-600 mt-1">Approved by: {payout.approved_by}</p>
                    )}
                  </div>
                </div>
              )}
              
              {payout.status !== 'pending' && payout.processed_at && (
                <div className="flex items-start space-x-3">
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    payout.status === 'completed' ? 'bg-green-500' : 
                    payout.status === 'processing' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {payout.status === 'completed' ? 'Payout Completed' : `Payout ${payout.status}`}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(payout.processed_at)}</p>
                    {payout.processed_by && (
                      <p className="text-xs text-gray-600 mt-1">Processed by: {payout.processed_by}</p>
                    )}
                  </div>
                </div>
              )}
              
              {payout.rejected_at && (
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Payout Rejected</p>
                    <p className="text-xs text-gray-500">{formatDate(payout.rejected_at)}</p>
                    {payout.rejection_reason && (
                      <p className="text-xs text-red-600 mt-1">Reason: {payout.rejection_reason}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
          {payout.status === 'completed' && (
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center">
              <Download className="w-4 h-4 mr-1" />
              Download Receipt
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// New Payout Request Component - FIXED
const NewPayoutRequest = ({ availableBalance, onRequestPayout, onCancel }) => {
  const [amount, setAmount] = useState('');
  const [requesting, setRequesting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payoutAmount = parseFloat(amount);
    
    if (!amount || payoutAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (payoutAmount > availableBalance) {
      alert('Amount exceeds available balance');
      return;
    }
    if (payoutAmount < 10) {
      alert('Minimum payout amount is $10');
      return;
    }

    setRequesting(true);
    try {
      await onRequestPayout(payoutAmount);
      setAmount('');
      onCancel();
    } catch (error) {
      console.error('Payout request error:', error);
      alert('Failed to submit payout request: ' + error.message);
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Request New Payout</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="block text-sm font-medium text-gray-700 mb-2">
            Available Balance: ${Number(availableBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount (minimum $10)"
            min="10"
            max={availableBalance}
            step="0.01"
            disabled={requesting}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            required
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={requesting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={requesting || !amount || parseFloat(amount) < 10 || parseFloat(amount) > availableBalance}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 inline-flex items-center"
          >
            {requesting && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            )}
            {requesting ? 'Submitting...' : 'Request Payout'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Main PayoutManager Component
const PayoutManager = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showNewPayout, setShowNewPayout] = useState(false);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [commissionCount, setCommissionCount] = useState(0);
  const [stats, setStats] = useState({
    totalPaid: 0,
    pendingAmount: 0,
    completedPayouts: 0,
    averagePayout: 0,
    totalCommissions: 0,
    totalProcessingFees: 0
  });

  // Fetch payouts data
  const fetchPayouts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching payouts and balance...');
      
      // Make API calls with proper error handling
      const [payoutsResponse, balanceResponse] = await Promise.all([
        apiCall('/payouts'),
        apiCall('/balance')
      ]);
      
      console.log('Raw payouts response:', payoutsResponse);
      console.log('Raw balance response:', balanceResponse);
      
      // Handle payouts response
      let payoutsData = [];
      if (payoutsResponse) {
        if (payoutsResponse.success && payoutsResponse.data && Array.isArray(payoutsResponse.data.payouts)) {
          payoutsData = payoutsResponse.data.payouts;
        } else if (payoutsResponse.success && Array.isArray(payoutsResponse.data)) {
          payoutsData = payoutsResponse.data;
        } else if (Array.isArray(payoutsResponse)) {
          payoutsData = payoutsResponse;
        } else if (payoutsResponse.data && Array.isArray(payoutsResponse.data)) {
          payoutsData = payoutsResponse.data;
        }
      }
      
      console.log('Processed payouts data:', payoutsData);
      setPayouts(payoutsData);
      
      // Handle balance response
      let balance = 0;
      let commissions = 0;
      if (balanceResponse) {
        if (balanceResponse.success && balanceResponse.data) {
          balance = balanceResponse.data.available_balance || balanceResponse.data.available || 0;
          commissions = balanceResponse.data.commission_count || 0;
        } else if (balanceResponse.data) {
          balance = balanceResponse.data.available_balance || balanceResponse.data.available || 0;
          commissions = balanceResponse.data.commission_count || 0;
        } else {
          balance = balanceResponse.available_balance || balanceResponse.available || 0;
          commissions = balanceResponse.commission_count || 0;
        }
      }
      
      console.log('Processed available balance:', balance);
      console.log('Commission count:', commissions);
      setAvailableBalance(Number(balance));
      setCommissionCount(commissions);
      
      // Calculate enhanced stats
      const validPayouts = Array.isArray(payoutsData) ? payoutsData : [];
      
      const totalPaid = validPayouts
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + Number(p.amount || 0), 0);
        
      const pendingAmount = validPayouts
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + Number(p.amount || 0), 0);
        
      const completedPayouts = validPayouts.filter(p => p.status === 'completed').length;
      const averagePayout = completedPayouts > 0 ? totalPaid / completedPayouts : 0;
      
      const totalCommissions = validPayouts.reduce((sum, p) => {
        if (p.commission_breakdown && p.commission_breakdown.total_commission) {
          return sum + Number(p.commission_breakdown.total_commission);
        }
        return sum + Number(p.amount || 0);
      }, 0);
      
      const totalProcessingFees = validPayouts.reduce((sum, p) => {
        return sum + Number(p.processing_fee || 0);
      }, 0);
      
      const calculatedStats = {
        totalPaid,
        pendingAmount,
        completedPayouts,
        averagePayout,
        totalCommissions,
        totalProcessingFees
      };
      
      console.log('Enhanced calculated stats:', calculatedStats);
      setStats(calculatedStats);
      
    } catch (error) {
      console.error('Failed to fetch payouts:', error);
      setError(error.message);
      // Set empty array as fallback to prevent map/filter errors
      setPayouts([]);
      setAvailableBalance(0);
      setCommissionCount(0);
      setStats({
        totalPaid: 0,
        pendingAmount: 0,
        completedPayouts: 0,
        averagePayout: 0,
        totalCommissions: 0,
        totalProcessingFees: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle new payout request
  const handleRequestPayout = async (amount) => {
    try {
      console.log('Requesting payout for amount:', amount);
      
      const response = await apiCall('/payout', {
        method: 'POST',
        body: JSON.stringify({ amount }),
      });
      
      console.log('Payout request response:', response);
      
      // Check if the response indicates success
      if (response.success || response.message) {
        // Refresh data after successful payout
        await fetchPayouts();
        alert('Payout request submitted successfully!');
      } else {
        throw new Error(response.error || 'Payout request failed');
      }
    } catch (error) {
      console.error('Payout request failed:', error);
      throw error;
    }
  };

  // Handle view payout details
  const handleViewDetails = (payout) => {
    console.log('Viewing details for payout:', payout);
    setSelectedPayout(payout);
    setShowModal(true);
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Payouts</h2>
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
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Payouts</h2>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <XCircle className="w-8 h-8 text-red-600" />
            <div>
              <h3 className="text-lg font-semibold text-red-900">Error Loading Payouts</h3>
              <p className="text-red-700 mt-1">{error}</p>
              <button
                onClick={fetchPayouts}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payouts</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your commission payouts and view transaction history
          </p>
        </div>
        <button
          onClick={() => setShowNewPayout(true)}
          disabled={availableBalance < 10}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4 mr-2" />
          Request Payout
        </button>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PayoutStatsCard
          icon={DollarSign}
          title="Total Paid Out"
          value={`$${Number(stats.totalPaid).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle="All time earnings"
        />
        <PayoutStatsCard
          icon={Clock}
          title="Pending Amount"
          value={`$${Number(stats.pendingAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle="Awaiting processing"
        />
        <PayoutStatsCard
          icon={CheckCircle}
          title="Completed Payouts"
          value={stats.completedPayouts}
          subtitle={`Avg: $${Number(stats.averagePayout).toFixed(2)}`}
        />
        <PayoutStatsCard
          icon={Banknote}
          title="Available Balance"
          value={`$${Number(availableBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle={`${commissionCount} commissions`}
        />
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Commissions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${Number(stats.totalCommissions).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Processing Fees</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                ${Number(stats.totalProcessingFees).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <Hash className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Net Received</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                ${Number(stats.totalPaid - stats.totalProcessingFees).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* New Payout Request Form */}
      {showNewPayout && (
        <NewPayoutRequest
          availableBalance={availableBalance}
          onRequestPayout={handleRequestPayout}
          onCancel={() => setShowNewPayout(false)}
        />
      )}

      {/* Low Balance Warning */}
      {availableBalance > 0 && availableBalance < 10 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                Balance Below Minimum Payout
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                You need at least $10.00 to request a payout. Current balance: ${availableBalance.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payouts List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Payout History</h3>
            <div className="text-sm text-gray-500">
              {payouts.length} total payouts
            </div>
          </div>
        </div>
        <div className="p-6">
          {payouts.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No payouts yet</h3>
              <p className="text-gray-500 mb-4">Request your first payout to get started</p>
              {availableBalance >= 10 && (
                <button
                  onClick={() => setShowNewPayout(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Request First Payout
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {payouts.map((payout) => (
                <PayoutCard
                  key={payout.id}
                  payout={payout}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Payout Details Modal */}
      <PayoutDetailsModal
        payout={selectedPayout}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedPayout(null);
        }}
      />
    </div>
  );
};

export default PayoutManager;