import React, { useState, useRef, useEffect } from 'react'
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi'
import { FaHistory, FaTachometerAlt, FaWallet, FaUndo } from 'react-icons/fa';
import { MdFlight } from 'react-icons/md'
import { themeColors } from '../../theme/index'
import { useAuth } from '../../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

function Header() {
  const { user, logout, isAuthenticated, userType } = useAuth()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  const [activeItem, setActiveItem] = useState('Home')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)

  // Base navigation items
  const baseNavItems = [
    'Home', 
    'About Us', 
    'Booking Terms', 
    'Flights', 
    'Get In Touch', 
    'Find Flights'
  ]

  // Add Dashboard for partners and admins
  const navItems = (userType === 'partner' || userType === 'admin')
    ? ['Home', 'Dashboard', 'About Us', 'Booking Terms', 'Flights', 'Get In Touch', 'Find Flights']
    : baseNavItems

  const handleItemClick = (item) => {
    setActiveItem(item)
    setIsMobileMenuOpen(false)
    
    // Handle navigation for specific items
    if (item === 'Dashboard') {
      if (userType === 'partner') {
        navigate('/partner')
      } else if (userType === 'admin') {
        navigate('/admin')
      }
    }
    // Add other navigation logic as needed
    else if (item === 'Home') {
      navigate('/')
    } else if (item === 'About Us') {
      navigate('/about')
    } else if (item === 'Booking Terms') {
      navigate('/booking-terms')
    } else if (item === 'Flights') {
      navigate('/search')
    } else if (item === 'Get In Touch') {
      navigate('/get-in-touch')
    } else if (item === 'Find Flights') {
      navigate('/flight-results')
    }
  }

  const goHome = () => {
    navigate("/")
  }

  const goToProfile = () => {
    console.log('Navigating to profile...')
    setIsProfileDropdownOpen(false)
    setIsMobileMenuOpen(false)
    // Use setTimeout to ensure dropdown closes before navigation
    setTimeout(() => {
      navigate("/profile")
    }, 100)
  }

  const goToHistory = () => {
    console.log('Navigating to history...')
    setIsProfileDropdownOpen(false)
    setIsMobileMenuOpen(false)
    // Use setTimeout to ensure dropdown closes before navigation
    setTimeout(() => {
      navigate("/history")
    }, 100)
  }

  const goToDashboard = () => {
    console.log('Navigating to dashboard...')
    setIsProfileDropdownOpen(false)
    setIsMobileMenuOpen(false)
    // Use setTimeout to ensure dropdown closes before navigation
    setTimeout(() => {
      if (userType === 'partner') {
        navigate("/partner")
      } else if (userType === 'admin') {
        navigate("/admin")
      }
    }, 100)
  }

  const goToRefund = () => {
    console.log('Navigating to refund...')
    setIsProfileDropdownOpen(false)
    setIsMobileMenuOpen(false)
    // Use setTimeout to ensure dropdown closes before navigation
    setTimeout(() => {
      navigate("/refund")
    }, 100)
  }

  const goToWallet = () => {
    console.log('Navigating to wallet...')
    setIsProfileDropdownOpen(false)
    setIsMobileMenuOpen(false)
    // Use setTimeout to ensure dropdown closes before navigation
    setTimeout(() => {
      navigate("/wallet")
    }, 100)
  }

  const handleLogout = async () => {
    console.log('Logging out...')
    setIsProfileDropdownOpen(false)
    setIsMobileMenuOpen(false)
    try {
      await logout()
      navigate("/")
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Close dropdown when clicking outside - with better event handling
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close if click is truly outside and not on a dropdown item
      if (dropdownRef.current && 
          !dropdownRef.current.contains(event.target) && 
          !event.target.closest('[data-dropdown-item]')) {
        setIsProfileDropdownOpen(false)
      }
    }

    // Add a small delay to prevent immediate closure
    if (isProfileDropdownOpen) {
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
      }, 100)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileDropdownOpen])

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const ProfileDropdown = ({ isMobile = false }) => (
    <div className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 ${isMobile ? 'relative mt-4 w-full' : ''}`}>
      <button
        data-dropdown-item="true"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          goToProfile()
        }}
        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition-colors duration-200"
      >
        <FiUser size={16} />
        <span>View Profile</span>
      </button>
      
      {/* Dashboard option for partners and admins */}
      {(userType === 'partner' || userType === 'admin') && (
        <button
          data-dropdown-item="true"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            goToDashboard()
          }}
          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition-colors duration-200"
        >
          <FaTachometerAlt size={16} />
          <span>Dashboard</span>
        </button>
      )}
      
      <button
        data-dropdown-item="true"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          goToHistory()
        }}
        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition-colors duration-200"
      >
        <FaHistory size={16} />
        <span>View History</span>
      </button>

      {/* Wallet option */}
      <button
        data-dropdown-item="true"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          goToWallet()
        }}
        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition-colors duration-200"
      >
        <FaWallet size={16} />
        <span>Wallet</span>
      </button>

      {/* Refund option */}
      <button
        data-dropdown-item="true"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          goToRefund()
        }}
        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition-colors duration-200"
      >
        <FaUndo size={16} />
        <span>Refund</span>
      </button>

      <hr className="my-1" />
      <button
        data-dropdown-item="true"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleLogout()
        }}
        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors duration-200"
      >
        <FiLogOut size={16} />
        <span>Logout</span>
      </button>
    </div>
  )

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer group flex-shrink-0"
            onClick={goHome}
          >
            <div className="relative">
              <MdFlight 
                className="text-2xl sm:text-3xl transform group-hover:scale-110 transition-all duration-300 group-hover:rotate-12" 
                style={{ color: themeColors.primary.text }}
              />
              <div 
                className="absolute -top-1 -right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse"
                style={{ backgroundColor: themeColors.warning.text }}
              ></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Elevatio
              </span>
              <span className="text-xs hidden sm:block" style={{ color: themeColors.neutral.text }}>
                Flight Booking
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navItems.map((item) => (
              <div key={item} className="relative group">
                <button
                  onClick={() => handleItemClick(item)}
                  className={`relative px-2 xl:px-3 py-2 text-sm font-medium transition-all duration-300 ${
                    activeItem === item
                      ? ''
                      : 'hover:text-blue-600'
                  }`}
                  style={{
                    color: activeItem === item ? themeColors.primary.text : themeColors.neutral.text
                  }}
                >
                  {item === 'Dashboard' && (userType === 'partner' || userType === 'admin') ? (
                    <span className="flex items-center space-x-1">
                      <FaTachometerAlt size={14} />
                      <span>{item}</span>
                    </span>
                  ) : (
                    item
                  )}
                  
                  {/* Active indicator line */}
                  <div 
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r transform transition-all duration-300 ${
                      activeItem === item 
                        ? 'scale-x-100 opacity-100' 
                        : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-50'
                    }`}
                    style={{
                      background: `linear-gradient(to right, ${themeColors.primary.bgColor(1)}, ${themeColors.secondary.bgColor(1)})`
                    }}
                  ></div>
                  
                  {/* Hover background */}
                  <div 
                    className="absolute inset-0 rounded-lg transform scale-0 group-hover:scale-100 transition-transform duration-200 -z-10"
                    style={{ backgroundColor: themeColors.primary.bgColor(0.1) }}
                  ></div>
                </button>
              </div>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700 hidden lg:block">
                  Welcome, <span className="font-semibold">{user?.first_name || user?.email?.split('@')[0] || 'User'}</span>
                </span>
                
                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }}
                    className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full border-2 border-gray-300 hover:border-blue-500 transition-all duration-300 overflow-hidden group"
                  >
                    {user?.profile_image ? (
                      <img 
                        src={user.profile_image} 
                        alt="Profile" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <FiUser 
                        className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" 
                      />
                    )}
                  </button>
                  
                  {isProfileDropdownOpen && <ProfileDropdown />}
                </div>
              </div>
            ) : (
              <button 
                onClick={() => handleItemClick('Find Flights')}
                className={`text-white px-4 lg:px-6 py-2 rounded-full font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-r text-sm lg:text-base ${themeColors.gradient.gradient} hover:${themeColors.gradient.gradientHover}`}
              >
                Book Now
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Profile Icon (when authenticated) */}
            {isAuthenticated && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }}
                  className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-300 hover:border-blue-500 transition-all duration-300 overflow-hidden"
                >
                  {user?.profile_image ? (
                    <img 
                      src={user.profile_image} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiUser className="w-4 h-4 text-gray-600" />
                  )}
                </button>
                
                {isProfileDropdownOpen && <ProfileDropdown />}
              </div>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="transition-colors duration-200 p-2"
              style={{ 
                color: themeColors.neutral.text,
              }}
              onMouseEnter={(e) => e.target.style.color = themeColors.primary.text}
              onMouseLeave={(e) => e.target.style.color = themeColors.neutral.text}
            >
              {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-96 opacity-100 pb-4' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="space-y-1 pt-4 border-t">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => handleItemClick(item)}
                className={`block w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeItem === item
                    ? 'border-l-4'
                    : ''
                }`}
                style={{
                  color: activeItem === item ? themeColors.primary.text : themeColors.neutral.text,
                  backgroundColor: activeItem === item ? themeColors.primary.bgColor(0.1) : 'transparent',
                  borderLeftColor: activeItem === item ? themeColors.primary.text : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (activeItem !== item) {
                    e.target.style.color = themeColors.primary.text
                    e.target.style.backgroundColor = themeColors.neutral.lightBg(0.5)
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeItem !== item) {
                    e.target.style.color = themeColors.neutral.text
                    e.target.style.backgroundColor = 'transparent'
                  }
                }}
              >
                {item === 'Dashboard' && (userType === 'partner' || userType === 'admin') ? (
                  <span className="flex items-center space-x-2">
                    <FaTachometerAlt size={16} />
                    <span>{item}</span>
                  </span>
                ) : (
                  item
                )}
              </button>
            ))}
            
            {/* Mobile Authentication Section */}
            {isAuthenticated ? (
              <div className="mt-4 space-y-2">
                <div className="px-4 py-2 text-sm text-gray-600 border-t pt-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full border-2 border-gray-300 overflow-hidden flex-shrink-0">
                      {user?.profile_image ? (
                        <img 
                          src={user.profile_image} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <FiUser className="w-4 h-4 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <span className="font-semibold">
                      {user?.first_name || user?.email?.split('@')[0] || 'User'}
                    </span>
                  </div>
                </div>

                {/* Mobile Profile Menu */}
                <div className="px-4 space-y-2">
                  <button
                    onClick={goToProfile}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <FiUser size={16} />
                    <span>View Profile</span>
                  </button>
                  
                  {/* Dashboard option for partners and admins in mobile */}
                  {(userType === 'partner' || userType === 'admin') && (
                    <button
                      onClick={goToDashboard}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      <FaTachometerAlt size={16} />
                      <span>Dashboard</span>
                    </button>
                  )}
                  
                  <button
                    onClick={goToHistory}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <FaHistory size={16} />
                    <span>View History</span>
                  </button>

                  {/* Wallet option in mobile */}
                  <button
                    onClick={goToWallet}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <FaWallet size={16} />
                    <span>Wallet</span>
                  </button>

                  {/* Refund option in mobile */}
                  <button
                    onClick={goToRefund}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <FaUndo size={16} />
                    <span>Refund</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <FiLogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => handleItemClick('Find Flights')}
                className={`w-full mt-4 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 bg-gradient-to-r ${themeColors.gradient.gradient} hover:${themeColors.gradient.gradientHover}`}
              >
                Book Now
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Header