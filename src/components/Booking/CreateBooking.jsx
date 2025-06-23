import React from 'react';
import { 
  Plane, 
  Users, 
  Mail, 
  Armchair, 
  Luggage, 
  CreditCard, 
  CheckCircle, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  Trash2, 
  Plus 
} from 'lucide-react';

const CreateBooking = ({
  // Required props
  bookingStep,
  internalBookingData,
  selectedFlight,
  searchData,
  user,
  loading,
  promoDiscount,
  paymentReference,
  
  // Functions
  updatePassenger,
  removePassenger,
  addPassenger,
  updateContactInfo,
  applyPromoCode,
  updatePaymentData,
  calculateTotal,
  handleProceedToPayment,
  setBookingStep,
  setActiveTab,
  resetBookingData,
  setInternalBookingData,
  
  // Optional props with defaults
  paymentData = {
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  }
}) => {
  
  // Flight Summary component
  const FlightSummary = () => {
    if (!selectedFlight) return null;

    return (
      <div className="bg-blue-50 rounded-xl p-4 mb-6">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
          <Plane className="mr-2 text-blue-600" size={20} />
          Selected Flight
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-700">{selectedFlight.airline}</div>
            <div className="text-gray-600">{selectedFlight.flightNumber}</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">
              {selectedFlight.departure.time} → {selectedFlight.arrival.time}
            </div>
            <div className="text-gray-600">{selectedFlight.duration}</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">${selectedFlight.price} per person</div>
            <div className="text-gray-600">
              {selectedFlight.stops === 0 ? 'Non-stop' : `${selectedFlight.stops} stop(s)`}
            </div>
          </div>
        </div>
      </div>
    );
  };

  switch (bookingStep) {
    case 1:
      return (
        <div className="space-y-6">
          {/* Flight Summary */}
          {selectedFlight ? (
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
                <Plane className="mr-3" size={24} />
                Selected Flight
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-blue-800">
                    {selectedFlight.airline} {selectedFlight.flightNumber}
                  </p>
                  <p className="text-blue-700">
                    {selectedFlight.departure.city} → {selectedFlight.arrival.city}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-900">${selectedFlight.price}</p>
                  <p className="text-blue-700 text-sm">per person</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
              <div className="flex items-center">
                <AlertTriangle className="text-yellow-600 mr-3" size={24} />
                <div>
                  <h3 className="font-semibold text-yellow-800">No Flight Selected</h3>
                  <p className="text-yellow-700">Please go back to search and select a flight.</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Passenger Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Users className="mr-3 text-blue-600" size={24} />
              Passenger Information
            </h3>

            {internalBookingData.passengers.map((passenger, index) => (
              <div key={passenger.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-700">
                    Passenger {index + 1} ({passenger.type})
                  </h4>
                  {internalBookingData.passengers.length > 1 && (
                    <button
                      onClick={() => removePassenger(passenger.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={passenger.type}
                      onChange={(e) => updatePassenger(passenger.id, 'type', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="adult">Adult (12+)</option>
                      <option value="child">Child (2-11)</option>
                      <option value="infant">Infant (0-2)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <select
                      value={passenger.title}
                      onChange={(e) => updatePassenger(passenger.id, 'title', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Mr">Mr</option>
                      <option value="Mrs">Mrs</option>
                      <option value="Ms">Ms</option>
                      <option value="Miss">Miss</option>
                      <option value="Dr">Dr</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      value={passenger.first_name}
                      onChange={(e) => updatePassenger(passenger.id, 'first_name', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="First Name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      value={passenger.last_name}
                      onChange={(e) => updatePassenger(passenger.id, 'last_name', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Last Name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                    <input
                      type="date"
                      value={passenger.date_of_birth}
                      onChange={(e) => updatePassenger(passenger.id, 'date_of_birth', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number *</label>
                    <input
                      type="text"
                      value={passenger.passport_number}
                      onChange={(e) => updatePassenger(passenger.id, 'passport_number', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Passport Number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nationality *</label>
                    <input
                      type="text"
                      value={passenger.nationality}
                      onChange={(e) => updatePassenger(passenger.id, 'nationality', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Nationality"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={passenger.email}
                      onChange={(e) => updatePassenger(passenger.id, 'email', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Email (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={passenger.phone}
                      onChange={(e) => updatePassenger(passenger.id, 'phone', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Phone (optional)"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addPassenger}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              <Plus size={16} />
              <span>Add Another Passenger</span>
            </button>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Mail className="mr-3 text-blue-600" size={24} />
              Contact Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={internalBookingData.contactInfo.email}
                  onChange={(e) => updateContactInfo('email', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Email Address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  value={internalBookingData.contactInfo.phone}
                  onChange={(e) => updateContactInfo('phone', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Phone Number"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                <input
                  type="text"
                  value={internalBookingData.contactInfo.emergencyContact}
                  onChange={(e) => updateContactInfo('emergencyContact', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Emergency Contact (optional)"
                />
              </div>
            </div>
          </div>
        </div>
      );

    case 2:
      return (
        <div className="space-y-6">
          <FlightSummary />
          
          {/* Seat Selection */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Armchair className="mr-3 text-blue-600" size={24} />
              Seat Selection (Optional)
            </h3>
            <p className="text-gray-600 mb-4">Select your preferred seats. Additional fees may apply for premium seats.</p>
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <Armchair className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 mb-4">Interactive seat map will be displayed here</p>
              <button 
                className="text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => setBookingStep(3)}
              >
                Skip Seat Selection
              </button>
            </div>
          </div>

          {/* Extra Services */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Luggage className="mr-3 text-blue-600" size={24} />
              Extra Services (Optional)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <h4 className="font-medium text-gray-700 mb-2">Extra Checked Bag</h4>
                <p className="text-sm text-gray-600 mb-3">23kg allowance</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800">$45</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Add
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <h4 className="font-medium text-gray-700 mb-2">Priority Boarding</h4>
                <p className="text-sm text-gray-600 mb-3">Board first</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800">$25</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Add
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <h4 className="font-medium text-gray-700 mb-2">Travel Insurance</h4>
                <p className="text-sm text-gray-600 mb-3">Trip protection</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800">$35</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 3:
      return (
        <div className="space-y-6">
          {/* Payment Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <CreditCard className="mr-3 text-blue-600" size={24} />
              Payment Information
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Promo Code</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={internalBookingData.promoCode}
                      onChange={(e) => setInternalBookingData(prev => ({ ...prev, promoCode: e.target.value }))}
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter promo code"
                    />
                    <button
                      onClick={applyPromoCode}
                      disabled={loading}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50"
                    >
                      {loading ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number *</label>
                  <input
                    type="text"
                    value={paymentData.cardNumber}
                    onChange={(e) => updatePaymentData('cardNumber', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry *</label>
                    <input
                      type="text"
                      value={paymentData.expiryDate}
                      onChange={(e) => updatePaymentData('expiryDate', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV *</label>
                    <input
                      type="text"
                      value={paymentData.cvv}
                      onChange={(e) => updatePaymentData('cvv', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name *</label>
                  <input
                    type="text"
                    value={paymentData.cardholderName}
                    onChange={(e) => updatePaymentData('cardholderName', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">Billing Address</h4>
                  <input
                    type="text"
                    value={paymentData.billingAddress.street}
                    onChange={(e) => updatePaymentData('billingAddress.street', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Street Address"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={paymentData.billingAddress.city}
                      onChange={(e) => updatePaymentData('billingAddress.city', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="City"
                    />
                    <input
                      type="text"
                      value={paymentData.billingAddress.state}
                      onChange={(e) => updatePaymentData('billingAddress.state', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="State"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={paymentData.billingAddress.zipCode}
                      onChange={(e) => updatePaymentData('billingAddress.zipCode', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="ZIP Code"
                    />
                    <input
                      type="text"
                      value={paymentData.billingAddress.country}
                      onChange={(e) => updatePaymentData('billingAddress.country', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Country"
                    />
                  </div>
                </div>
              </div>

              {/* Booking Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-800 mb-4">Booking Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Flight ({internalBookingData.passengers.length} passenger{internalBookingData.passengers.length > 1 ? 's' : ''})</span>
                    <span className="font-medium">${(selectedFlight?.price * internalBookingData.passengers.length || 0).toFixed(2)}</span>
                  </div>
                  {internalBookingData.seatSelections.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Seat Selection</span>
                      <span className="font-medium">${internalBookingData.seatSelections.reduce((sum, seat) => sum + (seat.price || 0), 0).toFixed(2)}</span>
                    </div>
                  )}
                  {internalBookingData.baggageSelections.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Extra Services</span>
                      <span className="font-medium">${internalBookingData.baggageSelections.reduce((sum, bag) => sum + (bag.price || 0), 0).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-medium">$50.00</span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Promo Discount</span>
                      <span>-${promoDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <hr className="border-gray-300" />
                  <div className="flex justify-between text-lg font-semibold text-gray-800">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 4:
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            {paymentReference ? (
              <>
                <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Booking Confirmed!</h3>
                <p className="text-gray-600 mb-6">
                  Your flight has been successfully booked and paid for. You will receive confirmation details via email.
                </p>
                <div className="bg-green-50 rounded-lg p-4 mb-6">
                  <p className="text-green-800 font-medium">Payment Reference: {paymentReference}</p>
                </div>
              </>
            ) : (
              <>
                <Clock className="mx-auto text-yellow-500 mb-4" size={64} />
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Booking Reserved!</h3>
                <p className="text-gray-600 mb-6">
                  Your booking has been reserved. Please complete payment within 15 minutes to confirm your flight.
                </p>
                <div className="bg-yellow-50 rounded-lg p-4 mb-6">
                  <p className="text-yellow-800 font-medium">
                    Amount Due: ${calculateTotal().toFixed(2)}
                  </p>
                  <p className="text-yellow-700 text-sm mt-1">
                    Reservation expires in: <span className="font-medium">14:32</span>
                  </p>
                </div>
              </>
            )}
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-gray-800 mb-4">Flight Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-gray-600">From</p>
                  <p className="font-medium">{searchData?.from}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">To</p>
                  <p className="font-medium">{searchData?.to}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Departure</p>
                  <p className="font-medium">{searchData?.departure}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Arrival</p>
                  <p className="font-medium">{searchData?.arrival}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Passengers</p>
                  <p className="font-medium">{internalBookingData.passengers.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-medium text-green-600">${calculateTotal().toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!paymentReference ? (
                // Show payment button if not paid
                <>
                  <button
                    onClick={handleProceedToPayment}
                    disabled={loading}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <Clock className="mr-2 animate-spin" size={20} />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2" size={20} />
                        Complete Payment - ${calculateTotal().toFixed(2)}
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setBookingStep(3)}
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Back to Review
                  </button>
                </>
              ) : (
                // Show booking management options if paid
                <>
                  <button
                    onClick={() => {
                      setActiveTab('manage');
                      setBookingStep(1);
                      resetBookingData();
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Calendar className="mr-2" size={20} />
                    View My Bookings
                  </button>
                  <button
                    onClick={() => {
                      setBookingStep(1);
                      resetBookingData();
                    }}
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Book Another Flight
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default CreateBooking;