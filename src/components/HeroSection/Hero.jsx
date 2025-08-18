import React, { useState, useEffect } from 'react'
import { ChevronDown, MapPin, Calendar, Users, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import plane from "../../assets/images/Fly.png"
import Header from '../Navbar/Header'
import themeColors from '../../theme'
import summaryApi from '../../common'
import AirportAutocomplete from './AirportAutocomplete'

function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentText, setCurrentText] = useState(0)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Form state - Fixed to match backend expectations
  const [searchForm, setSearchForm] = useState({
    tripType: 'one-way',
    origin: '',      
    destination: '', 
    departureDate: '', 
    returnDate: '',
    passengers: 1,   
    cabinClass: 'economy', 
    directFlightsOnly: false, 
    flexibleDates: false
  })

  const heroTexts = [
    "Find Your Perfect Flight",
    "Discover Amazing Destinations", 
    "Book Your Dream Journey"
  ]

  useEffect(() => {
    setIsVisible(true)
    
    // Text rotation animation
    const textInterval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % heroTexts.length)
    }, 4000)

    return () => clearInterval(textInterval)
  }, [])

  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    })
  }

  // Handle form input changes - Fixed to match new structure
  const handleInputChange = (field, value) => {
    if (field === 'passengers') {
      // Convert to number for backend
      setSearchForm(prev => ({
        ...prev,
        passengers: parseInt(value) || 1
      }))
    } else {
      setSearchForm(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  // Validation function - Updated field names
  const isSearchValid = () => {
    const basicValid = searchForm.origin && searchForm.destination && searchForm.departureDate
    const returnValid = searchForm.tripType === 'one-way' || searchForm.returnDate
    return basicValid && returnValid && searchForm.passengers > 0
  }

  // Handle flight search - Fixed payload structure
  const handleSearchFlights = async () => {
    // Validate required fields
    if (!isSearchValid()) {
      setError('Please fill in all required fields (Origin, Destination, and Departure Date)')
      return
    }

    setIsSearching(true)
    setError('')

    try {
      // Prepare search payload with correct field names and structure
      const searchPayload = {
        tripType: searchForm.tripType,
        origin: searchForm.origin,
        destination: searchForm.destination,
        departureDate: searchForm.departureDate,
        returnDate: searchForm.returnDate || null,
        passengers: searchForm.passengers, // Now a simple number
        cabinClass: searchForm.cabinClass,
        directFlightsOnly: searchForm.directFlightsOnly,
        flexibleDates: searchForm.flexibleDates
      }

      // Remove null/empty values to clean the payload
      Object.keys(searchPayload).forEach(key => {
        if (searchPayload[key] === null || searchPayload[key] === '') {
          delete searchPayload[key]
        }
      })

      console.log('Search payload:', searchPayload) // Debug log

      // Make API call
      const response = await fetch(summaryApi.searchFlights.url, {
        method: summaryApi.searchFlights.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchPayload)
      })

      // Handle response
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Server error:', errorData)
        
        // Better error handling
        if (errorData.details && Array.isArray(errorData.details)) {
          setError(errorData.details.join(', '))
        } else if (errorData.message) {
          setError(errorData.message)
        } else {
          setError(`Server error: ${response.status}`)
        }
        return
      }

      const searchResults = await response.json()
      console.log('Search results:', searchResults)
      
      // Navigate to results page
      navigate('/flight-results', {
        state: {
          searchData: searchForm,
          searchResults: searchResults
        }
      })
      
    } catch (error) {
      console.error('Flight search failed:', error)
      setError('Connection failed. Please check your internet connection and try again.')
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Custom CSS */}
      <style>
        {`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slowZoom {
            0% {
              transform: scale(1);
            }
            100% {
              transform: scale(1.1);
            }
          }
          
          input[type="date"]::-webkit-calendar-picker-indicator {
            filter: invert(1);
          }
        `}
      </style>

      {/* Animated Background */}
      <div className="absolute inset-0 w-full h-full">
        <div 
          className="absolute inset-0 w-full h-full transform scale-110 transition-transform duration-[20000ms] ease-out animate-pulse"
          style={{
            backgroundImage: `url("${plane}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            animation: 'slowZoom 20s ease-out infinite alternate'
          }}
        />
        
        {/* Dynamic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-transparent animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-white/30 rounded-full animate-ping" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-blue-400/50 rounded-full animate-pulse" />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-purple-400/30 rounded-full animate-bounce" />
      </div>

      {/* Header */}
      {/* <div className="relative z-40">
        <Header isTransparent={true} />
      </div> */}

      {/* Main Hero Content */}
      <div className="relative z-30 min-h-screen flex items-center pb-20 sm:pb-16 lg:pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-8rem)] sm:min-h-[calc(100vh-6rem)] lg:min-h-[calc(100vh-4rem)]">
            
            {/* Left Content */}
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <div className="space-y-6 lg:space-y-8">
                
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white/90 text-sm font-medium">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                  ✈️ #1 Flight Booking Platform
                </div>

                {/* Main Heading with Text Animation */}
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                    <span className="block">
                      {heroTexts[currentText].split(' ').map((word, index) => (
                        <span
                          key={`${currentText}-${index}`}
                          className="inline-block mr-3 transform transition-all duration-700 ease-out"
                          style={{
                            animationDelay: `${index * 100}ms`,
                            animation: 'slideUp 0.7s ease-out forwards'
                          }}
                        >
                          {word}
                        </span>
                      ))}
                    </span>
                  </h1>
                  
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transform origin-left transition-all duration-1000 animate-pulse" />
                </div>

                {/* Subtitle */}
                <p className={`text-lg sm:text-xl lg:text-2xl text-white/90 leading-relaxed max-w-2xl transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
                  Experience seamless travel booking with 
                   <span className="text-blue-400 font-semibold"> Elevatio</span>!
                  <span className="text-blue-300 font-semibold"> Elevatio</span>. 
                  Discover incredible destinations and unbeatable deals worldwide.
                  
                </p>

                {/* CTA Buttons */}
                <div className={`flex flex-col sm:flex-row gap-4 pt-4 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
                  <button 
                    onClick={scrollToNextSection}
                    className={`group relative px-8 py-4 bg-gradient-to-r ${themeColors.gradient.gradient} hover:${themeColors.gradient.gradientHover} text-white rounded-full font-semibold text-lg shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 overflow-hidden`}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      Start Booking
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </button>
                  
                  <button className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:border-white/50 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105">
                    Explore Deals
                  </button>
                </div>

                {/* Stats */}
                <div className={`grid grid-cols-3 gap-6 pt-8 transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
                  {[
                    { number: '50K+', label: 'Happy Travelers' },
                    { number: '200+', label: 'Destinations' },
                    { number: '4.9★', label: 'User Rating' }
                  ].map((stat, index) => (
                    <div key={index} className="text-center group">
                      <div className="text-2xl sm:text-3xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
                        {stat.number}
                      </div>
                      <div className="text-white/70 text-sm sm:text-base">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Content - Quick Search */}
            <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 lg:p-8 shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:scale-[1.02] mb-8 sm:mb-6 lg:mb-0">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                  Quick Flight Search
                </h3>
                
                {/* Error Display */}
                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 text-red-200 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                
                <div className="space-y-4">
                  {/* Trip Type Selection */}
                  <div className="flex space-x-1 bg-white/10 p-1 rounded-lg">
                    <button
                      onClick={() => handleInputChange('tripType', 'one-way')}
                      className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        searchForm.tripType === 'one-way'
                          ? 'bg-white/20 text-white shadow-sm'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      One Way
                    </button>
                    <button
                      onClick={() => handleInputChange('tripType', 'round-trip')}
                      className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        searchForm.tripType === 'round-trip'
                          ? 'bg-white/20 text-white shadow-sm'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      Round Trip
                    </button>
                  </div>

                  {/* Origin/Destination */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <AirportAutocomplete
                      value={searchForm.origin}
                      onChange={(value) => handleInputChange('origin', value)}
                      placeholder="From (e.g., Lagos, Abuja)"
                      icon={MapPin}
                    />
                    <AirportAutocomplete
                      value={searchForm.destination}
                      onChange={(value) => handleInputChange('destination', value)}
                      placeholder="To (e.g., Kano, London)"
                      icon={MapPin}
                    />
                  </div>

                  {/* Date/Passengers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative group">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 group-hover:text-white transition-colors duration-300" size={20} />
                      <input 
                        type="date" 
                        value={searchForm.departureDate}
                        onChange={(e) => handleInputChange('departureDate', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 backdrop-blur-sm"
                      />
                    </div>
                    
                    {/* Return Date - Only show for round trip */}
                    {searchForm.tripType === 'round-trip' && (
                      <div className="relative group">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 group-hover:text-white transition-colors duration-300" size={20} />
                        <input 
                          type="date" 
                          value={searchForm.returnDate}
                          onChange={(e) => handleInputChange('returnDate', e.target.value)}
                          min={searchForm.departureDate || new Date().toISOString().split('T')[0]}
                          className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 backdrop-blur-sm"
                        />
                      </div>
                    )}
                    
                    {/* Passengers - Only show if not round trip or round trip with return date */}
                    {(searchForm.tripType === 'one-way' || searchForm.returnDate) && (
                      <div className="relative group">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 group-hover:text-white transition-colors duration-300" size={20} />
                        <select 
                          value={searchForm.passengers}
                          onChange={(e) => handleInputChange('passengers', e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 backdrop-blur-sm appearance-none"
                        >
                          <option value="1" className="bg-gray-800">1 Passenger</option>
                          <option value="2" className="bg-gray-800">2 Passengers</option>
                          <option value="3" className="bg-gray-800">3 Passengers</option>
                          <option value="4" className="bg-gray-800">4 Passengers</option>
                          <option value="5" className="bg-gray-800">5 Passengers</option>
                          <option value="6" className="bg-gray-800">6+ Passengers</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Travel Class */}
                  <div className="relative group">
                    <select 
                      value={searchForm.cabinClass}
                      onChange={(e) => handleInputChange('cabinClass', e.target.value)}
                      className="w-full pl-4 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 backdrop-blur-sm appearance-none"
                    >
                      <option value="economy" className="bg-gray-800">Economy Class</option>
                      <option value="premium-economy" className="bg-gray-800">Premium Economy</option>
                      <option value="business" className="bg-gray-800">Business Class</option>
                      <option value="first" className="bg-gray-800">First Class</option>
                    </select>
                  </div>

                  {/* Additional Options */}
                  <div className="flex items-center space-x-4 text-white/90">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={searchForm.directFlightsOnly}
                        onChange={(e) => handleInputChange('directFlightsOnly', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-white/10 border-white/30 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm">Direct flights only</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={searchForm.flexibleDates}
                        onChange={(e) => handleInputChange('flexibleDates', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-white/10 border-white/30 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm">Flexible dates</span>
                    </label>
                  </div>

                  {/* Search Button */}
                  <button 
                    onClick={handleSearchFlights}
                    disabled={isSearching || !isSearchValid()}
                    className={`w-full py-4 bg-gradient-to-r ${themeColors.gradient.gradient} hover:${themeColors.gradient.gradientHover} text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                  >
                    <span className="flex items-center justify-center">
                      {isSearching ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Searching...
                        </>
                      ) : (
                        <>
                          Search Flights
                          <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Fixed positioning and mobile responsive */}
      <div className={`absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 transition-all duration-1000 delay-1000 hidden lg:block ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
        <button 
          onClick={scrollToNextSection}
          className="flex flex-col items-center text-white/70 hover:text-white transition-colors duration-300 group"
        >
          <span className="text-sm mb-2 group-hover:transform group-hover:scale-110 transition-transform duration-300">
            Explore More
          </span>
          <ChevronDown 
            size={24} 
            className="animate-bounce group-hover:translate-y-1 transition-transform duration-300" 
          />
        </button>
      </div>
    </div>
  )
}

export default Hero