import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  Plus, 
  Minus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  CreditCard, 
  Eye, 
  EyeOff,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  DollarSign,
  Send,
  Banknote
} from 'lucide-react';
import { backendUrl } from '../../config/config';
import Header from '../../components/Navbar/Header';

const UserWallet = () => {
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [showBalance, setShowBalance] = useState(true);
  const [loading, setLoading] = useState(false);
  const [walletSummary, setWalletSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [showFundModal, setShowFundModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [transactionFilters, setTransactionFilters] = useState({
    page: 1,
    limit: 10,
    type: '',
    status: ''
  });

  // Form states
  const [fundForm, setFundForm] = useState({
    amount: '',
    paymentMethod: { type: 'card' }
  });
  const [withdrawForm, setWithdrawForm] = useState({
    amount: '',
    bankDetails: {
      accountNumber: '',
      bankCode: '',
      accountName: '',
      bankName: ''
    }
  });
  const [payForm, setPayForm] = useState({
    amount: '',
    description: ''
  });

//   const backendUrl = 'http://localhost:5000';wallets

  // API helper function
  const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token'); 
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      },
      ...options
    };

    const response = await fetch(endpoint, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }
    
    return data;
  };

  // Load wallet summary
  const loadWalletSummary = async () => {
    try {
      setLoading(true);
      const response = await apiCall(`${backendUrl}/api/wallet/summary`);
      setWalletSummary(response.data);
    } catch (error) {
      console.error('Error loading wallet summary:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load transactions
  const loadTransactions = async () => {
    try {
      const queryParams = new URLSearchParams({
        page: transactionFilters.page,
        limit: transactionFilters.limit,
        ...(transactionFilters.type && { type: transactionFilters.type }),
        ...(transactionFilters.status && { status: transactionFilters.status })
      });
      
      const response = await apiCall(`${backendUrl}/api/wallet/transactions?${queryParams}`);
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  // Load withdrawals
  const loadWithdrawals = async () => {
    try {
      const response = await apiCall(`${backendUrl}/api/wallet/withdrawals?page=1&limit=20`);
      setWithdrawals(response.data.withdrawals);
    } catch (error) {
      console.error('Error loading withdrawals:', error);
    }
  };

  // Fund wallet
  const handleFundWallet = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await apiCall(`${backendUrl}/api/wallet/fund`, {
        method: 'POST',
        body: JSON.stringify(fundForm)
      });
      
      // Redirect to payment link
      if (response.data.paymentLink) {
        window.open(response.data.paymentLink, '_blank');
      }
      
      setShowFundModal(false);
      setFundForm({ amount: '', paymentMethod: { type: 'card' } });
      await loadWalletSummary();
    } catch (error) {
      console.error('Error funding wallet:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Request withdrawal
  const handleWithdraw = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await apiCall(`${backendUrl}/api/wallet/withdraw`, {
        method: 'POST',
        body: JSON.stringify(withdrawForm)
      });
      
      alert(response.message);
      setShowWithdrawModal(false);
      setWithdrawForm({
        amount: '',
        bankDetails: { accountNumber: '', bankCode: '', accountName: '', bankName: '' }
      });
      await loadWalletSummary();
      await loadWithdrawals();
    } catch (error) {
      console.error('Error requesting withdrawal:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Process wallet payment
  const handleWalletPayment = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await apiCall(`${backendUrl}/api/wallet/pay`, {
        method: 'POST',
        body: JSON.stringify(payForm)
      });
      
      alert(response.message);
      setShowPayModal(false);
      setPayForm({ amount: '', description: '' });
      await loadWalletSummary();
      await loadTransactions();
    } catch (error) {
      console.error('Error processing payment:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      failed: { color: 'bg-red-100 text-red-800', icon: AlertCircle }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Load data on component mount
  useEffect(() => {
    loadWalletSummary();
    loadTransactions();
    loadWithdrawals();
  }, []);

  // Reload transactions when filters change
  useEffect(() => {
    loadTransactions();
  }, [transactionFilters]);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className='mb-4'>
         <Header/>
      </div>
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-full">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wallet</h1>
              <p className="text-gray-500">Manage your funds seamlessly</p>
            </div>
          </div>
          <button
            onClick={loadWalletSummary}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Balance Display */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium opacity-90">Available Balance</h2>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <div className="text-4xl font-bold mb-2">
            {showBalance ? (walletSummary?.formattedBalance || '₦0') : '₦••••••'}
          </div>
          {walletSummary?.pendingWithdrawals > 0 && (
            <p className="text-blue-100 text-sm">
              Pending withdrawals: ₦{walletSummary.pendingWithdrawals.toLocaleString()}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <button
            onClick={() => setShowFundModal(true)}
            className="flex items-center justify-center space-x-3 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Fund Wallet</span>
          </button>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="flex items-center justify-center space-x-3 bg-orange-600 hover:bg-orange-700 text-white px-6 py-4 rounded-xl transition-colors"
          >
            <Minus className="w-5 h-5" />
            <span className="font-medium">Withdraw</span>
          </button>
          <button
            onClick={() => setShowPayModal(true)}
            className="flex items-center justify-center space-x-3 bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-xl transition-colors"
          >
            <Send className="w-5 h-5" />
            <span className="font-medium">Pay</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex space-x-1 bg-white rounded-xl p-1 mb-6 shadow-lg">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'transactions', label: 'Transactions', icon: History },
          { id: 'withdrawals', label: 'Withdrawals', icon: ArrowUpRight }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        {activeTab === 'overview' && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
            {walletSummary?.recentTransactions?.length > 0 ? (
              <div className="space-y-4">
                {walletSummary.recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'credit' ? (
                          <ArrowDownLeft className="w-5 h-5 text-green-600" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}₦{parseFloat(transaction.amount).toLocaleString()}
                      </p>
                      <StatusBadge status={transaction.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No recent transactions</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'transactions' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Transaction History</h3>
              <div className="flex space-x-2">
                <select
                  value={transactionFilters.type}
                  onChange={(e) => setTransactionFilters(prev => ({ ...prev, type: e.target.value, page: 1 }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </select>
                <select
                  value={transactionFilters.status}
                  onChange={(e) => setTransactionFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
            
            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'credit' ? (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">ID: {transaction.transaction_id}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(transaction.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}₦{parseFloat(transaction.amount).toLocaleString()}
                      </p>
                      <StatusBadge status={transaction.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No transactions found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'withdrawals' && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Withdrawal History</h3>
            {withdrawals.length > 0 ? (
              <div className="space-y-3">
                {withdrawals.map((withdrawal) => (
                  <div key={withdrawal.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-orange-100 rounded-full">
                        <Banknote className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {withdrawal.account_name} - {withdrawal.bank_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {withdrawal.bank_account_number}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(withdrawal.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-orange-600">
                        ₦{parseFloat(withdrawal.amount).toLocaleString()}
                      </p>
                      <StatusBadge status={withdrawal.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ArrowUpRight className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No withdrawal requests</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fund Wallet Modal */}
      {showFundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Fund Wallet</h3>
              <button
                onClick={() => setShowFundModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleFundWallet} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  min="100"
                  step="0.01"
                  value={fundForm.amount}
                  onChange={(e) => setFundForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter amount"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Minimum amount: ₦100</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={fundForm.paymentMethod.type}
                  onChange={(e) => setFundForm(prev => ({ 
                    ...prev, 
                    paymentMethod: { type: e.target.value } 
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="card">Debit/Credit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="ussd">USSD</option>
                  <option value="mobile_money">Mobile Money</option>
                </select>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-colors"
              >
                {loading ? 'Processing...' : 'Fund Wallet'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Withdraw Funds</h3>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  min="500"
                  step="0.01"
                  value={withdrawForm.amount}
                  onChange={(e) => setWithdrawForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter amount"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Minimum amount: ₦500</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  value={withdrawForm.bankDetails.accountNumber}
                  onChange={(e) => setWithdrawForm(prev => ({ 
                    ...prev, 
                    bankDetails: { ...prev.bankDetails, accountNumber: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter account number"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Code
                </label>
                <input
                  type="text"
                  value={withdrawForm.bankDetails.bankCode}
                  onChange={(e) => setWithdrawForm(prev => ({ 
                    ...prev, 
                    bankDetails: { ...prev.bankDetails, bankCode: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter bank code"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  value={withdrawForm.bankDetails.accountName}
                  onChange={(e) => setWithdrawForm(prev => ({ 
                    ...prev, 
                    bankDetails: { ...prev.bankDetails, accountName: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter account name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name (Optional)
                </label>
                <input
                  type="text"
                  value={withdrawForm.bankDetails.bankName}
                  onChange={(e) => setWithdrawForm(prev => ({ 
                    ...prev, 
                    bankDetails: { ...prev.bankDetails, bankName: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter bank name"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-colors"
              >
                {loading ? 'Processing...' : 'Request Withdrawal'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Pay Modal */}
      {showPayModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Make Payment</h3>
              <button
                onClick={() => setShowPayModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleWalletPayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={payForm.amount}
                  onChange={(e) => setPayForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter amount"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={payForm.description}
                  onChange={(e) => setPayForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Payment description"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-colors"
              >
                {loading ? 'Processing...' : 'Make Payment'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserWallet;