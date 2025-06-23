import React from 'react';
import { Camera } from 'lucide-react';

const ProfilePicture = ({ 
  firstName, 
  lastName, 
  profileImage, 
  onImageChange, 
  editing, 
  size = 'large' 
}) => {
  const initials = `${firstName?.charAt(0) || 'P'}${lastName?.charAt(0) || 'P'}`;
  
  const sizeClasses = {
    small: 'w-12 h-12 text-sm',
    medium: 'w-16 h-16 text-lg',
    large: 'w-24 h-24 text-2xl'
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, or WebP)');
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }

      // Pass the event to parent component
      onImageChange?.(event);
    }
  };

  return (
    <div className="relative">
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg`}>
        {profileImage ? (
          <img 
            src={profileImage} 
            alt={`${firstName} ${lastName}`} 
            className="w-full h-full object-cover" 
            onError={(e) => {
              // Fallback to initials if image fails to load
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : (
          <span className="text-white font-bold">{initials}</span>
        )}
        {/* Fallback initials (hidden unless image fails) */}
        {profileImage && (
          <div className="absolute inset-0 items-center justify-center text-white font-bold" style={{ display: 'none' }}>
            {initials}
          </div>
        )}
      </div>
      
      {size === 'large' && editing && (
        <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
          <Camera className="w-4 h-4 text-gray-600" />
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};

export default ProfilePicture;