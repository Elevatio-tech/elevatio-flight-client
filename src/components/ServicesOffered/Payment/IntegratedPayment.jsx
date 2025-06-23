import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { backendUrl } from '../../../config/config';

// const backendUrl = 'http://localhost:5000';

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
  userId: providedUserId, // Make it optional
  partnerId = null
}) => {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(providedUserId);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  console.log("hello", bookingData)

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
    
    // Check for required flight information
    if (!data.selectedFlight) {
      return { valid: false, error: 'Flight information is missing' };
    }
    
    // Check for passengers
    if (!data.passengers || !Array.isArray(data.passengers) || data.passengers.length === 0) {
      return { valid: false, error: 'Passenger information is missing' };
    }
    
    // Validate each passenger
    for (let i = 0; i < data.passengers.length; i++) {
      const passenger = data.passengers[i];
      if (!passenger.first_name || !passenger.last_name) {
        return { valid: false, error: `Passenger ${i + 1} is missing required information` };
      }
    }
    
    // Check for contact info
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

  const fetchWalletBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No authentication token found');
        return;
      }

      console.log("token of user", token)
      
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

  const handlePaymentCallback = async (status, txRef, transactionId) => {
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
            toast.success('Payment completed successfully!');
            onPaymentSuccess?.(verificationResult.data);
            navigate('/booking');
          } else {
            toast.error('Payment verification failed');
            onPaymentError?.('Payment verification failed');
          }
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        const errorMsg = 'Failed to verify payment';
        toast.error(errorMsg);
        onPaymentError?.(errorMsg);
      }
    } else if (status === 'cancelled') {
      toast.info('Payment was cancelled');
    } else {
      const errorMsg = 'Payment failed';
      toast.error(errorMsg);
      onPaymentError?.(errorMsg);
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

const processPayment = async () => {
  try {
    // Validate user authentication
    await validateUserAuthentication();
  } catch (authError) {
    onPaymentError?.(authError.message);
    return;
  }
  
  // Enhanced validation
  if (!totalAmount || totalAmount <= 0) {
    const errorMsg = 'Invalid payment amount';
    toast.error(errorMsg);
    onPaymentError?.(errorMsg);
    return;
  }

  if (!selectedMethod) {
    const errorMsg = 'Please select a payment method';
    toast.error(errorMsg);
    onPaymentError?.(errorMsg);
    return;
  }

  // Validate booking data
  const validation = validateBookingData(bookingData);
  if (!validation.valid) {
    toast.error(validation.error);
    onPaymentError?.(validation.error);
    return;
  }

  // Use currentUserId (either from prop or extracted from token)
  const userIdToUse = currentUserId;
  console.log('Using userId:', userIdToUse);

  if (!userIdToUse) {
    const errorMsg = 'User authentication required. Please log in and try again.';
    toast.error(errorMsg);
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
          total: totalAmount.toString(), // Backend expects string
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
      
      console.log('Converted flightOffer:', JSON.stringify(flightOffer, null, 2));
      
      // Prepare booking payload in the exact format backend expects
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
        paymentMethodId: null // Will be set after payment
      };

      console.log('Final booking payload:', JSON.stringify(bookingPayload, null, 2));

      // Create booking headers - only include partner ID if it exists
      const bookingHeaders = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      // Only add X-Partner-Id header if partnerId is provided and not null
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
      
      // Extract booking ID from response
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
      userId: userIdToUse // Use the resolved userId
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
    
    // ENHANCED PAYMENT RESPONSE DEBUGGING
    console.log('=== PAYMENT RESPONSE DEBUG ===');
    console.log('Response status:', paymentResponse.status);
    console.log('Response ok:', paymentResponse.ok);
    console.log('Full payment result:', JSON.stringify(paymentResult, null, 2));
    
    // Log all possible payment link locations
    console.log('Payment link extraction attempts:');
    console.log('  - paymentResult.paymentResult?.paymentLink:', paymentResult.paymentResult?.paymentLink);
    console.log('  - paymentResult.nextAction?.url:', paymentResult.nextAction?.url);
    console.log('  - paymentResult.gatewayResponse?.data?.link:', paymentResult.gatewayResponse?.data?.link);
    console.log('  - paymentResult.paymentResult?.gatewayResponse?.data?.link:', paymentResult.paymentResult?.gatewayResponse?.data?.link);
    console.log('===============================');

    if (!paymentResponse.ok) {
      console.error('Payment processing failed:', paymentResult);
      throw new Error(paymentResult.error || paymentResult.message || 'Payment processing failed');
    }

    // Handle payment response
    if (paymentResult) {
  setPaymentData(paymentResult);

  // CORRECTED PAYMENT LINK EXTRACTION - Added missing .data path
  const paymentLink = 
    paymentResult.data?.paymentResult?.paymentResult?.paymentLink || 
    paymentResult.data?.paymentResult?.nextAction?.url ||
    paymentResult.data?.paymentResult?.gatewayResponse?.data?.link ||
    paymentResult.paymentResult?.paymentLink || 
    paymentResult.nextAction?.url ||
    paymentResult.gatewayResponse?.data?.link ||
    paymentResult.paymentResult?.gatewayResponse?.data?.link ||
    paymentResult.data?.link ||
    paymentResult.link;

  const paymentStatus = 
    paymentResult.data?.paymentResult?.status ||
    paymentResult.paymentResult?.status || 
    paymentResult.status || 
    'unknown';

  console.log('🔍 EXTRACTED VALUES:');
  console.log('  Payment Link:', paymentLink);
  console.log('  Payment Status:', paymentStatus);

  // Handle different payment scenarios
  if (paymentLink) {
    // External payment gateway (Flutterwave) - REDIRECT
    console.log('🚀 Payment link found, preparing redirect...');
    console.log('🔗 Redirect URL:', paymentLink);
    
    toast.success('Redirecting to payment gateway...', {
      duration: 1500,
      position: 'top-center'
    });
    
    // IMMEDIATE REDIRECT
    console.log('🚀 EXECUTING REDIRECT NOW...');
    
    // Use setTimeout to ensure toast displays first, then redirect
    setTimeout(() => {
      window.location.href = paymentLink;
    }, 100); // Very short delay to ensure redirect happens
    
    return; // Exit early to prevent further processing

  } else if (paymentStatus === 'completed') {
    // Payment completed immediately
    console.log('✅ Payment completed immediately');
    toast.success('Payment completed successfully!');
    onPaymentSuccess?.(paymentResult);

  } else if (paymentStatus === 'pending') {
    // Handle different types of pending payments
    if (selectedMethod === 'cash') {
      console.log('💵 Cash payment selected');
      toast.success('Cash payment option selected. Please visit our office to complete payment.');
      onPaymentSuccess?.(paymentResult);
    } else if (selectedMethod === 'bank_transfer') {
      console.log('🏦 Bank transfer initiated');
      toast.info('Bank transfer details have been sent. Please complete the transfer.');
      onPaymentSuccess?.(paymentResult);
    } else {
      console.log('⏳ Payment is pending - but no payment link found');
      
      // CRITICAL: If payment is pending but no link, something is wrong
      console.error('🚨 PAYMENT PENDING BUT NO PAYMENT LINK!');
      console.error('🔍 Full payment response:', JSON.stringify(paymentResult, null, 2));
      
      // Try to find the link in debug mode
      const debugLink = findPaymentLinkDebug(paymentResult);
      if (debugLink) {
        console.log('🔍 Found payment link in debug mode:', debugLink);
        window.location.href = debugLink;
        return;
      }
      
      toast.error('Payment gateway link not found. Please try again.');
      onPaymentError?.('Payment gateway link not found');
    }
  } else if (paymentStatus === 'failed') {
    console.log('❌ Payment failed');
    throw new Error(paymentResult.message || 'Payment failed');
  } else {
    // Unknown status
    console.warn('⚠️ Unknown payment status:', paymentStatus);
    throw new Error(`Unexpected payment status: ${paymentStatus}`);
  }
}
  } catch (error) {
    console.error('💥 Payment processing error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    // Provide user-friendly error messages
    let userErrorMessage;
    if (error.message.includes('network') || error.message.includes('fetch')) {
      userErrorMessage = 'Network error. Please check your internet connection and try again.';
    } else if (error.message.includes('authentication') || error.message.includes('unauthorized')) {
      userErrorMessage = 'Authentication error. Please log in again and retry.';
    } else if (error.message.includes('insufficient')) {
      userErrorMessage = error.message; // Keep original message for balance issues
    } else {
      userErrorMessage = error.message || 'Payment processing failed. Please try again.';
    }

    toast.error(userErrorMessage, {
      duration: 5000,
      position: 'top-center'
    });
    
    onPaymentError?.(userErrorMessage);
  } finally {
    // Only reset processing state if we're not redirecting
    if (!window.location.href.includes('flutterwave.com')) {
      setIsProcessing(false);
    }
  }
};

function findPaymentLinkDebug(obj, path = '') {
  if (typeof obj !== 'object' || obj === null) return null;
  
  // Check if current object has a link-like property
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;
    
    // Check if this looks like a payment link
    if (typeof value === 'string' && value.includes('flutterwave.com')) {
      console.log(`🔍 Found payment link at path: ${currentPath} = ${value}`);
      return value;
    }
    
    // Recursively search nested objects
    if (typeof value === 'object' && value !== null) {
      const foundLink = findPaymentLinkDebug(value, currentPath);
      if (foundLink) return foundLink;
    }
  }
  
  return null;
}

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
  };

  // Generate booking reference if not provided
  const getBookingReference = () => {
    return bookingData?.booking_reference || 
           bookingData?.id || 
           `BK${Date.now().toString().slice(-8)}`;
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
      {paymentData && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Payment Status</h4>
          <div className="text-sm text-gray-600">
            <p>Transaction ID: {paymentData.payment?.transaction_id}</p>
            <p>Status: <span className="capitalize">{paymentData.paymentResult?.status}</span></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegratedPayment;