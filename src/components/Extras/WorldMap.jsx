import React, { useState, useEffect, useRef } from 'react';
import { 
  Plane, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  TrendingUp,
  Navigation,
  Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WorldMap = () => {
    const navigate = useNavigate()
  const [activeDestination, setActiveDestination] = useState(null);
  const [flightPaths, setFlightPaths] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const mapRef = useRef(null);

  // Popular destinations with coordinates and flight info
  const destinations = [
    {
      id: 1,
      name: "New York",
      country: "USA",
      x: 25,
      y: 35,
      price: "$450",
      duration: "8h 30m",
      airlines: 15,
      rating: 4.8,
      popular: true,
      color: "from-blue-400 to-blue-600"
    },
    {
      id: 2,
      name: "London",
      country: "UK",
      x: 48,
      y: 28,
      price: "$380",
      duration: "6h 45m",
      airlines: 12,
      rating: 4.9,
      popular: true,
      color: "from-purple-400 to-purple-600"
    },
    {
      id: 3,
      name: "Dubai",
      country: "UAE",
      x: 58,
      y: 42,
      price: "$280",
      duration: "4h 15m",
      airlines: 8,
      rating: 4.7,
      popular: true,
      color: "from-yellow-400 to-orange-600"
    },
    {
      id: 4,
      name: "Tokyo",
      country: "Japan",
      x: 78,
      y: 38,
      price: "$650",
      duration: "11h 20m",
      airlines: 10,
      rating: 4.6,
      popular: true,
      color: "from-pink-400 to-red-600"
    },
    {
      id: 5,
      name: "Sydney",
      country: "Australia",
      x: 82,
      y: 72,
      price: "$720",
      duration: "14h 30m",
      airlines: 6,
      rating: 4.5,
      popular: false,
      color: "from-green-400 to-teal-600"
    },
    {
      id: 6,
      name: "São Paulo",
      country: "Brazil",
      x: 32,
      y: 68,
      price: "$580",
      duration: "10h 45m",
      airlines: 7,
      rating: 4.4,
      popular: false,
      color: "from-emerald-400 to-green-600"
    },
    {
      id: 7,
      name: "Cairo",
      country: "Egypt",
      x: 53,
      y: 48,
      price: "$320",
      duration: "5h 30m",
      airlines: 9,
      rating: 4.3,
      popular: false,
      color: "from-amber-400 to-yellow-600"
    },
    {
      id: 8,
      name: "Mumbai",
      country: "India",
      x: 65,
      y: 48,
      price: "$250",
      duration: "3h 45m",
      airlines: 11,
      rating: 4.2,
      popular: false,
      color: "from-orange-400 to-red-600"
    }
  ];

  // Lagos coordinates (our origin point)
  const lagosCoords = { x: 50, y: 52 };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!activeDestination) {
        const randomDestination = destinations[Math.floor(Math.random() * destinations.length)];
        animateFlightPath(lagosCoords, randomDestination);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeDestination]);

  const animateFlightPath = (start, end) => {
    setIsAnimating(true);
    const newPath = {
      id: Date.now(),
      startX: start.x,
      startY: start.y,
      endX: end.x,
      endY: end.y,
      color: end.color
    };

    setFlightPaths(prev => [...prev, newPath]);

    setTimeout(() => {
      setFlightPaths(prev => prev.filter(path => path.id !== newPath.id));
      setIsAnimating(false);
    }, 2000);
  };

  const handleDestinationClick = (destination) => {
    setActiveDestination(destination);
    animateFlightPath(lagosCoords, destination);
  };

  const handleCloseDetails = () => {
    setActiveDestination(null);
  };

  const handleSearch =()=>{
    navigate("/search")
  }

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 min-h-screen overflow-hidden">
      {/* Background Stars */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.8 + 0.2
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/10 backdrop-blur-lg rounded-full border border-white/20">
              <Globe className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Explore the World with{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Elevatio
            </span>
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Discover amazing destinations worldwide. Click on any location to see flight details, 
            prices, and book your next adventure from Lagos.
          </p>
        </div>

        {/* Map Container */}
        <div className="relative">
          <div 
            ref={mapRef}
            className="relative w-full h-96 md:h-[500px] lg:h-[600px] bg-gradient-to-br from-slate-800/50 to-blue-800/50 backdrop-blur-lg rounded-3xl border border-white/10 overflow-hidden"
          >
            {/* Simplified World Map SVG */}
            <svg
              viewBox="0 0 1000 500"
              className="absolute inset-0 w-full h-full opacity-30"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              {/* Continents simplified paths */}
              <path
                d="M150 200 Q200 180 250 200 L300 190 Q350 200 400 220 L450 210 Q500 200 520 180 L480 160 Q450 150 400 160 L350 170 Q300 160 250 170 L200 160 Q150 170 150 200"
                fill="rgba(255,255,255,0.1)"
                className="text-white/20"
              />
              {/* Add more continent paths as needed */}
              <path
                d="M520 180 Q580 170 640 180 L700 175 Q750 180 800 190 L850 185 Q900 180 920 200 L880 220 Q850 230 800 225 L750 220 Q700 225 650 220 L600 225 Q550 220 520 200"
                fill="rgba(255,255,255,0.1)"
                className="text-white/20"
              />
            </svg>

            {/* Flight Paths */}
            {flightPaths.map((path) => (
              <svg
                key={path.id}
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100"
              >
                <defs>
                  <linearGradient id={`gradient-${path.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" />
                    <stop offset="50%" stopColor="rgba(59, 130, 246, 1)" />
                    <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                  </linearGradient>
                </defs>
                <path
                  d={`M ${path.startX} ${path.startY} Q ${(path.startX + path.endX) / 2} ${Math.min(path.startY, path.endY) - 10} ${path.endX} ${path.endY}`}
                  stroke={`url(#gradient-${path.id})`}
                  strokeWidth="0.5"
                  fill="none"
                  className="animate-pulse"
                  strokeDasharray="5,5"
                />
              </svg>
            ))}

            {/* Lagos (Origin Point) */}
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
              style={{ left: `${lagosCoords.x}%`, top: `${lagosCoords.y}%` }}
            >
              <div className="relative">
                <div className="w-6 h-6 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <span className="text-white text-sm font-semibold bg-red-500/20 backdrop-blur-sm px-2 py-1 rounded-full border border-red-500/30">
                    Lagos, Nigeria
                  </span>
                </div>
                {/* Radar Effect */}
                <div className="absolute inset-0 w-6 h-6 bg-red-500 rounded-full animate-ping opacity-20"></div>
              </div>
            </div>

            {/* Destination Points */}
            {destinations.map((dest) => (
              <div
                key={dest.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
                style={{ left: `${dest.x}%`, top: `${dest.y}%` }}
                onClick={() => handleDestinationClick(dest)}
              >
                <div className="relative">
                  <div className={`w-4 h-4 bg-gradient-to-r ${dest.color} rounded-full shadow-lg group-hover:scale-125 transition-all duration-300`}>
                    {dest.popular && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-3 border border-white/20 whitespace-nowrap">
                      <p className="text-white font-semibold text-sm">{dest.name}</p>
                      <p className="text-blue-200 text-xs">{dest.country}</p>
                      <p className="text-green-300 text-xs font-bold">{dest.price}</p>
                    </div>
                  </div>

                  {/* Ripple Effect */}
                  <div className="absolute inset-0 w-4 h-4 bg-white rounded-full animate-ping opacity-10 group-hover:opacity-30"></div>
                </div>
              </div>
            ))}

            {/* Floating Plane Animation */}
            <div className="absolute top-1/4 left-0 animate-pulse">
              <Plane className="w-6 h-6 text-blue-400 transform rotate-45" />
            </div>
          </div>

          {/* Popular Destinations Cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.filter(dest => dest.popular).map((dest) => (
              <div
                key={dest.id}
                className="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer hover:transform hover:-translate-y-2"
                onClick={() => handleDestinationClick(dest)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-3 h-3 bg-gradient-to-r ${dest.color} rounded-full`}></div>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">{dest.name}</h3>
                <p className="text-blue-200 text-sm mb-3">{dest.country}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-300 font-bold">{dest.price}</span>
                  <span className="text-gray-300">{dest.duration}</span>
                </div>
                <div className="flex items-center mt-3 text-xs text-gray-300">
                  <Users className="w-3 h-3 mr-1" />
                  {dest.airlines} airlines
                  <div className="ml-auto flex items-center">
                    <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                    {dest.rating}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flight Details Modal */}
        {activeDestination && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">{activeDestination.name}</h3>
                <button
                  onClick={handleCloseDetails}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200">Destination:</span>
                  <span className="text-white font-semibold">{activeDestination.country}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-200">Price from Lagos:</span>
                  <span className="text-green-300 font-bold text-lg">{activeDestination.price}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-200">Flight Duration:</span>
                  <span className="text-white">{activeDestination.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-200">Available Airlines:</span>
                  <span className="text-white">{activeDestination.airlines} options</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-200">Rating:</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-white">{activeDestination.rating}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                onClick={handleSearch}
                >
                  <Plane className="w-4 h-4 mr-2" />
                  Book Flight
                </button>
                <button className="px-6 py-3 border border-white/30 text-white rounded-full hover:bg-white/10 transition-all duration-300 flex items-center justify-center">
                  <Navigation className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default WorldMap;