import React, { useState } from 'react';
import { User, Camera, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Header from '../Navbar/Header';

const Profile = () => {
  const { user, updateProfile, logout, userType } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profile_image || null);
  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    dateofbirth: user?.dateofbirth || '',
    address: user?.address || ''
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile({
        ...formData,
        profile_image: profileImage
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      firstName: user?.first_name || '',
      lastName: user?.last_name || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      dateOfbirth: user?.date_of_birth || '',
      address: user?.address || ''
    });
    setProfileImage(user?.profile_image || null);
  };

  // Function to get user type display with proper styling
  const getUserTypeDisplay = () => {
    const type = userType || 'user';
    const displayType = type.charAt(0).toUpperCase() + type.slice(1);
    
    // Different colors for different user types
    const getTypeColor = () => {
      switch (type.toLowerCase()) {
        case 'admin':
          return 'bg-red-500/20 text-red-300 border-red-500/30';
        case 'partner':
          return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
        case 'user':
        default:
          return 'bg-green-500/20 text-green-300 border-green-500/30';
      }
    };

    return (
      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor()}`}>
        {displayType}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className='mb-4'>
         <Header/>
      </div>
      <div className="max-w-4xl mx-auto">
        
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-4 border-white/30">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 text-white" />
                      
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-purple-500 rounded-full p-2 cursor-pointer hover:bg-purple-600 transition-colors">
                      <Camera className="w-4 h-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">
                    {user?.first_name} {user?.last_name}
                  </h1>
                  <p className="text-purple-200">{user?.email}</p>
                  <div className="mt-2">
                    {getUserTypeDisplay()}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{loading ? 'Saving...' : 'Save'}</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors flex items-center space-x-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300">
                    {formData.firstName || 'Not provided'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300">
                    {formData.lastName || 'Not provided'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300">
                    {formData.phone || 'Not provided'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.dateofbirth}
                    onChange={(e) => setFormData({...formData, dateofbirth: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300">
                    {formData.dateofbirth || 'Not provided'}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Bio</label>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300 min-h-[100px]">
                  {formData.bio || 'No bio provided'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Address</label>
              {isEditing ? (
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Your address..."
                />
              ) : (
                <p className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300">
                  {formData.address || 'No address provided'}
                </p>
              )}
            </div>

            {/* Account Information */}
            <div className="border-t border-white/20 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Email</label>
                  <p className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300">
                    {user?.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Account Type</label>
                  <p className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300">
                    {getUserTypeDisplay()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Member Since</label>
                  <p className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300">
                    {new Date(user?.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Email Verified</label>
                  <p className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user?.email_verified 
                        ? 'bg-green-500/20 text-green-300' 
                        : 'bg-red-500/20 text-red-300'
                    }`}>
                      {user?.email_verified ? 'Verified' : 'Not Verified'}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Account Status</label>
                  <p className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300">
                    <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-medium">
                      {user?.status?.charAt(0).toUpperCase() + user?.status?.slice(1)}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-white/20 pt-6 flex justify-end">
              <button
                onClick={logout}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;