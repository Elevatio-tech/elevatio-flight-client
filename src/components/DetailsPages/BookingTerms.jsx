import React, { useState, useEffect } from 'react'
import { 
  FileText, 
  Shield, 
  CreditCard, 
  Calendar, 
  Plane, 
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Phone,
  Mail,
  Globe,
  User,
  Lock,
  Info
} from 'lucide-react'
import Header from '../Navbar/Header'

function BookingTerms() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeSection, setActiveSection] = useState('booking')

  const sections = [
    { id: 'booking', title: 'Booking Terms', icon: FileText },
    { id: 'payment', title: 'Payment Policy', icon: CreditCard },
    { id: 'cancellation', title: 'Cancellation & Refunds', icon: RefreshCw },
    { id: 'privacy', title: 'Privacy & Data', icon: Shield },
    { id: 'travel', title: 'Travel Requirements', icon: Plane },
    { id: 'contact', title: 'Contact Information', icon: Phone }
  ]

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const renderContent = () => {
    switch (activeSection) {
      case 'booking':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center mb-4">
                <CheckCircle className="text-green-400 mr-3" size={24} />
                <h3 className="text-2xl font-bold text-white">Booking Confirmation</h3>
              </div>
              <div className="space-y-4 text-white/80">
                <p>Your booking is confirmed once payment is successfully processed and you receive a confirmation email with your booking reference.</p>
                <p>All bookings are subject to airline availability and fare conditions at the time of reservation.</p>
                <p>Booking confirmations will be sent to the email address provided during the booking process within 2 hours of successful payment.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center mb-4">
                  <User className="text-blue-400 mr-3" size={20} />
                  <h4 className="text-xl font-semibold text-white">Passenger Information</h4>
                </div>
                <div className="space-y-3 text-white/70 text-sm">
                  <div className="flex items-start">
                    <CheckCircle className="text-green-400 mr-2 mt-0.5 flex-shrink-0" size={16} />
                    <span>Names must match exactly as shown on passport/ID</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="text-green-400 mr-2 mt-0.5 flex-shrink-0" size={16} />
                    <span>All passenger details must be provided at booking</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="text-green-400 mr-2 mt-0.5 flex-shrink-0" size={16} />
                    <span>Contact information must be accurate and accessible</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center mb-4">
                  <Clock className="text-purple-400 mr-3" size={20} />
                  <h4 className="text-xl font-semibold text-white">Booking Deadlines</h4>
                </div>
                <div className="space-y-3 text-white/70 text-sm">
                  <div className="flex items-start">
                    <AlertTriangle className="text-yellow-400 mr-2 mt-0.5 flex-shrink-0" size={16} />
                    <span>Domestic flights: Book at least 2 hours before departure</span>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="text-yellow-400 mr-2 mt-0.5 flex-shrink-0" size={16} />
                    <span>International flights: Book at least 6 hours before departure</span>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="text-yellow-400 mr-2 mt-0.5 flex-shrink-0" size={16} />
                    <span>Same-day bookings may incur additional fees</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-500/20 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/30">
              <div className="flex items-start">
                <Info className="text-amber-400 mr-3 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Important Notice</h4>
                  <p className="text-white/80 text-sm">
                    By completing your booking, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions. 
                    You also confirm that all information provided is accurate and complete.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'payment':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center mb-4">
                <CreditCard className="text-green-400 mr-3" size={24} />
                <h3 className="text-2xl font-bold text-white">Payment Methods</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-white">Accepted Cards</h4>
                  <div className="space-y-2 text-white/70 text-sm">
                    <div className="flex items-center">
                      <CheckCircle className="text-green-400 mr-2" size={16} />
                      <span>Visa, Mastercard, American Express</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="text-green-400 mr-2" size={16} />
                      <span>Verve cards (Nigeria)</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="text-green-400 mr-2" size={16} />
                      <span>Bank transfers and mobile money</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-white">Payment Security</h4>
                  <div className="space-y-2 text-white/70 text-sm">
                    <div className="flex items-center">
                      <Lock className="text-blue-400 mr-2" size={16} />
                      <span>256-bit SSL encryption</span>
                    </div>
                    <div className="flex items-center">
                      <Lock className="text-blue-400 mr-2" size={16} />
                      <span>PCI DSS compliant</span>
                    </div>
                    <div className="flex items-center">
                      <Lock className="text-blue-400 mr-2" size={16} />
                      <span>3D Secure authentication</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h4 className="text-xl font-semibold text-white mb-4">Payment Process</h4>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 mt-0.5">1</div>
                    <div>
                      <p className="text-white/80 text-sm">Payment is processed immediately upon booking confirmation</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 mt-0.5">2</div>
                    <div>
                      <p className="text-white/80 text-sm">Confirmation email sent within 2 hours of successful payment</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 mt-0.5">3</div>
                    <div>
                      <p className="text-white/80 text-sm">E-tickets delivered via email and available in your account</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h4 className="text-xl font-semibold text-white mb-4">Pricing & Fees</h4>
                <div className="space-y-3 text-white/70 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span>Service Fee</span>
                    <span className="text-green-400">Free</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span>Payment Processing</span>
                    <span>Included</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span>Same-day Booking</span>
                    <span>+₦2,000</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span>Changes/Amendments</span>
                    <span>Airline fees apply</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-500/20 backdrop-blur-sm rounded-2xl p-6 border border-red-500/30">
              <div className="flex items-start">
                <AlertTriangle className="text-red-400 mr-3 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Payment Failures</h4>
                  <p className="text-white/80 text-sm mb-3">
                    If your payment fails, your booking will not be confirmed. Please ensure sufficient funds and try again. 
                    For persistent issues, contact your bank or try an alternative payment method.
                  </p>
                  <p className="text-white/80 text-sm">
                    Bookings are held for 15 minutes after initiation. After this time, prices may change and availability is not guaranteed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'cancellation':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center mb-4">
                <RefreshCw className="text-orange-400 mr-3" size={24} />
                <h3 className="text-2xl font-bold text-white">Cancellation Policy</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Refundable Tickets</h4>
                  <div className="space-y-2 text-white/70 text-sm">
                    <div className="flex items-center">
                      <CheckCircle className="text-green-400 mr-2" size={16} />
                      <span>Full refund if canceled within 24 hours of booking</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="text-green-400 mr-2" size={16} />
                      <span>Partial refund based on airline policy</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="text-green-400 mr-2" size={16} />
                      <span>Processing time: 5-10 business days</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Non-Refundable Tickets</h4>
                  <div className="space-y-2 text-white/70 text-sm">
                    <div className="flex items-center">
                      <AlertTriangle className="text-yellow-400 mr-2" size={16} />
                      <span>No refund after 24-hour grace period</span>
                    </div>
                    <div className="flex items-center">
                      <AlertTriangle className="text-yellow-400 mr-2" size={16} />
                      <span>Credit note may be issued (airline dependent)</span>
                    </div>
                    <div className="flex items-center">
                      <AlertTriangle className="text-yellow-400 mr-2" size={16} />
                      <span>Change fees and fare differences apply</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="text-center">
                  <Clock className="text-blue-400 mx-auto mb-3" size={32} />
                  <h4 className="text-lg font-semibold text-white mb-2">24-Hour Rule</h4>
                  <p className="text-white/70 text-sm">
                    Cancel within 24 hours of booking for a full refund, regardless of ticket type
                  </p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="text-center">
                  <Calendar className="text-purple-400 mx-auto mb-3" size={32} />
                  <h4 className="text-lg font-semibold text-white mb-2">Schedule Changes</h4>
                  <p className="text-white/70 text-sm">
                    Major schedule changes by airlines may qualify for full refunds
                  </p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="text-center">
                  <Shield className="text-green-400 mx-auto mb-3" size={32} />
                  <h4 className="text-lg font-semibold text-white mb-2">Travel Insurance</h4>
                  <p className="text-white/70 text-sm">
                    Consider purchasing travel insurance for additional protection
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h4 className="text-xl font-semibold text-white mb-4">Refund Process</h4>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4 mt-1">1</div>
                  <div>
                    <h5 className="text-white font-semibold">Submit Cancellation Request</h5>
                    <p className="text-white/70 text-sm mt-1">Contact our support team or use your booking reference online</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4 mt-1">2</div>
                  <div>
                    <h5 className="text-white font-semibold">Review & Processing</h5>
                    <p className="text-white/70 text-sm mt-1">We review your request and process according to airline policies</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4 mt-1">3</div>
                  <div>
                    <h5 className="text-white font-semibold">Refund Issued</h5>
                    <p className="text-white/70 text-sm mt-1">Refunds are processed to your original payment method within 5-10 business days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'privacy':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center mb-4">
                <Shield className="text-purple-400 mr-3" size={24} />
                <h3 className="text-2xl font-bold text-white">Privacy & Data Protection</h3>
              </div>
              <p className="text-white/80 mb-4">
                We are committed to protecting your personal information and respecting your privacy rights in accordance with applicable data protection laws.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-white">Data We Collect</h4>
                  <div className="space-y-2 text-white/70 text-sm">
                    <div className="flex items-center">
                      <User className="text-blue-400 mr-2" size={16} />
                      <span>Personal identification information</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="text-blue-400 mr-2" size={16} />
                      <span>Contact details (email, phone)</span>
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="text-blue-400 mr-2" size={16} />
                      <span>Payment information (securely encrypted)</span>
                    </div>
                    <div className="flex items-center">
                      <Plane className="text-blue-400 mr-2" size={16} />
                      <span>Travel preferences and history</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-white">How We Use Your Data</h4>
                  <div className="space-y-2 text-white/70 text-sm">
                    <div className="flex items-center">
                      <CheckCircle className="text-green-400 mr-2" size={16} />
                      <span>Process bookings and payments</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="text-green-400 mr-2" size={16} />
                      <span>Send booking confirmations and updates</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="text-green-400 mr-2" size={16} />
                      <span>Provide customer support</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="text-green-400 mr-2" size={16} />
                      <span>Improve our services (with consent)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center mb-4">
                  <Lock className="text-green-400 mr-3" size={20} />
                  <h4 className="text-xl font-semibold text-white">Data Security</h4>
                </div>
                <div className="space-y-3 text-white/70 text-sm">
                  <p>We implement industry-standard security measures to protect your data:</p>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle className="text-green-400 mr-2" size={16} />
                      <span>SSL/TLS encryption for all data transmission</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="text-green-400 mr-2" size={16} />
                      <span>Secure data storage with regular backups</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="text-green-400 mr-2" size={16} />
                      <span>Access controls and authentication</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="text-green-400 mr-2" size={16} />
                      <span>Regular security audits and updates</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center mb-4">
                  <User className="text-blue-400 mr-3" size={20} />
                  <h4 className="text-xl font-semibold text-white">Your Rights</h4>
                </div>
                <div className="space-y-3 text-white/70 text-sm">
                  <p>You have the right to:</p>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle className="text-green-400 mr-2" size={16} />
                      <span>Access your personal data</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="text-green-400 mr-2" size={16} />
                      <span>Correct inaccurate information</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="text-green-400 mr-2" size={16} />
                      <span>Request data deletion</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="text-green-400 mr-2" size={16} />
                      <span>Opt-out of marketing communications</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
              <div className="flex items-start">
                <Info className="text-blue-400 mr-3 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Third-Party Sharing</h4>
                  <p className="text-white/80 text-sm mb-3">
                    We only share your data with trusted partners necessary for booking completion:
                  </p>
                  <div className="space-y-2 text-white/70 text-sm">
                    <div className="flex items-center">
                      <Plane className="text-blue-400 mr-2" size={16} />
                      <span>Airlines and travel partners (for booking fulfillment)</span>
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="text-blue-400 mr-2" size={16} />
                      <span>Payment processors (for transaction security)</span>
                    </div>
                    <div className="flex items-center">
                      <Shield className="text-blue-400 mr-2" size={16} />
                      <span>Regulatory authorities (when legally required)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'travel':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center mb-4">
                <Plane className="text-green-400 mr-3" size={24} />
                <h3 className="text-2xl font-bold text-white">Travel Requirements</h3>
              </div>
              <p className="text-white/80 mb-6">
                It is the passenger's responsibility to ensure they meet all travel requirements before departure.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Documentation Required</h4>
                  <div className="space-y-3">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                      <h5 className="text-white font-semibold mb-2">Domestic Flights</h5>
                      <div className="space-y-1 text-white/70 text-sm">
                        <div className="flex items-center">
                          <CheckCircle className="text-green-400 mr-2" size={16} />
                          <span>Valid government-issued photo ID</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="text-green-400 mr-2" size={16} />
                          <span>National ID card or driver's license</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="text-green-400 mr-2" size={16} />
                          <span>International passport (if preferred)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                      <h5 className="text-white font-semibold mb-2">International Flights</h5>
                      <div className="space-y-1 text-white/70 text-sm">
                        <div className="flex items-center">
                          <CheckCircle className="text-green-400 mr-2" size={16} />
                          <span>Valid passport (6+ months validity)</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="text-green-400 mr-2" size={16} />
                          <span>Appropriate visa (if required)</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="text-green-400 mr-2" size={16} />
                          <span>Return/onward ticket proof</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Health & Safety</h4>
                  <div className="space-y-3">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                      <h5 className="text-white font-semibold mb-2">Health Requirements</h5>
                      <div className="space-y-1 text-white/70 text-sm">
                        <div className="flex items-center">
                          <AlertTriangle className="text-yellow-400 mr-2" size={16} />
                          <span>Vaccination certificates (destination dependent)</span>
                        </div>
                        <div className="flex items-center">
                          <AlertTriangle className="text-yellow-400 mr-2" size={16} />
                          <span>COVID-19 requirements (if applicable)</span>
                        </div>
                        <div className="flex items-center">
                          <AlertTriangle className="text-yellow-400 mr-2" size={16} />
                          <span>Medical certificates (if required)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                      <h5 className="text-white font-semibold mb-2">Travel Advisory</h5>
                      <div className="space-y-1 text-white/70 text-sm">
                        <div className="flex items-center">
                          <Info className="text-blue-400 mr-2" size={16} />
                          <span>Check destination travel advisories</span>
                        </div>
                        <div className="flex items-center">
                          <Info className="text-blue-400 mr-2" size={16} />
                          <span>Review airline-specific requirements</span>
                        </div>
                        <div className="flex items-center">
                          <Info className="text-blue-400 mr-2" size={16} />
                          <span>Confirm entry/exit requirements</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
                <Calendar className="text-blue-400 mx-auto mb-3" size={32} />
                <h4 className="text-lg font-semibold text-white mb-2">Check-in Times</h4>
                <div className="space-y-2 text-white/70 text-sm">
                  <p>Domestic: 2 hours before</p>
                  <p>International: 3 hours before</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
                <Globe className="text-purple-400 mx-auto mb-3" size={32} />
                <h4 className="text-lg font-semibold text-white mb-2">Visa Information</h4>
                <div className="space-y-2 text-white/70 text-sm">
                  <p>Check visa requirements</p>
                  <p>Apply well in advance</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
                <Shield className="text-green-400 mx-auto mb-3" size={32} />
                <h4 className="text-lg font-semibold text-white mb-2">Travel Insurance</h4>
                <div className="space-y-2 text-white/70 text-sm">
                  <p>Highly recommended</p>
                  <p>Covers medical & trip costs</p>
                </div>
              </div>
            </div>

            <div className="bg-red-500/20 backdrop-blur-sm rounded-2xl p-6 border border-red-500/30">
              <div className="flex items-start">
                <AlertTriangle className="text-red-400 mr-3 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Important Disclaimer</h4>
                  <p className="text-white/80 text-sm mb-3">
                    Elevatio is not responsible for passengers being denied boarding or entry due to inadequate documentation. 
                    Requirements can change frequently, and it is the passenger's responsibility to stay informed.
                  </p>
                  <p className="text-white/80 text-sm">
                    We recommend checking with the relevant embassy or consulate and reviewing official government travel advisories 
                    before your departure date.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'contact':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center mb-4">
                <Phone className="text-cyan-400 mr-3" size={24} />
                <h3 className="text-2xl font-bold text-white">Contact Information</h3>
              </div>
              <p className="text-white/80 mb-6">
                Need help? Our customer support team is here to assist you with your travel needs.
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
                  <Phone className="text-green-400 mx-auto mb-4" size={32} />
                  <h4 className="text-lg font-semibold text-white mb-2">Phone Support</h4>
                  <div className="space-y-2 text-white/70 text-sm">
                    <p>Nigeria: +234 (0) 1 234 5678</p>
                    <p>International: +1 234 567 8900</p>
                    <p className="text-green-400 font-semibold">24/7 Available</p>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
                  <Mail className="text-blue-400 mx-auto mb-4" size={32} />
                  <h4 className="text-lg font-semibold text-white mb-2">Email Support</h4>
                  <div className="space-y-2 text-white/70 text-sm">
                    <p>support@elevatio.com</p>
                    <p>bookings@elevatio.com</p>
                    <p className="text-blue-400 font-semibold">Response within 2 hours</p>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center md:col-span-2 lg:col-span-1">
                  <Globe className="text-purple-400 mx-auto mb-4" size={32} />
                  <h4 className="text-lg font-semibold text-white mb-2">Live Chat</h4>
                  <div className="space-y-2 text-white/70 text-sm">
                    <p>Available on our website</p>
                    <p>Monday - Sunday</p>
                    <p className="text-purple-400 font-semibold">6:00 AM - 12:00 AM WAT</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h4 className="text-xl font-semibold text-white mb-4">Office Locations</h4>
                <div className="space-y-4">
                  <div className="border-b border-white/10 pb-3">
                    <h5 className="text-white font-semibold">Lagos Headquarters</h5>
                    <p className="text-white/70 text-sm">
                      Plot 123, Victoria Island<br/>
                      Lagos, Nigeria<br/>
                      Phone: +234 (0) 1 234 5678
                    </p>
                  </div>
                  <div className="border-b border-white/10 pb-3">
                    <h5 className="text-white font-semibold">Abuja Office</h5>
                    <p className="text-white/70 text-sm">
                      Wuse II District<br/>
                      Abuja, FCT, Nigeria<br/>
                      Phone: +234 (0) 9 876 5432
                    </p>
                  </div>
                  <div>
                    <h5 className="text-white font-semibold">London Office</h5>
                    <p className="text-white/70 text-sm">
                      25 Canary Wharf<br/>
                      London, UK<br/>
                      Phone: +44 20 1234 5678
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h4 className="text-xl font-semibold text-white mb-4">Support Categories</h4>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-white/5 rounded-lg">
                    <Plane className="text-blue-400 mr-3" size={20} />
                    <div>
                      <h5 className="text-white font-semibold text-sm">Booking Assistance</h5>
                      <p className="text-white/60 text-xs">New bookings, modifications, seat selection</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-white/5 rounded-lg">
                    <RefreshCw className="text-orange-400 mr-3" size={20} />
                    <div>
                      <h5 className="text-white font-semibold text-sm">Cancellations & Refunds</h5>
                      <p className="text-white/60 text-xs">Cancel bookings, process refunds, policy info</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-white/5 rounded-lg">
                    <CreditCard className="text-green-400 mr-3" size={20} />
                    <div>
                      <h5 className="text-white font-semibold text-sm">Payment Issues</h5>
                      <p className="text-white/60 text-xs">Payment failures, billing questions</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-white/5 rounded-lg">
                    <AlertTriangle className="text-red-400 mr-3" size={20} />
                    <div>
                      <h5 className="text-white font-semibold text-sm">Emergency Support</h5>
                      <p className="text-white/60 text-xs">Urgent travel changes, disruptions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-center">
                <h4 className="text-xl font-semibold text-white mb-4">Emergency Contact</h4>
                <p className="text-white/80 mb-4">
                  For urgent matters outside business hours or travel emergencies
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <Phone className="text-red-400 mx-auto mb-2" size={24} />
                    <p className="text-white font-semibold">Emergency Hotline</p>
                    <p className="text-white/70 text-sm">+234 (0) 1 911 0000</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <Mail className="text-red-400 mx-auto mb-2" size={24} />
                    <p className="text-white font-semibold">Emergency Email</p>
                    <p className="text-white/70 text-sm">emergency@elevatio.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div>
            <Header/>
        </div>
      <div
        className={`absolute inset-0 bg-[url("data:image/svg+xml;utf8,<svg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'><g fill='none' fill-rule='evenodd'><g fill='%239C92AC' fill-opacity='0.1'><circle cx='30' cy='30' r='1'/></g></g></svg>")] opacity-20`}
      ></div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                Terms & Conditions
              </h1>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Important information about booking, payments, and travel requirements
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-purple-500/25'
                        : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    <Icon size={16} className="mr-2" />
                    {section.title}
                  </button>
                )
              })}
            </div>

            <div className="max-w-6xl mx-auto">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingTerms