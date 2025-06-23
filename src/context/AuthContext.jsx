// import React, { useState, useContext, createContext, useEffect } from 'react';
// import summaryApi from '../common';

// // Auth Context
// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// // Helper functions for localStorage management
// const getStoredAuth = () => {
//   try {
//     return {
//       token: localStorage.getItem('token'),
//       refreshToken: localStorage.getItem('refreshToken'),
//       user: JSON.parse(localStorage.getItem('user')),
//       userType: localStorage.getItem('userType') || 'user'
//     };
//   } catch (error) {
//     console.error('Error reading from localStorage:', error);
//     return {
//       token: null,
//       refreshToken: null,
//       user: null,
//       userType: 'user'
//     };
//   }
// };

// const setStoredAuth = (authData) => {
//   try {
//     if (authData.token) localStorage.setItem('token', authData.token);
//     if (authData.refreshToken) localStorage.setItem('refreshToken', authData.refreshToken);
//     if (authData.user) localStorage.setItem('user', JSON.stringify(authData.user));
//     if (authData.userType) localStorage.setItem('userType', authData.userType);
//     if (authData.supabaseToken) localStorage.setItem('supabaseToken', authData.supabaseToken);
//   } catch (error) {
//     console.error('Error writing to localStorage:', error);
//   }
// };

// const clearStoredAuth = () => {
//   try {
//     localStorage.removeItem('token');
//     localStorage.removeItem('supabaseToken');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('userType');
//     localStorage.removeItem('user');
//   } catch (error) {
//     console.error('Error clearing localStorage:', error);
//   }
// };

// // Auth Provider
// export const AuthProvider = ({ children }) => {
//   // Initialize state from localStorage
//   const storedAuth = getStoredAuth();
  
//   const [user, setUser] = useState(storedAuth.user);
//   const [loading, setLoading] = useState(!!storedAuth.token); // Only show loading if we have a token to verify
//   const [token, setToken] = useState(storedAuth.token);
//   const [refreshToken, setRefreshToken] = useState(storedAuth.refreshToken);
//   const [userType, setUserType] = useState(storedAuth.userType);

//   useEffect(() => {
//     const initializeAuth = async () => {
//       console.log('🚀 App startup - initializing auth state');
      
//       // If we have both token and user data, consider the user authenticated
//       if (token && user) {
//         console.log('✅ Found existing session, user is authenticated');
//         setLoading(false);
        
//         // Optionally verify session in background (don't logout on failure)
//         verifySessionInBackground();
//         return;
//       }
      
//       // If we have token but no user data, try to fetch user profile
//       if (token && !user) {
//         console.log('🔄 Found token but no user data, fetching profile...');
//         await fetchUserProfile(false); // Don't logout on failure
//         return;
//       }
      
//       // No token, user is not authenticated
//       console.log('❌ No authentication data found');
//       setLoading(false);
//     };
    
//     initializeAuth();
//   }, []); // Only run once on app startup

//   // Background session verification (doesn't logout on failure)
//   const verifySessionInBackground = async () => {
//     try {
//       if (!token) return;
      
//       console.log('🔄 Background session verification...');
      
//       const verifyResponse = await fetch(summaryApi.verifySession.url, {
//         method: summaryApi.verifySession.method,
//         headers: { 
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (verifyResponse.ok) {
//         const verifyResult = await verifyResponse.json();
//         console.log('✅ Background session verification successful');
        
//         if (verifyResult.user && JSON.stringify(verifyResult.user) !== JSON.stringify(user)) {
//           // Update user data if it changed
//           setUser(verifyResult.user);
//           setStoredAuth({ user: verifyResult.user });
//         }
//       } else if (verifyResponse.status === 401 && refreshToken) {
//         console.log('🔄 Token expired, attempting background refresh...');
//         await handleTokenRefresh(false); // Don't logout on failure
//       }
//     } catch (error) {
//       console.warn('⚠️ Background session verification failed (ignored):', error);
//       // Don't logout on background verification failure
//     }
//   };

//   // Enhanced profile fetching (with option to not logout on failure)
//   const fetchUserProfile = async (logoutOnFailure = true) => {
//     try {
//       if (!token) {
//         if (logoutOnFailure) logout();
//         return null;
//       }
      
//       const endpoint = userType === 'partner' ? summaryApi.getPartnerProfile : summaryApi.getUserProfile;
      
//       const response = await fetch(endpoint.url, {
//         method: endpoint.method,
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
      
//       if (response.ok) {
//         const result = await response.json();
//         const userData = result.data || result.user || result;
        
//         setUser(userData);
//         setStoredAuth({ user: userData });
//         setLoading(false);
        
//         return userData;
//       } else if (response.status === 401) {
//         // Token expired, try to refresh
//         if (refreshToken) {
//           const refreshResult = await handleTokenRefresh(logoutOnFailure);
//           return refreshResult ? refreshResult.user : null;
//         } else if (logoutOnFailure) {
//           logout();
//         }
//       } else {
//         console.error('Failed to fetch profile:', response.status);
//         if (logoutOnFailure) {
//           logout();
//         }
//       }
//     } catch (error) {
//       console.error('Profile fetch error:', error);
//       if (logoutOnFailure) {
//         logout();
//       }
//     } finally {
//       setLoading(false);
//     }
    
//     return null;
//   };

//   // Enhanced token refresh (with option to not logout on failure)
//   const handleTokenRefresh = async (logoutOnFailure = true) => {
//     try {
//       if (!refreshToken) {
//         if (logoutOnFailure) logout();
//         return null;
//       }
      
//       console.log('🔄 Attempting token refresh...');
      
//       const response = await fetch(summaryApi.refreshToken.url, {
//         method: summaryApi.refreshToken.method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ refreshToken })
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log('✅ Token refresh successful');
        
//         // Update all auth data
//         const authData = {
//           token: data.token,
//           refreshToken: data.refreshToken,
//           user: data.user,
//           userType: userType,
//           supabaseToken: data.supabaseToken
//         };
        
//         setToken(data.token);
//         setRefreshToken(data.refreshToken);
//         setUser(data.user);
//         setStoredAuth(authData);
        
//         return data;
//       } else {
//         console.error('Token refresh failed:', response.status);
//         if (logoutOnFailure) {
//           logout();
//         }
//         return null;
//       }
//     } catch (error) {
//       console.error('Token refresh error:', error);
//       if (logoutOnFailure) {
//         logout();
//       }
//       return null;
//     }
//   };

//   const login = async (credentials, loginUserType = 'user') => {
//     try {
//       setLoading(true);
      
//       const endpoint = loginUserType === 'partner' ? summaryApi.partnerLogin : summaryApi.userLogin;
      
//       const response = await fetch(endpoint.url, {
//         method: endpoint.method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(credentials)
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.error || data.message || 'Login failed');
//       }

//       // Store all auth data
//       const userData = data.user || data.partner || data.data;
//       const authData = {
//         token: data.token,
//         refreshToken: data.refreshToken,
//         user: userData,
//         userType: loginUserType,
//         supabaseToken: data.supabaseToken
//       };
      
//       setToken(data.token);
//       setRefreshToken(data.refreshToken);
//       setUser(userData);
//       setUserType(loginUserType);
//       setStoredAuth(authData);
      
//       console.log('✅ Login successful, user data stored');
//       return data;
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loginWithSupabase = async (supabaseAccessToken) => {
//     try {
//       setLoading(true);
      
//       const response = await fetch(summaryApi.userLoginSupabase.url, {
//         method: summaryApi.userLoginSupabase.method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ supabaseAccessToken })
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.error || 'Supabase login failed');
//       }

//       // Store all auth data
//       const authData = {
//         token: data.token || supabaseAccessToken,
//         refreshToken: data.refreshToken,
//         user: data.user,
//         userType: 'user',
//         supabaseToken: data.supabaseToken || supabaseAccessToken
//       };
      
//       setToken(authData.token);
//       setRefreshToken(authData.refreshToken);
//       setUser(data.user);
//       setUserType('user');
//       setStoredAuth(authData);
      
//       return data;
//     } catch (error) {
//       console.error('Supabase login error:', error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const register = async (userData, registerUserType = 'user') => {
//     try {
//       setLoading(true);
      
//       const endpoint = registerUserType === 'partner' ? summaryApi.partnerRegister : summaryApi.userRegister;
      
//       const response = await fetch(endpoint.url, {
//         method: endpoint.method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(userData)
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.error || data.message || 'Registration failed');
//       }

//       // If backend returns token (auto-login after registration)
//       if (data.token) {
//         const authData = {
//           token: data.token,
//           refreshToken: data.refreshToken,
//           user: data.user,
//           userType: registerUserType,
//           supabaseToken: data.supabaseToken
//         };
        
//         setToken(data.token);
//         setRefreshToken(data.refreshToken);
//         setUser(data.user);
//         setUserType(registerUserType);
//         setStoredAuth(authData);
//       }

//       return data;
//     } catch (error) {
//       console.error('Registration error:', error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const verifyEmail = async (email, otp) => {
//     try {
//       const endpoint = userType === 'partner' ? summaryApi.verifyPartnerEmail : summaryApi.verifyEmail;
      
//       const response = await fetch(endpoint.url, {
//         method: endpoint.method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, otp })
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.error || 'Email verification failed');
//       }

//       // If backend returns tokens after verification (auto-login)
//       if (data.token) {
//         const authData = {
//           token: data.token,
//           refreshToken: data.refreshToken,
//           user: data.user || data.partner,
//           userType: userType,
//           supabaseToken: data.supabaseToken
//         };
        
//         setToken(data.token);
//         setRefreshToken(data.refreshToken);
//         setUser(data.user || data.partner);
//         setStoredAuth(authData);
//       }

//       return data;
//     } catch (error) {
//       console.error('Email verification error:', error);
//       throw error;
//     }
//   };

//   const forgotPassword = async (email) => {
//     try {
//       const response = await fetch(summaryApi.forgotPassword.url, {
//         method: summaryApi.forgotPassword.method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email })
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.error || 'Password reset request failed');
//       }

//       return data;
//     } catch (error) {
//       console.error('Forgot password error:', error);
//       throw error;
//     }
//   };

//   const resetPassword = async (accessToken, newPassword) => {
//     try {
//       const response = await fetch(summaryApi.resetPassword.url, {
//         method: summaryApi.resetPassword.method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ accessToken, newPassword })
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.error || 'Password reset failed');
//       }

//       return data;
//     } catch (error) {
//       console.error('Reset password error:', error);
//       throw error;
//     }
//   };

//   const logout = async () => {
//     console.log('🚪 Logging out user...');
    
//     try {
//       // Call backend logout endpoint if token exists
//       if (token) {
//         await fetch(summaryApi.userLogout.url, {
//           method: summaryApi.userLogout.method,
//           headers: { 'Authorization': `Bearer ${token}` }
//         });
//       }
//     } catch (error) {
//       console.error('Logout API call failed:', error);
//       // Continue with local logout even if API call fails
//     } finally {
//       // Clear all local storage and state
//       clearStoredAuth();
//       setToken(null);
//       setRefreshToken(null);
//       setUser(null);
//       setUserType('user');
//       setLoading(false);
      
//       console.log('✅ User logged out successfully');
//     }
//   };

//   const updateProfile = async (profileData) => {
//     try {
//       const endpoint = userType === 'partner' ? summaryApi.updatePartnerProfile : summaryApi.updateUserProfile;
      
//       const response = await fetch(endpoint.url, {
//         method: endpoint.method,
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(profileData)
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         if (response.status === 401 && refreshToken) {
//           await handleTokenRefresh();
//           // Retry the request with new token
//           return updateProfile(profileData);
//         }
//         throw new Error(data.error || 'Profile update failed');
//       }

//       const userData = data.data || data.user || data.partner || data;
//       setUser(userData);
//       setStoredAuth({ user: userData });
      
//       return userData;
//     } catch (error) {
//       console.error('Profile update error:', error);
//       throw error;
//     }
//   };

//   const deleteAccount = async () => {
//     try {
//       const response = await fetch(summaryApi.deleteUserAccount.url, {
//         method: summaryApi.deleteUserAccount.method,
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.error || 'Account deletion failed');
//       }

//       // Logout after successful account deletion
//       logout();
//       return data;
//     } catch (error) {
//       console.error('Delete account error:', error);
//       throw error;
//     }
//   };

//   const syncUserData = async () => {
//     try {
//       const response = await fetch(summaryApi.syncUserData.url, {
//         method: summaryApi.syncUserData.method,
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.error || 'User sync failed');
//       }

//       if (data.user) {
//         setUser(data.user);
//         setStoredAuth({ user: data.user });
//       }
      
//       return data;
//     } catch (error) {
//       console.error('User sync error:', error);
//       throw error;
//     }
//   };

//   const resendVerificationEmail = async (email) => {
//     try {
//       const response = await fetch(summaryApi.resendPartnerVerificationEmail.url, {
//         method: summaryApi.resendPartnerVerificationEmail.method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email })
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to resend verification email');
//       }

//       return data;
//     } catch (error) {
//       console.error('Resend verification error:', error);
//       throw error;
//     }
//   };

//   const value = {
//     // State
//     user,
//     token,
//     refreshToken,
//     loading,
//     userType,
//     isAuthenticated: !!user && !!token,
//     isPartner: userType === 'partner',
//     isUser: userType === 'user',
    
//     // Authentication methods
//     login,
//     loginWithSupabase,
//     register,
//     logout,
    
//     // Profile methods
//     fetchUserProfile,
//     updateProfile,
//     deleteAccount,
//     syncUserData,
    
//     // Utility methods
//     verifyEmail,
//     forgotPassword,
//     resetPassword,
//     handleTokenRefresh,
//     verifySessionInBackground,
//     resendVerificationEmail
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };



import React, { useState, useContext, createContext, useEffect } from 'react';
import summaryApi from '../common';
import { backendUrl } from '../config/config';

// Auth Context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper functions for localStorage management
const getStoredAuth = () => {
  try {
    // Check for admin auth first
    const adminToken = localStorage.getItem('adminToken');
    const adminUser = localStorage.getItem('adminUser');
    
    if (adminToken && adminUser) {
      return {
        token: adminToken,
        refreshToken: null,
        user: JSON.parse(adminUser),
        userType: 'admin'
      };
    }
    
    // Fall back to regular auth
    return {
      token: localStorage.getItem('token'),
      refreshToken: localStorage.getItem('refreshToken'),
      user: JSON.parse(localStorage.getItem('user')),
      userType: localStorage.getItem('userType') || 'user'
    };
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return {
      token: null,
      refreshToken: null,
      user: null,
      userType: 'user'
    };
  }
};

