// import React, { useState } from 'react';
// import { Mail, Phone, Lock, Eye, EyeOff, Users, User, Building } from 'lucide-react';
// import { useAuth } from '../../context/AuthContext';

// const RegisterForm = ({ userType, onToggleForm, onRegistrationSuccess, onSwitchType }) => {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     password: '',
//     confirmPassword: '',
//     companyName: '',
//     businessType: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const { register } = useAuth();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       setLoading(false);
//       return;
//     }

//     try {
//       const { confirmPassword, ...submitData } = formData;
      
//       // Only include partner-specific fields if userType is 'partner'
//       const finalData = userType === 'partner' 
//         ? submitData 
//         : {
//             firstName: submitData.firstName,
//             lastName: submitData.lastName,
//             email: submitData.email,
//             phone: submitData.phone,
//             password: submitData.password
//           };
      
//       await register(finalData, userType);
      
//       // Navigate to email verification instead of showing success message
//       onRegistrationSuccess(formData.email);
      
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getUserTypeColor = () => {
//     switch(userType) {
//       case 'partner': return 'from-blue-500 to-indigo-600';
//       default: return 'from-green-500 to-emerald-600';
//     }
//   };

//   const getUserTypeIcon = () => {
//     switch(userType) {
//       case 'partner': return <Building className="w-8 h-8 text-white" />;
//       default: return <Users className="w-8 h-8 text-white" />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
//       <div className="max-w-md w-full space-y-8">
//         <div className="text-center">
//           <div className={`mx-auto h-16 w-16 bg-gradient-to-r ${getUserTypeColor()} rounded-full flex items-center justify-center mb-4`}>
//             {getUserTypeIcon()}
//           </div>
//           <h2 className="text-3xl font-bold text-white mb-2">
//             Create {userType === 'partner' ? 'Partner' : 'User'} Account
//           </h2>
//           <p className="text-gray-300">Join us today</p>
//         </div>

//         <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 max-h-[90vh] overflow-y-auto">
//           {error && (
//             <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
//               {error}
//             </div>
//           )}

//           {/* User Type Selection */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-200 mb-3">Account Type</label>
//             <div className="flex space-x-2">
//               <button
//                 type="button"
//                 onClick={() => onSwitchType('user')}
//                 className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
//                   userType === 'user' 
//                     ? 'bg-green-600 text-white' 
//                     : 'bg-white/10 text-gray-300 hover:bg-white/20'
//                 }`}
//               >
//                 <User className="w-4 h-4" />
//                 <span>User</span>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => onSwitchType('partner')}
//                 className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
//                   userType === 'partner' 
//                     ? 'bg-blue-600 text-white' 
//                     : 'bg-white/10 text-gray-300 hover:bg-white/20'
//                 }`}
//               >
//                 <Building className="w-4 h-4" />
//                 <span>Partner</span>
//               </button>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-200 mb-2">First Name</label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.firstName}
//                   onChange={(e) => setFormData({...formData, firstName: e.target.value})}
//                   className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder="First name"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-200 mb-2">Last Name</label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.lastName}
//                   onChange={(e) => setFormData({...formData, lastName: e.target.value})}
//                   className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder="Last name"
//                 />
//               </div>
//             </div>

//             {userType === 'partner' && (
//               <>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-200 mb-2">Company Name</label>
//                   <input
//                     type="text"
//                     required
//                     value={formData.companyName}
//                     onChange={(e) => setFormData({...formData, companyName: e.target.value})}
//                     className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                     placeholder="Company name"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-200 mb-2">Business Type</label>
//                   <select
//                     required
//                     value={formData.businessType}
//                     onChange={(e) => setFormData({...formData, businessType: e.target.value})}
//                     className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   >
//                     <option value="">Select business type</option>
//                     <option value="travel_agency">Travel Agency</option>
//                     <option value="airline">Airline</option>
//                     <option value="hotel">Hotel</option>
//                     <option value="tour_operator">Tour Operator</option>
//                   </select>
//                 </div>
//               </>
//             )}

//             <div>
//               <label className="block text-sm font-medium text-gray-200 mb-2">Email</label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <input
//                   type="email"
//                   required
//                   value={formData.email}
//                   onChange={(e) => setFormData({...formData, email: e.target.value})}
//                   className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder="Email address"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-200 mb-2">Phone</label>
//               <div className="relative">
//                 <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <input
//                   type="tel"
//                   required
//                   value={formData.phone}
//                   onChange={(e) => setFormData({...formData, phone: e.target.value})}
//                   className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder="Phone number"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   required
//                   value={formData.password}
//                   onChange={(e) => setFormData({...formData, password: e.target.value})}
//                   className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder="Password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-3 text-gray-400 hover:text-white"
//                 >
//                   {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                 </button>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-200 mb-2">Confirm Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <input
//                   type="password"
//                   required
//                   value={formData.confirmPassword}
//                   onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
//                   className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder="Confirm password"
//                 />
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full py-3 px-4 bg-gradient-to-r ${getUserTypeColor()} text-white font-semibold rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200`}
//             >
//               {loading ? 'Creating Account...' : `Create ${userType === 'partner' ? 'Partner' : 'User'} Account`}
//             </button>
//           </form>

//           <div className="mt-6 text-center">
//             <p className="text-gray-300 text-sm">
//               Already have an account?{' '}
//               <button
//                 onClick={onToggleForm}
//                 className="text-purple-300 hover:text-purple-200 font-medium"
//               >
//                 Sign in
//               </button>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegisterForm;



import React, { useState } from 'react';
import { Mail, Phone, Lock, Eye, EyeOff, Users, User, Building } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const RegisterForm = ({ userType, onToggleForm, onRegistrationSuccess, onSwitchType }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    businessType: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...submitData } = formData;
      
      // Prepare data based on user type
      const finalData = userType === 'partner' 
        ? {
            firstName: submitData.firstName,
            lastName: submitData.lastName,
            email: submitData.email,
            phone: submitData.phone,
            password: submitData.password,
            companyName: submitData.companyName,
            businessType: submitData.businessType
          }
        : {
            firstName: submitData.firstName,
            lastName: submitData.lastName,
            email: submitData.email,
            phone: submitData.phone,
            password: submitData.password
          };
      
      const result = await register(finalData, userType);
      
      // Handle registration success
      if (result.token) {
        // Auto-login after registration
        onRegistrationSuccess(formData.email, true); // true indicates auto-login
      } else {
        // Email verification required
        onRegistrationSuccess(formData.email, false);
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeColor = () => {
    switch(userType) {
      case 'partner': return 'from-blue-500 to-indigo-600';
      default: return 'from-green-500 to-emerald-600';
    }
  };

  const getUserTypeIcon = () => {
    switch(userType) {
      case 'partner': return <Building className="w-8 h-8 text-white" />;
      default: return <Users className="w-8 h-8 text-white" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className={`mx-auto h-16 w-16 bg-gradient-to-r ${getUserTypeColor()} rounded-full flex items-center justify-center mb-4`}>
            {getUserTypeIcon()}
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Create {userType === 'partner' ? 'Partner' : 'User'} Account
          </h2>
          <p className="text-gray-300">Join us today and get started</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 max-h-[90vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* User Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-200 mb-3">Account Type</label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => onSwitchType('user')}
                className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                  userType === 'user' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <User className="w-4 h-4" />
                <span>User</span>
              </button>
              <button
                type="button"
                onClick={() => onSwitchType('partner')}
                className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                  userType === 'partner' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>Partner</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  First Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Last Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Last name"
                />
              </div>
            </div>

            {/* Partner-specific fields */}
            {userType === 'partner' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Company Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Your company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Business Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    required
                    value={formData.businessType}
                    onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="" className="bg-gray-800">Select business type</option>
                    <option value="travel_agency" className="bg-gray-800">Travel Agency</option>
                    <option value="airline" className="bg-gray-800">Airline</option>
                    <option value="hotel" className="bg-gray-800">Hotel</option>
                    <option value="tour_operator" className="bg-gray-800">Tour Operator</option>
                    <option value="other" className="bg-gray-800">Other</option>
                  </select>
                </div>
              </>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Email Address <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Phone Number <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Confirm Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 bg-gradient-to-r ${getUserTypeColor()} text-white font-semibold rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                `Create ${userType === 'partner' ? 'Partner' : 'User'} Account`
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-300 text-sm">
              Already have an account?{' '}
              <button
                onClick={onToggleForm}
                className="text-purple-300 hover:text-purple-200 font-medium"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;