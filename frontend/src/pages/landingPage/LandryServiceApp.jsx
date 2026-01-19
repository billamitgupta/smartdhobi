import React, { useState, useEffect } from "react";
import {
  MapPin,
  UserPlus,
  ArrowRight,
  Search,
  Star,
  Clock,
  Truck,
  Sparkles,
  Zap,
  X,
  Phone,
  Mail,
  Navigation,
  LogIn,
} from "lucide-react";

import Modal from "../landingPage/components/Modal";
import CustomerRegistration from "../landingPage/auth/CustomerRegistration";
import DhobiRegistration from "../landingPage/auth/DhobiRegistration";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import LogInForm from "../landingPage/auth/LoginForm";
import { useNavigate } from "react-router-dom";

export default function SmartDhobiApp() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [userType, setUserType] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [nearbyServices, setNearbyServices] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const navigate = useNavigate();

  // Animation classes for icons
  const [animatedIcons, setAnimatedIcons] = useState({
    wash: false,
    delivery: false,
    star: false,
  });

  useEffect(() => {
    // Animate icons on mount
    const timer = setTimeout(() => {
      setAnimatedIcons({ wash: true, delivery: true, star: true });
    }, 500);

    // Simulate getting user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          // Simulate nearby services
          setNearbyServices([
            {
              id: 1,
              name: "Quick Wash Dhobi",
              distance: "0.8 km",
              rating: 4.8,
              time: "2 hrs",
            },
            {
              id: 2,
              name: "Premium Laundry",
              distance: "1.2 km",
              rating: 4.9,
              time: "3 hrs",
            },
            {
              id: 3,
              name: "Express Clean",
              distance: "1.5 km",
              rating: 4.7,
              time: "1.5 hrs",
            },
          ]);
        },
        () => {
          // Fallback nearby services
          setNearbyServices([
            {
              id: 1,
              name: "Quick Wash Dhobi",
              distance: "0.8 km",
              rating: 4.8,
              time: "2 hrs",
            },
            {
              id: 2,
              name: "Premium Laundry",
              distance: "1.2 km",
              rating: 4.9,
              time: "3 hrs",
            },
          ]);
        }
      );
    }

    return () => clearTimeout(timer);
  }, []);

  const handleLoginClick = (type) => {
     navigate('/login');
  };

  const handleRegisterClick = (type) => {
    setUserType(type);
    if(type ==="vendor"){
      navigate('/dhobi-register')
    }
    setShowRegister(true);
    setShowLogin(false);
  };

  const closeModals = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  const findNearbyServices = () => {
    // Animate search
    document.getElementById("search-btn").classList.add("animate-pulse");
    setTimeout(() => {
      document.getElementById("search-btn").classList.remove("animate-pulse");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Modern Navigation */}
      <Navbar
        handleLoginClick={handleLoginClick}
        handleRegisterClick={handleRegisterClick}
        isMenuOpen={isMenuOpen}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-pink-200 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-200 rounded-full opacity-20 animate-ping"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-800 bg-clip-text text-transparent">
                  Smart Dhobi
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-4">
                Premium Laundry Services At Your Doorstep
              </p>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Connect with professional dhobis in your area for quality
                laundry services. Fast, reliable, and convenient.
              </p>
            </div>

            {/* Location Finder */}
            <div className="mb-12">
              <div className="max-w-md mx-auto relative">
                <div className="flex items-center bg-white rounded-full shadow-lg border-2 border-purple-100 p-2">
                  <MapPin className="text-purple-500 ml-4" size={20} />
                  <input
                    type="text"
                    placeholder="Enter your location"
                    className="flex-1 px-4 py-3 outline-none text-gray-700"
                  />
                  <button
                    id="search-btn"
                    onClick={findNearbyServices}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                  >
                    <Search size={18} />
                    <span>Find</span>
                  </button>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
              <button
                onClick={() => handleRegisterClick("customer")}
                className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3"
              >
                <UserPlus
                  size={24}
                  className="group-hover:rotate-12 transition-transform"
                />
                <span>Register as Customer</span>
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
              <button
                onClick={() => handleRegisterClick("vendor")}
                className="group relative overflow-hidden bg-white text-purple-600 border-2 border-purple-200 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-50 hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-3"
              >
                <Sparkles
                  size={24}
                  className="group-hover:rotate-12 transition-transform"
                />
                <span>Register as Dhobi</span>
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-all duration-300 group">
                <div
                  className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center transform transition-transform duration-500 ${
                    animatedIcons.wash ? "animate-spin" : ""
                  } group-hover:scale-110`}
                >
                  <Sparkles className="text-white w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Professional Cleaning
                </h3>
                <p className="text-gray-600">
                  Expert dhobis with years of experience
                </p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-all duration-300 group">
                <div
                  className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center transform transition-transform duration-500 ${
                    animatedIcons.delivery ? "animate-bounce" : ""
                  } group-hover:scale-110`}
                >
                  <Truck className="text-white w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Doorstep Service
                </h3>
                <p className="text-gray-600">
                  Free pickup and delivery at your convenience
                </p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-all duration-300 group">
                <div
                  className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-500 to-pink-600 rounded-full flex items-center justify-center transform transition-transform duration-500 ${
                    animatedIcons.star ? "animate-pulse" : ""
                  } group-hover:scale-110`}
                >
                  <Star className="text-white w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  5-Star Quality
                </h3>
                <p className="text-gray-600">
                  Guaranteed satisfaction with every order
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nearby Services Section */}
      <section id="nearby" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              <Navigation
                className="inline-block mr-3 text-purple-600"
                size={40}
              />
              Nearby Dhobi Services
            </h2>
            <p className="text-lg text-gray-600">
              Professional laundry services in your area
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearbyServices.map((service) => (
              <div
                key={service.id}
                className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 border border-purple-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {service.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <MapPin size={14} className="mr-1 text-purple-500" />
                        {service.distance}
                      </span>
                      <span className="flex items-center">
                        <Clock size={14} className="mr-1 text-green-500" />
                        {service.time}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
                    <Star size={14} className="text-yellow-500 mr-1" />
                    <span className="text-sm font-semibold text-yellow-700">
                      {service.rating}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    Book Now
                  </button>
                  <button className="px-4 py-2 border border-purple-200 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                    <Phone size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="py-20 bg-gradient-to-br from-purple-50 to-pink-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Premium Services
            </h2>
            <p className="text-lg text-gray-600">
              Professional laundry solutions for every need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-purple-100">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <Sparkles className="text-white w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Wash & Fold
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Professional washing and folding services for all your regular
                clothes with premium detergents.
              </p>
            
            </div>

            <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-purple-100">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <Zap className="text-white w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Dry Cleaning
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Expert dry cleaning for your delicate and special garments with
                eco-friendly solvents.
              </p>
             
            </div>

            <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-purple-100">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-500 to-red-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <Clock className="text-white w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Express Service
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Quick turnaround when you need your clothes cleaned fast.
                Same-day delivery available.
              </p>
            
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How Smart Dhobi Works
            </h2>
            <p className="text-lg text-gray-600">
              Simple steps to get your laundry done professionally
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                number: "1",
                title: "Register",
                description: "Sign up and create your account in minutes",
                icon: UserPlus,
                color: "from-purple-500 to-pink-500",
              },
              {
                number: "2",
                title: "Schedule",
                description: "Book a pickup at your preferred time",
                icon: Clock,
                color: "from-blue-500 to-purple-500",
              },
              {
                number: "3",
                title: "Professional Cleaning",
                description: "Your clothes get professionally cleaned",
                icon: Sparkles,
                color: "from-green-500 to-blue-500",
              },
              {
                number: "4",
                title: "Delivery",
                description: "Clean clothes delivered to your doorstep",
                icon: Truck,
                color: "from-pink-500 to-red-500",
              },
            ].map((step, index) => (
              <div key={index} className="relative group">
                <div className="text-center">
                  <div
                    className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <step.icon className="text-white w-10 h-10" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-4 border-purple-200 rounded-full flex items-center justify-center text-sm font-bold text-purple-600">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>

                {index < 3 && (
                  <div className="hidden md:block absolute top-10 left-full w-full">
                    <ArrowRight className="text-purple-300 w-8 h-8 mx-auto animate-bounce" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}

      {/* Modals */}
     
      {showRegister && (
        <Modal
          title={`${
            userType === "vendor" ? "Dhobi" : "Customer"
          } Registration`}
          onClose={closeModals}
        >
          {userType === "vendor" ? (
            <DhobiRegistration />
          ) : (
            <CustomerRegistration />
          )}
        </Modal>
      )}

      <Footer />
    </div>
  );
}
