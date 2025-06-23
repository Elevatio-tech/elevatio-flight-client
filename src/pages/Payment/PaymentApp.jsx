import React, { useState, useEffect } from 'react';
import { CreditCard, Wallet, DollarSign, Smartphone, Building2, Banknote, CheckCircle, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

// Mock API - replace with actual import from '../common'
const summaryApi = {
  processPayment: { url: 'http://localhost:5000/api/payments/process', method: 'POST' },
  verifyPayment: { url: 'http://localhost:5000/api/payments/verify/:transactionId', method: 'GET' },
  fundWallet: { url: 'http://localhost:5000/api/payments/wallet/fund', method: 'POST' },
  getWalletBalance: { url: 'http://localhost:5000/api/payments/wallet/balance', method: 'GET' },
  getWalletTransactions: { url: 'http://localhost:5000/api/payments/wallet/transactions', method: 'GET' },
  withdrawFromWallet: { url: 'http://localhost:5000/api/payments/wallet/withdraw', method: 'POST' },
  getPaymentHistory: { url: 'http://localhost:5000/api/payments/history', method: 'GET' }
};

// Flutterwave Payment Component
const FlutterwavePayment = ({ amount, bookingId, userId, onPaymentInitiated, onError }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const paymentOptions = [
    { id: 'card', label: 'Debit/Credit Card', icon: CreditCard, description: 'Pay with your card' },
    { id: 'bank_transfer', label: 'Bank Transfer', icon: Building2, description: 'Direct bank transfer' },
    { id: 'ussd', label: 'USSD', icon: Smartphone, description: 'Pay with USSD code' },
    { id: 'mobile_money', label: 'Mobile Money', icon: Smartphone, description: 'Pay with mobile money' }
  ];

  const handlePayment = async () => {
    if (!amount || !bookingId || !userId) {
      onError('Missing required payment information');
      return;
    }

    setLoading(true);
    try {
      const paymentData = {
        bookingId,
        paymentMethod: {
          type: paymentMethod,
          phoneNumber: paymentMethod === 'mobile_money' ? phoneNumber : undefined
        },
        amount: parseFloat(amount),
        userId
      };

      const response = await fetch(summaryApi.processPayment.url, {
        method: summaryApi.processPayment.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();
      
      if (response.ok && result.paymentResult?.paymentLink) {
        onPaymentInitiated(result);
        // Redirect to Flutterwave payment page
        window.location.href = result.paymentResult.paymentLink;
      } else {
        throw new Error(result.message || 'Payment initialization failed');
      }
    } catch (error) {
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl border border-blue-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-500 rounded-lg">
          <CreditCard className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Flutterwave Payment</h3>
          <p className="text-gray-600">Secure payment gateway</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {paymentOptions.map((option) => {
          const Icon = option.icon;
          return (
            <label key={option.id} className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-white transition-colors">
              <input
                type="radio"
                name="flutterwave-method"
                value={option.id}
                checked={paymentMethod === option.id}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="sr-only"
              />
              <div className={`flex-1 flex items-center gap-3 ${paymentMethod === option.id ? 'text-blue-600' : 'text-gray-700'}`}>
                <div className={`p-2 rounded-lg ${paymentMethod === option.id ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 ${paymentMethod === option.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                {paymentMethod === option.id && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
              </div>
            </label>
          );
        })}
      </div>

      {paymentMethod === 'mobile_money' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter your phone number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      )}

      <div className="bg-white p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Total Amount:</span>
          <span className="text-blue-600">₦{parseFloat(amount).toLocaleString()}</span>
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading || (paymentMethod === 'mobile_money' && !phoneNumber)}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Pay ₦{parseFloat(amount).toLocaleString()}
          </>
        )}
      </button>
    </div>
  );
};

// Wallet Payment Component
const WalletPayment = ({ amount, bookingId, userId, onPaymentComplete, onError }) => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(true);

  useEffect(() => {
    fetchWalletBalance();
  }, [userId]);

  const fetchWalletBalance = async () => {
    try {
      const response = await fetch(summaryApi.getWalletBalance.url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setWalletBalance(data.balance || 0);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    } finally {
      setLoadingBalance(false);
    }
  };

  const handleWalletPayment = async () => {
    if (walletBalance < parseFloat(amount)) {
      onError(`Insufficient wallet balance. Available: ₦${walletBalance.toLocaleString()}, Required: ₦${parseFloat(amount).toLocaleString()}`);
      return;
    }

    setLoading(true);
    try {
      const paymentData = {
        bookingId,
        paymentMethod: { type: 'wallet' },
        amount: parseFloat(amount),
        userId
      };

      const response = await fetch(summaryApi.processPayment.url, {
        method: summaryApi.processPayment.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();
      
      if (response.ok && result.paymentResult?.status === 'completed') {
        onPaymentComplete(result);
        await fetchWalletBalance(); // Refresh balance
      } else {
        throw new Error(result.message || 'Wallet payment failed');
      }
    } catch (error) {
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const canAffordPayment = walletBalance >= parseFloat(amount);

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl border border-green-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-500 rounded-lg">
          <Wallet className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Wallet Payment</h3>
          <p className="text-gray-600">Pay from your wallet balance</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-600">Available Balance:</span>
          {loadingBalance ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading...</span>
            </div>
          ) : (
            <span className="text-lg font-semibold text-green-600">₦{walletBalance.toLocaleString()}</span>
          )}
        </div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-600">Payment Amount:</span>
          <span className="text-lg font-semibold">₦{parseFloat(amount).toLocaleString()}</span>
        </div>
        <hr className="my-3" />
        <div className="flex justify-between items-center">
          <span className="font-medium">Remaining Balance:</span>
          <span className={`text-lg font-semibold ${canAffordPayment ? 'text-green-600' : 'text-red-600'}`}>
            ₦{Math.max(0, walletBalance - parseFloat(amount)).toLocaleString()}
          </span>
        </div>
      </div>

      {!canAffordPayment && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div className="text-red-700">
            <p className="font-medium">Insufficient Balance</p>
            <p className="text-sm">You need ₦{(parseFloat(amount) - walletBalance).toLocaleString()} more to complete this payment.</p>
          </div>
        </div>
      )}

      <button
        onClick={handleWalletPayment}
        disabled={loading || !canAffordPayment || loadingBalance}
        className={`w-full font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 ${
          canAffordPayment && !loadingBalance
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Wallet className="w-5 h-5" />
            Pay from Wallet
          </>
        )}
      </button>
    </div>
  );
};

// Cash Payment Component
const CashPayment = ({ amount, bookingId, userId, onPaymentInitiated, onError }) => {
  const [loading, setLoading] = useState(false);

  const handleCashPayment = async () => {
    setLoading(true);
    try {
      const paymentData = {
        bookingId,
        paymentMethod: { type: 'cash' },
        amount: parseFloat(amount),
        userId
      };

      const response = await fetch(summaryApi.processPayment.url, {
        method: summaryApi.processPayment.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();
      
      if (response.ok) {
        onPaymentInitiated(result);
      } else {
        throw new Error(result.message || 'Cash payment option failed');
      }
    } catch (error) {
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-100 p-6 rounded-xl border border-orange-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-orange-500 rounded-lg">
          <Banknote className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Cash Payment</h3>
          <p className="text-gray-600">Pay at our office location</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg mb-6">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-700 mb-2">Payment Amount</div>
          <div className="text-3xl font-bold text-orange-600">₦{parseFloat(amount).toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-orange-50 p-4 rounded-lg mb-6">
        <h4 className="font-semibold text-gray-800 mb-3">Payment Instructions:</h4>
        <ul className="text-sm text-gray-700 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-orange-500 mt-1">•</span>
            Visit our office during business hours (9 AM - 5 PM)
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500 mt-1">•</span>
            Bring your booking reference number
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500 mt-1">•</span>
            Payment must be made within 24 hours
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500 mt-1">•</span>
            Bring valid identification
          </li>
        </ul>
      </div>

      <button
        onClick={handleCashPayment}
        disabled={loading}
        className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Banknote className="w-5 h-5" />
            Select Cash Payment
          </>
        )}
      </button>
    </div>
  );
};

// Wallet Management Component
const WalletManagement = ({ userId }) => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [showFunding, setShowFunding] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankDetails, setBankDetails] = useState({ accountNumber: '', bankCode: '', accountName: '' });
  const [loading, setLoading] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchWalletData();
    }
  }, [userId]);

  const fetchWalletData = async () => {
    try {
      // Fetch balance
      const balanceResponse = await fetch(summaryApi.getWalletBalance.url, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const balanceData = await balanceResponse.json();
      setBalance(balanceData.balance || 0);

      // Fetch transactions
      const transactionsResponse = await fetch(`${summaryApi.getWalletTransactions.url}?page=1&limit=10`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const transactionsData = await transactionsResponse.json();
      setTransactions(transactionsData.transactions || []);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const handleFundWallet = async () => {
    if (!fundAmount || parseFloat(fundAmount) <= 0) return;

    setLoading(true);
    try {
      const response = await fetch(summaryApi.fundWallet.url, {
        method: summaryApi.fundWallet.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: parseFloat(fundAmount),
          paymentMethod: { type: 'card' }
        })
      });

      const result = await response.json();
      if (response.ok && result.paymentResult?.paymentLink) {
        window.location.href = result.paymentResult.paymentLink;
      }
    } catch (error) {
      console.error('Wallet funding error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > balance) return;

    setLoading(true);
    try {
      const response = await fetch(summaryApi.withdrawFromWallet.url, {
        method: summaryApi.withdrawFromWallet.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: parseFloat(withdrawAmount),
          bankDetails
        })
      });

      if (response.ok) {
        await fetchWalletData();
        setShowWithdraw(false);
        setWithdrawAmount('');
        setBankDetails({ accountNumber: '', bankCode: '', accountName: '' });
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-100 p-6 rounded-xl border border-purple-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500 rounded-lg">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Wallet Management</h3>
            <p className="text-gray-600">Manage your wallet balance</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Current Balance</p>
          <p className="text-2xl font-bold text-purple-600">₦{balance.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setShowFunding(!showFunding)}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <DollarSign className="w-5 h-5" />
          Fund Wallet
        </button>
        <button
          onClick={() => setShowWithdraw(!showWithdraw)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Banknote className="w-5 h-5" />
          Withdraw
        </button>
      </div>

      {showFunding && (
        <div className="bg-white p-4 rounded-lg mb-6">
          <h4 className="font-semibold mb-3">Fund Wallet</h4>
          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Enter amount"
              value={fundAmount}
              onChange={(e) => setFundAmount(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              onClick={handleFundWallet}
              disabled={loading || !fundAmount}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <DollarSign className="w-4 h-4" />}
              Fund
            </button>
          </div>
        </div>
      )}

      {showWithdraw && (
        <div className="bg-white p-4 rounded-lg mb-6 space-y-3">
          <h4 className="font-semibold">Withdraw from Wallet</h4>
          <input
            type="number"
            placeholder="Enter amount"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            max={balance}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Account Number"
            value={bankDetails.accountNumber}
            onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Bank Code"
            value={bankDetails.bankCode}
            onChange={(e) => setBankDetails({...bankDetails, bankCode: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Account Name"
            value={bankDetails.accountName}
            onChange={(e) => setBankDetails({...bankDetails, accountName: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleWithdraw}
            disabled={loading || !withdrawAmount || parseFloat(withdrawAmount) > balance}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-2 rounded-lg flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Banknote className="w-4 h-4" />}
            Withdraw
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg p-4">
        <h4 className="font-semibold mb-3">Recent Transactions</h4>
        {loadingTransactions ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : transactions.length > 0 ? (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-sm">{transaction.description}</p>
                  <p className="text-xs text-gray-500">{new Date(transaction.created_at).toLocaleDateString()}</p>
                </div>
                <div className={`font-semibold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'credit' ? '+' : '-'}₦{parseFloat(transaction.amount).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No transactions yet</p>
        )}
      </div>
    </div>
  );
};

// Main Payment System Component
const PaymentSystem = () => {
  const [activeTab, setActiveTab] = useState('payment');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('flutterwave');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock data - replace with actual props or context
  const mockData = {
    amount: 45000,
    bookingId: 'BK001',
    userId: 'user123',
    bookingReference: 'FL-2024-001'
  };

  const paymentMethods = [
    { id: 'flutterwave', label: 'Card/Bank Transfer', icon: CreditCard, color: 'blue' },
    { id: 'wallet', label: 'Wallet Payment', icon: Wallet, color: 'green' },
    { id: 'cash', label: 'Cash Payment', icon: Banknote, color: 'orange' }
  ];

  const handlePaymentInitiated = (result) => {
    setPaymentStatus(result);
    if (result.paymentResult?.status === 'completed') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  };

  const handlePaymentComplete = (result) => {
    setPaymentStatus(result);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const handleError = (error) => {
    setErrorMessage(error);
    setTimeout(() => setErrorMessage(''), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Payment System</h1>
          <p className="text-blue-100">Complete your booking payment securely</p>
          
          <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-200">Booking Reference:</span>
                <div className="font-semibold">{mockData.bookingReference}</div>
              </div>
              <div>
                <span className="text-blue-200">Amount:</span>
                <div className="font-semibold text-xl">₦{mockData.amount.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b bg-gray-50">
          <button
            onClick={() => setActiveTab('payment')}
            className={`flex-1 py-4 px-6 font-semibold transition-colors ${
              activeTab === 'payment'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Make Payment
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex-1 py-4 px-6 font-semibold transition-colors ${
              activeTab === 'wallet'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Wallet Management
          </button>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 m-6">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-green-800">Payment Successful!</h3>
                <p className="text-sm text-green-700">Your payment has been processed successfully.</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 m-6">
            <div className="flex items-center">
              <AlertCircle className="w-6 h-6 text-red-400 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-red-800">Payment Error</h3>
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'payment' && (
            <div className="space-y-6">
              {/* Payment Method Selector */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Select Payment Method</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          selectedPaymentMethod === method.id
                            ? `border-${method.color}-500 bg-${method.color}-50 text-${method.color}-700`
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className={`w-8 h-8 mx-auto mb-2 ${
                          selectedPaymentMethod === method.id ? `text-${method.color}-600` : 'text-gray-500'
                        }`} />
                        <p className="font-medium text-sm">{method.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Payment Components */}
              <div className="space-y-6">
                {selectedPaymentMethod === 'flutterwave' && (
                  <FlutterwavePayment
                    amount={mockData.amount}
                    bookingId={mockData.bookingId}
                    userId={mockData.userId}
                    onPaymentInitiated={handlePaymentInitiated}
                    onError={handleError}
                  />
                )}

                {selectedPaymentMethod === 'wallet' && (
                  <WalletPayment
                    amount={mockData.amount}
                    bookingId={mockData.bookingId}
                    userId={mockData.userId}
                    onPaymentComplete={handlePaymentComplete}
                    onError={handleError}
                  />
                )}

                {selectedPaymentMethod === 'cash' && (
                  <CashPayment
                    amount={mockData.amount}
                    bookingId={mockData.bookingId}
                    userId={mockData.userId}
                    onPaymentInitiated={handlePaymentInitiated}
                    onError={handleError}
                  />
                )}
              </div>

              {/* Payment Status */}
              {paymentStatus && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Payment Status</h4>
                  <div className="text-sm text-blue-700">
                    <p><strong>Transaction ID:</strong> {paymentStatus.transactionId}</p>
                    <p><strong>Status:</strong> {paymentStatus.paymentResult?.status || 'Processing'}</p>
                    <p><strong>Amount:</strong> ₦{mockData.amount.toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'wallet' && (
            <WalletManagement userId={mockData.userId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSystem;