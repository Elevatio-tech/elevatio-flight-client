import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Globe, 
  Save,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle,
  Upload
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ProfilePicture from './ProfilePicture'; 
import { backendUrl } from '../../config/config';

// API Configuration
const API_BASE_URL = `${backendUrl}/api/partners`;

// Utility function for API calls
const apiCall = async (endpoint, options = {}, token) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Status Badge Component
const StatusBadge = ({ status, emailVerified }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return {
          icon: CheckCircle,
          className: 'bg-green-100 text-green-800',
          text: 'Approved'
        };
      case 'pending':
        return {
          icon: AlertCircle,
          className: 'bg-yellow-100 text-yellow-800',
          text: 'Pending Review'
        };
      case 'rejected':
        return {
          icon: XCircle,
          className: 'bg-red-100 text-red-800',
          text: 'Rejected'
        };
      default:
        return {
          icon: AlertCircle,
          className: 'bg-gray-100 text-gray-800',
          text: 'Unknown'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className="flex items-center space-x-2">
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${config.className}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
      {emailVerified !== undefined && (
        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
          emailVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <Mail className="w-3 h-3 mr-1" />
          {emailVerified ? 'Email Verified' : 'Email Not Verified'}
        </span>
      )}
    </div>
  );
};

// Form Input Component
const FormInput = ({ label, icon: Icon, error, ...props }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      )}
      <input
        className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? 'border-red-300 ring-red-500' : ''
        } ${props.disabled ? 'bg-gray-50 text-gray-500' : ''}`}
        {...props}
      />
    </div>
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);

// Form Textarea Component
const FormTextarea = ({ label, error, ...props }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
        error ? 'border-red-300 ring-red-500' : ''
      } ${props.disabled ? 'bg-gray-50 text-gray-500' : ''}`}
      rows={4}
      {...props}
    />
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);

