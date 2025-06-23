// import React, { useState, useEffect } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { backendUrl } from '../../config/config';

// // const backendUrl = 'http://localhost:5000';

// // Helper function to decode JWT token
// const decodeToken = (token) => {
//   try {
//     const base64Url = token.split('.')[1];
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
//       return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//     }).join(''));
//     return JSON.parse(jsonPayload);
//   } catch (error) {
//     console.error('Error decoding token:', error);
//     return null;
//   }
// };

// const IntegratedPayment = ({ 
//   bookingData, 
//   totalAmount, 
//   onPaymentSuccess, 
//   onPaymentError, 
//   onClose, 
//   userId: providedUserId,
//   partnerId = null
// }) => {
//   const [selectedMethod, setSelectedMethod] = useState('card');
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [paymentData, setPaymentData] = useState(null);
//   const [walletBalance, setWalletBalance] = useState(0);
//   const [currentUserId, setCurrentUserId] = useState(providedUserId);
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
  
//   // New state for enhanced payment flow
//   const [paymentReference, setPaymentReference] = useState('');
//   const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, pending, completed, failed
//   const [pollingInterval, setPollingInterval] = useState(null);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [paymentWindow, setPaymentWindow] = useState(null);

//   console.log("hello", bookingData)

//   // Extract userId from token if not provided as prop
//   useEffect(() => {
//     if (!providedUserId) {
//       const token = localStorage.getItem('token');
//       if (token) {
//         const decoded = decodeToken(token);
//         if (decoded && decoded.userId) {
//           setCurrentUserId(decoded.userId);
//           console.log('Extracted userId from token:', decoded.userId);
//         }
//       }
//     }
//   }, [providedUserId]);

//   // Validation helper function
//   const validateBookingData = (data) => {
//     if (!data) return { valid: false, error: 'Booking data is missing' };
    
//     if (!data.selectedFlight) {
//       return { valid: false, error: 'Flight information is missing' };
//     }
    
//     if (!data.passengers || !Array.isArray(data.passengers) || data.passengers.length === 0) {
//       return { valid: false, error: 'Passenger information is missing' };
//     }
    
//     for (let i = 0; i < data.passengers.length; i++) {
//       const passenger = data.passengers[i];
//       if (!passenger.first_name || !passenger.last_name) {
//         return { valid: false, error: `Passenger ${i + 1} is missing required information` };
//       }
//     }
    
//     if (!data.contactInfo || !data.contactInfo.email) {
//       return { valid: false, error: 'Contact information is missing' };
//     }
    
//     return { valid: true };
//   };

//   // Payment method configurations for Nigeria
//   const paymentMethods = [
//     {
//       id: 'card',
//       name: 'Debit/Credit Card',
//       icon: '💳',
//       description: 'Pay with your Visa, Mastercard, or Verve card',
//       supported: true
//     },
//     {
//       id: 'bank_transfer',
//       name: 'Bank Transfer',
//       icon: '🏦',
//       description: 'Transfer from your bank account',
//       supported: true
//     },
//     {
//       id: 'ussd',
//       name: 'USSD',
//       icon: '📱',
//       description: 'Pay using *901# or other bank USSD codes',
//       supported: true
//     },
//     {
//       id: 'wallet',
//       name: 'Wallet Balance',
//       icon: '👛',
//       description: `Available: ₦${walletBalance.toLocaleString()}`,
//       supported: walletBalance >= (totalAmount || 0)
//     },
//     {
//       id: 'cash',
//       name: 'Cash Payment',
//       icon: '💵',
//       description: 'Pay at our physical office location',
//       supported: true
//     }
//   ];

//   // Fetch wallet balance on component mount
//   useEffect(() => {
//     fetchWalletBalance();
    
//     // Check for payment callback from URL params
//     const status = searchParams.get('status');
//     const tx_ref = searchParams.get('tx_ref');
//     const transaction_id = searchParams.get('transaction_id');
    
//     if (status && tx_ref) {
//       handlePaymentCallback(status, tx_ref, transaction_id);
//     }
//   }, [searchParams]);

//   // Cleanup polling interval on unmount
//   useEffect(() => {
//     return () => {
//       if (pollingInterval) {
//         clearInterval(pollingInterval);
//       }
//       if (paymentWindow && !paymentWindow.closed) {
//         paymentWindow.close();
//       }
//     };
//   }, [pollingInterval, paymentWindow]);

//   const fetchWalletBalance = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         console.warn('No authentication token found');
//         return;
//       }

//       console.log("token of user", token)
      
//       const response = await fetch(`${backendUrl}/api/payments/wallet/balance`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (response.ok) {
//         const data = await response.json();
//         setWalletBalance(data.balance || 0);
//       } else {
//         console.warn('Failed to fetch wallet balance:', response.status);
//       }
//     } catch (error) {
//       console.error('Failed to fetch wallet balance:', error);
//     }
//   };

//   // Enhanced payment status polling
//   const startPaymentStatusPolling = (transactionId) => {
//     if (pollingInterval) {
//       clearInterval(pollingInterval);
//     }

//     const interval = setInterval(async () => {
//       try {
//         console.log(`🔄 Polling payment status for transaction: ${transactionId}`);
        
//         const response = await fetch(`${backendUrl}/api/payments/verify/${transactionId}`, {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json'
//           }
//         });
        
//         const result = await response.json();
//         console.log('📊 Payment status poll result:', result);
        
//         if (result.success && result.data) {
//           if (result.data.successful) {
//             // Payment completed successfully
//             console.log('✅ Payment verification successful');
//             clearInterval(interval);
//             setPollingInterval(null);
//             handlePaymentVerificationSuccess(result);
//           } else if (result.data.status === 'failed') {
//             // Payment failed
//             console.log('❌ Payment verification failed');
//             clearInterval(interval);
//             setPollingInterval(null);
//             setPaymentStatus('failed');
//             setError('Payment failed. Please try again.');
//             setIsProcessing(false);
//           }
//           // If still pending, continue polling
//         }
//       } catch (error) {
//         console.error('Payment status polling error:', error);
//         // Continue polling unless it's a critical error
//       }
//     }, 3000); // Poll every 3 seconds
    
//     setPollingInterval(interval);
    
//     // Stop polling after 10 minutes
//     setTimeout(() => {
//       if (interval) {
//         clearInterval(interval);
//         setPollingInterval(null);
//         setPaymentStatus('failed');
//         setError('Payment verification timed out. Please check your payment status.');
//         setIsProcessing(false);
//       }
//     }, 600000);
//   };

//   // Enhanced payment callback handler
//   const handlePaymentCallback = async (status, txRef, transactionId) => {
//     console.log('🔄 Processing payment callback:', { status, txRef, transactionId });
    
//     if (status === 'successful' || status === 'completed') {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await fetch(`${backendUrl}/api/payments/verify/${transactionId || txRef}`, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
        
//         if (response.ok) {
//           const verificationResult = await response.json();
//           if (verificationResult.success && verificationResult.data?.successful) {
//             handlePaymentVerificationSuccess(verificationResult);
//           } else {
//             setPaymentStatus('failed');
//             setError('Payment verification failed');
//             setIsProcessing(false);
//           }
//         }
//       } catch (error) {
//         console.error('Payment verification error:', error);
//         setPaymentStatus('failed');
//         setError('Failed to verify payment');
//         setIsProcessing(false);
//       }
//     } else if (status === 'cancelled') {
//       setPaymentStatus('failed');
//       setError('Payment was cancelled');
//       setIsProcessing(false);
//     } else {
//       setPaymentStatus('failed');
//       setError('Payment failed');
//       setIsProcessing(false);
//     }
//   };

//   // Enhanced payment verification success handler
//   const handlePaymentVerificationSuccess = async (verificationResult) => {
//     try {
//       console.log('🎉 Processing payment verification success');
//       setPaymentStatus('completed');
//       setSuccess('Payment completed successfully! Your booking has been confirmed.');
//       setIsProcessing(false);
      
