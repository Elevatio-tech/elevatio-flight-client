import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Plane,
  CreditCard,
  Download,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Luggage,
  Armchair,
  Plus,
  Minus,
  Trash2,
  Edit3,
  Filter,
  Search,
  ArrowRight,
  Eye,
  Hash, Timer,
  Badge,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import summaryApi from '../../common';
import { useLocation } from 'react-router-dom';
import IntegratedPayment from '../../pages/Payment/IntegratedPayment';
import { backendUrl } from '../../config/config';
import Header from '../Navbar/Header';


// const backendUrl = 'http://localhost:5000';


// Helper function to make API calls (enhanced version userBookings)
const makeApiCall = async (endpoint, data = null, pathParams = {}) => {
  try {
    let url = endpoint.url;
    
    // Replace path parameters
    Object.keys(pathParams).forEach(key => {
      url = url.replace(`:${key}`, pathParams[key]);
    });

    const config = {
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Handle query parameters for GET requests
    if (data && endpoint.method === 'GET') {
      url += `?${new URLSearchParams(data)}`;
    }

    // Add body for POST/PUT requests
    if (data && (endpoint.method === 'POST' || endpoint.method === 'PUT')) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(url, config);
    
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    // Handle different response types
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else if (endpoint.url.includes('/ticket')) {
      return await response.blob();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Payment Method Selection Component
const PaymentMethodSelector = ({ selectedMethod, onMethodChange, methods = ['card', 'wallet', 'mobile_money', 'bank_transfer', 'cash'] }) => {
  const methodIcons = {
    card: <CreditCard className="w-5 h-5" />,
    wallet: <Wallet className="w-5 h-5" />,
    bank_transfer: <ArrowUpRight className="w-5 h-5" />,
    mobile_money: <ArrowDownLeft className="w-5 h-5" />,
    cash: <DollarSign className="w-5 h-5" />
  };

  const methodLabels = {
    card: 'Card Payment',
    wallet: 'Wallet',
    bank_transfer: 'Bank Transfer',
    mobile_money: 'Mobile Money',
    cash: 'Cash Payment'
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">Select Payment Method</h3>
      <div className="grid grid-cols-2 gap-3">
        {methods.map((method) => (
          <button
            key={method}
            onClick={() => onMethodChange(method)}
            className={`p-4 border-2 rounded-lg flex items-center space-x-3 transition-all ${
              selectedMethod === method
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {methodIcons[method]}
            <span className="font-medium">{methodLabels[method]}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const Bookings = ({ onBack, user }) => {

  const [activeTab, setActiveTab] = useState('create');
  const [bookingStep, setBookingStep] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentReference, setPaymentReference] = useState('');
  const location = useLocation();
  const bookingData = location.state;
  
  console.log('bookingData from location.state:', bookingData);
  console.log('goodygood', bookingData);
  
  const searchData = bookingData?.searchData || bookingData?.search || null;
  const selectedFlight = bookingData?.selectedFlight || bookingData?.flight || null;

  // Debug logging - remove after fixing
  console.log('bookingData prop:', bookingData);
  console.log('extracted selectedFlight:', selectedFlight);
  console.log('extracted searchData:', searchData);
  
  const [internalBookingData, setInternalBookingData] = useState({
    passengers: [],
    contactInfo: {
      email: user?.email || '',
      phone: user?.phone || '',
      emergencyContact: ''
    },
    seatSelections: [],
    baggageSelections: [],
    promoCode: ''
  });
  
  const [userBookings, setUserBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [pendingBookingId, setPendingBookingId] = useState(null);
  
  
    // Initialize component with selected flight data
  useEffect(() => {
    if (selectedFlight && activeTab === 'create') {
      setInternalBookingData(prev => ({
        ...prev,
        selectedFlight: selectedFlight,
        flightDetails: {
          id: selectedFlight.id,
          airline: selectedFlight.airline,
          flightNumber: selectedFlight.flightNumber,
          departure: selectedFlight.departure,
          arrival: selectedFlight.arrival,
          duration: selectedFlight.duration,
          stops: selectedFlight.stops,
          price: selectedFlight.price,
          date: searchData?.departDate,
          returnDate: searchData?.returnDate,
          passengers: searchData?.passengers
        }
      }));

      if (searchData?.passengers && internalBookingData.passengers.length === 0) {
        initializePassengers();
      }
    }
  }, [selectedFlight, searchData, activeTab]);

  useEffect(() => {
    if (activeTab === 'manage') {
      loadUserBookings();
    }
  }, [activeTab]);

  const initializePassengers = () => {
    const passengers = [];
    const { adults = 1, children = 0, infants = 0 } = searchData?.passengers || {};

    // Add adults
    for (let i = 0; i < adults; i++) {
      passengers.push({
        id: Date.now() + i,
        type: 'adult',
        title: 'Mr',
        first_name: '',
        last_name: '',
        date_of_birth: '',
        passport_number: '',
        nationality: '',
        email: i === 0 ? user?.email || '' : '',
        phone: i === 0 ? user?.phone || '' : ''
      });
    }

    // Add children
    for (let i = 0; i < children; i++) {
      passengers.push({
        id: Date.now() + adults + i,
        type: 'child',
        title: 'Master',
        first_name: '',
        last_name: '',
        date_of_birth: '',
        passport_number: '',
        nationality: '',
        email: '',
        phone: ''
      });
    }

    // Add infants
    for (let i = 0; i < infants; i++) {
      passengers.push({
        id: Date.now() + adults + children + i,
        type: 'infant',
        title: 'Baby',
        first_name: '',
        last_name: '',
        date_of_birth: '',
        passport_number: '',
        nationality: '',
        email: '',
        phone: ''
      });
    }

    setInternalBookingData(prev => ({
      ...prev,
      passengers: passengers
    }));
  };


  useEffect(() => {
    if (activeTab === 'manage') {
      loadUserBookings();
    }
  }, [activeTab]);

  const loadUserBookings = async () => {
  try {
    setLoading(true);
    setError('');
    
    console.log('Loading user bookings...');
    console.log('API endpoint:', summaryApi.getUserBookings);
    
    const response = await makeApiCall(summaryApi.getUserBookings);
    
    console.log('Raw API response:', response);
    console.log('Response type:', typeof response);
    console.log('Response keys:', Object.keys(response || {}));
    
    // Try different possible data structures
    let bookingsData = [];
    
    if (Array.isArray(response)) {
      bookingsData = response;
      console.log('Response is array, using directly');
    } else if (response.bookings && Array.isArray(response.bookings)) {
      bookingsData = response.bookings;
      console.log('Using response.bookings');
    } else if (response.data && Array.isArray(response.data)) {
      bookingsData = response.data;
      console.log('Using response.data');
    } else if (response.results && Array.isArray(response.results)) {
      bookingsData = response.results;
      console.log('Using response.results');
    } else {
      console.log('Unknown response structure, using fallback');
      bookingsData = response ? [response] : [];
    }
    
    console.log('Final bookings data:', bookingsData);
    console.log('Number of bookings:', bookingsData.length);
    
    // Log first booking structure if available
    if (bookingsData.length > 0) {
      console.log('First booking structure:', bookingsData[0]);
      console.log('First booking keys:', Object.keys(bookingsData[0] || {}));
    }
    
    setUserBookings(bookingsData);
    
  } catch (err) {
    console.error('Load bookings error:', err);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    
    setError('Failed to load bookings: ' + err.message);
  } finally {
    setLoading(false);
  }
};

const addPassenger = () => {
    const newPassenger = {
      id: Date.now(),
      type: 'adult',
      title: 'Mr',
      first_name: '',
      last_name: '',
      date_of_birth: '',
      passport_number: '',
      nationality: '',
      email: '',
      phone: ''
    };
    setInternalBookingData(prev => ({
      ...prev,
      passengers: [...prev.passengers, newPassenger]
    }));
  };

  const removePassenger = (id) => {
    if (internalBookingData.passengers.length <= 1) {
      setError('At least one passenger is required');
      return;
    }
    setInternalBookingData(prev => ({
      ...prev,
      passengers: prev.passengers.filter(p => p.id !== id)
    }));
  };

  const updatePassenger = (id, field, value) => {
    setInternalBookingData(prev => ({
      ...prev,
      passengers: prev.passengers.map(p => 
        p.id === id ? { ...p, [field]: value } : p
      )
    }));
  };

  const updateContactInfo = (field, value) => {
    setInternalBookingData(prev => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, [field]: value }
    }));
  };

  const updatePaymentData = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setPaymentData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setPaymentData(prev => ({ ...prev, [field]: value }));
    }
  };

  const applyPromoCode = async () => {
    if (!internalBookingData.promoCode.trim()) {
      setError('Please enter a promo code');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Make API call to validate promo codeseat
      // Since there's no specific promo code endpoint in your API, 
      // you might need to add this or handle it in the booking creation
      const basePrice = selectedFlight.price * internalBookingData.passengers.length;
      
      // Simulate promo code validation - replace with actual API call
      const validPromoCodes = {
        'SAVE10': 10,
        'WELCOME15': 15,
        'STUDENT20': 20,
        'FIRST25': 25
      };
      
      const discountPercent = validPromoCodes[internalBookingData.promoCode.toUpperCase()];
      if (discountPercent) {
        const discount = (basePrice * discountPercent) / 100;
        setPromoDiscount(discount);
        setSuccess(`Promo code applied! You saved $${discount.toFixed(2)} (${discountPercent}% off)`);
      } else {
        throw new Error('Invalid promo code');
      }
    } catch (err) {
      setError('Invalid promo code: ' + err.message);
      setPromoDiscount(0);
    } finally {
      setLoading(false);
    }
  };

 
  const calculateTotal = () => {
  if (!selectedFlight) return 0;
  
  let basePrice = selectedFlight.price || selectedFlight.totalPrice || 0;
  
  // Calculate total based on passengers
  const passengerCount = internalBookingData.passengers.length || 1;
  let total = basePrice * passengerCount;
  
  // Add baggage fees
  const baggageFees = internalBookingData.baggageSelections.reduce((sum, baggage) => {
    return sum + (baggage.price || 0);
  }, 0);
  
  // Add seat selection fees
  const seatFees = internalBookingData.seatSelections.reduce((sum, seat) => {
    return sum + (seat.price || 0);
  }, 0);
  
  // Calculate subtotal
  const subtotal = total + baggageFees + seatFees;
  
  // Apply promo discount
  const discount = promoDiscount || 0;
  
  // Add taxes (example: 7.5% VAT)
  const taxes = subtotal * 0.075;
  
  const finalTotal = Math.max(0, subtotal + taxes - discount);
  
  return parseFloat(finalTotal.toFixed(2));
};


 // Function to create booking before payment (if needed)price
const createPendingBooking = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${backendUrl}/api/bookings/create-pending`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        selectedFlight: selectedFlight,
        passengers: internalBookingData.passengers,
        contactInfo: internalBookingData.contactInfo,
        seatSelections: internalBookingData.seatSelections,
        baggageSelections: internalBookingData.baggageSelections,
        promoCode: internalBookingData.promoCode,
        totalAmount: calculateTotal(),
        userId: user?.id
      })
    });

    const result = await response.json();
    if (response.ok) {
      setPendingBookingId(result.bookingId || result.id);
      return result.bookingId || result.id;
    } else {
      throw new Error(result.error || 'Failed to create pending booking');
    }
  } catch (error) {
    console.error('Error creating pending booking:', error);
    setError('Failed to create booking. Please try again.');
    return null;
  }
};


const proceedToPayment = async () => {
  // Validate required fields
  const requiredPassengerFields = ['first_name', 'last_name', 'date_of_birth'];
  const isValid = internalBookingData.passengers.every(passenger => 
    requiredPassengerFields.every(field => passenger[field]?.trim())
  );

  if (!isValid) {
    setError('Please fill in all required passenger information');
    return;
  }

  if (!internalBookingData.contactInfo.email || !internalBookingData.contactInfo.phone) {
    setError('Please provide contact information');
    return;
  }

  // Create pending booking if not already created
  if (!pendingBookingId) {
    const bookingId = await createPendingBooking();
    if (!bookingId) {
      return; // Error already handled in createPendingBooking
    }
  }

  setBookingStep(3); // Move to payment step
};



  const validateBookingData = () => {
    const errors = [];

    if (!selectedFlight && bookingStep > 1) {
      errors.push('No flight selected');
    }

    if (internalBookingData.passengers.length === 0) {
      errors.push('At least one passenger is required');
    }

    internalBookingData.passengers.forEach((passenger, index) => {
      if (!passenger.first_name?.trim()) {
        errors.push(`Passenger ${index + 1}: First name is required`);
      }
      if (!passenger.last_name?.trim()) {
        errors.push(`Passenger ${index + 1}: Last name is required`);
      }
      if (!passenger.date_of_birth) {
        errors.push(`Passenger ${index + 1}: Date of birth is required`);
      }
      if (!passenger.passport_number?.trim()) {
        errors.push(`Passenger ${index + 1}: Passport number is required`);
      }
      if (!passenger.nationality?.trim()) {
        errors.push(`Passenger ${index + 1}: Nationality is required`);
      }
    });

    if (!internalBookingData.contactInfo.email?.trim()) {
      errors.push('Contact email is required');
    }
    if (!internalBookingData.contactInfo.phone?.trim()) {
      errors.push('Contact phone is required');
    }

    return errors;
  };

 const handleNextStep = () => {
    console.log('Moving to next step, current step:', bookingStep);
    
    const errors = validateBookingData();
    if (errors.length > 0) {
      console.log('Validation errors:', errors);
      setError(errors.join('. '));
      return;
    }
    
    setError('');
    
    // If moving to step 3 (payment), show the integrated payment component
    if (bookingStep === 2) {
      setBookingStep(3);
    } else {
      setBookingStep(prev => prev + 1);
    }
  };

  const handlePayment = async (paymentData) => {
  try {
    setLoading(true);
    setError('');
    
    const response = await fetch(`${backendUrl}/api/payments/process`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        bookingId: pendingBookingId,
        paymentMethod: paymentData.paymentMethod,
        amount: calculateTotal()
      })
    });

    const result = await response.json();
    
    if (result.success) {
      if (result.status === 'pending' && result.paymentLink) {
        // Payment is pending - redirect to payment gateway
        setPaymentReference(result.data.paymentResult.transactionId || result.transactionId);
        
        // Open payment link in new window/tab
        const paymentWindow = window.open(
          result.paymentLink, 
          'payment', 
          'width=600,height=700,scrollbars=yes,resizable=yes'
        );
        
        // Start polling for payment status
        startPaymentStatusPolling(result.data.paymentResult.transactionId);
        
        // Show pending message
        setSuccess('Payment initiated. Please complete payment in the new window.');
        
      } else if (result.status === 'completed') {
        // Direct payment success (wallet, etc.)
        handlePaymentVerificationSuccess(result);
      }
    } else {
      setError(result.error || 'Payment failed');
    }
  } catch (error) {
    setError('Payment failed: ' + error.message);
  } finally {
    setLoading(false);
  }
};

// 2. ADD PAYMENT STATUS POLLING
const startPaymentStatusPolling = (transactionId) => {
  const pollInterval = setInterval(async () => {
    try {
      const response = await fetch(`${backendUrl}/api/payments/verify/${transactionId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (result.success && result.data) {
        if (result.data.successful) {
          // Payment completed successfully
          clearInterval(pollInterval);
          handlePaymentVerificationSuccess(result);
        } else if (result.data.status === 'failed') {
          // Payment failed
          clearInterval(pollInterval);
          setError('Payment failed. Please try again.');
        }
        // If still pending, continue polling
      }
    } catch (error) {
      console.error('Payment status polling error:', error);
      // Continue polling unless it's a critical error
    }
  }, 3000); // Poll every 3 seconds
  
  // Stop polling after 10 minutes
  setTimeout(() => {
    clearInterval(pollInterval);
    setError('Payment verification timed out. Please check your payment status.');
  }, 600000);
};


  const handlePaymentVerificationSuccess = async (verificationResult) => {
  try {
    setLoading(true);
    setError('');
    
    // Update booking status to confirmed
    if (pendingBookingId) {
      const token = localStorage.getItem('token');
      const response = await fetch(`${backendUrl}/api/bookings/${pendingBookingId}/confirm`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentData: verificationResult.data,
          status: 'confirmed'
        })
      });
      
      if (response.ok) {
        setSuccess('Booking confirmed successfully! You will receive a confirmation email shortly.');
        setBookingStep(4); // Now move to confirmation step
        
        // Reset form data
        setInternalBookingData({
          passengers: [],
          contactInfo: {
            email: user?.email || '',
            phone: user?.phone || '',
            emergencyContact: ''
          },
          seatSelections: [],
          baggageSelections: [],
          promoCode: ''
        });
      } else {
        setError('Payment successful but booking confirmation failed. Please contact support.');
      }
    }
    
  } catch (error) {
    console.error('Error confirming booking after payment:', error);
    setError('Payment successful but booking confirmation failed. Please contact support.');
  } finally {
    setLoading(false);
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
          handlePaymentVerificationSuccess(verificationResult);
        } else {
          setError('Payment verification failed');
        }
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setError('Failed to verify payment');
    }
  } else if (status === 'cancelled') {
    setError('Payment was cancelled');
  } else {
    setError('Payment failed');
  }
};



const handleCancelBooking = async (bookingId) => {
  if (!window.confirm('Are you sure you want to cancel this booking? Cancellation fees may apply.')) {
    return;
  }
  
  try {
    setLoading(true);
    setError('');

    const response = await makeApiCall(
      summaryApi.cancelBooking, 
      { reason: 'Customer request' },
      { bookingId }
    );
    
    if (response.success) {
      setSuccess(response.message || 'Booking cancelled successfully');
      if (response.refundAmount > 0) {
        setSuccess(`${response.message}. Refund amount: $${response.refundAmount.toFixed(2)}`);
      }
      
      // Refresh the bookings list
      await loadUserBookings();
      
      // Clear selected booking if it was the cancelled one
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking(null);
      }
    } else {
      setError(response.error || 'Failed to cancel booking');
    }
    
  } catch (err) {
    setError('Failed to cancel booking: ' + (err.message || 'Unknown error'));
    console.error('Cancel booking error:', err);
  } finally {
    setLoading(false);
  }
};

const handleDownloadTicket = async (bookingId) => {
  try {
    setLoading(true);
    setError('');

    // Make API call to download ticket
    const response = await fetch(
      summaryApi.downloadTicket.url.replace(':bookingId', bookingId),
      {
        method: summaryApi.downloadTicket.method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    // Check if response is JSON (error) or PDF (success)
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to download ticket');
    }

    // Get the blob (PDF data)
    const blob = await response.blob();
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Get filename from response headers or use default
    const disposition = response.headers.get('content-disposition');
    let filename = `ticket-${bookingId}.pdf`;
    
    if (disposition && disposition.includes('filename=')) {
      filename = disposition.split('filename=')[1].replace(/"/g, '');
    }
    
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    setSuccess('Ticket downloaded successfully');
    
  } catch (err) {
    setError('Failed to download ticket: ' + (err.message || 'Unknown error'));
    console.error('Download ticket error:', err);
  } finally {
    setLoading(false);
  }
};

// Update your makeApiCall function to handle different response types
const makeApiCall = async (apiConfig, data = null, urlParams = {}) => {
  try {
    let url = apiConfig.url;
    
    // Replace URL parameters
    if (urlParams) {
      Object.keys(urlParams).forEach(key => {
        url = url.replace(`:${key}`, urlParams[key]);
      });
    }

    const config = {
      method: apiConfig.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    };

    if (data && (apiConfig.method === 'POST' || apiConfig.method === 'PUT')) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(url, config);
    
    // For download endpoints, return blob directly
    if (apiConfig.url.includes('/ticket')) {
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.blob();
    }

    // For other endpoints, parse JSON
    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.error || responseData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return responseData;
    
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};
  

  // Flight summary component for booking review
  const FlightSummary = () => {
    if (!selectedFlight) return null;

    return (
      <div className="bg-blue-50 rounded-xl p-4 mb-6">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
          <Plane className="mr-2 text-blue-600" size={20} />
          Selected Flight
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-700">{selectedFlight.airline}</div>
            <div className="text-gray-600">{selectedFlight.flightNumber}</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">
              {selectedFlight.departure.time} → {selectedFlight.arrival.time}
            </div>
            <div className="text-gray-600">{selectedFlight.duration}</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">${selectedFlight?.price} per person</div>
            <div className="text-gray-600">
              {selectedFlight.stops === 0 ? 'Non-stop' : `${selectedFlight.stops} stop(s)`}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCreateBooking = () => {
    switch (bookingStep) {
      case 1:
        return (
          <div className="space-y-6">
            <FlightSummary />
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <Users className="mr-3 text-blue-600" size={24} />
                Passenger Information
              </h3>

              {internalBookingData.passengers.map((passenger, index) => (
                <div key={passenger.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-700">
                      Passenger {index + 1} ({passenger.type})
                    </h4>
                    {internalBookingData.passengers.length > 1 && (
                      <button
                        onClick={() => removePassenger(passenger.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select
                        value={passenger.type}
                        onChange={(e) => updatePassenger(passenger.id, 'type', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="adult">Adult (12+)</option>
                        <option value="child">Child (2-11)</option>
                        <option value="infant">Infant (0-2)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <select
                        value={passenger.title}
                        onChange={(e) => updatePassenger(passenger.id, 'title', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Ms">Ms</option>
                        <option value="Miss">Miss</option>
                        <option value="Dr">Dr</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                      <input
                        type="text"
                        value={passenger.first_name}
                        onChange={(e) => updatePassenger(passenger.id, 'first_name', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="First Name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                      <input
                        type="text"
                        value={passenger.last_name}
                        onChange={(e) => updatePassenger(passenger.id, 'last_name', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Last Name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                      <input
                        type="date"
                        value={passenger.date_of_birth}
                        onChange={(e) => updatePassenger(passenger.id, 'date_of_birth', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number *</label>
                      <input
                        type="text"
                        value={passenger.passport_number}
                        onChange={(e) => updatePassenger(passenger.id, 'passport_number', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Passport Number"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nationality *</label>
                      <input
                        type="text"
                        value={passenger.nationality}
                        onChange={(e) => updatePassenger(passenger.id, 'nationality', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Nationality"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={passenger.email}
                        onChange={(e) => updatePassenger(passenger.id, 'email', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Email (optional)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={passenger.phone}
                        onChange={(e) => updatePassenger(passenger.id, 'phone', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Phone (optional)"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={addPassenger}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                <Plus size={16} />
                <span>Add Another Passenger</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <Mail className="mr-3 text-blue-600" size={24} />
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={internalBookingData.contactInfo.email}
                    onChange={(e) => updateContactInfo('email', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Email Address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    value={internalBookingData.contactInfo.phone}
                    onChange={(e) => updateContactInfo('phone', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Phone Number"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                  <input
                    type="text"
                    value={internalBookingData.contactInfo.emergencyContact}
                    onChange={(e) => updateContactInfo('emergencyContact', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Emergency Contact (optional)"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <FlightSummary />
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <Armchair className="mr-3 text-blue-600" size={24} />
                Seat Selection (Optional)
              </h3>
              <p className="text-gray-600 mb-4">Select your preferred seats. Additional fees may apply for premium seats.</p>
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Armchair className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-500 mb-4">Interactive seat map will be displayed here</p>
                <button 
                  className="text-blue-600 hover:text-blue-800 font-medium"
                  onClick={() => setBookingStep(3)}
                >
                  Skip Seat Selection
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <Luggage className="mr-3 text-blue-600" size={24} />
                Extra Baggage (Optional)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <h4 className="font-medium text-gray-700 mb-2">Extra Checked Bag</h4>
                  <p className="text-sm text-gray-600 mb-3">23kg allowance</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800">$45</span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Add
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <h4 className="font-medium text-gray-700 mb-2">Priority Boarding</h4>
                  <p className="text-sm text-gray-600 mb-3">Board first</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800">$25</span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Add
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <h4 className="font-medium text-gray-700 mb-2">Travel Insurance</h4>
                  <p className="text-sm text-gray-600 mb-3">Trip protection</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800">$35</span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
  return (
    <IntegratedPayment
      bookingData={{
        id: pendingBookingId, // Add this if you have a pending booking ID
        selectedFlight: selectedFlight,
        passengers: internalBookingData.passengers,
        contactInfo: internalBookingData.contactInfo,
        seatSelections: internalBookingData.seatSelections,
        baggageSelections: internalBookingData.baggageSelections,
        promoCode: internalBookingData.promoCode,
        booking_reference: pendingBookingId || `BK${Date.now().toString().slice(-8)}`
      }}
      totalAmount={calculateTotal()}
      onPaymentSuccess={handlePaymentVerificationSuccess}
      onPaymentError={(error) => setError(error)}
      onClose={() => setBookingStep(2)} // Go back to previous step
      userId={user?.id}
      
    />
    
  );

        case 4:
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        {paymentReference ? (
          <>
            <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Booking Confirmed!</h3>
            <p className="text-gray-600 mb-6">
              Your flight has been successfully booked and paid for. You will receive confirmation details via email.
            </p>
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-medium">Payment Reference: {paymentReference}</p>
            </div>
          </>
        ) : (
          <>
            <Clock className="mx-auto text-yellow-500 mb-4" size={64} />
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Booking Reserved!</h3>
            <p className="text-gray-600 mb-6">
              Your booking has been reserved. Please complete payment within 15 minutes to confirm your flight.
            </p>
            <div className="bg-yellow-50 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 font-medium">
                Amount Due: ${calculateTotal().toFixed(2)}
              </p>
              <p className="text-yellow-700 text-sm mt-1">
                Reservation expires in: <span className="font-medium">14:32</span>
              </p>
            </div>
          </>
        )}
        
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h4 className="font-semibold text-gray-800 mb-4">Flight Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-sm text-gray-600">From</p>
              <p className="font-medium">{searchData.from}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">To</p>
              <p className="font-medium">{searchData.to}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Departure</p>
              <p className="font-medium">{searchData.departure}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Arrival</p>
              <p className="font-medium">{searchData.arrival}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Passengers</p>
              <p className="font-medium">{internalBookingData.passengers.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="font-medium text-green-600">${calculateTotal().toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!paymentReference ? (
            // Show payment button if not paid
            <>
              <button
                onClick={proceedToPayment}
                disabled={loading}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Clock className="mr-2 animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2" size={20} />
                    Complete Payment - ${calculateTotal().toFixed(2)}
                  </>
                )}
              </button>
              <button
                onClick={() => setBookingStep(3)}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Review
              </button>
            </>
          ) : (
            // Show booking management options if paidhandleNextStep
            <>
              <button
                onClick={() => {
                  setActiveTab('manage');
                  setBookingStep(1);
                  resetBookingData();
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Calendar className="mr-2" size={20} />
                View My Bookings
              </button>
              <button
                onClick={() => {
                  setBookingStep(1);
                  resetBookingData();
                }}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Book Another Flight
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
default:
        return null;
    }
    
  };

  // Helper function to reset booking datapayment step
const resetBookingData = () => {
  setInternalBookingData({
    passengers: [],
    contactInfo: { email: user?.email || '', phone: '', emergencyContact: '' },
    seatSelections: [],
    baggageSelections: [],
    promoCode: ''
  });
  setPaymentData({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: { street: '', city: '', state: '', zipCode: '', country: '' }
  });
  setPromoDiscount(0);
  setPaymentReference('');
};


  const renderManageBookings = () => {
  if (selectedBooking) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedBooking(null)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Bookings
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Booking Details - {selectedBooking.booking_reference || selectedBooking.bookingReference}
            </h3>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedBooking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                selectedBooking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                selectedBooking.status === 'pending' || selectedBooking.status === 'pending_payment' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {selectedBooking.status?.toUpperCase()?.replace('_', ' ') || 'CONFIRMED'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <Plane className="mr-2 text-blue-600" size={20} />
                  Flight Information
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Route:</span>
                    <span className="font-medium">
                      {selectedBooking.flight_offer?.departure?.airport || 
                       selectedBooking.flight_offer?.itineraries?.[0]?.segments?.[0]?.departure?.iataCode || 
                       selectedBooking.flight?.from || 'N/A'} → {selectedBooking.flight_offer?.arrival?.airport || 
                       selectedBooking.flight_offer?.itineraries?.[0]?.segments?.[0]?.arrival?.iataCode || 
                       selectedBooking.flight?.to || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Flight Number:</span>
                    <span className="font-medium">
                      {selectedBooking.flight_offer?.airline || 
                       selectedBooking.flight_offer?.itineraries?.[0]?.segments?.[0]?.carrierCode || ''} {selectedBooking.flight_offer?.flightNumber || 
                       selectedBooking.flight_offer?.itineraries?.[0]?.segments?.[0]?.number || 
                       selectedBooking.flightNumber || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {selectedBooking.created_at ? 
                        new Date(selectedBooking.created_at).toLocaleDateString() : 
                        selectedBooking.date || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Departure:</span>
                    <span className="font-medium">
                      {selectedBooking.flight_offer?.departure?.time || 
                       selectedBooking.flight_offer?.itineraries?.[0]?.segments?.[0]?.departure?.at || 
                       selectedBooking.departure || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Arrival:</span>
                    <span className="font-medium">
                      {selectedBooking.flight_offer?.arrival?.time || 
                       selectedBooking.flight_offer?.itineraries?.[0]?.segments?.[0]?.arrival?.at || 
                       selectedBooking.arrival || 'N/A'}
                    </span>
                  </div>
                  {selectedBooking.flight_offer?.duration && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{selectedBooking.flight_offer.duration}</span>
                    </div>
                  )}
                  {selectedBooking.flight_offer?.aircraft && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Aircraft:</span>
                      <span className="font-medium">{selectedBooking.flight_offer.aircraft}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <Users className="mr-2 text-blue-600" size={20} />
                  Passengers ({selectedBooking.passengers?.length || 0})
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {selectedBooking.passengers?.map((passenger, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-600">Passenger {index + 1}:</span>
                      <span className="font-medium">
                        {passenger.title || ''} {passenger.first_name || passenger.firstName} {passenger.last_name || passenger.lastName}
                      </span>
                    </div>
                  )) || <span className="text-gray-500">No passenger details available</span>}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <Mail className="mr-2 text-blue-600" size={20} />
                  Contact Information
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{selectedBooking.contact_info?.email || selectedBooking.contactInfo?.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{selectedBooking.contact_info?.phone || selectedBooking.contactInfo?.phone || 'N/A'}</span>
                  </div>
                  {selectedBooking.contact_info?.emergencyContact && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Emergency:</span>
                      <span className="font-medium">{selectedBooking.contact_info.emergencyContact}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <CreditCard className="mr-2 text-blue-600" size={20} />
                  Payment Information
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-medium text-green-600">
                      {selectedBooking.flight_offer?.price?.currency || selectedBooking.currency || 'USD'} {(selectedBooking.total_amount || selectedBooking.totalAmount || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Currency:</span>
                    <span className="font-medium">{selectedBooking.flight_offer?.price?.currency || selectedBooking.currency || 'USD'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status:</span>
                    <span className={`font-medium ${
                      selectedBooking.status === 'confirmed' || selectedBooking.paymentStatus === 'paid' ? 'text-green-600' : 
                      selectedBooking.status?.includes('pending') || selectedBooking.paymentStatus === 'pending' ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}>
                      {selectedBooking.status === 'confirmed' ? 'PAID' : 
                       selectedBooking.status === 'pending_payment' ? 'PENDING' :
                       selectedBooking.paymentStatus?.toUpperCase() || 'PENDING'}
                    </span>
                  </div>
                  {selectedBooking.flight_offer?.price?.breakdown && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Base Fare:</span>
                        <span className="font-medium">{selectedBooking.flight_offer.price.breakdown.baseFare}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taxes:</span>
                        <span className="font-medium">{selectedBooking.flight_offer.price.breakdown.taxes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fees:</span>
                        <span className="font-medium">{selectedBooking.flight_offer.price.breakdown.fees}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Booking Actions</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => handleDownloadTicket(selectedBooking.id || selectedBooking._id)}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                  >
                    <Download className="mr-2" size={16} />
                    {loading ? 'Downloading...' : 'Download Ticket'}
                  </button>
                  
                  {selectedBooking.status !== 'cancelled' && (
                    <button
                      onClick={() => handleCancelBooking(selectedBooking.id || selectedBooking._id)}
                      disabled={loading}
                      className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center"
                    >
                      <X className="mr-2" size={16} />
                      {loading ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">My Bookings</h3>
        <button
          onClick={loadUserBookings}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
        >
          {loading ? <Clock className="mr-2 animate-spin" size={16} /> : <Search className="mr-2" size={16} />}
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {loading && userBookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Clock className="mx-auto text-gray-400 mb-4 animate-spin" size={48} />
          <p className="text-gray-500">Loading your bookings...</p>
        </div>
      ) : userBookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
          <h4 className="text-lg font-medium text-gray-700 mb-2">No Bookings Found</h4>
          <p className="text-gray-500 mb-4">You haven't made any flight bookings yet.</p>
          <button
            onClick={() => setActiveTab('create')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Book Your First Flight
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userBookings.map((booking) => (
            <div key={booking.id || booking._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800">
                  {booking.booking_reference || booking.bookingReference || `Booking #${(booking.id || booking._id)?.slice(-8)}`}
                </h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  booking.status === 'pending' || booking.status === 'pending_payment' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {booking.status?.toUpperCase()?.replace('_', ' ') || 'CONFIRMED'}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                {/* Flight Route */}
                <div className="flex items-center text-sm text-gray-600">
                  <Plane className="mr-2" size={14} />
                  <span>
                    {booking.flight_offer?.departure?.airport || 
                     booking.flight_offer?.itineraries?.[0]?.segments?.[0]?.departure?.iataCode || 
                     booking.flight?.from || 'N/A'} → {booking.flight_offer?.arrival?.airport || 
                     booking.flight_offer?.itineraries?.[0]?.segments?.[0]?.arrival?.iataCode || 
                     booking.flight?.to || 'N/A'}
                  </span>
                </div>

                {/* Flight Number */}
                <div className="flex items-center text-sm text-gray-600">
                  <Hash className="mr-2" size={14} />
                  <span>
                    {booking.flight_offer?.airline || 
                     booking.flight_offer?.itineraries?.[0]?.segments?.[0]?.carrierCode || ''} {booking.flight_offer?.flightNumber || 
                     booking.flight_offer?.itineraries?.[0]?.segments?.[0]?.number || 
                     booking.flightNumber || 'N/A'}
                  </span>
                </div>

                {/* Date */}
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="mr-2" size={14} />
                  <span>
                    {booking.created_at ? 
                      new Date(booking.created_at).toLocaleDateString() : 
                      booking.date || 'N/A'}
                  </span>
                </div>

                {/* Departure and Arrival Times */}
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="mr-2" size={14} />
                  <div className="flex gap-4">
                    <span>
                      <span className='font-bold mr-1'>Depart:</span>
                      {booking.flight_offer?.departure?.time || 
                       booking.flight_offer?.itineraries?.[0]?.segments?.[0]?.departure?.at || 
                       booking.departure || 'N/A'}
                    </span>
                    <span>
                      <span className='font-bold mr-1'>Arrive:</span>
                      {booking.flight_offer?.arrival?.time || 
                       booking.flight_offer?.itineraries?.[0]?.segments?.[0]?.arrival?.at || 
                       booking.arrival || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Duration */}
                {booking.flight_offer?.duration && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Timer className="mr-2" size={14} />
                    <span>Duration: {booking.flight_offer.duration}</span>
                  </div>
                )}

                {/* Passengers */}
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="mr-2" size={14} />
                  <span>{booking.passengers?.length || 1} passenger{(booking.passengers?.length || 1) > 1 ? 's' : ''}</span>
                </div>

                {/* Booking Type */}
                <div className="flex items-center text-sm text-gray-600">
                  <Badge className="mr-2" size={14} />
                  <span>Type: {booking.booking_type?.charAt(0).toUpperCase() + booking.booking_type?.slice(1) || 'One Way'}</span>
                </div>
              </div>

              {/* Price section */}
              <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-lg font-semibold text-green-600">
                    {booking.flight_offer?.price?.currency || booking.currency || 'USD'} {(booking.total_amount || booking.totalAmount || 0).toFixed(2)}
                  </span>
                  {booking.flight_offer?.price?.breakdown && (
                    <div className="text-xs text-gray-500 mt-1">
                      Base: {booking.flight_offer.price.breakdown.baseFare} | 
                      Taxes: {booking.flight_offer.price.breakdown.taxes} | 
                      Fees: {booking.flight_offer.price.breakdown.fees}
                    </div>
                  )}
                </div>
                <div className="text-right text-xs text-gray-500">
                  <div>Created: {new Date(booking.created_at).toLocaleDateString()}</div>
                  {booking.updated_at !== booking.created_at && (
                    <div>Updated: {new Date(booking.updated_at).toLocaleDateString()}</div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedBooking(booking)}
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center"
                >
                  <Eye className="mr-1" size={14} />
                  View Details
                </button>
                <button
                  onClick={() => handleDownloadTicket(booking.id || booking._id)}
                  disabled={loading}
                  className="bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
                >
                  <Download size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Header/>
        <div className="flex items-center justify-between mt-4 mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Search
          </button>
        </div>

        {/* Flight Summary */}
        {searchData && activeTab === 'create' && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Plane className="mr-3 text-blue-600" size={24} />
              Selected Flight
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center">
                <MapPin className="mr-2 text-gray-400" size={16} />
                <div>
                  <p className="text-sm text-gray-600">From</p>
                  <p className="font-semibold">{searchData.from}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 text-gray-400" size={16} />
                <div>
                  <p className="text-sm text-gray-600">To</p>
                  <p className="font-semibold">{searchData.to}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 text-gray-400" size={16} />
                <div>
                  <p className="text-sm text-gray-600">Departure</p>
                  <p className="font-semibold">{searchData.departure}</p>
                </div>
              </div>
              <div className="flex items-center">
                <CreditCard className="mr-2 text-gray-400" size={16} />
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="font-semibold text-blue-600">${searchData?.price}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('create')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'create'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Create Booking
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'manage'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Manage Bookings
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Progress Indicator for Create Booking */}
            {activeTab === 'create' && bookingStep < 4 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        bookingStep >= step
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {step}
                      </div>
                      <div className={`ml-3 text-sm font-medium ${
                        bookingStep >= step ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {step === 1 && 'Passenger Info'}
                        {step === 2 && 'Extras'}
                        {step === 3 && 'Payment'}
                      </div>
                      {step < 3 && (
                        <div className={`w-16 h-1 mx-4 ${
                          bookingStep > step ? 'bg-blue-600' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error and Success Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="mr-3 text-red-500 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="text-red-800 font-medium">Error</h4>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
                <button
                  onClick={() => setError('')}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
                <CheckCircle className="mr-3 text-green-500 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="text-green-800 font-medium">Success</h4>
                  <p className="text-green-700 text-sm mt-1">{success}</p>
                </div>
                <button
                  onClick={() => setSuccess('')}
                  className="ml-auto text-green-500 hover:text-green-700"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Content */}
            {activeTab === 'create' ? renderCreateBooking() : renderManageBookings()}

            {/* Navigation Buttons for Create Booking */}
            {activeTab === 'create' && bookingStep < 4 && (
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                //   onClick={handlePreviousStep}
                  disabled={bookingStep === 1 || loading}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  <ArrowLeft className="mr-2" size={20} />
                  Previous
                </button>
                
                <button
                  onClick={handleNextStep}
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
                >
                  {loading ? (
                    <>
                      <Clock className="mr-2 animate-spin" size={20} />
                      Processing...
                    </>
                  ) : bookingStep === 3 ? (
                    <>
                      Complete Booking
                      <CreditCard className="ml-2" size={20} />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="ml-2" size={20} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;