// Business Type Select Component
const BusinessTypeSelect = ({ value, onChange, error, disabled }) => {
  const businessTypes = [
    { value: 'travel_agency', label: 'Travel Agency' },
    { value: 'tour_operator', label: 'Tour Operator' },
    { value: 'hotel', label: 'Hotel' },
    { value: 'airline', label: 'Airline' },
    { value: 'consultant', label: 'Travel Consultant' },
    { value: 'booking_platform', label: 'Booking Platform' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">Business Type</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Building className="h-5 w-5 text-gray-400" />
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error ? 'border-red-300 ring-red-500' : ''
          } ${disabled ? 'bg-gray-50 text-gray-500' : ''}`}
        >
          <option value="">Select business type</option>
          {businessTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

// Main ProfileManager Component
const ProfileManager = () => {
  const { user: authUser, token } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [profileImageFile, setProfileImageFile] = useState(null); // Store actual file
  const [profileImagePreview, setProfileImagePreview] = useState(null); // Store preview URL
  const [originalProfileImage, setOriginalProfileImage] = useState(null); // Store original image
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    phone: '',
    businessType: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    website: '',
    description: ''
  });

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await apiCall('/profile', {}, token);
      const profileData = response.data || response;
      setProfile(profileData);
      
      // Set profile image from database or auth user
      const imageUrl = profileData.profile_image || authUser?.profile_image;
      setProfileImagePreview(imageUrl);
      setOriginalProfileImage(imageUrl);
      
      // Populate form data with correct field mapping
      setFormData({
        firstName: profileData.first_name || '',
        lastName: profileData.last_name || '',
        companyName: profileData.business_name || '',
        phone: profileData.phone || '',
        businessType: profileData.business_type || '',
        address: profileData.address || '',
        city: profileData.city || '',
        state: profileData.state || '',
        country: profileData.country || '',
        postalCode: profileData.postal_code || '',
        website: profileData.website || '',
        description: profileData.description || ''
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      alert('Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Handle profile image change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Store the actual file for upload
      setProfileImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    if (!formData.businessType) {
      newErrors.businessType = 'Business type is required';
    }
    if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
      newErrors.website = 'Please enter a valid website URL';
    }
    if (formData.phone && !formData.phone.match(/^[\+]?[1-9][\d]{0,15}$/)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save profile changes using FormData
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      
      // Create FormData for multipart upload
      const formDataToSend = new FormData();
      
      // Add all form fields
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('companyName', formData.companyName);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('businessType', formData.businessType);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('state', formData.state);
      formDataToSend.append('country', formData.country);
      formDataToSend.append('postalCode', formData.postalCode);
      formDataToSend.append('website', formData.website);
      formDataToSend.append('description', formData.description);
      
      // Add profile image file if selected
      if (profileImageFile) {
        formDataToSend.append('profileImage', profileImageFile);
        console.log('Adding profile image to FormData:', profileImageFile.name);
      }
      
      // Debug: Log FormData contents
      console.log('FormData entries:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, typeof value === 'object' ? `File: ${value.name}` : value);
      }
      
      // Make API call with FormData
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type - let browser set it with boundary for FormData
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Profile update response:', data);
      
      // Refresh profile data to get updated values
      await fetchProfile();
      setEditing(false);
      setProfileImageFile(null); // Clear the file after successful upload
      
      // Show success message
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert(error.message || 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    // Reset form data to original profile data
    if (profile) {
      setFormData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        companyName: profile.business_name || '',
        phone: profile.phone || '',
        businessType: profile.business_type || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        country: profile.country || '',
        postalCode: profile.postal_code || '',
        website: profile.website || '',
        description: profile.description || ''
      });
      setProfileImagePreview(originalProfileImage); // Reset to original image
      setProfileImageFile(null); // Clear selected file
    }
    setErrors({});
    setEditing(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="animate-pulse">
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-40"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profile Management</h1>
              <p className="text-gray-500 mt-1">Manage your partner account information</p>
            </div>
            <div className="flex items-center space-x-3">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Profile Header */}
          <div className="flex items-center space-x-6 mb-8">
            <ProfilePicture 
              firstName={formData.firstName} 
              lastName={formData.lastName}
              profileImage={profileImagePreview}
              onImageChange={handleImageChange}
              editing={editing}
            />
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">
                {formData.firstName} {formData.lastName}
              </h2>
              <p className="text-gray-600 mt-1">{formData.companyName}</p>
              <div className="mt-3">
                <StatusBadge 
                  status={profile?.status} 
                  emailVerified={profile?.email_verified} 
                />
              </div>
              {editing && (
                <div className="mt-3 text-sm text-blue-600">
                  <Upload className="w-4 h-4 inline mr-1" />
                  Click the camera icon to upload a new profile picture
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Available Balance</div>
              <div className="text-2xl font-bold text-green-600">
                ${(profile?.available_balance || 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Commission Rate: {((profile?.commission_rate || 0) * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="space-y-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="First Name"
                  icon={User}
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  error={errors.firstName}
                  disabled={!editing}
                />
                <FormInput
                  label="Last Name"
                  icon={User}
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  error={errors.lastName}
                  disabled={!editing}
                />
                <FormInput
                  label="Email"
                  icon={Mail}
                  value={profile?.email || ''}
                  disabled={true}
                  className="bg-gray-50"
                />
                <FormInput
                  label="Phone"
                  icon={Phone}
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  error={errors.phone}
                  disabled={!editing}
                />
              </div>
            </div>

            {/* Business Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Company Name"
                  icon={Building}
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  error={errors.companyName}
                  disabled={!editing}
                />
                <BusinessTypeSelect
                  value={formData.businessType}
                  onChange={(value) => handleInputChange('businessType', value)}
                  error={errors.businessType}
                  disabled={!editing}
                />
                <div className="md:col-span-2">
                  <FormInput
                    label="Website"
                    icon={Globe}
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    error={errors.website}
                    disabled={!editing}
                    placeholder="https://your-website.com"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <FormInput
                    label="Street Address"
                    icon={MapPin}
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    error={errors.address}
                    disabled={!editing}
                  />
                </div>
                <FormInput
                  label="City"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  error={errors.city}
                  disabled={!editing}
                />
                <FormInput
                  label="State/Province"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  error={errors.state}
                  disabled={!editing}
                />
                <FormInput
                  label="Country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  error={errors.country}
                  disabled={!editing}
                />
                <FormInput
                  label="Postal Code"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  error={errors.postalCode}
                  disabled={!editing}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Description</h3>
              <FormTextarea
                label="Describe your business"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                error={errors.description}
                disabled={!editing}
                placeholder="Tell us about your business, services, and specializations..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileManager;