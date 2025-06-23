import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { backendUrl } from '../../../config/config';


// const backendUrl = 'http://localhost:5000';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationResult, setVerificationResult] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get parameters from URL
        const status = searchParams.get('status');
        const txRef = searchParams.get('tx_ref');
        const transactionId = searchParams.get('transaction_id');
        
        console.log('Payment callback received:', { status, txRef, transactionId });

        if (!status || !txRef) {
          throw new Error('Invalid payment callback parameters');
        }

        // Use transaction_id if available, otherwise use tx_ref
        const verificationId = transactionId || txRef;

        // Verify payment on backend
        const token = localStorage.getItem('token');
        const response = await fetch(`${backendUrl}/api/payments/verify/${verificationId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const result = await response.json();
        console.log('Payment verification response:', result);

        if (!response.ok) {
          throw new Error(result.error || 'Payment verification failed');
        }

        setVerificationResult(result);

        // Handle verification result
        if (result.success && result.data?.successful) {
          toast.success('Payment completed successfully!');
          
          // Redirect to bookings page after a short delay
          setTimeout(() => {
            navigate('/booking', { replace: true });
          }, 3000);
        } else {
          toast.error(result.message || 'Payment verification failed');
          
          // Redirect to payment page or bookings after delay
          setTimeout(() => {
            navigate('/booking', { replace: true });
          }, 5000);
        }

      } catch (error) {
        console.error('Payment verification error:', error);
        toast.error(error.message || 'Payment verification failed');
        setVerificationResult({ success: false, error: error.message });
        
        // Redirect after error
        setTimeout(() => {
          navigate('/booking', { replace: true });
        }, 5000);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  const getStatusIcon = () => {
    if (isVerifying) return '⏳';
    if (verificationResult?.success && verificationResult?.data?.successful) return '✅';
    return '❌';
  };

  const getStatusMessage = () => {
    if (isVerifying) return 'Verifying your payment...';
    if (verificationResult?.success && verificationResult?.data?.successful) {
      return 'Payment completed successfully!';
    }
    return verificationResult?.error || 'Payment verification failed';
  };

  const getStatusColor = () => {
    if (isVerifying) return 'text-blue-600';
    if (verificationResult?.success && verificationResult?.data?.successful) return 'text-green-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">
            {getStatusIcon()}
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {isVerifying ? 'Processing Payment' : 'Payment Status'}
          </h1>
          
          <p className={`text-lg mb-6 ${getStatusColor()}`}>
            {getStatusMessage()}
          </p>

          {isVerifying && (
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">Please wait...</span>
            </div>
          )}

          {verificationResult && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-medium text-gray-800 mb-2">Transaction Details</h3>
              <div className="text-sm text-gray-600 space-y-1">
                {verificationResult.data?.reference && (
                  <p><span className="font-medium">Reference:</span> {verificationResult.data.reference}</p>
                )}
                {verificationResult.data?.amount && (
                  <p><span className="font-medium">Amount:</span> ₦{verificationResult.data.amount.toLocaleString()}</p>
                )}
                {verificationResult.data?.status && (
                  <p><span className="font-medium">Status:</span> <span className="capitalize">{verificationResult.data.status}</span></p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-3">
            {!isVerifying && (
              <button
                onClick={() => navigate('/bookings', { replace: true })}
                className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View My Bookings
              </button>
            )}
            
            <button
              onClick={() => navigate('/', { replace: true })}
              className="w-full py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </button>
          </div>

          {!isVerifying && (
            <p className="text-sm text-gray-500 mt-4">
              Redirecting automatically in a few seconds...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;