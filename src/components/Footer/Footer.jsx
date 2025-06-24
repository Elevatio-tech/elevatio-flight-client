// import { Plane, Mail, Phone, MapPin } from 'lucide-react';
// import { Link } from 'react-router-dom';

// const Footer = () => {
//   return (
//     <footer className="bg-gray-900 text-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           {/* Brand */}
//           <div className="col-span-1 md:col-span-2">
//             <div className="flex items-center space-x-2 mb-4">
//               <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
//                 <Plane className="h-6 w-6 text-white" />
//               </div>
//               <span className="text-xl font-bold">FLYELEVATIO</span>
//             </div>
//             <p className="text-gray-300 mb-4 max-w-md">
//               Your gateway to seamless flight booking. Compare prices, book flights, 
//               and travel with confidence across local and international destinations.
//             </p>
//             <div className="flex space-x-4">
//               <div className="flex items-center space-x-2 text-sm text-gray-300">
//                 <Mail className="h-4 w-4" />
//                 <span>support@elevatio.com</span>
//               </div>
//               <div className="flex items-center space-x-2 text-sm text-gray-300">
//                 <Phone className="h-4 w-4" />
//                 <span>+234 (0) 123 456 7890</span>
//               </div>
//             </div>
//           </div>

//           {/* Quick Links */}
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
//             <ul className="space-y-2">
//               <li><Link to="/search" className="text-gray-300 hover:text-white transition-colors">Search Flights</Link></li>
//               <li><Link to="/bookings" className="text-gray-300 hover:text-white transition-colors">My Bookings</Link></li>
//               <li><Link to="/support" className="text-gray-300 hover:text-white transition-colors">Support</Link></li>
//               <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
//             </ul>
//           </div>

//           {/* Legal */}
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Legal</h3>
//             <ul className="space-y-2">
//               <li><Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
//               <li><Link to="/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link></li>
//               <li><Link to="/cookies" className="text-gray-300 hover:text-white transition-colors">Cookie Policy</Link></li>
//             </ul>
//           </div>
//         </div>
        
//         <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
//           <p>&copy; 2025 Elevatio. All rights reserved.</p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;


import { Plane, Mail, Phone, MapPin } from 'lucide-react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { Link } from 'react-router-dom';
import PhoneNumber from '../../utils/PhoneNumber';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">ELEVATIO</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Your gateway to seamless flight booking. Compare prices, book flights, 
              and travel with confidence across local and international destinations.
            </p>
            <div className="space-y-2 mb-6">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Mail className="h-4 w-4" />
                <span>support@flyelevatio.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Phone className="h-4 w-4" />
                <span>+</span>
                 <PhoneNumber/>
              </div>
            </div>

            {/* Social Media Links */}
            <div>
              <h4 className="text-sm font-semibold mb-3 text-gray-200">Follow Us</h4>
              <div className="flex space-x-3">
                <a 
                  href="https://facebook.com/flyelevatio" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors duration-200"
                  aria-label="Follow us on Facebook"
                >
                  <FaFacebookF size={18} />
                </a>
                
                <a 
                  href="https://twitter.com/flyelevatio" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-sky-500 hover:bg-sky-600 rounded-full flex items-center justify-center transition-colors duration-200"
                  aria-label="Follow us on Twitter"
                >
                  <FaTwitter size={18} />
                </a>
                
                <a 
                  href="https://instagram.com/flyelevatio" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-full flex items-center justify-center transition-all duration-200"
                  aria-label="Follow us on Instagram"
                >
                  <FaInstagram size={18} />
                </a>
                
                <a 
                  href="https://linkedin.com/company/flyelevatio" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-700 hover:bg-blue-800 rounded-full flex items-center justify-center transition-colors duration-200"
                  aria-label="Follow us on LinkedIn"
                >
                  <FaLinkedinIn size={18} />
                </a>
                
                <a 
                  href="https://youtube.com/@flyelevatio" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors duration-200"
                  aria-label="Subscribe to our YouTube channel"
                >
                  <FaYoutube size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/search" className="text-gray-300 hover:text-white transition-colors">Search Flights</Link></li>
              <li><Link to="/bookings" className="text-gray-300 hover:text-white transition-colors">My Bookings</Link></li>
              <li><Link to="/support" className="text-gray-300 hover:text-white transition-colors">Support</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="text-gray-300 hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Elevatio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;