import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Calendar, 
  Users, 
  ArrowRight, 
  Plane, 
  Clock,
  ArrowUpDown,
  Plus,
  Minus,
  Search,
  Filter,
  Star,
  ArrowLeft,
  Wifi,
  Coffee,
  Utensils,
  Luggage,
  Shield,
  CreditCard
} from 'lucide-react';
import summaryApi from '../../common';
import { useNavigate } from 'react-router-dom';
import Header from '../Navbar/Header';

// FlightResults Component
const FlightResults = ({ searchData, searchResults, onBack, onBookFlight }) => {
  const [sortBy, setSortBy] = useState('price');
  const [filterBy, setFilterBy] = useState('all');
  const [selectedFlight, setSelectedFlight] = useState(null);
  const navigate = useNavigate();

  const sortedFlights = [...(searchResults?.flights || [])].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'duration':
        return parseInt(a.duration) - parseInt(b.duration);
      case 'departure':
        return a.departure.time.localeCompare(b.departure.time);
      default:
        return 0;
    }
  });

  const filteredFlights = sortedFlights.filter(flight => {
    switch (filterBy) {
      case 'direct':
        return flight.stops === 0;
      case 'one-stop':
        return flight.stops === 1;
      default:
        return true;
    }
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStopsText = (stops) => {
    if (stops === 0) return 'Non-stop';
    if (stops === 1) return '1 stop';
    return `${stops} stops`;
  };

  const getAirlineColor = (airline) => {
    const colors = {
      'Delta Airlines': 'bg-red-50 text-red-700 border-red-200',
      'American Airlines': 'bg-blue-50 text-blue-700 border-blue-200',
      'United Airlines': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'Emirates': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'British Airways': 'bg-purple-50 text-purple-700 border-purple-200'
    };
    return colors[airline] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getTotalPassengers = () => {
    return (searchData.passengers?.adults || 0) + (searchData.passengers?.children || 0) + (searchData.passengers?.infants || 0);
  };

  // Updated handleBookFlight function with navigation
  const handleBookFlight = (flight) => {
    // Prepare booking data to pass to booking component
    const bookingData = {
      flight: {
        ...flight,
        totalPrice: flight.price * getTotalPassengers()
      },
      searchData: {
        ...searchData,
        totalPassengers: getTotalPassengers()
      },
      passengers: searchData.passengers,
      tripDetails: {
        from: searchData.from,
        to: searchData.to,
        departDate: searchData.departDate,
        returnDate: searchData.returnDate,
        tripType: searchData.tripType,
        class: searchData.class
      }
    };

    console.log('About to navigate with bookingData:', bookingData);
    // Navigate to booking page with state
    navigate('/booking', { 
      state: bookingData 
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Modify Search</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Flight Results</h1>
            <p className="text-gray-600">
              {filteredFlights.length} flights found for {getTotalPassengers()} passenger{getTotalPassengers() !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-500">
              {searchData.from} → {searchData.to}
            </div>
            <div className="text-sm text-gray-500">
              {formatDate(searchData.departDate)}
              {searchData.returnDate && ` - ${formatDate(searchData.returnDate)}`}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between bg-gray-50 rounded-lg p-4 text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <MapPin size={16} className="text-gray-400" />
              <span>{searchData.from.split('(')[0]} → {searchData.to.split('(')[0]}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users size={16} className="text-gray-400" />
              <span>{getTotalPassengers()} passengers</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="capitalize">{searchData.class}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Filter size={20} className="mr-2" />
              Sort & Filter
            </h3>

            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Sort by</h4>
              <div className="space-y-2">
                {[
                  { value: 'price', label: 'Price (Low to High)' },
                  { value: 'duration', label: 'Duration (Shortest)' },
                  { value: 'departure', label: 'Departure Time' }
                ].map(option => (
                  <label key={option.value} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="sort"
                      value={option.value}
                      checked={sortBy === option.value}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-3">Stops</h4>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'All flights' },
                  { value: 'direct', label: 'Non-stop only' },
                  { value: 'one-stop', label: '1 stop max' }
                ].map(option => (
                  <label key={option.value} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="filter"
                      value={option.value}
                      checked={filterBy === option.value}
                      onChange={(e) => setFilterBy(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="space-y-4">
            {filteredFlights.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <Plane className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-800 mb-2">No flights found</h3>
                <p className="text-gray-600">Try adjusting your filters or search criteria</p>
              </div>
            ) : (
              filteredFlights.map(flight => (
                <div
                  key={flight.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`px-3 py-1 rounded-lg text-sm font-medium border ${getAirlineColor(flight.airline)}`}>
                          {flight.airline}
                        </div>
                        <span className="text-sm text-gray-500">{flight.flightNumber}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-800">${flight.price}</div>
                        <div className="text-sm text-gray-500">per person</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">{flight.departure.time}</div>
                        <div className="text-sm text-gray-600">{flight.departure.airport.split('(')[0]}</div>
                        <div className="text-xs text-gray-500">{formatDate(searchData.departDate)}</div>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                          <div className="flex-1 h-0.5 bg-gray-300 relative">
                            {flight.stops > 0 && (
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-yellow-500"></div>
                            )}
                          </div>
                          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                        </div>
                        <div className="text-sm font-medium text-gray-700">{flight.duration}</div>
                        <div className="text-xs text-gray-500">{getStopsText(flight.stops)}</div>
                      </div>

                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">{flight.arrival.time}</div>
                        <div className="text-sm text-gray-600">{flight.arrival.airport.split('(')[0]}</div>
                        <div className="text-xs text-gray-500">{formatDate(searchData.departDate)}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center space-x-6 mb-6 py-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-1 text-xs text-gray-600">
                        <Wifi size={14} />
                        <span>WiFi</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-600">
                        <Coffee size={14} />
                        <span>Refreshments</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-600">
                        <Luggage size={14} />
                        <span>Baggage</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-600">
                        <Shield size={14} />
                        <span>Flexible</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setSelectedFlight(selectedFlight === flight.id ? null : flight.id)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        {selectedFlight === flight.id ? 'Hide Details' : 'View Details'}
                      </button>
                      
                      <button
                        onClick={() => handleBookFlight(flight)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                      >
                        <CreditCard size={16} />
                        <span>Book Now</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>

                    {selectedFlight === flight.id && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-3">Flight Information</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Aircraft:</span>
                                <span className="font-medium">Boeing 737-800</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Cabin Class:</span>
                                <span className="font-medium capitalize">{searchData.class}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Baggage:</span>
                                <span className="font-medium">1 carry-on, 1 checked</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Meal Service:</span>
                                <span className="font-medium">Complimentary</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-3">Price Breakdown</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Base Fare:</span>
                                <span className="font-medium">${flight.price - 50}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Taxes & Fees:</span>
                                <span className="font-medium">$50</span>
                              </div>
                              <div className="flex justify-between border-t pt-2 font-semibold">
                                <span>Total per person:</span>
                                <span>${flight.price}</span>
                              </div>
                              <div className="flex justify-between text-lg font-bold text-blue-600">
                                <span>Total for {getTotalPassengers()} passengers:</span>
                                <span>${flight.price * getTotalPassengers()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main FlightSearch Component
const FlightSearch = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    tripType: 'round-trip',
    from: '',
    to: '',
    departDate: '',
    returnDate: '',
    passengers: {
      adults: 1,
      children: 0,
      infants: 0
    },
    class: 'economy',
    directFlights: false,
    flexibleDates: false
  });

  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [airportSuggestions, setAirportSuggestions] = useState({ from: [], to: [] });
  const [showSuggestions, setShowSuggestions] = useState({ from: false, to: false });
  const [error, setError] = useState('');
  const [multiCityFlights, setMultiCityFlights] = useState([
    { from: '', to: '', date: '' },
    { from: '', to: '', date: '' }
  ]);

  const cabinClasses = [
    { value: 'economy', label: 'Economy', icon: '💺' },
    { value: 'premium-economy', label: 'Premium Economy', icon: '🛋️' },
    { value: 'business', label: 'Business', icon: '🥂' },
    { value: 'first', label: 'First Class', icon: '👑' }
  ];

  const tripTypes = [
    { value: 'round-trip', label: 'Round Trip' },
    { value: 'one-way', label: 'One Way' },
    { value: 'multi-city', label: 'Multi-City' }
  ];

  useEffect(() => {
    loadPopularDestinations();
  }, []);

  const loadPopularDestinations = () => {
    // Mock popular destinations since API might not be available
    setPopularDestinations([
      { code: 'LOS', city: 'Lagos', country: 'Nigeria' },
      { code: 'ABV', city: 'Abuja', country: 'Nigeria' },
      { code: 'LAX', city: 'Los Angeles', country: 'USA' },
      { code: 'JFK', city: 'New York', country: 'USA' },
      { code: 'LHR', city: 'London', country: 'UK' },
      { code: 'DXB', city: 'Dubai', country: 'UAE' },
      { code: 'CDG', city: 'Paris', country: 'France' },
      { code: 'NRT', city: 'Tokyo', country: 'Japan' }
    ]);
  };

  const searchAirports = (query, field) => {
    if (query.length < 2) {
      setAirportSuggestions(prev => ({ ...prev, [field]: [] }));
      return;
    }

    const fallbackAirports = [
      { code: 'LOS', city: 'Lagos', country: 'Nigeria', name: 'Murtala Muhammed International Airport' },
      { code: 'ABV', city: 'Abuja', country: 'Nigeria', name: 'Nnamdi Azikiwe International Airport' },
      { code: 'KAN', city: 'Kano', country: 'Nigeria', name: 'Mallam Aminu Kano International Airport' },
      { code: 'PHC', city: 'Port Harcourt', country: 'Nigeria', name: 'Port Harcourt International Airport' },
      { code: 'LAX', city: 'Los Angeles', country: 'USA', name: 'Los Angeles International Airport' },
      { code: 'JFK', city: 'New York', country: 'USA', name: 'John F. Kennedy International Airport' },
      { code: 'LGA', city: 'New York', country: 'USA', name: 'LaGuardia Airport' },
      { code: 'LHR', city: 'London', country: 'UK', name: 'Heathrow Airport' },
      { code: 'LGW', city: 'London', country: 'UK', name: 'Gatwick Airport' },
      { code: 'DXB', city: 'Dubai', country: 'UAE', name: 'Dubai International Airport' },
      { code: 'CDG', city: 'Paris', country: 'France', name: 'Charles de Gaulle Airport' },
      { code: 'NRT', city: 'Tokyo', country: 'Japan', name: 'Narita International Airport' }
    ];

    const filteredAirports = fallbackAirports.filter(airport => 
      airport.city.toLowerCase().includes(query.toLowerCase()) ||
      airport.code.toLowerCase().includes(query.toLowerCase()) ||
      airport.country.toLowerCase().includes(query.toLowerCase())
    );
    
    setAirportSuggestions(prev => ({ ...prev, [field]: filteredAirports }));
  };

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getMinReturnDate = () => {
    if (!searchData.departDate) return getMinDate();
    const depDate = new Date(searchData.departDate);
    depDate.setDate(depDate.getDate() + 1);
    return depDate.toISOString().split('T')[0];
  };

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'from' || field === 'to') {
      searchAirports(value, field);
      setShowSuggestions(prev => ({ ...prev, [field]: true }));
    }
  };

  const selectAirport = (airport, field) => {
    const airportString = `${airport.city} (${airport.code})`;
    setSearchData(prev => ({ ...prev, [field]: airportString }));
    setShowSuggestions(prev => ({ ...prev, [field]: false }));
    setAirportSuggestions(prev => ({ ...prev, [field]: [] }));
  };

  const handlePassengerChange = (type, increment) => {
    setSearchData(prev => ({
      ...prev,
      passengers: {
        ...prev.passengers,
        [type]: Math.max(0, prev.passengers[type] + increment)
      }
    }));
  };

  const swapDestinations = () => {
    setSearchData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
  };

  const addMultiCityFlight = () => {
    setMultiCityFlights(prev => [...prev, { from: '', to: '', date: '' }]);
  };

  const removeMultiCityFlight = (index) => {
    if (multiCityFlights.length > 2) {
      setMultiCityFlights(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleMultiCityChange = (index, field, value) => {
    setMultiCityFlights(prev => 
      prev.map((flight, i) => 
        i === index ? { ...flight, [field]: value } : flight
      )
    );
  };

  const getTotalPassengers = () => {
    return searchData.passengers.adults + searchData.passengers.children + searchData.passengers.infants;
  };

  const isSearchValid = () => {
    if (searchData.tripType === 'multi-city') {
      return multiCityFlights.every(flight => flight.from && flight.to && flight.date);
    }
    
    const basicValid = searchData.from && searchData.to && searchData.departDate;
    const returnValid = searchData.tripType === 'one-way' || searchData.returnDate;
    
    return basicValid && returnValid && getTotalPassengers() > 0;
  };

  
 const handleSearch = async () => {
  if (!isSearchValid()) {
    setError('Please fill in all required fields');
    return;
  }

  setIsSearching(true);
  setError('');

  try {
    // Prepare search payload - FIXED to match backend schema
    const searchPayload = {
      tripType: searchData.tripType,
      origin: searchData.from,
      destination: searchData.to,
      departureDate: searchData.departDate,
      passengers: typeof searchData.passengers === 'object' 
        ? searchData.passengers.adults || 1
        : searchData.passengers,
      cabinClass: searchData.class,
      directFlightsOnly: searchData.directFlights,
      flexibleDates: searchData.flexibleDates,
      ...(searchData.tripType === 'multi-city' && { multiCityFlights })
    };

    // Only include returnDate if it's not empty and trip is round-trip
    if (searchData.tripType === 'round-trip' && searchData.returnDate) {
      searchPayload.returnDate = searchData.returnDate;
    }
    // For one-way trips, don't include returnDate at all

    console.log('Search payload:', searchPayload); // Debug log

    const response = await fetch(summaryApi.searchFlights.url, {
      method: summaryApi.searchFlights.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchPayload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Server error:', errorData);
      
      if (errorData.details && Array.isArray(errorData.details)) {
        setError(errorData.details.join(', '));
      } else {
        setError(errorData.message || `Search failed with status: ${response.status}`);
      }
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const results = await response.json();
    
    setSearchResults(results);
    setShowResults(true);
    setIsSearching(false);
    
  } catch (error) {
    console.error('Flight search failed:', error);
    setError('Flight search failed. Please try again.');
    setIsSearching(false);
  }
};

  const handleBackToSearch = () => {
    setShowResults(false);
    setSearchResults(null);
  };

  // Updated handleBookFlight function to pass the correct data
  const handleBookFlight = (flight) => {
    // This function is called from FlightResults component
    // The navigation logic is now handled in FlightResults component
    console.log('Booking flight:', flight);
  };

  // Show results if search is completed
  if (showResults && searchResults) {
    return (
      <FlightResults 
        searchData={searchData}
        searchResults={searchResults}
        onBack={handleBackToSearch}
        onBookFlight={handleBookFlight}
      />
    );
  }
  

  // Main search form
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Enhanced Header with Beautiful Background */}
      <div className='mb-4'>
        <Header/>
      </div>
      <div 
        className="relative flex items-center justify-between mb-8 p-6 rounded-xl overflow-hidden transform scale-110 transition-transform duration-[20000ms] ease-out animate-pulse"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.2)), url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-800/10 animate-pulse"></div>
        
        <div className="relative z-10 flex items-center space-x-2 cursor-pointer group">
          <div className="relative">
            <Plane 
              className="text-4xl transform group-hover:scale-110 transition-all duration-300 group-hover:rotate-12 text-white drop-shadow-lg" 
              size={32}
            />
            <div 
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse bg-yellow-400"
            ></div>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent drop-shadow-lg">
              Elevatio
            </span>
            <span className="text-sm text-white/90 drop-shadow-md">Flight Booking</span>
          </div>
        </div>
        
        <div className="relative z-10 flex items-center space-x-2 text-sm text-white/95 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
          <Star className="text-yellow-400 fill-current drop-shadow-sm" size={16} />
          <span className="font-medium drop-shadow-sm">Best Price Guarantee</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Trip Type Selection */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {tripTypes.map(type => (
          <button
            key={type.value}
            onClick={() => handleInputChange('tripType', type.value)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              searchData.tripType === type.value
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Main Search Form */}
      {searchData.tripType !== 'multi-city' ? (
        <div className="space-y-6">
          {/* Origin and Destination */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
            {/* From */}
            <div className="lg:col-span-5 relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchData.from}
                  onChange={(e) => handleInputChange('from', e.target.value)}
                  onBlur={() => setTimeout(() => setShowSuggestions(prev => ({ ...prev, from: false })), 200)}
                  placeholder="Departure city or airport"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              {showSuggestions.from && airportSuggestions.from.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                  {airportSuggestions.from.map(airport => (
                    <button
                      key={airport.code}
                      onClick={() => selectAirport(airport, 'from')}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <Plane className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-medium">{airport.city} ({airport.code})</div>
                        <div className="text-xs text-gray-500">{airport.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Swap Button */}
            <div className="lg:col-span-2 flex justify-center">
              <button
                onClick={swapDestinations}
                className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
              >
                <ArrowUpDown size={20} className="text-gray-600" />
              </button>
            </div>

            {/* To */}
            <div className="lg:col-span-5 relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchData.to}
                  onChange={(e) => handleInputChange('to', e.target.value)}
                  onBlur={() => setTimeout(() => setShowSuggestions(prev => ({ ...prev, to: false })), 200)}
                  placeholder="Arrival city or airport"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              {showSuggestions.to && airportSuggestions.to.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                  {airportSuggestions.to.map(airport => (
                    <button
                      key={airport.code}
                      onClick={() => selectAirport(airport, 'to')}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <Plane className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-medium">{airport.city} ({airport.code})</div>
                        <div className="text-xs text-gray-500">{airport.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Departure Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departure Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="date"
                  value={searchData.departDate}
                  onChange={(e) => handleInputChange('departDate', e.target.value)}
                  min={getMinDate()}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Return Date */}
            {searchData.tripType === 'round-trip' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Return Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="date"
                    value={searchData.returnDate}
                    onChange={(e) => handleInputChange('returnDate', e.target.value)}
                    min={getMinReturnDate()}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Multi-City Form */
        <div className="space-y-4">
          {multiCityFlights.map((flight, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-800">Flight {index + 1}</h4>
                {multiCityFlights.length > 2 && (
                  <button
                    onClick={() => removeMultiCityFlight(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={flight.from}
                    onChange={(e) => handleMultiCityChange(index, 'from', e.target.value)}
                    placeholder="From"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={flight.to}
                    onChange={(e) => handleMultiCityChange(index, 'to', e.target.value)}
                    placeholder="To"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="date"
                    value={flight.date}
                    onChange={(e) => handleMultiCityChange(index, 'date', e.target.value)}
                    min={getMinDate()}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <button
            onClick={addMultiCityFlight}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            <Plus size={16} />
            <span>Add Another Flight</span>
          </button>
        </div>
      )}

      {/* Passengers and Class */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Passengers */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Passengers
          </label>
          <button
            onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
            className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <div className="flex items-center space-x-2">
              <Users className="text-gray-400" size={20} />
              <span>{getTotalPassengers()} Passenger{getTotalPassengers() !== 1 ? 's' : ''}</span>
            </div>
            <div className="text-xs text-gray-500">
              {searchData.passengers.adults}A {searchData.passengers.children}C {searchData.passengers.infants}I
            </div>
          </button>

          {showPassengerDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-4">
              {[
                { key: 'adults', label: 'Adults', sublabel: '12+ years' },
                { key: 'children', label: 'Children', sublabel: '2-11 years' },
                { key: 'infants', label: 'Infants', sublabel: 'Under 2 years' }
              ].map(passenger => (
                <div key={passenger.key} className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-medium text-gray-800">{passenger.label}</div>
                    <div className="text-sm text-gray-500">{passenger.sublabel}</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handlePassengerChange(passenger.key, -1)}
                      disabled={searchData.passengers[passenger.key] === 0 || (passenger.key === 'adults' && searchData.passengers.adults === 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-medium">
                      {searchData.passengers[passenger.key]}
                    </span>
                    <button
                      onClick={() => handlePassengerChange(passenger.key, 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Class */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cabin Class
          </label>
          <button
            onClick={() => setShowClassDropdown(!showClassDropdown)}
            className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <div className="flex items-center space-x-2">
              <span>{cabinClasses.find(c => c.value === searchData.class)?.icon}</span>
              <span>{cabinClasses.find(c => c.value === searchData.class)?.label}</span>
            </div>
            <ArrowRight className="transform rotate-90 text-gray-400" size={16} />
          </button>

          {showClassDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              {cabinClasses.map(cabinClass => (
                <button
                  key={cabinClass.value}
                  onClick={() => {
                    handleInputChange('class', cabinClass.value);
                    setShowClassDropdown(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                >
                  <span className="text-lg">{cabinClass.icon}</span>
                  <span className="font-medium">{cabinClass.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Additional Options */}
      <div className="flex flex-wrap gap-4 mt-6">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={searchData.directFlights}
            onChange={(e) => handleInputChange('directFlights', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Direct flights only</span>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={searchData.flexibleDates}
            onChange={(e) => handleInputChange('flexibleDates', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Flexible dates (±3 days)</span>
        </label>
      </div>

      {/* Search Button */}
      <div className="mt-8">
        <button
          onClick={handleSearch}
          disabled={!isSearchValid() || isSearching}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
        >
          {isSearching ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Searching Flights...</span>
            </>
          ) : (
            <>
              <Search size={20} />
              <span>Search Flights</span>
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>

      {/* Popular Destinations */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Popular Destinations</h3>
        <div className="flex flex-wrap gap-2">
          {popularDestinations.slice(0, 6).map(destination => (
            <button
              key={destination.code}
              onClick={() => handleInputChange('to', `${destination.city} (${destination.code})`)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors duration-200"
            >
              {destination.city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlightSearch;