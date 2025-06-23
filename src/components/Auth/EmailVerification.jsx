// // Updated EmailVerification.js
// import React, { useState } from 'react';
// import { Mail } from 'lucide-react';
// import summaryApi from '../../common';

// const EmailVerification = ({ email, onVerified, onBackToLogin }) => {
//   const [otp, setOtp] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [resendLoading, setResendLoading] = useState(false);

//   const handleVerify = async () => {
//     setLoading(true);
//     setError('');

//     try {
//       const response = await fetch(summaryApi.verifyEmail.url, {
//         method: summaryApi.verifyEmail.method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, otp })
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.error || 'Verification failed');
//       }

//       onVerified();
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResendCode = async () => {
//     setResendLoading(true);
//     setError('');

//     try {
//       const response = await fetch(summaryApi.resendOTP?.url || '/api/resend-otp', {
//         method: summaryApi.resendOTP?.method || 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email })
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to resend code');
//       }

//       // Show success message briefly
//       setError(''); // Clear any previous errors
//       alert('Verification code sent successfully!');
      
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setResendLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
//       <div className="max-w-md w-full space-y-8">
//         <div className="text-center">
//           <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mb-4">
//             <Mail className="w-8 h-8 text-white" />
//           </div>
//           <h2 className="text-3xl font-bold text-white mb-2">Verify Your Email</h2>
//           <p className="text-gray-300">We've sent a verification code to</p>
//           <p className="text-blue-300 font-medium">{email}</p>
//         </div>

//         <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
//           {error && (
//             <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
//               {error}
//             </div>
//           )}

//           <div className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-200 mb-2">Verification Code</label>
//               <input
//                 type="text"
//                 required
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
//                 placeholder="Enter 6-digit code"
//                 maxLength={6}
//               />
//             </div>

//             <button
//               onClick={handleVerify}
//               disabled={loading || !otp}
//               className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
//             >
//               {loading ? 'Verifying...' : 'Verify Email'}
//             </button>

//             <div className="text-center space-y-3">
//               <button
//                 onClick={handleResendCode}
//                 disabled={resendLoading}
//                 className="text-blue-300 hover:text-blue-200 text-sm disabled:opacity-50"
//               >
//                 {resendLoading ? 'Sending...' : 'Resend verification code'}
//               </button>

//               <div className="pt-3 border-t border-white/20">
//                 <button
//                   onClick={onBackToLogin}
//                   className="text-gray-300 hover:text-white text-sm"
//                 >
//                   ← Back to login
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmailVerification;


// Updated EmailVerification.js
import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import summaryApi from '../../common';

const EmailVerification = ({ email, onVerified, onBackToLogin, userType = 'user' }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  // Determine which API endpoints to use based on userType
  const getApiEndpoints = () => {
    if (userType === 'partner') {
      return {
        verify: summaryApi.verifyPartnerEmail,
        resend: summaryApi.resendPartnerVerificationEmail
      };
    } else {
      return {
        verify: summaryApi.verifyEmail,
        resend: summaryApi.resendOTP || { url: '/api/resend-otp', method: 'POST' }
      };
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setError('');

    try {
      const apiEndpoints = getApiEndpoints();
      const response = await fetch(apiEndpoints.verify.url, {
        method: apiEndpoints.verify.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      onVerified();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setError('');

    try {
      const apiEndpoints = getApiEndpoints();
      const response = await fetch(apiEndpoints.resend.url, {
        method: apiEndpoints.resend.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend code');
      }

      // Show success message briefly
      setError(''); // Clear any previous errors
      alert('Verification code sent successfully!');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  // Get appropriate titles and messages based on userType
  const getContent = () => {
    if (userType === 'partner') {
      return {
        title: 'Verify Your Partner Account',
        subtitle: 'We\'ve sent a verification code to your business email',
        buttonText: 'Verify Partner Account'
      };
    } else {
      return {
        title: 'Verify Your Email',
        subtitle: 'We\'ve sent a verification code to',
        buttonText: 'Verify Email'
      };
    }
  };

  const content = getContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">{content.title}</h2>
          <p className="text-gray-300">{content.subtitle}</p>
          <p className="text-blue-300 font-medium">{email}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Verification Code</label>
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
            </div>

            <button
              onClick={handleVerify}
              disabled={loading || !otp}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Verifying...' : content.buttonText}
            </button>

            <div className="text-center space-y-3">
              <button
                onClick={handleResendCode}
                disabled={resendLoading}
                className="text-blue-300 hover:text-blue-200 text-sm disabled:opacity-50"
              >
                {resendLoading ? 'Sending...' : 'Resend verification code'}
              </button>

              <div className="pt-3 border-t border-white/20">
                <button
                  onClick={onBackToLogin}
                  className="text-gray-300 hover:text-white text-sm"
                >
                  ← Back to login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;