//       // Close payment window if it exists
//       if (paymentWindow && !paymentWindow.closed) {
//         paymentWindow.close();
//         setPaymentWindow(null);
//       }
      
//       // Clear any polling intervals
//       if (pollingInterval) {
//         clearInterval(pollingInterval);
//         setPollingInterval(null);
//       }
      
//       toast.success('Payment completed successfully!');
      
//       // Call the success callback
//       onPaymentSuccess?.(verificationResult.data || verificationResult);
      
//       // Navigate after a short delay to show success message
//       setTimeout(() => {
//         navigate('/booking');
//       }, 2000);
      
//     } catch (error) {
//       console.error('Error handling payment verification success:', error);
//       setPaymentStatus('failed');
//       setError('Payment successful but confirmation failed. Please contact support.');
//       setIsProcessing(false);
//     }
//   };

//   const validateUserAuthentication = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('No authentication token found');
//       }

//       const response = await fetch(`${backendUrl}/api/users/validate-token`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Authentication token is invalid');
//       }

//       const userData = await response.json();
//       console.log('User authentication validated:', userData);
      
//       return userData;
//     } catch (error) {
//       console.error('Authentication validation failed:', error);
//       toast.error('Please log in to continue with your booking');
//       throw error;
//     }
//   };

//   // Enhanced main payment processing function
//   const processPayment = async () => {
//     try {
//       // Reset states
//       setError('');
//       setSuccess('');
//       setPaymentStatus('processing');
      
//       // Validate user authentication
//       await validateUserAuthentication();
//     } catch (authError) {
//       setPaymentStatus('failed');
//       setError(authError.message);
//       onPaymentError?.(authError.message);
//       return;
//     }
    
//     // Enhanced validation
//     if (!totalAmount || totalAmount <= 0) {
//       const errorMsg = 'Invalid payment amount';
//       setPaymentStatus('failed');
//       setError(errorMsg);
//       onPaymentError?.(errorMsg);
//       return;
//     }

//     if (!selectedMethod) {
//       const errorMsg = 'Please select a payment method';
//       setPaymentStatus('failed');
//       setError(errorMsg);
//       onPaymentError?.(errorMsg);
//       return;
//     }

//     // Validate booking data
//     const validation = validateBookingData(bookingData);
//     if (!validation.valid) {
//       setPaymentStatus('failed');
//       setError(validation.error);
//       onPaymentError?.(validation.error);
//       return;
//     }

//     // Use currentUserId (either from prop or extracted from token)
//     const userIdToUse = currentUserId;
//     console.log('Using userId:', userIdToUse);

//     if (!userIdToUse) {
//       const errorMsg = 'User authentication required. Please log in and try again.';
//       setPaymentStatus('failed');
//       setError(errorMsg);
//       onPaymentError?.(errorMsg);
//       return;
//     }

//     setIsProcessing(true);

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('Authentication required. Please log in.');
//       }
      
//       // First create/save the booking to get a bookingId
//       let bookingId = bookingData.id || bookingData.bookingId;
      
//       if (!bookingId) {
//         console.log('Creating new booking...');
//         console.log('Original selectedFlight:', JSON.stringify(bookingData.selectedFlight, null, 2));
        
//         // Convert selectedFlight to flightOffer format that backend expects
//         const flightOffer = {
//           id: bookingData.selectedFlight.id || `flight_${Date.now()}`,
//           airline: bookingData.selectedFlight.airline,
//           flightNumber: bookingData.selectedFlight.flightNumber,
//           departure: bookingData.selectedFlight.departure,
//           arrival: bookingData.selectedFlight.arrival,
//           duration: bookingData.selectedFlight.duration,
//           aircraft: bookingData.selectedFlight.aircraft || 'Unknown',
//           price: {
//             total: totalAmount.toString(),
//             currency: 'NGN',
//             breakdown: {
//               baseFare: (totalAmount * 0.8).toFixed(2),
//               taxes: (totalAmount * 0.15).toFixed(2),
//               fees: (totalAmount * 0.05).toFixed(2)
//             }
//           },
//           itineraries: [{
//             segments: [{
//               departure: {
//                 iataCode: bookingData.selectedFlight.departure?.airport || bookingData.selectedFlight.departure?.iataCode,
//                 terminal: bookingData.selectedFlight.departure?.terminal,
//                 at: bookingData.selectedFlight.departure?.time || bookingData.selectedFlight.departure?.at
//               },
//               arrival: {
//                 iataCode: bookingData.selectedFlight.arrival?.airport || bookingData.selectedFlight.arrival?.iataCode,
//                 terminal: bookingData.selectedFlight.arrival?.terminal,
//                 at: bookingData.selectedFlight.arrival?.time || bookingData.selectedFlight.arrival?.at
//               },
//               carrierCode: bookingData.selectedFlight.airline,
//               number: bookingData.selectedFlight.flightNumber,
//               aircraft: {
//                 code: bookingData.selectedFlight.aircraft || 'Unknown'
//               },
//               duration: bookingData.selectedFlight.duration
//             }]
//           }],
//           travelerPricings: bookingData.passengers.map((passenger, index) => ({
//             travelerId: index + 1,
//             fareOption: 'STANDARD',
//             travelerType: passenger.type || 'ADULT',
//             price: {
//               currency: 'NGN',
//               total: (totalAmount / bookingData.passengers.length).toFixed(2)
//             }
//           }))
//         };
        
//         // Prepare booking payload
//         const bookingPayload = {
//           flightOffer: flightOffer,
//           passengers: bookingData.passengers.map(passenger => ({
//             ...passenger,
//             title: passenger.title || 'Mr',
//             firstName: passenger.firstName || passenger.first_name,
//             lastName: passenger.lastName || passenger.last_name,
//             dateOfBirth: passenger.dateOfBirth || passenger.date_of_birth,
//             gender: passenger.gender || 'M',
//             nationality: passenger.nationality || 'NG',
//             documentType: passenger.documentType || 'PASSPORT',
//             documentNumber: passenger.documentNumber || passenger.passport_number,
//             documentExpiryDate: passenger.documentExpiryDate || passenger.passport_expiry
//           })),
//           contactInfo: {
//             email: bookingData.contactInfo.email,
//             phone: bookingData.contactInfo.phone,
//             emergencyContact: bookingData.contactInfo.emergencyContact || bookingData.contactInfo.phone,
//             address: bookingData.contactInfo.address || ''
//           },
//           seatSelections: bookingData.seatSelections || [],
//           baggageSelections: bookingData.baggageSelections || [],
//           promoCode: bookingData.promoCode || null,
//           paymentMethodId: null
//         };

//         // Create booking headers
//         const bookingHeaders = {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         };
        
//         if (partnerId) {
//           bookingHeaders['X-Partner-Id'] = partnerId;
//         }

//         // Create booking
//         const bookingResponse = await fetch(`${backendUrl}/api/bookings`, {
//           method: 'POST',
//           headers: bookingHeaders,
//           body: JSON.stringify(bookingPayload)
//         });

//         const bookingResult = await bookingResponse.json();
//         console.log('Booking response:', bookingResult);
        
//         if (!bookingResponse.ok) {
//           console.error('Booking creation failed:', bookingResult);
//           throw new Error(bookingResult.error || bookingResult.message || 'Failed to create booking');
//         }
        
//         bookingId = bookingResult.booking?.id || bookingResult.bookingId || bookingResult.id;
//         if (!bookingId) {
//           console.error('No booking ID in response:', bookingResult);
//           throw new Error('Failed to get booking ID from server response');
//         }
        
//         console.log('Booking created successfully with ID:', bookingId);
//       }

//       // Now process payment
//       const paymentPayload = {
//         bookingId: bookingId,
//         amount: totalAmount,
//         paymentMethod: {
//           type: selectedMethod,
//           ...(selectedMethod === 'ussd' && { bank: 'GTB' }),
//           ...(selectedMethod === 'mobile_money' && { network: 'MTN' }),
//           ...(paymentData?.phoneNumber && { phoneNumber: paymentData.phoneNumber })
//         },
//         userId: userIdToUse
//       };

//       console.log('Processing payment with payload:', paymentPayload);

//       const paymentResponse = await fetch(`${backendUrl}/api/payments/process`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(paymentPayload)
//       });

//       const paymentResult = await paymentResponse.json();
//       console.log('Payment response:', JSON.stringify(paymentResult, null, 2));

//       if (!paymentResponse.ok) {
//         console.error('Payment processing failed:', paymentResult);
//         throw new Error(paymentResult.error || paymentResult.message || 'Payment processing failed');
//       }

//       // Handle payment response with enhanced logic
//       if (paymentResult.success) {
//         setPaymentData(paymentResult);

//         // Extract payment link and status
//         const paymentLink = 
//   // Check top-level paymentLink (recommended backend fix)
//   paymentResult.paymentLink ||
//   paymentResult.data?.paymentLink ||
  
//   // Based on your actual response structure from logs
//   paymentResult.data?.data?.paymentResult?.paymentResult?.paymentLink ||
//   paymentResult.data?.data?.paymentResult?.nextAction?.url ||
//   paymentResult.data?.data?.paymentResult?.gatewayResponse?.data?.link ||
  
//   // Check nested structures
//   paymentResult.data?.paymentResult?.paymentResult?.paymentLink ||
//   paymentResult.data?.paymentResult?.nextAction?.url ||
//   paymentResult.data?.paymentResult?.gatewayResponse?.data?.link ||
//   paymentResult.data?.nextAction?.url ||
  
//   // Legacy fallbacks
//   paymentResult.paymentResult?.paymentLink || 
//   paymentResult.nextAction?.url ||
//   paymentResult.gatewayResponse?.data?.link ||
//   paymentResult.data?.link ||
//   paymentResult.link;

// const status = 
//   paymentResult.status || 
//   paymentResult.data?.status ||
//   paymentResult.data?.paymentResult?.status ||
//   paymentResult.data?.data?.paymentResult?.status ||
//   'unknown';

// const transactionId = 
//   // Based on your actual response structure
//   paymentResult.data?.data?.payment?.transaction_id ||
//   paymentResult.data?.data?.paymentResult?.transactionId ||
//   paymentResult.data?.payment?.transaction_id ||
//   paymentResult.data?.paymentResult?.transactionId ||
//   paymentResult.data?.paymentResult?.paymentResult?.transactionId ||
//   paymentResult.paymentResult?.transactionId ||
//   paymentResult.transactionId;

// console.log('🔍 Enhanced extraction - Payment Link found:', paymentLink);
// console.log('🔍 Enhanced extraction - Transaction ID found:', transactionId);

//         if (status === 'pending' && paymentLink) {
//           // Payment is pending - open payment gateway
//           console.log('🚀 Opening payment gateway in new window');
//           setPaymentStatus('pending');
//           setPaymentReference(transactionId);
          
//           const newPaymentWindow = window.open(
//             paymentLink, 
//             'payment', 
//             'width=600,height=700,scrollbars=yes,resizable=yes'
//           );
          
//           setPaymentWindow(newPaymentWindow);
          
//           // Start polling for payment status
//           if (transactionId) {
//             startPaymentStatusPolling(transactionId);
//           }
          
//           setSuccess('Payment initiated. Please complete payment in the new window.');
//           toast.success('Payment window opened. Please complete your payment.');
          
//         } else if (status === 'completed') {
//           // Direct payment success (wallet, etc.)
//           console.log('✅ Payment completed immediately');
//           handlePaymentVerificationSuccess(paymentResult);
          
//         } else if (status === 'pending') {
//           // Handle different types of pending payments without payment link
//           if (selectedMethod === 'cash') {
//             console.log('💵 Cash payment selected');
//             setPaymentStatus('completed');
//             setSuccess('Cash payment option selected. Please visit our office to complete payment.');
//             onPaymentSuccess?.(paymentResult);
//           } else if (selectedMethod === 'bank_transfer') {
//             console.log('🏦 Bank transfer initiated');
//             setPaymentStatus('completed');
//             setSuccess('Bank transfer details have been sent. Please complete the transfer.');
//             onPaymentSuccess?.(paymentResult);
//           } else {
//             console.log('⏳ Payment is pending - but no payment link found');
//             setPaymentStatus('failed');
//             setError('Payment gateway link not found. Please try again.');
//           }
//           setIsProcessing(false);
          
//         } else if (status === 'failed') {
//           console.log('❌ Payment failed');
//           throw new Error(paymentResult.message || 'Payment failed');
//         } else {
//           console.warn('⚠️ Unknown payment status:', status);
//           throw new Error(`Unexpected payment status: ${status}`);
//         }
//       } else {
//         throw new Error(paymentResult.error || paymentResult.message || 'Payment processing failed');
//       }
      
//     } catch (error) {
//       console.error('💥 Payment processing error:', error);
      
//       setPaymentStatus('failed');
//       setIsProcessing(false);
      
//       // Provide user-friendly error messages
//       let userErrorMessage;
//       if (error.message.includes('network') || error.message.includes('fetch')) {
//         userErrorMessage = 'Network error. Please check your internet connection and try again.';
//       } else if (error.message.includes('authentication') || error.message.includes('unauthorized')) {
//         userErrorMessage = 'Authentication error. Please log in again and retry.';
//       } else if (error.message.includes('insufficient')) {
//         userErrorMessage = error.message;
//       } else {
//         userErrorMessage = error.message || 'Payment processing failed. Please try again.';
//       }

//       setError(userErrorMessage);
//       toast.error(userErrorMessage);
//       onPaymentError?.(userErrorMessage);
//     }
//   };

//   const handleMethodSelect = (methodId) => {
//     const method = paymentMethods.find(m => m.id === methodId);
//     if (!method?.supported) {
//       if (methodId === 'wallet') {
//         toast.error(`Insufficient wallet balance. You need ₦${(totalAmount - walletBalance).toLocaleString()} more.`);
//       } else {
//         toast.error('This payment method is not currently available');
//       }
//       return;
//     }
//     setSelectedMethod(methodId);
//     // Reset states when changing payment method
//     setError('');
//     setSuccess('');
//     setPaymentStatus('idle');
//   };

//   // Generate booking reference if not provided
//   const getBookingReference = () => {
//     return bookingData?.booking_reference || 
//            bookingData?.id || 
//            `BK${Date.now().toString().slice(-8)}`;
//   };

//   // Payment Status Component
//   const PaymentStatus = () => {
//     if (paymentStatus === 'processing' || isProcessing) {
//       return (
//         <div className="text-center py-8">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-blue-600">Processing payment...</p>
//           {paymentStatus === 'pending' && (
//             <p className="text-sm text-gray-600 mt-2">Please complete payment in the popup window</p>
//           )}
//         </div>
//       );
//     }
    
//     if (paymentStatus === 'completed' || success) {
//       return (
//         <div className="text-center py-8">
//           <div className="text-green-600 mb-4">
//             <svg className="h-16 w-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//             </svg>
//           </div>
//           <h3 className="text-lg font-semibold text-green-800 mb-2">Payment Successful!</h3>
//           <p className="text-green-600">{success}</p>
//         </div>
//       );
//     }
    
//     if (paymentStatus === 'failed' || error) {
//       return (
//         <div className="text-center py-8">
//           <div className="text-red-600 mb-4">
//             <svg className="h-16 w-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//             </svg>
//           </div>
//           <h3 className="text-lg font-semibold text-red-800 mb-2">Payment Failed</h3>
//           <p className="text-red-600 mb-4">{error}</p>
//           <button 
//             onClick={() => {
//               setError('');
//               setSuccess('');
//               setPaymentStatus('idle');
//               setIsProcessing(false);
//             }}
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           >
//             Try Again
//           </button>
//         </div>
//       );
//     }
    
//     return null;
//   };

//   // Early return if no booking data or amount
//   if (!bookingData || !totalAmount) {
//     return (
//       <div className="flex items-center justify-center p-8">
//         <div className="text-center">
//           <p className="text-gray-600">No booking information or amount available</p>
//           <p className="text-sm text-gray-500 mt-2">
//             Booking Data: {bookingData ? 'Available' : 'Missing'} | 
//             Amount: {totalAmount ? `₦${totalAmount.toLocaleString()}` : 'Missing'}
//           </p>
//           <button
//             onClick={onClose}
//             className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Validate booking data before rendering
//   const validation = validateBookingData(bookingData);
//   if (!validation.valid) {
//     return (
//       <div className="flex items-center justify-center p-8">
//         <div className="text-center">
//           <p className="text-red-600 font-medium">Booking Validation Error</p>
//           <p className="text-gray-600 mt-2">{validation.error}</p>
//           <button
//             onClick={onClose}
//             className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Show payment status if processing, completed, or failed
//   if (paymentStatus !== 'idle') {
//     return (
//       <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
//         <div className="mb-6">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Status</h2>
//           <PaymentStatus />
          
//           {paymentStatus === 'pending' && (
//             <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//               <div className="flex items-center space-x-3">
//                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
//                 <div>
//                   <h4 className="font-medium text-blue-800">Payment in Progress</h4>
//                   <p className="text-sm text-blue-600 mt-1">
//                     {paymentWindow && !paymentWindow.closed 
//                       ? 'Please complete your payment in the popup window' 
//                       : 'Waiting for payment confirmation...'}
//                   </p>
//                   {paymentReference && (
//                     <p className="text-xs text-blue-500 mt-1">
//                       Reference: {paymentReference}
//                     </p>
//                   )}
//                 </div>
//               </div>
              
//               <div className="mt-4 flex space-x-3">
//                 {paymentWindow && paymentWindow.closed && (
//                   <button
//                     onClick={() => {
//                       const newWindow = window.open(
//                         paymentData?.data?.paymentResult?.paymentResult?.paymentLink || 
//                         paymentData?.data?.paymentResult?.nextAction?.url ||
//                         paymentData?.paymentResult?.paymentLink,
//                         'payment',
//                         'width=600,height=700,scrollbars=yes,resizable=yes'
//                       );
//                       setPaymentWindow(newWindow);
//                     }}
//                     className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
//                   >
//                     Reopen Payment Window
//                   </button>
//                 )}
                
//                 <button
//                   onClick={() => {
//                     if (pollingInterval) {
//                       clearInterval(pollingInterval);
//                       setPollingInterval(null);
//                     }
//                     if (paymentWindow && !paymentWindow.closed) {
//                       paymentWindow.close();
//                       setPaymentWindow(null);
//                     }
//                     setPaymentStatus('idle');
//                     setIsProcessing(false);
//                     setError('');
//                     setSuccess('');
//                   }}
//                   className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
//                 >
//                   Cancel Payment
//                 </button>
//               </div>
//             </div>
//           )}
          
//           {(paymentStatus === 'failed' || paymentStatus === 'completed') && (
//             <div className="mt-6 flex justify-center">
//               <button
//                 onClick={onClose}
//                 className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
//               >
//                 Close
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold text-gray-800 mb-4">Complete Payment</h2>
        
//         {/* Debug info - remove in production */}
//         {process.env.NODE_ENV === 'development' && (
//           <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
//             <p>Debug: userId = {currentUserId || 'Not set'}</p>
//           </div>
//         )}
        
//         {/* Error Display */}
//         {error && (
//           <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
//             <div className="flex items-start space-x-2">
//               <span className="text-red-600">❌</span>
//               <div className="text-sm text-red-800">
//                 <p className="font-medium mb-1">Payment Error</p>
//                 <p>{error}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Success Display */}
//         {success && (
//           <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
//             <div className="flex items-start space-x-2">
//               <span className="text-green-600">✅</span>
//               <div className="text-sm text-green-800">
//                 <p className="font-medium mb-1">Success</p>
//                 <p>{success}</p>
//               </div>
//             </div>
//           </div>
//         )}
        
//         {/* Booking Summary */}
//         <div className="bg-blue-50 p-6 rounded-lg mb-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <h3 className="font-semibold text-gray-800 mb-2">Booking Details</h3>
//               <div className="space-y-1 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Booking Reference:</span>
//                   <span className="font-semibold">{getBookingReference()}</span>
//                 </div>
//                 {bookingData.selectedFlight && (
//                   <>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Flight:</span>
//                       <span className="font-semibold">
//                         {bookingData.selectedFlight.airline} {bookingData.selectedFlight.flightNumber}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Route:</span>
//                       <span className="font-semibold">
//                         {bookingData.selectedFlight.departure?.airport} → {bookingData.selectedFlight.arrival?.airport}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Departure:</span>
//                       <span className="font-semibold">
//                         {bookingData.selectedFlight.departure?.time}
//                       </span>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
            
//             <div>
//               <h3 className="font-semibold text-gray-800 mb-2">Passenger Information</h3>
//               <div className="space-y-1 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Total Passengers:</span>
//                   <span className="font-semibold">{bookingData.passengers?.length || 0}</span>
//                 </div>
//                 {bookingData.passengers?.map((passenger, index) => (
//                   <div key={index} className="flex justify-between">
//                     <span className="text-gray-600">
//                       {passenger.type === 'adult' ? 'Adult' : 
//                        passenger.type === 'child' ? 'Child' : 'Infant'} {index + 1}:
//                     </span>
//                     <span className="font-semibold">
//                       {passenger.first_name} {passenger.last_name}
//                     </span>
//                   </div>
//                 )) || (
//                   <span className="text-gray-500 italic">No passenger details available</span>
//                 )}
//               </div>
//             </div>
//           </div>
          
//           <div className="border-t pt-4 mt-4">
//             <div className="flex justify-between items-center">
//               <span className="text-lg font-semibold text-gray-700">Total Amount:</span>
//               <span className="text-3xl font-bold text-green-600">
//                 ₦{totalAmount?.toLocaleString()}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Contact Information */}
//         {bookingData.contactInfo && (
//           <div className="bg-gray-50 p-4 rounded-lg mb-4">
//             <h3 className="font-semibold text-gray-800 mb-2">Contact Information</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//               {bookingData.contactInfo.email && (
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Email:</span>
//                   <span className="font-semibold">{bookingData.contactInfo.email}</span>
//                 </div>
//               )}
//               {bookingData.contactInfo.phone && (
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Phone:</span>
//                   <span className="font-semibold">{bookingData.contactInfo.phone}</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="mb-6">
//         <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
//         <div className="grid gap-3">
//           {paymentMethods.map((method) => (
//             <div
//               key={method.id}
//               onClick={() => handleMethodSelect(method.id)}
//               className={`
//                 border-2 rounded-lg p-4 cursor-pointer transition-all duration-200
//                 ${selectedMethod === method.id 
//                   ? 'border-blue-500 bg-blue-50' 
//                   : 'border-gray-200 hover:border-gray-300'
//                 }
//                 ${!method.supported ? 'opacity-50 cursor-not-allowed' : ''}
//               `}
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <span className="text-2xl">{method.icon}</span>
//                   <div>
//                     <div className="font-medium">{method.name}</div>
//                     <div className="text-sm text-gray-600">{method.description}</div>
//                   </div>
//                 </div>
//                 <div className={`
//                   w-4 h-4 rounded-full border-2 
//                   ${selectedMethod === method.id 
//                     ? 'border-blue-500 bg-blue-500' 
//                     : 'border-gray-300'
//                   }
//                 `}>
//                   {selectedMethod === method.id && (
//                     <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Payment method specific information */}
//       {selectedMethod === 'cash' && (
//         <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//           <div className="flex items-start space-x-2">
//             <span className="text-yellow-600">⚠️</span>
//             <div className="text-sm text-yellow-800">
//               <p className="font-medium mb-1">Cash Payment Instructions:</p>
//               <p>Please visit our office at [Your Office Address] during business hours (9 AM - 5 PM) to complete your payment.</p>
//               <p className="mt-1">Bring your booking reference: <strong>{getBookingReference()}</strong></p>
//             </div>
//           </div>
//         </div>
//       )}

