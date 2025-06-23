
import React, { useState, useEffect, useRef } from 'react'
import { ChevronDown, MapPin, Calendar, Users, ArrowRight, Search } from 'lucide-react'

// Airport/City database with IATA codes
const AIRPORTS = [
  // Nigerian airports
  { code: 'LOS', city: 'Lagos', country: 'Nigeria', name: 'Murtala Muhammed International Airport' },
  { code: 'ABV', city: 'Abuja', country: 'Nigeria', name: 'Nnamdi Azikiwe International Airport' },
  { code: 'KAN', city: 'Kano', country: 'Nigeria', name: 'Mallam Aminu Kano International Airport' },
  { code: 'PHC', city: 'Port Harcourt', country: 'Nigeria', name: 'Port Harcourt International Airport' },
  { code: 'ENU', city: 'Enugu', country: 'Nigeria', name: 'Akanu Ibiam International Airport' },
  { code: 'CBQ', city: 'Calabar', country: 'Nigeria', name: 'Margaret Ekpo International Airport' },
  { code: 'JOS', city: 'Jos', country: 'Nigeria', name: 'Yakubu Gowon Airport' },
  { code: 'MIU', city: 'Maiduguri', country: 'Nigeria', name: 'Maiduguri International Airport' },
  { code: 'YOL', city: 'Yola', country: 'Nigeria', name: 'Yola Airport' },
  { code: 'SKO', city: 'Sokoto', country: 'Nigeria', name: 'Sadiq Abubakar III International Airport' },
  { code: 'KAD', city: 'Kaduna', country: 'Nigeria', name: 'Kaduna Airport' },
  { code: 'ILR', city: 'Ilorin', country: 'Nigeria', name: 'Ilorin International Airport' },
  { code: 'BNI', city: 'Benin City', country: 'Nigeria', name: 'Benin Airport' },
  
  // West African airports
  { code: 'ACC', city: 'Accra', country: 'Ghana', name: 'Kotoka International Airport' },
  { code: 'ABJ', city: 'Abidjan', country: 'Ivory Coast', name: 'Félix-Houphouët-Boigny International Airport' },
  { code: 'DKR', city: 'Dakar', country: 'Senegal', name: 'Léopold Sédar Senghor International Airport' },
  { code: 'LFW', city: 'Lome', country: 'Togo', name: 'Gnassingbé Eyadéma International Airport' },
  { code: 'COO', city: 'Cotonou', country: 'Benin', name: 'Cadjehoun Airport' },
  
  // Major African airports
  { code: 'JNB', city: 'Johannesburg', country: 'South Africa', name: 'O.R. Tambo International Airport' },
  { code: 'CPT', city: 'Cape Town', country: 'South Africa', name: 'Cape Town International Airport' },
  { code: 'CAI', city: 'Cairo', country: 'Egypt', name: 'Cairo International Airport' },
  { code: 'NBO', city: 'Nairobi', country: 'Kenya', name: 'Jomo Kenyatta International Airport' },
  { code: 'ADD', city: 'Addis Ababa', country: 'Ethiopia', name: 'Bole International Airport' },
  { code: 'CMN', city: 'Casablanca', country: 'Morocco', name: 'Mohammed V International Airport' },
  { code: 'TUN', city: 'Tunis', country: 'Tunisia', name: 'Tunis-Carthage International Airport' },
  { code: 'ALG', city: 'Algiers', country: 'Algeria', name: 'Houari Boumediene Airport' },
  
  // International major airports
  { code: 'LHR', city: 'London', country: 'United Kingdom', name: 'Heathrow Airport' },
  { code: 'CDG', city: 'Paris', country: 'France', name: 'Charles de Gaulle Airport' },
  { code: 'FRA', city: 'Frankfurt', country: 'Germany', name: 'Frankfurt Airport' },
  { code: 'AMS', city: 'Amsterdam', country: 'Netherlands', name: 'Amsterdam Airport Schiphol' },
  { code: 'IST', city: 'Istanbul', country: 'Turkey', name: 'Istanbul Airport' },
  { code: 'DXB', city: 'Dubai', country: 'UAE', name: 'Dubai International Airport' },
  { code: 'DOH', city: 'Doha', country: 'Qatar', name: 'Hamad International Airport' },
  { code: 'JFK', city: 'New York', country: 'USA', name: 'John F. Kennedy International Airport' },
  { code: 'LAX', city: 'Los Angeles', country: 'USA', name: 'Los Angeles International Airport' },
  { code: 'NRT', city: 'Tokyo', country: 'Japan', name: 'Narita International Airport' },
  { code: 'SIN', city: 'Singapore', country: 'Singapore', name: 'Singapore Changi Airport' },
  { code: 'HKG', city: 'Hong Kong', country: 'Hong Kong', name: 'Hong Kong International Airport' },
  { code: 'BOM', city: 'Mumbai', country: 'India', name: 'Chhatrapati Shivaji International Airport' },
  { code: 'DEL', city: 'Delhi', country: 'India', name: 'Indira Gandhi International Airport' }
];

// Airport Autocomplete Component
const AirportAutocomplete = ({ value, onChange, placeholder, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAirports, setFilteredAirports] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Filter airports based on search term
  useEffect(() => {
    if (searchTerm.length >= 1) {
      const filtered = AIRPORTS.filter(airport => 
        airport.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airport.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airport.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airport.name.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 8); // Limit to 8 results for performance
      
      setFilteredAirports(filtered);
      setIsOpen(filtered.length > 0);
      setHighlightedIndex(-1);
    } else {
      setFilteredAirports([]);
      setIsOpen(false);
    }
  }, [searchTerm]);

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange(newValue); // Update parent component
  };

  // Handle airport selection
  const handleAirportSelect = (airport) => {
    const formattedValue = `${airport.city} (${airport.code})`;
    setSearchTerm(formattedValue);
    onChange(formattedValue);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredAirports.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredAirports.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredAirports[highlightedIndex]) {
          handleAirportSelect(filteredAirports[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Set initial search term from value prop
  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  return (
    <div className="relative group" ref={dropdownRef}>
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 group-hover:text-white transition-colors duration-300 z-10" size={20} />
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (filteredAirports.length > 0) {
            setIsOpen(true);
          }
        }}
        className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 backdrop-blur-sm"
        autoComplete="off"
      />
      
      {/* Dropdown */}
      {isOpen && filteredAirports.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto">
          {filteredAirports.map((airport, index) => (
            <div
              key={airport.code}
              onClick={() => handleAirportSelect(airport)}
              className={`px-4 py-3 cursor-pointer transition-colors duration-150 border-b border-white/10 last:border-b-0 ${
                index === highlightedIndex 
                  ? 'bg-blue-500/20 text-blue-800' 
                  : 'hover:bg-gray-50 text-gray-800'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-sm">
                    {airport.city}, {airport.country}
                  </div>
                  <div className="text-xs text-gray-600 truncate">
                    {airport.name}
                  </div>
                </div>
                <div className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {airport.code}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AirportAutocomplete;