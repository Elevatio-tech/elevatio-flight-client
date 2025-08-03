const backendUrl = 'https://elevatio.onrender.com';

const summaryApi = {
     // ============== USER ROUTES ==============
    // Public user routes
    userRegister: {
        url: `${backendUrl}/api/users/register`,
        method: 'POST',
    },
    userLogin: {
        url: `${backendUrl}/api/users/login`,
        method: 'POST',
    },
    userLoginSupabase: {
        url: `${backendUrl}/api/users/login/supabase`,
        method: 'POST',
    },
    verifyEmail: {
        url: `${backendUrl}/api/users/verify-email`,
        method: 'POST',
    },
    forgotPassword: {
        url: `${backendUrl}/api/users/forgot-password`,
        method: 'POST',
    },
    resetPassword: {
        url: `${backendUrl}/api/users/reset-password`,
        method: 'POST',
    },
    refreshToken: {
        url: `${backendUrl}/api/users/refresh-token`,
        method: 'POST',
    },
    verifySession: {
        url: `${backendUrl}/api/users/verify-session`,
        method: 'GET',
    },
    userLogout: {
        url: `${backendUrl}/api/users/logout`,
        method: 'POST',
    },

    // Protected user routes
    getUserProfile: {
        url: `${backendUrl}/api/users/profile`,
        method: 'GET',
    },
    updateUserProfile: {
        url: `${backendUrl}/api/users/profile`,
        method: 'PUT',
    },
    deleteUserAccount: {
        url: `${backendUrl}/api/users/account`,
        method: 'DELETE',
    },
    syncUserData: {
        url: `${backendUrl}/api/users/sync`,
        method: 'POST',
    },

    // ============== FLIGHT ROUTES ==============
    // Flight search routes
    searchFlights: {
        url: `${backendUrl}/api/flightsss/search`,
        method: 'POST',
    },
    getFlightDetails: {
        url: `${backendUrl}/api/flightsss/details/:flightId`,
        method: 'GET',
    },
    getFareRules: {
        url: `${backendUrl}/api/flightsss/fare-rules/:flightId`,
        method: 'GET',
    },
    // Airport and airline routes
    searchAirports: {
        url: `${backendUrl}/api/flightsss/airports/search`,
        method: 'GET',
    },
    getPopularDestinations: {
        url: `${backendUrl}/api/flightsss/destinations/popular`,
        method: 'GET',
    },
    getAirlines: {
        url: `${backendUrl}/api/flightsss/airlines`,
        method: 'GET',
    },
    // Price alerts (protected)
    createPriceAlert: {
        url: `${backendUrl}/api/flights/price-alerts`,
        method: 'POST',
    },
    getUserPriceAlerts: {
        url: `${backendUrl}/api/flightsss/price-alerts`,
        method: 'GET',
    },
    updatePriceAlert: {
        url: `${backendUrl}/api/flightsss/price-alerts/:alertId`,
        method: 'PUT',
    },
    deletePriceAlert: {
        url: `${backendUrl}/api/flights/price-alerts/:alertId`,
        method: 'DELETE',
    },
    // Price calendar
    getPriceCalendar: {
        url: `${backendUrl}/api/flights/calendar/:route`,
        method: 'GET',
    },
    // Search history (protected)
    getSearchHistory: {
        url: `${backendUrl}/api/flights/history`,
        method: 'GET',
    },
    deleteSearchHistory: {
        url: `${backendUrl}/api/flights/history/:searchId`,
        method: 'DELETE',
    },
    // Flight favorites (protected)
    addToFavorites: {
        url: `${backendUrl}/api/flights/favorites`,
        method: 'POST',
    },
    getFavorites: {
        url: `${backendUrl}/api/flights/favorites`,
        method: 'GET',
    },
    removeFromFavorites: {
        url: `${backendUrl}/api/flights/favorites/:flightId`,
        method: 'DELETE',
    },

    // ============== BOOKING ROUTES ==============
    createBooking: {
        url: `${backendUrl}/api/bookingsss`,
        method: 'POST',
    },
    getUserBookings: {
        url: `${backendUrl}/api/bookingsss`,
        method: 'GET',
    },
    getBookingDetails: {
        url: `${backendUrl}/api/bookingsss/:bookingId`,
        method: 'GET',
    },
    cancelBooking: {
        url: `${backendUrl}/api/bookingsss/:bookingId/cancel`,
        method: 'PUT',
    },
    modifyBooking: {
        url: `${backendUrl}/api/bookingsss/:bookingId/modify`,
        method: 'PUT',
    },
    downloadTicket: {
        url: `${backendUrl}/api/bookingsss/:bookingId/ticket`,
        method: 'GET',
    },

    // ============== PAYMENT ROUTES ==============
    
     processPayment: {
        url: `${backendUrl}/api/paymentsss/process`,
        method: 'POST',
        // Expected payload: { bookingId, paymentMethod, amount }
    },

    // Verify payment
    verifyPayment: {
        url: `${backendUrl}/api/paymentsss/verify/:transactionId`,
        method: 'GET',
        // Replace :transactionId with actual transaction ID
    },

    // Wallet management
    fundWallet: {
        url: `${backendUrl}/api/paymentsss/wallet/fund`,
        method: 'POST',
        // Expected payload: { amount, paymentMethod }
    },

    getWalletBalance: {
        url: `${backendUrl}/api/paymentsss/wallet/balance`,
        method: 'GET',
    },

    getWalletTransactions: {
        url: `${backendUrl}/api/paymentsss/wallet/transactions`,
        method: 'GET',
        // Query params: ?page=1&limit=20
    },

    withdrawFromWallet: {
        url: `${backendUrl}/api/paymentsss/wallet/withdraw`,
        method: 'POST',
        // Expected payload: { amount, bankDetails }
    },

    // NEW: Get withdrawal history
    getWithdrawalHistory: {
        url: `${backendUrl}/api/payments/wallet/withdrawals`,
        method: 'GET',
        // Query params: ?page=1&limit=20
    },

    // Payment history and tracking
    getPaymentHistory: {
        url: `${backendUrl}/api/payments/history`,
        method: 'GET',
        // Query params: ?page=1&limit=20&status=completed
    },

    // UPDATED: Changed from booking/:bookingId/payments to booking/:bookingId
    getBookingPayments: {
        url: `${backendUrl}/api/payments/booking/:bookingId`,
        method: 'GET',
        // Replace :bookingId with actual booking ID
    },

    // NEW: Get payment statistics
    getPaymentStats: {
        url: `${backendUrl}/api/payments/stats`,
        method: 'GET',
    },

    // Admin/Partner routes (require special privileges)
    // UPDATED: Changed from cash/update-status to cash/update
    updateCashPaymentStatus: {
        url: `${backendUrl}/api/payments/cash/update`,
        method: 'POST',
        // Expected payload: { paymentId, bookingId }
        // Requires partner/admin privileges
    },

    // NEW: Get all payments (admin only)
    getAllPayments: {
        url: `${backendUrl}/api/payments/admin/all`,
        method: 'GET',
        // Query params: ?page=1&limit=20&status=completed
        // Requires partner/admin privileges
    },

    // NEW: Webhook endpoint (for external services)
    flutterwaveWebhook: {
        url: `${backendUrl}/api/payments/webhook/flutterwave`,
        method: 'POST',
        // Note: This endpoint doesn't require authentication
        // Used by Flutterwave to send payment notifications
    },

    // ============== WALLET ROUTES ==============
    
    // Get wallet balance
    getWalletBalanceOnly: {
        url: `${backendUrl}/api/wallet/balance`,
        method: 'GET',
    },

    // Get wallet summary (balance + recent transactions + pending withdrawals)
    getWalletSummary: {
        url: `${backendUrl}/api/wallet/summary`,
        method: 'GET',
    },

    // Fund wallet via external payment
    fundWalletDirect: {
        url: `${backendUrl}/api/wallet/fund`,
        method: 'POST',
        // Expected payload: { amount, paymentMethod }
    },

    // Complete wallet funding after payment verification
    completeFunding: {
        url: `${backendUrl}/api/wallet/fund/complete`,
        method: 'POST',
        // Expected payload: { transactionId }
    },

    // Process payment using wallet balance
    processWalletPayment: {
        url: `${backendUrl}/api/wallet/pay`,
        method: 'POST',
        // Expected payload: { amount, description }
    },

    // Credit wallet (mainly for refunds)
    creditWallet: {
        url: `${backendUrl}/api/wallet/credit`,
        method: 'POST',
        // Expected payload: { userId, amount, description, reference }
    },

    // Request withdrawal from wallet
    requestWithdrawal: {
        url: `${backendUrl}/api/wallet/withdraw`,
        method: 'POST',
        // Expected payload: { amount, bankDetails }
    },

    // Get withdrawal history
    getWalletWithdrawalHistory: {
        url: `${backendUrl}/api/wallet/withdrawals`,
        method: 'GET',
        // Query params: ?page=1&limit=20&status=pending
    },

    // Get wallet transactions with pagination and filters
    getWalletTransactionsDetailed: {
        url: `${backendUrl}/api/wallet/transactions`,
        method: 'GET',
        // Query params: ?page=1&limit=20&type=credit&status=completed&startDate=&endDate=
    },

    // Verify a specific wallet transaction
    verifyWalletTransaction: {
        url: `${backendUrl}/api/wallet/transactions/:transactionId/verify`,
        method: 'GET',
        // Replace :transactionId with actual transaction ID
    },

    // Wallet service health check
    walletHealthCheck: {
        url: `${backendUrl}/api/wallet/health`,
        method: 'GET',
    },
    
    // ============== PARTNER ROUTES ==============
    // Public partner routes
    partnerRegister: {
        url: `${backendUrl}/api/partners/register`,
        method: 'POST',
    },
    partnerLogin: {
        url: `${backendUrl}/api/partners/login`,
        method: 'POST',
    },
    verifyPartnerEmail: {
        url: `${backendUrl}/api/partners/verify-email`,
        method: 'POST',
    },
    resendPartnerVerificationEmail: {
         url: `${backendUrl}/api/partners/resend-verification`,
        method: 'POST',
    },
    // Protected partner routes
    getPartnerDashboard: {
        url: `${backendUrl}/api/partners/dashboard`,
        method: 'GET',
    },
    getPartnerBookings: {
        url: `${backendUrl}/api/partnersss/bookings`,
        method: 'GET',
    },
    requestPayout: {
        url: `${backendUrl}/api/partnersss/payout`,
        method: 'POST',
    },
    updatePartnerProfile: {
        url: `${backendUrl}/api/partnersss/profile`,
        method: 'PUT',
    },
    getPartnerProfile: {
        url: `${backendUrl}/api/partnersss/profile`,
        method: 'GET',
    },

    // ============== ADMIN ROUTES ==============
    // Admin authentication
    adminLogin: {
        url: `${backendUrl}/api/admin/auth/login`,
        method: 'POST',
    },
    // Dashboard
    getAdminDashboard: {
        url: `${backendUrl}/api/admin/dashboard`,
        method: 'GET',
    },
    // Users management
    getAllUsers: {
        url: `${backendUrl}/api/admin/users`,
        method: 'GET',
    },
    manageUsers: {
        url: `${backendUrl}/api/admin/users/:action/:userId`,
        method: 'PUT',
    },
    // Partners management
    getAllPartners: {
        url: `${backendUrl}/api/admin/partners`,
        method: 'GET',
    },
    managePartners: {
        url: `${backendUrl}/api/admin/partners/:action/:partnerId`,
        method: 'PUT',
    },
    // Bookings management
    getAllBookings: {
        url: `${backendUrl}/api/admin/bookings`,
        method: 'GET',
    },
    getAdminBookingDetails: {
        url: `${backendUrl}/api/admin/bookings/:bookingId`,
        method: 'GET',
    },
    // Refunds management
    getAllRefunds: {
        url: `${backendUrl}/api/admin/refunds`,
        method: 'GET',
    },
    processRefund: {
        url: `${backendUrl}/api/admin/refunds/:refundId/:action`,
        method: 'PUT',
    },
    // Reports
    generateReports: {
        url: `${backendUrl}/api/admin/reports/:reportType`,
        method: 'GET',
    },
    // Promo codes management
    createPromoCode: {
        url: `${backendUrl}/api/admin/promo-codes/:action`,
        method: 'POST',
    },
    updatePromoCode: {
        url: `${backendUrl}/api/admin/promo-codes/:action`,
        method: 'PUT',
    },
    // System management
    getSystemLogs: {
        url: `${backendUrl}/api/admin/system/logs`,
        method: 'GET',
    },
    getSystemSettings: {
        url: `${backendUrl}/api/admin/system/settings`,
        method: 'GET',
    },
    updateSystemSettings: {
        url: `${backendUrl}/api/admin/system/settings`,
        method: 'PUT',
    },
    // Notifications
    sendNotification: {
        url: `${backendUrl}/api/admin/notifications`,
        method: 'POST',
    },
};

export default summaryApi;