//       {selectedMethod === 'wallet' && walletBalance < totalAmount && (
//         <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//           <div className="flex items-start space-x-2">
//             <span className="text-red-600">❌</span>
//             <div className="text-sm text-red-800">
//               <p className="font-medium mb-1">Insufficient Wallet Balance</p>
//               <p>You need ₦{(totalAmount - walletBalance).toLocaleString()} more to complete this payment.</p>
//               <button 
//                 onClick={() => navigate('/wallet/fund')}
//                 className="mt-2 text-blue-600 hover:text-blue-800 underline"
//               >
//                 Fund your wallet
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {selectedMethod === 'ussd' && (
//         <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//           <div className="flex items-start space-x-2">
//             <span className="text-blue-600">📱</span>
//             <div className="text-sm text-blue-800">
//               <p className="font-medium mb-1">USSD Payment Instructions:</p>
//               <p>After clicking "Pay", you'll receive a USSD code to dial on your phone to complete the payment.</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {selectedMethod === 'bank_transfer' && (
//         <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
//           <div className="flex items-start space-x-2">
//             <span className="text-green-600">🏦</span>
//             <div className="text-sm text-green-800">
//               <p className="font-medium mb-1">Bank Transfer Instructions:</p>
//               <p>After clicking "Pay", you'll receive bank account details to complete your transfer.</p>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="flex space-x-4">
//         <button
//           onClick={onClose}
//           className="flex-1 py-3 px-6 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//           disabled={isProcessing}
//         >
//           Cancel
//         </button>
//         <button
//           onClick={processPayment}
//           disabled={isProcessing || !selectedMethod || !totalAmount}
//           className={`
//             flex-1 py-3 px-6 rounded-lg text-white font-medium transition-colors
//             ${isProcessing || !totalAmount
//               ? 'bg-gray-400 cursor-not-allowed' 
//               : 'bg-blue-600 hover:bg-blue-700'
//             }
//           `}
//         >
//           {isProcessing ? (
//             <div className="flex items-center justify-center space-x-2">
//               <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//               <span>Processing...</span>
//             </div>
//           ) : (
//             `Pay ₦${totalAmount?.toLocaleString() || '0'}`
//           )}
//         </button>
//       </div>

//       {/* Payment status display */}
//       {paymentData && paymentStatus === 'idle' && (
//         <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//           <h4 className="font-medium mb-2">Last Payment Attempt</h4>
//           <div className="text-sm text-gray-600">
//             {paymentData.data?.paymentResult?.transactionId && (
//               <p>Transaction ID: {paymentData.data.paymentResult.transactionId}</p>
//             )}
//             {paymentData.paymentResult?.status && (
//               <p>Status: <span className="capitalize">{paymentData.paymentResult.status}</span></p>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Payment Window Monitor */}
//       {paymentWindow && (
//         <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-2">
//               <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//               <span className="text-sm text-blue-800">Payment window is active</span>
//             </div>
//             <button
//               onClick={() => {
//                 if (paymentWindow && !paymentWindow.closed) {
//                   paymentWindow.focus();
//                 } else {
//                   setError('Payment window was closed. Please try again.');
//                   setPaymentStatus('failed');
//                   setIsProcessing(false);
//                 }
//               }}
//               className="text-sm text-blue-600 hover:text-blue-800 underline"
//             >
//               Focus Window
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default IntegratedPayment;


import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { backendUrl } from '../../config/config';

// Helper function to decode JWT token
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

const IntegratedPayment = ({ 
  bookingData, 
  totalAmount, 
  onPaymentSuccess, 
  onPaymentError, 
  onClose, 
  userId: providedUserId,
  partnerId = null
}) => {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(providedUserId);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Enhanced state for payment flow
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [pollingInterval, setPollingInterval] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [paymentWindow, setPaymentWindow] = useState(null);
  const [pollAttempts, setPollAttempts] = useState(0);
  const [maxPollAttempts] = useState(120); // 6 minutes of polling (3 second intervals)

  console.log("Booking data received:", bookingData);

  // Extract userId from token if not provided as prop
  useEffect(() => {
    if (!providedUserId) {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = decodeToken(token);
        if (decoded && decoded.userId) {
          setCurrentUserId(decoded.userId);
          console.log('Extracted userId from token:', decoded.userId);
        }
      }
    }
  }, [providedUserId]);

  // Validation helper function
  const validateBookingData = (data) => {
    if (!data) return { valid: false, error: 'Booking data is missing' };
    
    if (!data.selectedFlight) {
      return { valid: false, error: 'Flight information is missing' };
    }
    
    if (!data.passengers || !Array.isArray(data.passengers) || data.passengers.length === 0) {
      return { valid: false, error: 'Passenger information is missing' };
    }
    
    for (let i = 0; i < data.passengers.length; i++) {
      const passenger = data.passengers[i];
      if (!passenger.first_name || !passenger.last_name) {
        return { valid: false, error: `Passenger ${i + 1} is missing required information` };
      }
    }
    
    if (!data.contactInfo || !data.contactInfo.email) {
      return { valid: false, error: 'Contact information is missing' };
    }
    
    return { valid: true };
  };

  // Payment method configurations for Nigeria
  const paymentMethods = [
    {
      id: 'card',
      name: 'Debit/Credit Card',
      icon: '💳',
      description: 'Pay with your Visa, Mastercard, or Verve card',
      supported: true
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: '🏦',
      description: 'Transfer from your bank account',
      supported: true
    },
    {
      id: 'ussd',
      name: 'USSD',
      icon: '📱',
      description: 'Pay using *901# or other bank USSD codes',
      supported: true
    },
    {
      id: 'wallet',
      name: 'Wallet Balance',
      icon: '👛',
      description: `Available: ₦${walletBalance.toLocaleString()}`,
      supported: walletBalance >= (totalAmount || 0)
    },
    {
      id: 'cash',
      name: 'Cash Payment',
      icon: '💵',
      description: 'Pay at our physical office location',
      supported: true
    }
  ];

  // Fetch wallet balance on component mount
  useEffect(() => {
    fetchWalletBalance();
    
    // Check for payment callback from URL params
    const status = searchParams.get('status');
    const tx_ref = searchParams.get('tx_ref');
    const transaction_id = searchParams.get('transaction_id');
    
    if (status && tx_ref) {
      handlePaymentCallback(status, tx_ref, transaction_id);
    }
  }, [searchParams]);

  // Cleanup polling interval on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
      if (paymentWindow && !paymentWindow.closed) {
        paymentWindow.close();
      }
    };
  }, [pollingInterval, paymentWindow]);

  const fetchWalletBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No authentication token found');
        return;
      }

      console.log("Fetching wallet balance with token:", token);
      
      const response = await fetch(`${backendUrl}/api/payments/wallet/balance`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setWalletBalance(data.balance || 0);
      } else {
        console.warn('Failed to fetch wallet balance:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch wallet balance:', error);
    }
  };

  // Improved payment status polling with better error handling
  const startPaymentStatusPolling = (transactionId) => {
    console.log(`🔄 Starting payment status polling for transaction: ${transactionId}`);
    
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    setPollAttempts(0);

    const interval = setInterval(async () => {
      try {
        const currentAttempt = pollAttempts + 1;
        setPollAttempts(currentAttempt);

        console.log(`🔄 Polling attempt ${currentAttempt}/${maxPollAttempts} for transaction: ${transactionId}`);
        
        if (currentAttempt > maxPollAttempts) {
          console.log('⏰ Polling timeout reached');
          clearInterval(interval);
          setPollingInterval(null);
          setPaymentStatus('failed');
          setError('Payment verification timed out. Please check your payment status or contact support.');
          setIsProcessing(false);
          return;
        }

        const response = await fetch(`${backendUrl}/api/payments/verify/${transactionId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        const result = await response.json();
        console.log('📊 Payment status poll result:', result);
        
        if (response.ok && result.success) {
          if (result.data && result.data.successful) {
            // Payment completed successfully
            console.log('✅ Payment verification successful');
            clearInterval(interval);
            setPollingInterval(null);
            handlePaymentVerificationSuccess(result);
            return;
          } else if (result.data && result.data.status === 'failed') {
            // Payment failed
            console.log('❌ Payment verification failed');
            clearInterval(interval);
            setPollingInterval(null);
            setPaymentStatus('failed');
            setError('Payment failed. Please try again.');
            setIsProcessing(false);
            return;
          }
          // If still pending, continue polling
        } else {
          // Handle API errors but don't fail immediately
          console.warn(`⚠️ Poll attempt ${currentAttempt} failed:`, result);
          if (currentAttempt > 10) { // Only log errors after 10 attempts to avoid spam
            console.error('Persistent polling error:', result);
          }
        }
      } catch (error) {
        console.error('Payment status polling error:', error);
        // Continue polling unless it's a critical error
        const currentAttempt = pollAttempts + 1;
        if (currentAttempt > 10) {
          console.error('Persistent polling error, but continuing...', error);
        }
      }
    }, 3000); // Poll every 3 seconds
    
    setPollingInterval(interval);
  };

  // Enhanced payment callback handler
  const handlePaymentCallback = async (status, txRef, transactionId) => {
    console.log('🔄 Processing payment callback:', { status, txRef, transactionId });
    
    if (status === 'successful' || status === 'completed') {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${backendUrl}/api/payments/verify/${transactionId || txRef}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const verificationResult = await response.json();
          if (verificationResult.success && verificationResult.data?.successful) {
            handlePaymentVerificationSuccess(verificationResult);
          } else {
            setPaymentStatus('failed');
            setError('Payment verification failed');
            setIsProcessing(false);
          }
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setPaymentStatus('failed');
        setError('Failed to verify payment');
        setIsProcessing(false);
      }
    } else if (status === 'cancelled') {
      setPaymentStatus('failed');
      setError('Payment was cancelled');
      setIsProcessing(false);
    } else {
      setPaymentStatus('failed');
      setError('Payment failed');
      setIsProcessing(false);
    }
  };

  // Enhanced payment verification success handler
  const handlePaymentVerificationSuccess = async (verificationResult) => {
    try {
      console.log('🎉 Processing payment verification success');
      setPaymentStatus('completed');
      setSuccess('Payment completed successfully! Your booking has been confirmed.');
      setIsProcessing(false);
      
      // Close payment window if it exists
      if (paymentWindow && !paymentWindow.closed) {
        paymentWindow.close();
        setPaymentWindow(null);
      }
      
      // Clear any polling intervals
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
      
      toast.success('Payment completed successfully!');
      
      // Call the success callback
      onPaymentSuccess?.(verificationResult.data || verificationResult);
      
      // Navigate after a short delay to show success message
      setTimeout(() => {
        navigate('/booking');
      }, 2000);
      
    } catch (error) {
      console.error('Error handling payment verification success:', error);
      setPaymentStatus('failed');
      setError('Payment successful but confirmation failed. Please contact support.');
      setIsProcessing(false);
    }
  };

  const validateUserAuthentication = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${backendUrl}/api/users/validate-token`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Authentication token is invalid');
      }

      const userData = await response.json();
      console.log('User authentication validated:', userData);
      
      return userData;
    } catch (error) {
      console.error('Authentication validation failed:', error);
      toast.error('Please log in to continue with your booking');
      throw error;
    }
  };

  // Enhanced main payment processing function
  const processPayment = async () => {
    try {
      // Reset states
      setError('');
      setSuccess('');
      setPaymentStatus('processing');
      setPollAttempts(0);
      
      // Validate user authentication
      await validateUserAuthentication();
    } catch (authError) {
      setPaymentStatus('failed');
      setError(authError.message);
      onPaymentError?.(authError.message);
      return;
    }
    
    // Enhanced validation
    if (!totalAmount || totalAmount <= 0) {
      const errorMsg = 'Invalid payment amount';
      setPaymentStatus('failed');
      setError(errorMsg);
      onPaymentError?.(errorMsg);
      return;
    }

    if (!selectedMethod) {
      const errorMsg = 'Please select a payment method';
      setPaymentStatus('failed');
      setError(errorMsg);
      onPaymentError?.(errorMsg);
      return;
    }

    // Validate booking data
    const validation = validateBookingData(bookingData);
    if (!validation.valid) {
      setPaymentStatus('failed');
      setError(validation.error);
      onPaymentError?.(validation.error);
      return;
    }

    // Use currentUserId (either from prop or extracted from token)
    const userIdToUse = currentUserId;
    console.log('Using userId:', userIdToUse);

    if (!userIdToUse) {
      const errorMsg = 'User authentication required. Please log in and try again.';
      setPaymentStatus('failed');
      setError(errorMsg);
      onPaymentError?.(errorMsg);
      return;
    }

    setIsProcessing(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }
      
      // First create/save the booking to get a bookingId
      let bookingId = bookingData.id || bookingData.bookingId;
      
      if (!bookingId) {
        console.log('Creating new booking...');
        console.log('Original selectedFlight:', JSON.stringify(bookingData.selectedFlight, null, 2));
        
        // Convert selectedFlight to flightOffer format that backend expects
        const flightOffer = {
          id: bookingData.selectedFlight.id || `flight_${Date.now()}`,
          airline: bookingData.selectedFlight.airline,
          flightNumber: bookingData.selectedFlight.flightNumber,
          departure: bookingData.selectedFlight.departure,
          arrival: bookingData.selectedFlight.arrival,
          duration: bookingData.selectedFlight.duration,
          aircraft: bookingData.selectedFlight.aircraft || 'Unknown',
          price: {
            total: totalAmount.toString(),
            currency: 'NGN',
            breakdown: {
              baseFare: (totalAmount * 0.8).toFixed(2),
              taxes: (totalAmount * 0.15).toFixed(2),
              fees: (totalAmount * 0.05).toFixed(2)
            }
          },
          itineraries: [{
            segments: [{
              departure: {
                iataCode: bookingData.selectedFlight.departure?.airport || bookingData.selectedFlight.departure?.iataCode,
                terminal: bookingData.selectedFlight.departure?.terminal,
                at: bookingData.selectedFlight.departure?.time || bookingData.selectedFlight.departure?.at
              },
              arrival: {
                iataCode: bookingData.selectedFlight.arrival?.airport || bookingData.selectedFlight.arrival?.iataCode,
                terminal: bookingData.selectedFlight.arrival?.terminal,
                at: bookingData.selectedFlight.arrival?.time || bookingData.selectedFlight.arrival?.at
              },
              carrierCode: bookingData.selectedFlight.airline,
              number: bookingData.selectedFlight.flightNumber,
              aircraft: {
                code: bookingData.selectedFlight.aircraft || 'Unknown'
              },
              duration: bookingData.selectedFlight.duration
            }]
          }],
          travelerPricings: bookingData.passengers.map((passenger, index) => ({
            travelerId: index + 1,
            fareOption: 'STANDARD',
            travelerType: passenger.type || 'ADULT',
            price: {
              currency: 'NGN',
              total: (totalAmount / bookingData.passengers.length).toFixed(2)
            }
          }))
        };
        
        // Prepare booking payload
        const bookingPayload = {
          flightOffer: flightOffer,
          passengers: bookingData.passengers.map(passenger => ({
            ...passenger,
            title: passenger.title || 'Mr',
            firstName: passenger.firstName || passenger.first_name,
            lastName: passenger.lastName || passenger.last_name,
            dateOfBirth: passenger.dateOfBirth || passenger.date_of_birth,
            gender: passenger.gender || 'M',
            nationality: passenger.nationality || 'NG',
            documentType: passenger.documentType || 'PASSPORT',
            documentNumber: passenger.documentNumber || passenger.passport_number,
            documentExpiryDate: passenger.documentExpiryDate || passenger.passport_expiry
          })),
          contactInfo: {
            email: bookingData.contactInfo.email,
            phone: bookingData.contactInfo.phone,
            emergencyContact: bookingData.contactInfo.emergencyContact || bookingData.contactInfo.phone,
            address: bookingData.contactInfo.address || ''
          },
          seatSelections: bookingData.seatSelections || [],
          baggageSelections: bookingData.baggageSelections || [],
          promoCode: bookingData.promoCode || null,
          paymentMethodId: null
        };

        // Create booking headers
        const bookingHeaders = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };
        
        if (partnerId) {
          bookingHeaders['X-Partner-Id'] = partnerId;
        }

        // Create booking
        const bookingResponse = await fetch(`${backendUrl}/api/bookings`, {
          method: 'POST',
          headers: bookingHeaders,
          body: JSON.stringify(bookingPayload)
        });

        const bookingResult = await bookingResponse.json();
        console.log('Booking response:', bookingResult);
        
        if (!bookingResponse.ok) {
          console.error('Booking creation failed:', bookingResult);
          throw new Error(bookingResult.error || bookingResult.message || 'Failed to create booking');
        }
        
        bookingId = bookingResult.booking?.id || bookingResult.bookingId || bookingResult.id;
        if (!bookingId) {
          console.error('No booking ID in response:', bookingResult);
          throw new Error('Failed to get booking ID from server response');
        }
        
        console.log('Booking created successfully with ID:', bookingId);
      }

      // Now process payment
      const paymentPayload = {
        bookingId: bookingId,
        amount: totalAmount,
        paymentMethod: {
          type: selectedMethod,
          ...(selectedMethod === 'ussd' && { bank: 'GTB' }),
          ...(selectedMethod === 'mobile_money' && { network: 'MTN' }),
          ...(paymentData?.phoneNumber && { phoneNumber: paymentData.phoneNumber })
        },
        userId: userIdToUse
      };

      console.log('Processing payment with payload:', paymentPayload);

      const paymentResponse = await fetch(`${backendUrl}/api/payments/process`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentPayload)
      });

      const paymentResult = await paymentResponse.json();
      console.log('Payment response:', JSON.stringify(paymentResult, null, 2));

      if (!paymentResponse.ok) {
        console.error('Payment processing failed:', paymentResult);
        throw new Error(paymentResult.error || paymentResult.message || 'Payment processing failed');
      }

      // Handle payment response with enhanced logic
      if (paymentResult.success) {
        setPaymentData(paymentResult);

        // Enhanced payment link extraction
        const paymentLink = 
          paymentResult.paymentLink ||
          paymentResult.data?.paymentLink ||
          paymentResult.data?.data?.paymentResult?.paymentResult?.paymentLink ||
          paymentResult.data?.data?.paymentResult?.nextAction?.url ||
          paymentResult.data?.data?.paymentResult?.gatewayResponse?.data?.link ||
          paymentResult.data?.paymentResult?.paymentResult?.paymentLink ||
          paymentResult.data?.paymentResult?.nextAction?.url ||
          paymentResult.data?.paymentResult?.gatewayResponse?.data?.link ||
          paymentResult.data?.nextAction?.url ||
          paymentResult.paymentResult?.paymentLink || 
          paymentResult.nextAction?.url ||
          paymentResult.gatewayResponse?.data?.link ||
          paymentResult.data?.link ||
          paymentResult.link;

        const status = 
          paymentResult.status || 
          paymentResult.data?.status ||
          paymentResult.data?.paymentResult?.status ||
          paymentResult.data?.data?.paymentResult?.status ||
          'unknown';

        const transactionId = 
          paymentResult.data?.data?.payment?.transaction_id ||
          paymentResult.data?.data?.paymentResult?.transactionId ||
          paymentResult.data?.payment?.transaction_id ||
          paymentResult.data?.paymentResult?.transactionId ||
          paymentResult.data?.paymentResult?.paymentResult?.transactionId ||
          paymentResult.paymentResult?.transactionId ||
          paymentResult.transactionId;

        console.log('🔍 Payment Link found:', paymentLink);
        console.log('🔍 Status:', status);
        console.log('🔍 Transaction ID found:', transactionId);

        if (status === 'pending' && paymentLink) {
          // Payment is pending - open payment gateway
          console.log('🚀 Opening payment gateway in new window');
          setPaymentStatus('pending');
          setPaymentReference(transactionId);
          
          const newPaymentWindow = window.open(
            paymentLink, 
            'payment', 
            'width=600,height=700,scrollbars=yes,resizable=yes'
          );
          
          setPaymentWindow(newPaymentWindow);
          
          // Start polling for payment status
          if (transactionId) {
            startPaymentStatusPolling(transactionId);
          }
          
          setSuccess('Payment initiated. Please complete payment in the new window.');
          toast.success('Payment window opened. Please complete your payment.');
          
        } else if (status === 'completed') {
          // Direct payment success (wallet, etc.)
          console.log('✅ Payment completed immediately');
          handlePaymentVerificationSuccess(paymentResult);
          
        } else if (status === 'pending') {
          // Handle different types of pending payments without payment link
          if (selectedMethod === 'cash') {
            console.log('💵 Cash payment selected');
            setPaymentStatus('completed');
            setSuccess('Cash payment option selected. Please visit our office to complete payment.');
            onPaymentSuccess?.(paymentResult);
          } else if (selectedMethod === 'bank_transfer') {
            console.log('🏦 Bank transfer initiated');
            setPaymentStatus('completed');
            setSuccess('Bank transfer details have been sent. Please complete the transfer.');
            onPaymentSuccess?.(paymentResult);
          } else {
            console.log('⏳ Payment is pending - but no payment link found');
            setPaymentStatus('failed');
            setError('Payment gateway link not found. Please try again.');
          }
          setIsProcessing(false);
          
        } else if (status === 'failed') {
          console.log('❌ Payment failed');
          throw new Error(paymentResult.message || 'Payment failed');
        } else {
          console.warn('⚠️ Unknown payment status:', status);
          throw new Error(`Unexpected payment status: ${status}`);
        }
      } else {
        throw new Error(paymentResult.error || paymentResult.message || 'Payment processing failed');
      }
      
    } catch (error) {
      console.error('💥 Payment processing error:', error);
      
      setPaymentStatus('failed');
      setIsProcessing(false);
      
      // Provide user-friendly error messages
      let userErrorMessage;
      if (error.message.includes('network') || error.message.includes('fetch')) {
        userErrorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message.includes('authentication') || error.message.includes('unauthorized')) {
        userErrorMessage = 'Authentication error. Please log in again and retry.';
      } else if (error.message.includes('insufficient')) {
        userErrorMessage = error.message;
      } else {
        userErrorMessage = error.message || 'Payment processing failed. Please try again.';
      }

      setError(userErrorMessage);
      toast.error(userErrorMessage);
      onPaymentError?.(userErrorMessage);
    }
  };

  const handleMethodSelect = (methodId) => {
    const method = paymentMethods.find(m => m.id === methodId);
    if (!method?.supported) {
      if (methodId === 'wallet') {
        toast.error(`Insufficient wallet balance. You need ₦${(totalAmount - walletBalance).toLocaleString()} more.`);
      } else {
        toast.error('This payment method is not currently available');
      }
      return;
    }
    setSelectedMethod(methodId);
    // Reset states when changing payment method
    setError('');
    setSuccess('');
    setPaymentStatus('idle');
    setPollAttempts(0);
  };

  // Generate booking reference if not provided
  const getBookingReference = () => {
    return bookingData?.booking_reference || 
           bookingData?.id || 
           `BK${Date.now().toString().slice(-8)}`;
  };

  // Payment Status Component
  const PaymentStatus = () => {
    if (paymentStatus === 'processing' || isProcessing) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600">Processing payment...</p>
          {paymentStatus === 'pending' && (
            <p className="text-sm text-gray-600 mt-2">Please complete payment in the popup window</p>
          )}
        </div>
      );
    }
    
    if (paymentStatus === 'completed' || success) {
      return (
        <div className="text-center py-8">
          <div className="text-green-600 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">Payment Successful!</h3>
          <p className="text-green-600">{success}</p>
        </div>
      );
    }
    
    if (paymentStatus === 'failed' || error) {
      return (
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Payment Failed</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => {
              setError('');
              setSuccess('');
              setPaymentStatus('idle');
              setIsProcessing(false);
              setPollAttempts(0);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      );
    }
    
    return null;
  };

  // Early return if no booking data or amount
  if (!bookingData || !totalAmount) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-gray-600">No booking information or amount available</p>
          <p className="text-sm text-gray-500 mt-2">
            Booking Data: {bookingData ? 'Available' : 'Missing'} | 
            Amount: {totalAmount ? `₦${totalAmount.toLocaleString()}` : 'Missing'}
          </p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Validate booking data before rendering
  const validation = validateBookingData(bookingData);
  if (!validation.valid) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-600 font-medium">Booking Validation Error</p>
          <p className="text-gray-600 mt-2">{validation.error}</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Show payment status if processing, completed, or failed
  if (paymentStatus !== 'idle') {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Status</h2>
          <PaymentStatus />
          
          {paymentStatus === 'pending' && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <div>
                  <h4 className="font-medium text-blue-800">Payment in Progress</h4>
                  <p className="text-sm text-blue-600 mt-1">
                    {paymentWindow && !paymentWindow.closed 
                      ? 'Please complete your payment in the popup window' 
                      : 'Waiting for payment confirmation...'}
                  </p>
                  {paymentReference && (
                    <p className="text-xs text-blue-500 mt-1">
                      Reference: {paymentReference}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="mt-4 flex space-x-3">
                {paymentWindow && paymentWindow.closed && (
                  <button
                    onClick={() => {
                      const newWindow = window.open(
                        paymentData?.data?.paymentResult?.paymentResult?.paymentLink || 
                        paymentData?.data?.paymentResult?.nextAction?.url ||
                        paymentData?.paymentResult?.paymentLink,
                        'payment',
                        'width=600,height=700,scrollbars=yes,resizable=yes'
                      );
                      setPaymentWindow(newWindow);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Reopen Payment Window
                  </button>
                )}
                
                <button
                  onClick={() => {
                    if (pollingInterval) {
                      clearInterval(pollingInterval);
                      setPollingInterval(null);
                    }
                    if (paymentWindow && !paymentWindow.closed) {
                      paymentWindow.close();
                      setPaymentWindow(null);
                    }
                    setPaymentStatus('idle');
                    setIsProcessing(false);
                    setError('');
                    setSuccess('');
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                >
                  Cancel Payment
                </button>
              </div>
            </div>
          )}
          
          {(paymentStatus === 'failed' || paymentStatus === 'completed') && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Complete Payment</h2>
        
        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
            <p>Debug: userId = {currentUserId || 'Not set'}</p>
          </div>
        )}
        
        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <span className="text-red-600">❌</span>
              <div className="text-sm text-red-800">
                <p className="font-medium mb-1">Payment Error</p>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success Display */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <span className="text-green-600">✅</span>
              <div className="text-sm text-green-800">
                <p className="font-medium mb-1">Success</p>
                <p>{success}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Booking Summary */}
        <div className="bg-blue-50 p-6 rounded-lg mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Booking Details</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking Reference:</span>
                  <span className="font-semibold">{getBookingReference()}</span>
                </div>
                {bookingData.selectedFlight && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Flight:</span>
                      <span className="font-semibold">
                        {bookingData.selectedFlight.airline} {bookingData.selectedFlight.flightNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Route:</span>
                      <span className="font-semibold">
                        {bookingData.selectedFlight.departure?.airport} → {bookingData.selectedFlight.arrival?.airport}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Departure:</span>
                      <span className="font-semibold">
                        {bookingData.selectedFlight.departure?.time}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Passenger Information</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Passengers:</span>
                  <span className="font-semibold">{bookingData.passengers?.length || 0}</span>
                </div>
                {bookingData.passengers?.map((passenger, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-600">
                      {passenger.type === 'adult' ? 'Adult' : 
                       passenger.type === 'child' ? 'Child' : 'Infant'} {index + 1}:
                    </span>
                    <span className="font-semibold">
                      {passenger.first_name} {passenger.last_name}
                    </span>
                  </div>
                )) || (
                  <span className="text-gray-500 italic">No passenger details available</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-700">Total Amount:</span>
              <span className="text-3xl font-bold text-green-600">
                ₦{totalAmount?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        {bookingData.contactInfo && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-gray-800 mb-2">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {bookingData.contactInfo.email && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-semibold">{bookingData.contactInfo.email}</span>
                </div>
              )}
              {bookingData.contactInfo.phone && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-semibold">{bookingData.contactInfo.phone}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
        <div className="grid gap-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              onClick={() => handleMethodSelect(method.id)}
              className={`
                border-2 rounded-lg p-4 cursor-pointer transition-all duration-200
                ${selectedMethod === method.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
                }
                ${!method.supported ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{method.icon}</span>
                  <div>
                    <div className="font-medium">{method.name}</div>
                    <div className="text-sm text-gray-600">{method.description}</div>
                  </div>
                </div>
                <div className={`
                  w-4 h-4 rounded-full border-2 
                  ${selectedMethod === method.id 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-300'
                  }
                `}>
                  {selectedMethod === method.id && (
                    <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment method specific information */}
      {selectedMethod === 'cash' && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <span className="text-yellow-600">⚠️</span>
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Cash Payment Instructions:</p>
              <p>Please visit our office at [Your Office Address] during business hours (9 AM - 5 PM) to complete your payment.</p>
              <p className="mt-1">Bring your booking reference: <strong>{getBookingReference()}</strong></p>
            </div>
          </div>
        </div>
      )}

      {selectedMethod === 'wallet' && walletBalance < totalAmount && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <span className="text-red-600">❌</span>
            <div className="text-sm text-red-800">
              <p className="font-medium mb-1">Insufficient Wallet Balance</p>
              <p>You need ₦{(totalAmount - walletBalance).toLocaleString()} more to complete this payment.</p>
              <button 
                onClick={() => navigate('/wallet/fund')}
                className="mt-2 text-blue-600 hover:text-blue-800 underline"
              >
                Fund your wallet
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedMethod === 'ussd' && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <span className="text-blue-600">📱</span>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">USSD Payment Instructions:</p>
              <p>After clicking "Pay", you'll receive a USSD code to dial on your phone to complete the payment.</p>
            </div>
          </div>
        </div>
      )}

      {selectedMethod === 'bank_transfer' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <span className="text-green-600">🏦</span>
            <div className="text-sm text-green-800">
              <p className="font-medium mb-1">Bank Transfer Instructions:</p>
              <p>After clicking "Pay", you'll receive bank account details to complete your transfer.</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex space-x-4">
        <button
          onClick={onClose}
          className="flex-1 py-3 px-6 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          disabled={isProcessing}
        >
          Cancel
        </button>
        <button
          onClick={processPayment}
          disabled={isProcessing || !selectedMethod || !totalAmount}
          className={`
            flex-1 py-3 px-6 rounded-lg text-white font-medium transition-colors
            ${isProcessing || !totalAmount
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
            }
          `}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : (
            `Pay ₦${totalAmount?.toLocaleString() || '0'}`
          )}
        </button>
      </div>

      {/* Payment status display */}
      {paymentData && paymentStatus === 'idle' && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Last Payment Attempt</h4>
          <div className="text-sm text-gray-600">
            {paymentData.data?.paymentResult?.transactionId && (
              <p>Transaction ID: {paymentData.data.paymentResult.transactionId}</p>
            )}
            {paymentData.paymentResult?.status && (
              <p>Status: <span className="capitalize">{paymentData.paymentResult.status}</span></p>
            )}
          </div>
        </div>
      )}

      {/* Payment Window Monitor */}
      {paymentWindow && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-blue-800">Payment window is active</span>
            </div>
            <button
              onClick={() => {
                if (paymentWindow && !paymentWindow.closed) {
                  paymentWindow.focus();
                } else {
                  setError('Payment window was closed. Please try again.');
                  setPaymentStatus('failed');
                  setIsProcessing(false);
                }
              }}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Focus Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegratedPayment;