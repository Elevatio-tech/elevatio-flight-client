import React, { useState, useEffect, useRef } from 'react';
import { 
  Eye, 
  Search, 
  CalendarCheck, 
  Star, 
  ShieldCheck, 
  Wallet, 
  Bell, 
  Smartphone, 
  Mail, 
  MessageCircle, 
  Briefcase, 
  Heart, 
  Users, 
  Check, 
  Plane, 
  PlayCircle 
} from 'lucide-react';

const ElevatioServices = () => {
  const [visibleElements, setVisibleElements] = useState(new Set());
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleElements(prev => new Set([...prev, entry.target.dataset.index]));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const elements = document.querySelectorAll('[data-observer]');
    elements.forEach((el, index) => {
      el.dataset.index = index;
      observerRef.current.observe(el);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const services = [
    {
      icon: Eye,
      title: "Transparent Pricing",
      description: "No hidden fees, ever. See the complete breakdown of fares, taxes, and baggage costs upfront so you can budget with confidence.",
      delay: 0
    },
    {
      icon: Search,
      title: "Smart Flight Search",
      description: "Compare flights across multiple airlines with real-time pricing. Filter by price, reliability, duration, and more to find your perfect match.",
      delay: 0.2
    },
    {
      icon: CalendarCheck,
      title: "Flexible Options",
      description: "Book with confidence using our \"Hold My Fare\" feature, free cancellation options, and easy ticket modifications when plans change.",
      delay: 0.4
    },
    {
      icon: Star,
      title: "Loyalty Rewards",
      description: "Earn miles with every booking. Connect your existing loyalty programs from Emirates, British Airways, and more to maximize your rewards.",
      delay: 0.6
    },
    {
      icon: ShieldCheck,
      title: "Travel Intelligence",
      description: "Get real-time visa requirements, health advisories, airline safety ratings, and travel documentation needs for every destination.",
      delay: 0.8
    },
    {
      icon: Wallet,
      title: "Flexible Payments",
      description: "Pay your way with cards, bank transfers, mobile money, wallet funds, or \"Buy Now Pay Later\" services in your local currency.",
      delay: 1.0
    }
  ];

  const travelerTypes = [
    {
      icon: Briefcase,
      title: "Business Travelers",
      features: [
        "Quick booking & loyalty integration",
        "Corporate account management",
        "Bulk booking discounts"
      ]
    },
    {
      icon: Heart,
      title: "Holiday Travelers",
      features: [
        "Best price comparison",
        "Flexible cancellation options",
        "Travel requirement alerts"
      ]
    },
    {
      icon: Users,
      title: "Travel Partners",
      features: [
        "Partner dashboard & API access",
        "Commission tracking & payouts",
        "Client management tools"
      ]
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div 
          className={`text-center mb-16 transition-all duration-800 ease-out ${
            visibleElements.has('0') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
          data-observer
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-sky-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Elevatio
            </span>
            ?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience the future of flight booking with transparent pricing, real-time updates, 
            and comprehensive travel solutions designed for every type of traveler.
          </p>
        </div>

        {/* Main Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={index}
                className={`group relative p-8 text-center bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl transition-all duration-800 ease-out hover:transform hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/20 ${
                  visibleElements.has(String(index + 1))
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${service.delay}s` }}
                data-observer
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-sky-500 via-blue-500 to-purple-500 rounded-full flex items-center justify-center group-hover:animate-pulse">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            );
          })}
        </div>

        {/* Featured Service Banner */}
        <div 
          className={`bg-gradient-to-r from-sky-500 via-blue-500 to-purple-500 rounded-3xl p-8 md:p-12 text-white text-center mb-20 transition-all duration-800 ease-out ${
            visibleElements.has('7')
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
          data-observer
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                <Bell className="w-10 h-10 text-white" />
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-6">Real-time Flight Updates</h3>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Never miss a beat with instant notifications about booking confirmations, payment status, 
              flight changes, gate updates, and delays delivered right to your device.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: Smartphone, text: "Push Notifications" },
                { icon: Mail, text: "Email Alerts" },
                { icon: MessageCircle, text: "SMS Updates" }
              ].map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className="flex items-center bg-white/20 rounded-full px-6 py-3 hover:bg-white/30 transition-colors">
                    <IconComponent className="w-5 h-5 mr-2" />
                    {item.text}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Partner Services */}
        <div 
          className={`transition-all duration-800 ease-out ${
            visibleElements.has('8')
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
          data-observer
        >
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Built for{' '}
            <span className="bg-gradient-to-r from-sky-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Every Traveler
            </span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {travelerTypes.map((type, index) => {
              const IconComponent = type.icon;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-sky-500 via-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-6">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">{type.title}</h4>
                  <ul className="space-y-3 text-gray-600">
                    {type.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div 
          className={`text-center mt-20 transition-all duration-800 ease-out ${
            visibleElements.has('9')
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
          data-observer
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-6">Ready to Experience Elevatio?</h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who've discovered the freedom to fly with confidence, 
            transparency, and unmatched convenience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-sky-500 via-blue-500 to-purple-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center">
              <Plane className="w-5 h-5 mr-2" />
              Start Booking Now
            </button>
            <button className="border-2 border-blue-500 text-blue-500 px-8 py-4 rounded-full font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300 flex items-center justify-center">
              <PlayCircle className="w-5 h-5 mr-2" />
              Watch Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ElevatioServices;