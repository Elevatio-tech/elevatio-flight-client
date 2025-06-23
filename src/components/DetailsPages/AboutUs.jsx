import React, { useState, useEffect } from 'react'
import { 
  Plane, 
  Users, 
  Globe, 
  Award, 
  Heart, 
  Shield, 
  Clock, 
  Star,
  MapPin,
  Headphones,
  TrendingUp,
  CheckCircle
} from 'lucide-react'
import Header from '../Navbar/Header'

function AboutUs() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const stats = [
    { icon: Users, number: '50K+', label: 'Happy Travelers', color: 'text-blue-400' },
    { icon: MapPin, number: '200+', label: 'Destinations', color: 'text-purple-400' },
    { icon: Plane, number: '1M+', label: 'Flights Booked', color: 'text-green-400' },
    { icon: Star, number: '4.9', label: 'Average Rating', color: 'text-yellow-400' }
  ]

  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Your travel dreams are our priority. We go above and beyond to ensure every journey is memorable.',
      color: 'from-red-400 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Advanced security measures and transparent pricing ensure your bookings are safe and reliable.',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Connecting you to over 200 destinations worldwide with the best airlines and competitive prices.',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: TrendingUp,
      title: 'Innovation',
      description: 'Cutting-edge technology and AI-powered recommendations for seamless travel planning.',
      color: 'from-purple-400 to-violet-500'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'Lagos, Nigeria',
      rating: 5,
      text: 'Elevatio made booking my family vacation so easy! The interface is beautiful and the customer service is exceptional.',
      avatar: '👩🏽‍💼'
    },
    {
      name: 'Michael Chen',
      location: 'London, UK',
      rating: 5,
      text: 'Best flight booking experience ever. Found amazing deals and the booking process was seamless.',
      avatar: '👨🏻‍💻'
    },
    {
      name: 'Amara Okafor',
      location: 'Abuja, Nigeria',
      rating: 5,
      text: 'I love how they show all the options clearly. Saved me hundreds on my business trips!',
      avatar: '👩🏿‍💼'
    }
  ]

  const milestones = [
    { year: '2020', title: 'Founded', description: 'Elevatio was born with a vision to revolutionize flight booking' },
    { year: '2021', title: 'Global Expansion', description: 'Expanded to serve customers across Africa and beyond' },
    { year: '2023', title: '1M Bookings', description: 'Reached the milestone of 1 million successful bookings' },
    { year: '2024', title: 'AI Integration', description: 'Launched AI-powered flight recommendations and smart pricing' }
  ]

  useEffect(() => {
    setIsVisible(true)
    
    // Testimonial rotation
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(testimonialInterval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <div>
         <Header/>
      </div>
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20" />
        <div className="relative container mx-auto px-4 py-20">
          <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white/90 text-sm font-medium mb-6">
              <Plane className="mr-2 animate-pulse" size={16} />
              About Elevatio
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Your Journey
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Starts Here
              </span>
            </h1>
            
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              We're more than just a booking platform. We're your trusted travel companion, 
              dedicated to making every flight booking experience seamless, secure, and memorable.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div 
                  key={index}
                  className={`text-center transform transition-all duration-1000 delay-${index * 100} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 border border-white/10">
                    <Icon className={`${stat.color} mx-auto mb-4 animate-pulse`} size={32} />
                    <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                    <div className="text-white/70">{stat.label}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Our Story
              </h2>
              <div className="space-y-6 text-white/80 text-lg leading-relaxed">
                <p>
                  Founded in 2020, Elevatio emerged from a simple yet powerful vision: to transform 
                  the way people book flights by combining cutting-edge technology with genuine 
                  human care.
                </p>
                <p>
                  We noticed that travelers were frustrated with complex booking processes, hidden 
                  fees, and poor customer service. So we set out to create something different – 
                  a platform that puts transparency, simplicity, and customer satisfaction at its core.
                </p>
                <p>
                  Today, we're proud to serve thousands of travelers worldwide, helping them discover 
                  amazing destinations and create unforgettable memories, one flight at a time.
                </p>
              </div>
            </div>
            
            <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                <div className="text-6xl mb-6 text-center">✈️</div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">Our Mission</h3>
                <p className="text-white/80 text-center leading-relaxed">
                  To democratize travel by making flight booking accessible, affordable, and 
                  delightful for everyone, everywhere.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              What Drives Us
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Our core values guide every decision we make and every service we provide
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div 
                  key={index}
                  className={`transform transition-all duration-1000 delay-${index * 150} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 h-full hover:bg-white/15 transition-all duration-300 transform hover:scale-105 border border-white/10">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${value.color} flex items-center justify-center mb-4`}>
                      <Icon className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                    <p className="text-white/70 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our Journey
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Key milestones that shaped Elevatio into what it is today
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-400 via-purple-400 to-cyan-400 rounded-full" />
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div 
                  key={index}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} gap-8`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'} transform transition-all duration-1000 delay-${index * 200} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all duration-300">
                      <div className="text-2xl font-bold text-blue-400 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-bold text-white mb-2">{milestone.title}</h3>
                      <p className="text-white/70">{milestone.description}</p>
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full border-4 border-slate-900" />
                  </div>
                  
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              What Our Travelers Say
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Real stories from real travelers who chose Elevatio for their journeys
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <div className="text-center">
                <div className="text-6xl mb-4">{testimonials[currentTestimonial].avatar}</div>
                <div className="text-2xl font-bold text-white mb-2">
                  {testimonials[currentTestimonial].name}
                </div>
                <div className="text-white/60 mb-4">
                  {testimonials[currentTestimonial].location}
                </div>
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={20} />
                  ))}
                </div>
                <p className="text-xl text-white/80 leading-relaxed italic">
                  "{testimonials[currentTestimonial].text}"
                </p>
              </div>
            </div>
            
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-blue-400' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied travelers who trust Elevatio for their flight bookings
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full font-semibold text-lg shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 overflow-hidden">
                <span className="relative z-10 flex items-center justify-center">
                  Book Your Flight
                  <Plane className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
              
              <button className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:border-white/50 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 flex items-center justify-center">
                <Headphones className="mr-2" size={20} />
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUs