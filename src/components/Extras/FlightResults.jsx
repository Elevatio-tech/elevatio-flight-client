// import React, { useState } from 'react';
// import { 
//   ArrowLeft, 
//   Plane, 
//   Clock, 
//   MapPin, 
//   Users, 
//   Filter,
//   ArrowRight,
//   Wifi,
//   Coffee,
//   Utensils,
//   Luggage,
//   Star,
//   Shield,
//   CreditCard
// } from 'lucide-react';

// const FlightResults = ({ searchData, searchResults, onBack, onBookFlight }) => {
//   const [sortBy, setSortBy] = useState('price'); // price, duration, departure
//   const [filterBy, setFilterBy] = useState('all'); // all, direct, one-stop
//   const [selectedFlight, setSelectedFlight] = useState(null);

//   // Sort flights based on selected criteria
//   const sortedFlights = [...(searchResults?.flights || [])].sort((a, b) => {
//     switch (sortBy) {
//       case 'price':
//         return a.price - b.price;
//       case 'duration':
//         return parseInt(a.duration) - parseInt(b.duration);
//       case 'departure':
//         return a.departure.time.localeCompare(b.departure.time);
//       default:
//         return 0;
//     }
//   });

//   // Filter flights based on stops
//   const filteredFlights = sortedFlights.filter(flight => {
//     switch (filterBy) {
//       case 'direct':
//         return flight.stops === 0;
//       case 'one-stop':
//         return flight.stops === 1;
//       default:
//         return true;
//     }
//   });

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       weekday: 'short',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const getStopsText = (stops) => {
//     if (stops === 0) return 'Non-stop';
//     if (stops === 1) return '1 stop';
//     return `${stops} stops`;
//   };

//   const getAirlineColor = (airline) => {
//     const colors = {
//       'Delta Airlines': 'bg-red-50 text-red-700 border-red-200',
//       'American Airlines': 'bg-blue-50 text-blue-700 border-blue-200',
//       'United Airlines': 'bg-indigo-50 text-indigo-700 border-indigo-200',
//       'Emirates': 'bg-yellow-50 text-yellow-700 border-yellow-200',
//       'British Airways': 'bg-purple-50 text-purple-700 border-purple-200'
//     };
//     return colors[airline] || 'bg-gray-50 text-gray-700 border-gray-200';
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
//         <div className="flex items-center justify-between mb-4">
//           <button
//             onClick={onBack}
//             className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
//           >
//             <ArrowLeft size={20} />
//             <span>Modify Search</span>
//           </button>
          
//           <div className="text-center">
//             <h1 className="text-2xl font-bold text-gray-800">Flight Results</h1>
//             <p className="text-gray-600">
//               {filteredFlights.length} flights found for {searchData.passengers?.adults + searchData.passengers?.children + searchData.passengers?.infants} passenger{(searchData.passengers?.adults + searchData.passengers?.children + searchData.passengers?.infants) !== 1 ? 's' : ''}
//             </p>
//           </div>
          
//           <div className="text-right">
//             <div className="text-sm text-gray-500">
//               {searchData.from} → {searchData.to}
//             </div>
//             <div className="text-sm text-gray-500">
//               {formatDate(searchData.departDate)}
//               {searchData.returnDate && ` - ${formatDate(searchData.returnDate)}`}
//             </div>
//           </div>
//         </div>

//         {/* Search Summary */}
//         <div className="flex flex-wrap items-center justify-between bg-gray-50 rounded-lg p-4 text-sm">
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center space-x-1">
//               <MapPin size={16} className="text-gray-400" />
//               <span>{searchData.from.split('(')[0]} → {searchData.to.split('(')[0]}</span>
//             </div>
//             <div className="flex items-center space-x-1">
//               <Users size={16} className="text-gray-400" />
//               <span>{searchData.passengers?.adults + searchData.passengers?.children + searchData.passengers?.infants} passengers</span>
//             </div>
//             <div className="flex items-center space-x-1">
//               <span className="capitalize">{searchData.class}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {/* Filters Sidebar */}
//         <div className="lg:col-span-1">
//           <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//               <Filter size={20} className="mr-2" />
//               Sort & Filter
//             </h3>

//             {/* Sort Options */}
//             <div className="mb-6">
//               <h4 className="font-medium text-gray-700 mb-3">Sort by</h4>
//               <div className="space-y-2">
//                 {[
//                   { value: 'price', label: 'Price (Low to High)' },
//                   { value: 'duration', label: 'Duration (Shortest)' },
//                   { value: 'departure', label: 'Departure Time' }
//                 ].map(option => (
//                   <label key={option.value} className="flex items-center cursor-pointer">
//                     <input
//                       type="radio"
//                       name="sort"
//                       value={option.value}
//                       checked={sortBy === option.value}
//                       onChange={(e) => setSortBy(e.target.value)}
//                       className="text-blue-600 focus:ring-blue-500"
//                     />
//                     <span className="ml-2 text-sm text-gray-700">{option.label}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Filter Options */}
//             <div>
//               <h4 className="font-medium text-gray-700 mb-3">Stops</h4>
//               <div className="space-y-2">
//                 {[
//                   { value: 'all', label: 'All flights' },
//                   { value: 'direct', label: 'Non-stop only' },
//                   { value: 'one-stop', label: '1 stop max' }
//                 ].map(option => (
//                   <label key={option.value} className="flex items-center cursor-pointer">
//                     <input
//                       type="radio"
//                       name="filter"
//                       value={option.value}
//                       checked={filterBy === option.value}
//                       onChange={(e) => setFilterBy(e.target.value)}
//                       className="text-blue-600 focus:ring-blue-500"
//                     />
//                     <span className="ml-2 text-sm text-gray-700">{option.label}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Flight Results */}
//         <div className="lg:col-span-3">
//           <div className="space-y-4">
//             {filteredFlights.length === 0 ? (
//               <div className="bg-white rounded-xl shadow-lg p-8 text-center">
//                 <Plane className="mx-auto text-gray-400 mb-4" size={48} />
//                 <h3 className="text-lg font-medium text-gray-800 mb-2">No flights found</h3>
//                 <p className="text-gray-600">Try adjusting your filters or search criteria</p>
//               </div>
//             ) : (
//               filteredFlights.map(flight => (
//                 <div
//                   key={flight.id}
//                   className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
//                 >
//                   <div className="p-6">
//                     {/* Flight Header */}
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="flex items-center space-x-3">
//                         <div className={`px-3 py-1 rounded-lg text-sm font-medium border ${getAirlineColor(flight.airline)}`}>
//                           {flight.airline}
//                         </div>
//                         <span className="text-sm text-gray-500">{flight.flightNumber}</span>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-2xl font-bold text-gray-800">${flight.price}</div>
//                         <div className="text-sm text-gray-500">per person</div>
//                       </div>
//                     </div>

//                     {/* Flight Details */}
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//                       {/* Departure */}
//                       <div className="text-center">
//                         <div className="text-2xl font-bold text-gray-800">{flight.departure.time}</div>
//                         <div className="text-sm text-gray-600">{flight.departure.airport.split('(')[0]}</div>
//                         <div className="text-xs text-gray-500">{formatDate(searchData.departDate)}</div>
//                       </div>

//                       {/* Duration & Stops */}
//                       <div className="text-center">
//                         <div className="flex items-center justify-center space-x-2 mb-2">
//                           <div className="w-3 h-3 rounded-full bg-blue-600"></div>
//                           <div className="flex-1 h-0.5 bg-gray-300 relative">
//                             {flight.stops > 0 && (
//                               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-yellow-500"></div>
//                             )}
//                           </div>
//                           <div className="w-3 h-3 rounded-full bg-blue-600"></div>
//                         </div>
//                         <div className="text-sm font-medium text-gray-700">{flight.duration}</div>
//                         <div className="text-xs text-gray-500">{getStopsText(flight.stops)}</div>
//                       </div>

//                       {/* Arrival */}
//                       <div className="text-center">
//                         <div className="text-2xl font-bold text-gray-800">{flight.arrival.time}</div>
//                         <div className="text-sm text-gray-600">{flight.arrival.airport.split('(')[0]}</div>
//                         <div className="text-xs text-gray-500">{formatDate(searchData.departDate)}</div>
//                       </div>
//                     </div>

//                     {/* Amenities */}
//                     <div className="flex items-center justify-center space-x-6 mb-6 py-3 bg-gray-50 rounded-lg">
//                       <div className="flex items-center space-x-1 text-xs text-gray-600">
//                         <Wifi size={14} />
//                         <span>WiFi</span>
//                       </div>
//                       <div className="flex items-center space-x-1 text-xs text-gray-600">
//                         <Coffee size={14} />
//                         <span>Refreshments</span>
//                       </div>
//                       <div className="flex items-center space-x-1 text-xs text-gray-600">
//                         <Luggage size={14} />
//                         <span>Baggage</span>
//                       </div>
//                       <div className="flex items-center space-x-1 text-xs text-gray-600">
//                         <Shield size={14} />
//                         <span>Flexible</span>
//                       </div>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="flex items-center justify-between">
//                       <button
//                         onClick={() => setSelectedFlight(selectedFlight === flight.id ? null : flight.id)}
//                         className="text-blue-600 hover:text-blue-800 font-medium text-sm"
//                       >
//                         {selectedFlight === flight.id ? 'Hide Details' : 'View Details'}
//                       </button>
                      
//                       <button
//                         onClick={() => onBookFlight(flight)}
//                         className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
//                       >
//                         <CreditCard size={16} />
//                         <span>Book Now</span>
//                         <ArrowRight size={16} />
//                       </button>
//                     </div>

//                     {/* Expanded Details */}
//                     {selectedFlight === flight.id && (
//                       <div className="mt-6 pt-6 border-t border-gray-200">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                           <div>
//                             <h4 className="font-semibold text-gray-800 mb-3">Flight Information</h4>
//                             <div className="space-y-2 text-sm">
//                               <div className="flex justify-between">
//                                 <span className="text-gray-600">Aircraft:</span>
//                                 <span className="font-medium">Boeing 737-800</span>
//                               </div>
//                               <div className="flex justify-between">
//                                 <span className="text-gray-600">Cabin Class:</span>
//                                 <span className="font-medium capitalize">{searchData.class}</span>
//                               </div>
//                               <div className="flex justify-between">
//                                 <span className="text-gray-600">Baggage:</span>
//                                 <span className="font-medium">1 carry-on, 1 checked</span>
//                               </div>
//                               <div className="flex justify-between">
//                                 <span className="text-gray-600">Meal Service:</span>
//                                 <span className="font-medium">Complimentary</span>
//                               </div>
//                             </div>
//                           </div>
                          
//                           <div>
//                             <h4 className="font-semibold text-gray-800 mb-3">Price Breakdown</h4>
//                             <div className="space-y-2 text-sm">
//                               <div className="flex justify-between">
//                                 <span className="text-gray-600">Base Fare:</span>
//                                 <span className="font-medium">${flight.price - 50}</span>
//                               </div>
//                               <div className="flex justify-between">
//                                 <span className="text-gray-600">Taxes & Fees:</span>
//                                 <span className="font-medium">$50</span>
//                               </div>
//                               <div className="flex justify-between border-t pt-2 font-semibold">
//                                 <span>Total per person:</span>
//                                 <span>${flight.price}</span>
//                               </div>
//                               <div className="flex justify-between text-lg font-bold text-blue-600">
//                                 <span>Total for {searchData.passengers?.adults + searchData.passengers?.children + searchData.passengers?.infants} passengers:</span>
//                                 <span>${flight.price * (searchData.passengers?.adults + searchData.passengers?.children + searchData.passengers?.infants)}</span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FlightResults;


import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plane, 
  Clock, 
  MapPin, 
  Users, 
  Filter,
  ArrowRight,
  Wifi,
  Coffee,
  Utensils,
  Luggage,
  Star,
  Shield,
  CreditCard,
  Loader,
  AlertCircle
} from 'lucide-react';
import { backendUrl } from '../../config/config';

// Import your API configuration
const summaryApi = {
  searchFlights: {
    url: `${backendUrl}/api/flights/search`,
    method: 'POST',
  }
};

const FlightResults = ({ onBookFlight }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get search data and results from navigation state
  const searchData = location.state?.searchData;
  const initialResults = location.state?.searchResults;
  
  const [sortBy, setSortBy] = useState('price'); // price, duration, departure
  const [filterBy, setFilterBy] = useState('all'); // all, direct, one-stop
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [searchResults, setSearchResults] = useState(initialResults?.flights || initialResults || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // If no search data, redirect back to home
  useEffect(() => {
    if (!searchData) {
      navigate('/');
      return;
    }

    // If we don't have initial results, perform the search
    if (!initialResults) {
      performFlightSearch();
    }
  }, [searchData, initialResults, navigate]);

  // Perform flight search if no initial results
  const performFlightSearch = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(summaryApi.searchFlights.url, {
        method: summaryApi.searchFlights.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const results = await response.json();
      setSearchResults(results.flights || results || []);
    } catch (error) {
      console.error('Flight search error:', error);
      setError('Failed to load flight results. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onBack = () => {
    navigate(-1); // Go back to previous page
  };

  // Handle the case where we don't have search data
  if (!searchData) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Plane className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No search data found</h3>
          <p className="text-gray-600 mb-4">Please start a new flight search</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Sort flights based on selected criteria
  const sortedFlights = [...searchResults].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return (a.price || 0) - (b.price || 0);
      case 'duration':
        return parseInt(a.duration || '0') - parseInt(b.duration || '0');
      case 'departure':
        return (a.departure?.time || '').localeCompare(b.departure?.time || '');
      default:
        return 0;
    }
  });

  // Filter flights based on stops
  const filteredFlights = sortedFlights.filter(flight => {
    switch (filterBy) {
      case 'direct':
        return (flight.stops || 0) === 0;
      case 'one-stop':
        return (flight.stops || 0) === 1;
      default:
        return true;
    }
  });

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStopsText = (stops) => {
    if (!stops || stops === 0) return 'Non-stop';
    if (stops === 1) return '1 stop';
    return `${stops} stops`;
  };

  const getAirlineColor = (airline) => {
    const colors = {
      'DL': 'bg-red-50 text-red-700 border-red-200',
      'AA': 'bg-blue-50 text-blue-700 border-blue-200',
      'UA': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'EK': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'BA': 'bg-purple-50 text-purple-700 border-purple-200',
      'Delta Airlines': 'bg-red-50 text-red-700 border-red-200',
      'American Airlines': 'bg-blue-50 text-blue-700 border-blue-200',
      'United Airlines': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'Emirates': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'British Airways': 'bg-purple-50 text-purple-700 border-purple-200'
    };
    return colors[airline] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  // Calculate total passengers
  const totalPassengers = searchData.passengers ? 
    (searchData.passengers.adults || 0) + (searchData.passengers.children || 0) + (searchData.passengers.infants || 0) :
    parseInt(searchData.passengers) || 1;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
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
              {isLoading ? 'Searching...' : `${filteredFlights.length} flights found for ${totalPassengers} passenger${totalPassengers !== 1 ? 's' : ''}`}
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

        {/* Search Summary */}
        <div className="flex flex-wrap items-center justify-between bg-gray-50 rounded-lg p-4 text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <MapPin size={16} className="text-gray-400" />
              <span>{searchData.from?.split('(')[0] || searchData.from} → {searchData.to?.split('(')[0] || searchData.to}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users size={16} className="text-gray-400" />
              <span>{totalPassengers} passengers</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="capitalize">{searchData.class || 'Economy'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Loader className="mx-auto text-blue-600 mb-4 animate-spin" size={48} />
          <h3 className="text-lg font-medium text-gray-800 mb-2">Searching for flights...</h3>
          <p className="text-gray-600">This may take a few moments</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-800 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={performFlightSearch}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Results */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Filter size={20} className="mr-2" />
                Sort & Filter
              </h3>

              {/* Sort Options */}
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

              {/* Filter Options */}
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

          {/* Flight Results */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {filteredFlights.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <Plane className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No flights found</h3>
                  <p className="text-gray-600">Try adjusting your filters or search criteria</p>
                </div>
              ) : (
                filteredFlights.map((flight, index) => (
                  <div
                    key={flight.id || index}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                  >
                    <div className="p-6">
                      {/* Flight Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`px-3 py-1 rounded-lg text-sm font-medium border ${getAirlineColor(flight.airline)}`}>
                            {flight.airline || 'Airline'}
                          </div>
                          <span className="text-sm text-gray-500">{flight.flightNumber || 'FL123'}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-800">${flight.price || 299}</div>
                          <div className="text-sm text-gray-500">per person</div>
                        </div>
                      </div>

                      {/* Flight Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* Departure */}
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-800">{flight.departure?.time || '08:00'}</div>
                          <div className="text-sm text-gray-600">{flight.departure?.airport?.split('(')[0] || searchData.from?.split('(')[0] || searchData.from}</div>
                          <div className="text-xs text-gray-500">{formatDate(searchData.departDate)}</div>
                        </div>

                        {/* Duration & Stops */}
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-2 mb-2">
                            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                            <div className="flex-1 h-0.5 bg-gray-300 relative">
                              {(flight.stops || 0) > 0 && (
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-yellow-500"></div>
                              )}
                            </div>
                            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                          </div>
                          <div className="text-sm font-medium text-gray-700">{flight.duration || '2h 30m'}</div>
                          <div className="text-xs text-gray-500">{getStopsText(flight.stops)}</div>
                        </div>

                        {/* Arrival */}
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-800">{flight.arrival?.time || '10:30'}</div>
                          <div className="text-sm text-gray-600">{flight.arrival?.airport?.split('(')[0] || searchData.to?.split('(')[0] || searchData.to}</div>
                          <div className="text-xs text-gray-500">{formatDate(searchData.departDate)}</div>
                        </div>
                      </div>

                      {/* Amenities */}
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

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setSelectedFlight(selectedFlight === (flight.id || index) ? null : (flight.id || index))}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          {selectedFlight === (flight.id || index) ? 'Hide Details' : 'View Details'}
                        </button>
                        
                        <button
                          onClick={() => onBookFlight ? onBookFlight(flight) : console.log('Book flight:', flight)}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                        >
                          <CreditCard size={16} />
                          <span>Book Now</span>
                          <ArrowRight size={16} />
                        </button>
                      </div>

                      {/* Expanded Details */}
                      {selectedFlight === (flight.id || index) && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-3">Flight Information</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Aircraft:</span>
                                  <span className="font-medium">{flight.aircraft || 'Boeing 737-800'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Cabin Class:</span>
                                  <span className="font-medium capitalize">{searchData.class || 'Economy'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Baggage:</span>
                                  <span className="font-medium">{flight.baggage || '1 carry-on, 1 checked'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Meal Service:</span>
                                  <span className="font-medium">{flight.meals || 'Complimentary'}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-3">Price Breakdown</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Base Fare:</span>
                                  <span className="font-medium">${(flight.price || 299) - 50}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Taxes & Fees:</span>
                                  <span className="font-medium">$50</span>
                                </div>
                                <div className="flex justify-between border-t pt-2 font-semibold">
                                  <span>Total per person:</span>
                                  <span>${flight.price || 299}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-blue-600">
                                  <span>Total for {totalPassengers} passengers:</span>
                                  <span>${(flight.price || 299) * totalPassengers}</span>
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
      )}
    </div>
  );
};

export default FlightResults;