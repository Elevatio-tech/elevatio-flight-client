import React, { useState, useEffect } from 'react'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle,
  Headphones,
  Globe,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  CheckCircle,
  ArrowRight,
  Plane,
  Users,
  Shield,
  Zap
} from 'lucide-react'

// Mock Header component - replace with your actual Header import
const Header = () => (
  <div className="h-16 bg-transparent"></div>
)

function GetInTouch() {
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      primary: 'hello@elevatio.com',
      secondary: 'support@elevatio.com',
      description: 'Drop us a line anytime',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: Phone,
      title: 'Call Us',
      primary: '+234 800 ELEVATIO',
      secondary: '+234 800 353 8284',
      description: '24/7 customer support',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      primary: 'Lagos, Nigeria',
      secondary: 'Victoria Island',
      description: 'Our headquarters',
      color: 'from-purple-400 to-violet-500'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      primary: 'Mon - Fri: 9AM - 6PM',
      secondary: 'Weekend: 10AM - 4PM',
      description: 'West Africa Time (WAT)',
      color: 'from-orange-400 to-red-500'
    }
  ]

  const supportCategories = [
    {
      id: 'general',
      title: 'General Inquiry',
      icon: MessageCircle,
      description: 'Questions about our services'
    },
    {
      id: 'booking',
      title: 'Booking Support',
      icon: Plane,
      description: 'Help with flight bookings'
    },
    {
      id: 'technical',
      title: 'Technical Support',
      icon: Zap,
      description: 'Website or app issues'
    },
    {
      id: 'partnership',
      title: 'Partnership',
      icon: Users,
      description: 'Business collaborations'
    }
  ]

  const socialLinks = [
    { icon: Twitter, href: '#', color: 'hover:text-blue-400' },
    { icon: Facebook, href: '#', color: 'hover:text-blue-600' },
    { icon: Instagram, href: '#', color: 'hover:text-pink-400' },
    { icon: Linkedin, href: '#', color: 'hover:text-blue-700' }
  ]

  const faqs = [
    {
      question: 'How can I modify or cancel my booking?',
      answer: 'You can modify or cancel your booking through your account dashboard or by contacting our support team within 24 hours of booking.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, bank transfers, and mobile money payments including MTN, Airtel, and others.'
    },
    {
      question: 'How do I get my boarding pass?',
      answer: 'Your boarding pass will be sent via email after check-in. You can also download it from your booking confirmation page.'
    },
    {
      question: 'Do you offer travel insurance?',
      answer: 'Yes, we partner with leading insurance providers to offer comprehensive travel insurance options during the booking process.'
    }
  ]

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div>
        <Header />
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20" />
        <div className="relative container mx-auto px-4 py-20">
          <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white/90 text-sm font-medium mb-6">
              <MessageCircle className="mr-2 animate-pulse" size={16} />
              Get In Touch
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              We're Here
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                To Help
              </span>
            </h1>
            
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Have a question, need support, or want to share feedback? We'd love to hear from you. 
              Our team is ready to assist you with anything you need.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information Cards */}
      <div className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon
              return (
                <div 
                  key={index}
                  className={`transform transition-all duration-1000 delay-${index * 100} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 h-full hover:bg-white/15 transition-all duration-300 transform hover:scale-105 border border-white/10 group">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${info.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{info.title}</h3>
                    <p className="text-white font-medium mb-1">{info.primary}</p>
                    <p className="text-white/70 mb-2">{info.secondary}</p>
                    <p className="text-white/60 text-sm">{info.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Contact Form & Support Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                <h2 className="text-3xl font-bold text-white mb-6">Send Us a Message</h2>
                
                {!isSubmitted ? (
                  <div className="space-y-6">
                    {/* Category Selection */}
                    <div>
                      <label className="block text-white/70 text-sm font-medium mb-3">
                        What can we help you with?
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {supportCategories.map((category) => {
                          const Icon = category.icon
                          return (
                            <label key={category.id} className="cursor-pointer">
                              <input
                                type="radio"
                                name="category"
                                value={category.id}
                                checked={formData.category === category.id}
                                onChange={handleInputChange}
                                className="sr-only"
                              />
                              <div className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                                formData.category === category.id
                                  ? 'border-blue-400 bg-blue-400/20'
                                  : 'border-white/20 bg-white/5 hover:bg-white/10'
                              }`}>
                                <Icon className="text-white mb-2" size={20} />
                                <div className="text-white text-sm font-medium">{category.title}</div>
                                <div className="text-white/60 text-xs">{category.description}</div>
                              </div>
                            </label>
                          )
                        })}
                      </div>
                    </div>

                    {/* Name & Email */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/70 text-sm font-medium mb-2">
                          Your Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-white/70 text-sm font-medium mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-white/70 text-sm font-medium mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                        placeholder="What's this about?"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-white/70 text-sm font-medium mb-2">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows="6"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300 resize-none"
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-semibold text-lg shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <Send className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="text-green-400" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-white/70">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Support Info & FAQs */}
            <div className={`space-y-8 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
              {/* Quick Support */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6">Need Immediate Help?</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-white/10 rounded-lg hover:bg-white/15 transition-all duration-300 cursor-pointer group">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <Headphones className="text-white" size={20} />
                    </div>
                    <div>
                      <div className="text-white font-semibold">Live Chat Support</div>
                      <div className="text-white/60 text-sm">Available 24/7 for urgent issues</div>
                    </div>
                    <ArrowRight className="text-white/60 ml-auto group-hover:translate-x-1 transition-transform duration-300" size={16} />
                  </div>

                  <div className="flex items-center p-4 bg-white/10 rounded-lg hover:bg-white/15 transition-all duration-300 cursor-pointer group">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <Shield className="text-white" size={20} />
                    </div>
                    <div>
                      <div className="text-white font-semibold">Emergency Support</div>
                      <div className="text-white/60 text-sm">For travel emergencies</div>
                    </div>
                    <ArrowRight className="text-white/60 ml-auto group-hover:translate-x-1 transition-transform duration-300" size={16} />
                  </div>
                </div>
              </div>

              {/* FAQs */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h3>
                
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-white/10 last:border-b-0 pb-4 last:pb-0">
                      <h4 className="text-white font-semibold mb-2">{faq.question}</h4>
                      <p className="text-white/70 text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social & Connect Section */}
      <div className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Stay Connected</h2>
            <p className="text-white/70 text-lg">Follow us on social media for updates, tips, and travel inspiration</p>
          </div>

          <div className="flex justify-center space-x-6">
            {socialLinks.map((social, index) => {
              const Icon = social.icon
              return (
                <a
                  key={index}
                  href={social.href}
                  className={`w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white/70 ${social.color} border border-white/20 hover:border-white/40 hover:bg-white/20 transition-all duration-300 transform hover:scale-110`}
                >
                  <Icon size={24} />
                </a>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <p className="text-white/60">
              Prefer email? Subscribe to our newsletter for exclusive deals and travel tips
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GetInTouch