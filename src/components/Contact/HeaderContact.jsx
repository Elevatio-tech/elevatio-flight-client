import React from 'react'
import { FiPhoneCall, FiMail } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import Phone from '../../utils/Phone';
import { themeColors, socialColors } from '../../theme/index';

function HeaderContact() {
  return (
    <div className='bg-gray-50 border-b border-gray-200 py-2 px-4' style={{ backgroundColor: themeColors.neutral.lightBg(1) }}>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-center'>
          
          {/* Left side - Contact Info */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            {/* Phone */}
            <div className='flex items-center gap-2' style={{ color: themeColors.neutral.text }}>
              <FiPhoneCall size={16} style={{ color: themeColors.primary.text }} />
              <div className="flex items-center text-sm">
                <span>+</span>
                <Phone/>
              </div>
            </div>
            
            {/* Email */}
            <div className='flex items-center gap-2' style={{ color: themeColors.neutral.text }}>
              <FiMail size={16} style={{ color: themeColors.primary.text }} />
              <span className="text-sm">info@company.com</span>
            </div>
          </div>

          {/* Right side - Social Media */}
          <div className="flex gap-3 justify-center md:justify-end">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 text-white rounded-full flex items-center justify-center transition-colors duration-200"
              style={{ 
                backgroundColor: socialColors.facebook.bgColor(1),
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = socialColors.facebook.hover(1)}
              onMouseLeave={(e) => e.target.style.backgroundColor = socialColors.facebook.bgColor(1)}
            >
              <FaFacebookF size={14} />
            </a>
            
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 text-white rounded-full flex items-center justify-center transition-colors duration-200"
              style={{ 
                backgroundColor: socialColors.twitter.bgColor(1),
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = socialColors.twitter.hover(1)}
              onMouseLeave={(e) => e.target.style.backgroundColor = socialColors.twitter.bgColor(1)}
            >
              <FaTwitter size={14} />
            </a>
            
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`w-8 h-8 text-white rounded-full flex items-center justify-center transition-all duration-200 bg-gradient-to-r ${socialColors.instagram.gradient} hover:${socialColors.instagram.gradientHover}`}
            >
              <FaInstagram size={14} />
            </a>
            
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 text-white rounded-full flex items-center justify-center transition-colors duration-200"
              style={{ 
                backgroundColor: socialColors.linkedin.bgColor(1),
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = socialColors.linkedin.hover(1)}
              onMouseLeave={(e) => e.target.style.backgroundColor = socialColors.linkedin.bgColor(1)}
            >
              <FaLinkedinIn size={14} />
            </a>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default HeaderContact