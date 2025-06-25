// import React, { useState, useEffect } from 'react'
// import LandingPage from './pages/LandingPage'
// import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
// import FlightSearch from './components/Extras/FlightSearch';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import LoginForm from './components/Auth/LoginForm';
// import RegisterForm from './components/Auth/RegisterForm';
// import EmailVerification from './components/Auth/EmailVerification';
// import ForgotPassword from './components/Profile/ForgotPassword';
// import Profile from './components/Profile/Profile';
// import Bookings from './components/Booking/Bookings';
// import PaymentApp from './pages/Payment/PaymentApp';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import PaymentCallback from './pages/Payment/PaymentCallback';
// import IntegratedPayment from './pages/Payment/IntegratedPayment';
// import UserHistory from './components/Profile/UserHistory';
// import FlightResults from './components/Extras/FlightResults';
// import AdminDashboard from './admin/pages/AdminDashboard';
// import PartnerDashboard from './partners/pages/PartnerDashboard';
// import AboutUs from './components/DetailsPages/AboutUs';
// import BookingTerms from './components/DetailsPages/BookingTerms';
// import GetInTouch from './components/DetailsPages/GetInTouch';
// import Refund from './pages/Payment/Refund';
// import UserWallet from './pages/Payment/Wallet';

// // Enhanced Auth Wrapper with redirect logic
// const AuthWrapper = ({ children }) => {
//   const [currentView, setCurrentView] = useState('login');
//   const [userType, setUserType] = useState('user');
//   const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');
//   const { user, loading, login: authLogin } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Store the current path when user becomes unauthenticated
//   useEffect(() => {
//     if (!user && !loading) {
//       const currentPath = location.pathname;
//       // Don't store auth-related paths
//       const authPaths = ['/login', '/register', '/forgot-password', '/verify'];
//       if (!authPaths.includes(currentPath) && currentPath !== '/') {
//         localStorage.setItem('redirectAfterLogin', currentPath);
//       }
//     }
//   }, [user, loading, location.pathname]);

//   // Enhanced login function with redirect logic
//   const handleLogin = async (credentials, loginUserType) => {
//     try {
//       await authLogin(credentials, loginUserType);
      
//       // After successful login, check for redirect path
//       const redirectPath = localStorage.getItem('redirectAfterLogin');
      
//       if (redirectPath) {
//         // User was on a specific page before logout, redirect there
//         localStorage.removeItem('redirectAfterLogin');
//         navigate(redirectPath, { replace: true });
//       } else {
//         // Normal login, redirect to homepage
//         navigate('/', { replace: true });
//       }
//     } catch (error) {
//       throw error; // Re-throw to let LoginForm handle the error display
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
//         <div className="text-white text-xl">Loading...</div>
//       </div>
//     );
//   }

//   if (user) {
//     // User is authenticated, show the main app
//     return children;
//   }

//   // User is not authenticated, show auth forms
//   const toggleForm = () => {
//     if (currentView === 'login') {
//       setCurrentView('register');
//     } else if (currentView === 'register') {
//       setCurrentView('login');
//     } else {
//       setCurrentView('login');
//     }
//   };

//   const handleForgotPassword = () => {
//     setCurrentView('forgot');
//   };

//   const handleBackToLogin = () => {
//     setCurrentView('login');
//   };

//   const handleRegistrationSuccess = (email) => {
//     setPendingVerificationEmail(email);
//     setCurrentView('verify');
//   };

//   const handleVerificationSuccess = () => {
//     // After email verification, redirect to homepage or stored path
//     const redirectPath = localStorage.getItem('redirectAfterLogin');
    
//     if (redirectPath) {
//       localStorage.removeItem('redirectAfterLogin');
//       navigate(redirectPath, { replace: true });
//     } else {
//       navigate('/', { replace: true });
//     }
//   };

//   return (
//     <div>
//       {currentView === 'login' && (
//         <LoginForm 
//           userType={userType}
//           onToggleForm={toggleForm}
//           onForgotPassword={handleForgotPassword}
//           onSwitchType={setUserType}
//           customLogin={handleLogin} // Pass our enhanced login function
//         />
//       )}
//       {currentView === 'register' && (
//         <RegisterForm 
//           userType={userType}
//           onToggleForm={toggleForm}
//           onSwitchType={setUserType}
//           onRegistrationSuccess={handleRegistrationSuccess}
//         />
//       )}
//       {currentView === 'forgot' && (
//         <ForgotPassword 
//           onBackToLogin={handleBackToLogin}
//         />
//       )}
//       {currentView === 'verify' && (
//         <EmailVerification 
//           email={pendingVerificationEmail}
//           userType={userType}
//           onVerified={handleVerificationSuccess}
//           onBackToLogin={handleBackToLogin}
//         />
//       )}
//     </div>
//   );
// };

// // Enhanced Protected Route Component
// const ProtectedRoute = ({ children }) => {
//   const { user } = useAuth();
  
//   if (!user) {
//     // This will trigger the useEffect in AuthWrapper to store the current path
//     return null; // Let AuthWrapper handle the redirect
//   }
  
//   return children;
// };

// // Main App Routes Component
// const AppRoutes = () => {
//   const navigate = useNavigate();

//   // Handle flight booking - redirect to booking page with flight data
//   const handleBookFlight = (flightData) => {
//     console.log('Booking flight:', flightData);
    
//     // Navigate to booking page with selected flight data
//     navigate('/booking', {
//       state: {
//         selectedFlight: flightData,
//         bookingStep: 'passenger-details'
//       }
//     });
//   };

//   return (
//     <AuthWrapper>
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/about" element={<AboutUs />} />
//         <Route path="/booking-terms" element={<BookingTerms />} />
//         <Route path="/get-in-touch" element={<GetInTouch />} />

//         <Route 
//           path="/search" 
//           element={
//             <ProtectedRoute>
//               <FlightSearch />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/flight-results" 
//           element={
//             <ProtectedRoute>
//               <FlightResults onBookFlight={handleBookFlight} />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/profile" 
//           element={
//             <ProtectedRoute>
//               <Profile />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/admin" 
//           element={
//             <ProtectedRoute>
//               <AdminDashboard />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/partner" 
//           element={
//             <ProtectedRoute>
//               <PartnerDashboard />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/history" 
//           element={
//             <ProtectedRoute>
//               <UserHistory />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/booking" 
//           element={
//             <ProtectedRoute>
//               <Bookings />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/payment" 
//           element={
//             <ProtectedRoute>
//               <PaymentApp />
//             </ProtectedRoute>
//           } 
//         />
//         <Route path="/payment/callback" element={<PaymentCallback />} />
//         <Route path="/payment/:bookingId" element={<IntegratedPayment />} />
//         <Route path="/wallet/callback" element={<PaymentCallback />} />
//         <Route path="/refund" element={<Refund />} />
//         <Route path="/wallet" element={<UserWallet />} />
//       </Routes>
      
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//       />
//     </AuthWrapper>
//   );
// };

// // Main App Component
// function App() {
//   // const backendUrl ='http://localhost:5000';
//   return (
//     <AuthProvider>
//       <Router>
//         <AppRoutes />
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;



// import React, { useState, useEffect } from 'react'
// import LandingPage from './pages/LandingPage'
// import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
// import FlightSearch from './components/Extras/FlightSearch';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import LoginForm from './components/Auth/LoginForm';
// import RegisterForm from './components/Auth/RegisterForm';
// import EmailVerification from './components/Auth/EmailVerification';
// import ForgotPassword from './components/Profile/ForgotPassword';
// import Profile from './components/Profile/Profile';
// import Bookings from './components/Booking/Bookings';
// import PaymentApp from './pages/Payment/PaymentApp';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import PaymentCallback from './pages/Payment/PaymentCallback';
// import IntegratedPayment from './pages/Payment/IntegratedPayment';
// import UserHistory from './components/Profile/UserHistory';
// import FlightResults from './components/Extras/FlightResults';
// import AdminDashboard from './admin/pages/AdminDashboard';
// import PartnerDashboard from './partners/pages/PartnerDashboard';
// import AboutUs from './components/DetailsPages/AboutUs';
// import BookingTerms from './components/DetailsPages/BookingTerms';
// import GetInTouch from './components/DetailsPages/GetInTouch';
// import Refund from './pages/Payment/Refund';
// import UserWallet from './pages/Payment/Wallet';

// // Auth Modal Component for handling login/register overlays
// const AuthModal = ({ isOpen, onClose }) => {
//   const [currentView, setCurrentView] = useState('login');
//   const [userType, setUserType] = useState('user');
//   const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');
//   const { login: authLogin } = useAuth();
//   const navigate = useNavigate();

//   // Enhanced login function with redirect logic
//   const handleLogin = async (credentials, loginUserType) => {
//     try {
//       await authLogin(credentials, loginUserType);
      
//       // After successful login, check for redirect path
//       const redirectPath = localStorage.getItem('redirectAfterLogin');
      
//       if (redirectPath) {
//         // User was on a specific page before logout, redirect there
//         localStorage.removeItem('redirectAfterLogin');
//         navigate(redirectPath, { replace: true });
//       } else {
//         // Normal login, redirect to homepage
//         navigate('/', { replace: true });
//       }
      
//       // Close the modal
//       onClose();
//     } catch (error) {
//       throw error; // Re-throw to let LoginForm handle the error display
//     }
//   };

//   const toggleForm = () => {
//     if (currentView === 'login') {
//       setCurrentView('register');
//     } else if (currentView === 'register') {
//       setCurrentView('login');
//     } else {
//       setCurrentView('login');
//     }
//   };

//   const handleForgotPassword = () => {
//     setCurrentView('forgot');
//   };

//   const handleBackToLogin = () => {
//     setCurrentView('login');
//   };

//   const handleRegistrationSuccess = (email) => {
//     setPendingVerificationEmail(email);
//     setCurrentView('verify');
//   };

//   const handleVerificationSuccess = () => {
//     // After email verification, redirect to homepage or stored path
//     const redirectPath = localStorage.getItem('redirectAfterLogin');
    
//     if (redirectPath) {
//       localStorage.removeItem('redirectAfterLogin');
//       navigate(redirectPath, { replace: true });
//     } else {
//       navigate('/', { replace: true });
//     }
    
//     // Close the modal
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="relative">
//         {/* Close button */}
//         <button 
//           onClick={onClose}
//           className="absolute top-4 right-4 z-10 text-white hover:text-gray-300"
//         >
//           ✕
//         </button>
        
//         {currentView === 'login' && (
//           <LoginForm 
//             userType={userType}
//             onToggleForm={toggleForm}
//             onForgotPassword={handleForgotPassword}
//             onSwitchType={setUserType}
//             customLogin={handleLogin}
//           />
//         )}
//         {currentView === 'register' && (
//           <RegisterForm 
//             userType={userType}
//             onToggleForm={toggleForm}
//             onSwitchType={setUserType}
//             onRegistrationSuccess={handleRegistrationSuccess}
//           />
//         )}
//         {currentView === 'forgot' && (
//           <ForgotPassword 
//             onBackToLogin={handleBackToLogin}
//           />
//         )}
//         {currentView === 'verify' && (
//           <EmailVerification 
//             email={pendingVerificationEmail}
//             userType={userType}
//             onVerified={handleVerificationSuccess}
//             onBackToLogin={handleBackToLogin}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// // Enhanced Protected Route Component
// const ProtectedRoute = ({ children }) => {
//   const { user, loading } = useAuth();
//   const location = useLocation();
//   const [showAuthModal, setShowAuthModal] = useState(false);

//   useEffect(() => {
//     if (!loading && !user) {
//       // Store the current path when user needs to authenticate
//       const currentPath = location.pathname;
//       localStorage.setItem('redirectAfterLogin', currentPath);
//       setShowAuthModal(true);
//     }
//   }, [user, loading, location.pathname]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
//         <div className="text-white text-xl">Loading...</div>
//       </div>
//     );
//   }

//   if (!user) {
//     // Show the auth modal overlay
//     return (
//       <>
//         {/* Show the current page content in the background */}
//         <div className="blur-sm pointer-events-none">
//           {children}
//         </div>
        
//         {/* Auth modal overlay */}
//         <AuthModal 
//           isOpen={showAuthModal} 
//           onClose={() => {
//             setShowAuthModal(false);
//             // Optionally redirect to home if user closes without logging in
//             // navigate('/');
//           }} 
//         />
//       </>
//     );
//   }
  
//   return children;
// };

// // Main App Routes Component
// const AppRoutes = () => {
//   const navigate = useNavigate();

//   // Handle flight booking - redirect to booking page with flight data
//   const handleBookFlight = (flightData) => {
//     console.log('Booking flight:', flightData);
    
//     // Navigate to booking page with selected flight data
//     navigate('/booking', {
//       state: {
//         selectedFlight: flightData,
//         bookingStep: 'passenger-details'
//       }
//     });
//   };

//   return (
//     <>
//       <Routes>
//         {/* Public Routes - No authentication required */}
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/about" element={<AboutUs />} />
//         <Route path="/booking-terms" element={<BookingTerms />} />
//         <Route path="/get-in-touch" element={<GetInTouch />} />
//         <Route path="/refund" element={<Refund />} />

//         {/* Protected Routes - Authentication required */}
//         <Route 
//           path="/search" 
//           element={
//             <ProtectedRoute>
//               <FlightSearch />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/flight-results" 
//           element={
//             <ProtectedRoute>
//               <FlightResults onBookFlight={handleBookFlight} />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/profile" 
//           element={
//             <ProtectedRoute>
//               <Profile />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/admin" 
//           element={
//             <ProtectedRoute>
//               <AdminDashboard />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/partner" 
//           element={
//             <ProtectedRoute>
//               <PartnerDashboard />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/history" 
//           element={
//             <ProtectedRoute>
//               <UserHistory />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/booking" 
//           element={
//             <ProtectedRoute>
//               <Bookings />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/payment" 
//           element={
//             <ProtectedRoute>
//               <PaymentApp />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/wallet" 
//           element={
//             <ProtectedRoute>
//               <UserWallet />
//             </ProtectedRoute>
//           } 
//         />

//         {/* Semi-public routes - may or may not need auth */}
//         <Route path="/payment/callback" element={<PaymentCallback />} />
//         <Route path="/payment/:bookingId" element={<IntegratedPayment />} />
//         <Route path="/wallet/callback" element={<PaymentCallback />} />
//       </Routes>
      
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//       />
//     </>
//   );
// };

// // Main App Component
// function App() {
//   // const backendUrl ='http://localhost:5000';
//   return (
//     <AuthProvider>
//       <Router>
//         <AppRoutes />
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import FlightSearch from './components/Extras/FlightSearch';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import EmailVerification from './components/Auth/EmailVerification';
import ForgotPassword from './components/Profile/ForgotPassword';
import Profile from './components/Profile/Profile';
import Bookings from './components/Booking/Bookings';
import PaymentApp from './pages/Payment/PaymentApp';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaymentCallback from './pages/Payment/PaymentCallback';
import IntegratedPayment from './pages/Payment/IntegratedPayment';
import UserHistory from './components/Profile/UserHistory';
import FlightResults from './components/Extras/FlightResults';
import AdminDashboard from './admin/pages/AdminDashboard';
import PartnerDashboard from './partners/pages/PartnerDashboard';
import AboutUs from './components/DetailsPages/AboutUs';
import BookingTerms from './components/DetailsPages/BookingTerms';
import GetInTouch from './components/DetailsPages/GetInTouch';
import Refund from './pages/Payment/Refund';
import UserWallet from './pages/Payment/Wallet';

// Simplified Auth Modal Component
const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [currentView, setCurrentView] = useState('login');
  const [userType, setUserType] = useState('user');
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');
  const { login } = useAuth();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentView('login');
      setUserType('user');
      setPendingVerificationEmail('');
    }
  }, [isOpen]);

  // Simplified login handler - no complex redirect logic
  const handleLogin = async (credentials, loginUserType) => {
    try {
      await login(credentials, loginUserType);
      
      // Handle admin redirect
      if (loginUserType === 'admin') {
        window.location.href = '/admin';
        return;
      }
      
      // For other user types, just close modal and call success callback
      onClose();
      if (onLoginSuccess) {
        onLoginSuccess();
      }
      
    } catch (error) {
      throw error; // Let LoginForm handle the error display
    }
  };

  const toggleForm = () => {
    setCurrentView(currentView === 'login' ? 'register' : 'login');
  };

  const handleForgotPassword = () => {
    setCurrentView('forgot');
  };

  const handleBackToLogin = () => {
    setCurrentView('login');
  };

  const handleRegistrationSuccess = (email) => {
    setPendingVerificationEmail(email);
    setCurrentView('verify');
  };

  const handleVerificationSuccess = () => {
    // After email verification, close modal and call success callback
    onClose();
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white hover:text-gray-300"
        >
          ✕
        </button>
        
        {currentView === 'login' && (
          <LoginForm 
            userType={userType}
            onToggleForm={toggleForm}
            onForgotPassword={handleForgotPassword}
            onSwitchType={setUserType}
            customLogin={handleLogin}
          />
        )}
        {currentView === 'register' && (
          <RegisterForm 
            userType={userType}
            onToggleForm={toggleForm}
            onSwitchType={setUserType}
            onRegistrationSuccess={handleRegistrationSuccess}
          />
        )}
        {currentView === 'forgot' && (
          <ForgotPassword 
            onBackToLogin={handleBackToLogin}
          />
        )}
        {currentView === 'verify' && (
          <EmailVerification 
            email={pendingVerificationEmail}
            userType={userType}
            onVerified={handleVerificationSuccess}
            onBackToLogin={handleBackToLogin}
          />
        )}
      </div>
    </div>
  );
};

// Simplified Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setShowAuthModal(true);
    } else if (!loading && user) {
      setShowAuthModal(false);
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        {/* Show blurred background */}
        <div className="blur-sm pointer-events-none">
          {children}
        </div>
        
        {/* Auth modal overlay */}
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={() => {
            setShowAuthModal(false);
            // User is now authenticated, component will re-render with user data
          }}
        />
      </>
    );
  }
  
  return children;
};

// Main App Routes Component
const AppRoutes = () => {
  const navigate = useNavigate();

  const handleBookFlight = (flightData) => {
    console.log('Booking flight:', flightData);
    
    navigate('/booking', {
      state: {
        selectedFlight: flightData,
        bookingStep: 'passenger-details'
      }
    });
  };

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/booking-terms" element={<BookingTerms />} />
        <Route path="/get-in-touch" element={<GetInTouch />} />
        <Route path="/refund" element={<Refund />} />

        {/* Protected Routes */}
        <Route 
          path="/search" 
          element={
            <ProtectedRoute>
              <FlightSearch />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/flight-results" 
          element={
            <ProtectedRoute>
              <FlightResults onBookFlight={handleBookFlight} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/partner" 
          element={
            <ProtectedRoute>
              <PartnerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/history" 
          element={
            <ProtectedRoute>
              <UserHistory />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/booking" 
          element={
            <ProtectedRoute>
              <Bookings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/payment" 
          element={
            <ProtectedRoute>
              <PaymentApp />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/wallet" 
          element={
            <ProtectedRoute>
              <UserWallet />
            </ProtectedRoute>
          } 
        />

        {/* Semi-public routes */}
        <Route path="/payment/callback" element={<PaymentCallback />} />
        <Route path="/payment/:bookingId" element={<IntegratedPayment />} />
        <Route path="/wallet/callback" element={<PaymentCallback />} />
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;