const setStoredAuth = (authData) => {
  try {
    if (authData.userType === 'admin') {
      // Store admin auth separately
      if (authData.token) localStorage.setItem('adminToken', authData.token);
      if (authData.user) localStorage.setItem('adminUser', JSON.stringify(authData.user));
    } else {
      // Store regular auth
      if (authData.token) localStorage.setItem('token', authData.token);
      if (authData.refreshToken) localStorage.setItem('refreshToken', authData.refreshToken);
      if (authData.user) localStorage.setItem('user', JSON.stringify(authData.user));
      if (authData.userType) localStorage.setItem('userType', authData.userType);
      if (authData.supabaseToken) localStorage.setItem('supabaseToken', authData.supabaseToken);
    }
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

const clearStoredAuth = () => {
  try {
    // Clear regular auth
    localStorage.removeItem('token');
    localStorage.removeItem('supabaseToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
    
    // Clear admin auth
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

// Auth Provider
export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage
  const storedAuth = getStoredAuth();
  
  const [user, setUser] = useState(storedAuth.user);
  const [loading, setLoading] = useState(!!storedAuth.token); // Only show loading if we have a token to verify
  const [token, setToken] = useState(storedAuth.token);
  const [refreshToken, setRefreshToken] = useState(storedAuth.refreshToken);
  const [userType, setUserType] = useState(storedAuth.userType);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🚀 App startup - initializing auth state');
      
      // If we have both token and user data, consider the user authenticated
      if (token && user) {
        console.log('✅ Found existing session, user is authenticated', { userType, email: user.email });
        setLoading(false);
        
        // Only verify session in background for non-admin users
        if (userType !== 'admin') {
          verifySessionInBackground();
        }
        return;
      }
      
      // If we have token but no user data, try to fetch user profile (not for admin)
      if (token && !user && userType !== 'admin') {
        console.log('🔄 Found token but no user data, fetching profile...');
        await fetchUserProfile(false); // Don't logout on failure
        return;
      }
      
      // No token, user is not authenticated
      console.log('❌ No authentication data found');
      setLoading(false);
    };
    
    initializeAuth();
  }, []); // Only run once on app startup

  // Background session verification (doesn't logout on failure)
  const verifySessionInBackground = async () => {
    try {
      if (!token || userType === 'admin') return; // Skip for admin users
      
      console.log('🔄 Background session verification...');
      
      const verifyResponse = await fetch(summaryApi.verifySession.url, {
        method: summaryApi.verifySession.method,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (verifyResponse.ok) {
        const verifyResult = await verifyResponse.json();
        console.log('✅ Background session verification successful');
        
        if (verifyResult.user && JSON.stringify(verifyResult.user) !== JSON.stringify(user)) {
          // Update user data if it changed
          setUser(verifyResult.user);
          setStoredAuth({ user: verifyResult.user, userType });
        }
      } else if (verifyResponse.status === 401 && refreshToken) {
        console.log('🔄 Token expired, attempting background refresh...');
        await handleTokenRefresh(false); // Don't logout on failure
      }
    } catch (error) {
      console.warn('⚠️ Background session verification failed (ignored):', error);
      // Don't logout on background verification failure
    }
  };

  // Enhanced profile fetching (with option to not logout on failure)
  const fetchUserProfile = async (logoutOnFailure = true) => {
    try {
      if (!token || userType === 'admin') {
        if (logoutOnFailure && userType !== 'admin') logout();
        return null;
      }
      
      const endpoint = userType === 'partner' ? summaryApi.getPartnerProfile : summaryApi.getUserProfile;
      
      const response = await fetch(endpoint.url, {
        method: endpoint.method,
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const result = await response.json();
        const userData = result.data || result.user || result;
        
        setUser(userData);
        setStoredAuth({ user: userData, userType });
        setLoading(false);
        
        return userData;
      } else if (response.status === 401) {
        // Token expired, try to refresh
        if (refreshToken) {
          const refreshResult = await handleTokenRefresh(logoutOnFailure);
          return refreshResult ? refreshResult.user : null;
        } else if (logoutOnFailure) {
          logout();
        }
      } else {
        console.error('Failed to fetch profile:', response.status);
        if (logoutOnFailure) {
          logout();
        }
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      if (logoutOnFailure) {
        logout();
      }
    } finally {
      setLoading(false);
    }
    
    return null;
  };

  // Enhanced token refresh (with option to not logout on failure)
  const handleTokenRefresh = async (logoutOnFailure = true) => {
    try {
      if (!refreshToken || userType === 'admin') {
        if (logoutOnFailure && userType !== 'admin') logout();
        return null;
      }
      
      console.log('🔄 Attempting token refresh...');
      
      const response = await fetch(summaryApi.refreshToken.url, {
        method: summaryApi.refreshToken.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Token refresh successful');
        
        // Update all auth data
        const authData = {
          token: data.token,
          refreshToken: data.refreshToken,
          user: data.user,
          userType: userType,
          supabaseToken: data.supabaseToken
        };
        
        setToken(data.token);
        setRefreshToken(data.refreshToken);
        setUser(data.user);
        setStoredAuth(authData);
        
        return data;
      } else {
        console.error('Token refresh failed:', response.status);
        if (logoutOnFailure) {
          logout();
        }
        return null;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      if (logoutOnFailure) {
        logout();
      }
      return null;
    }
  };

  // Admin login function
  const adminLogin = async (credentials) => {
    try {
      setLoading(true);
      console.log('🔐 Attempting admin login:', { email: credentials.email });
      
      const response = await fetch(`${backendUrl}/api/admin/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Admin login failed:', data);
        throw new Error(data.message || data.error || 'Admin login failed');
      }

      console.log('✅ Admin login successful:', { 
        email: data.user?.email, 
        role: data.user?.role 
      });
      
      // Update auth state
      const authData = {
        token: data.token,
        user: data.user,
        userType: 'admin'
      };
      
      setToken(data.token);
      setUser(data.user);
      setUserType('admin');
      setStoredAuth(authData);
      
      return data;
    } catch (error) {
      console.error('❌ Admin login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials, loginUserType = 'user') => {
    try {
      setLoading(true);
      
      // Handle admin login
      if (loginUserType === 'admin') {
        return await adminLogin(credentials);
      }
      
      const endpoint = loginUserType === 'partner' ? summaryApi.partnerLogin : summaryApi.userLogin;
      
      const response = await fetch(endpoint.url, {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Login failed');
      }

      // Store all auth data
      const userData = data.user || data.partner || data.data;
      const authData = {
        token: data.token,
        refreshToken: data.refreshToken,
        user: userData,
        userType: loginUserType,
        supabaseToken: data.supabaseToken
      };
      
      setToken(data.token);
      setRefreshToken(data.refreshToken);
      setUser(userData);
      setUserType(loginUserType);
      setStoredAuth(authData);
      
      console.log('✅ Login successful, user data stored');
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithSupabase = async (supabaseAccessToken) => {
    try {
      setLoading(true);
      
      const response = await fetch(summaryApi.userLoginSupabase.url, {
        method: summaryApi.userLoginSupabase.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supabaseAccessToken })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Supabase login failed');
      }

      // Store all auth data
      const authData = {
        token: data.token || supabaseAccessToken,
        refreshToken: data.refreshToken,
        user: data.user,
        userType: 'user',
        supabaseToken: data.supabaseToken || supabaseAccessToken
      };
      
      setToken(authData.token);
      setRefreshToken(authData.refreshToken);
      setUser(data.user);
      setUserType('user');
      setStoredAuth(authData);
      
      return data;
    } catch (error) {
      console.error('Supabase login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData, registerUserType = 'user') => {
    try {
      setLoading(true);
      
      const endpoint = registerUserType === 'partner' ? summaryApi.partnerRegister : summaryApi.userRegister;
      
      const response = await fetch(endpoint.url, {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Registration failed');
      }

      // If backend returns token (auto-login after registration)
      if (data.token) {
        const authData = {
          token: data.token,
          refreshToken: data.refreshToken,
          user: data.user,
          userType: registerUserType,
          supabaseToken: data.supabaseToken
        };
        
        setToken(data.token);
        setRefreshToken(data.refreshToken);
        setUser(data.user);
        setUserType(registerUserType);
        setStoredAuth(authData);
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (email, otp) => {
    try {
      const endpoint = userType === 'partner' ? summaryApi.verifyPartnerEmail : summaryApi.verifyEmail;
      
      const response = await fetch(endpoint.url, {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Email verification failed');
      }

      // If backend returns tokens after verification (auto-login)
      if (data.token) {
        const authData = {
          token: data.token,
          refreshToken: data.refreshToken,
          user: data.user || data.partner,
          userType: userType,
          supabaseToken: data.supabaseToken
        };
        
        setToken(data.token);
        setRefreshToken(data.refreshToken);
        setUser(data.user || data.partner);
        setStoredAuth(authData);
      }

      return data;
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await fetch(summaryApi.forgotPassword.url, {
        method: summaryApi.forgotPassword.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Password reset request failed');
      }

      return data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  };

  const resetPassword = async (accessToken, newPassword) => {
    try {
      const response = await fetch(summaryApi.resetPassword.url, {
        method: summaryApi.resetPassword.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, newPassword })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Password reset failed');
      }

      return data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const logout = async () => {
    console.log('🚪 Logging out user...');
    
    try {
      // Call backend logout endpoint if token exists
      if (token && userType !== 'admin') {
        await fetch(summaryApi.userLogout.url, {
          method: summaryApi.userLogout.method,
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with local logout even if API call fails
    } finally {
      // Clear all local storage and state
      clearStoredAuth();
      setToken(null);
      setRefreshToken(null);
      setUser(null);
      setUserType('user');
      setLoading(false);
      
      console.log('✅ User logged out successfully');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      if (userType === 'admin') {
        throw new Error('Admin profile updates not supported');
      }
      
      const endpoint = userType === 'partner' ? summaryApi.updatePartnerProfile : summaryApi.updateUserProfile;
      
      const response = await fetch(endpoint.url, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401 && refreshToken) {
          await handleTokenRefresh();
          // Retry the request with new token
          return updateProfile(profileData);
        }
        throw new Error(data.error || 'Profile update failed');
      }

      const userData = data.data || data.user || data.partner || data;
      setUser(userData);
      setStoredAuth({ user: userData, userType });
      
      return userData;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      const response = await fetch(summaryApi.deleteUserAccount.url, {
        method: summaryApi.deleteUserAccount.method,
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Account deletion failed');
      }

      // Logout after successful account deletion
      logout();
      return data;
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  };

  const syncUserData = async () => {
    try {
      const response = await fetch(summaryApi.syncUserData.url, {
        method: summaryApi.syncUserData.method,
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'User sync failed');
      }

      if (data.user) {
        setUser(data.user);
        setStoredAuth({ user: data.user, userType });
      }
      
      return data;
    } catch (error) {
      console.error('User sync error:', error);
      throw error;
    }
  };

  const resendVerificationEmail = async (email) => {
    try {
      const response = await fetch(summaryApi.resendPartnerVerificationEmail.url, {
        method: summaryApi.resendPartnerVerificationEmail.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend verification email');
      }

      return data;
    } catch (error) {
      console.error('Resend verification error:', error);
      throw error;
    }
  };

  const value = {
    // State
    user,
    token,
    refreshToken,
    loading,
    userType,
    isAuthenticated: !!user && !!token,
    isPartner: userType === 'partner',
    isUser: userType === 'user',
    isAdmin: userType === 'admin',
    
    // Authentication methods
    login,
    loginWithSupabase,
    register,
    logout,
    
    // Profile methods
    fetchUserProfile,
    updateProfile,
    deleteAccount,
    syncUserData,
    
    // Utility methods
    verifyEmail,
    forgotPassword,
    resetPassword,
    handleTokenRefresh,
    verifySessionInBackground,
    resendVerificationEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};