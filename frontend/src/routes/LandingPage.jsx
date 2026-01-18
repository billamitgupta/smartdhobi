import React, { useState, useEffect } from "react";
import {
  Package,
  TrendingUp,
  Users,
  Truck,
  CheckCircle,
  ArrowRight,
  ShoppingBag,
  Star,
  Zap,
} from "lucide-react";
import onlylogo from "../assets/onlylogo.png";
import vocalforlocal from "../assets/vocalforlocal.png";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const [floatingElements, setFloatingElements] = useState([0, 0, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFloatingElements((prev) => prev.map(() => Math.random() * 20 - 10));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const navigate = useNavigate(); 

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <img src={onlylogo} alt="" className="w-20 h-12" />
            </div>
            <nav className="hidden md:flex space-x-8">
              <a
                href="#benefits"
                className="text-gray-600 theme-hover-text transition"
              >
                Benefits
              </a>
              <a
                href="#how-it-works"
                className="text-gray-600 theme-hover-text transition"
              >
                How It Works
              </a>
              <a
                href="#features"
                className="text-gray-600 theme-hover-text transition"
              >
                Features
              </a>
            </nav>
            <button
              className="theme-btn-primary px-6 py-2 rounded-lg font-semibold transition shadow-md"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative bg-gray-50 overflow-hidden">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center px-4 py-6 md:py-8">
            {/* Left Content */}
            <div className="relative z-10">
              <div className="inline-block theme-badge  py-2 rounded-full text-sm font-semibold mb-6">
                🚀 Join 500+ Successful Dealers
              </div>
              <h1 className="text-5xl md:text-6xl font-bold theme-text-primary mb-6 leading-tight">
                Grow Your Business with{" "}
                <span className="theme-text-secondary">LEAFKAART</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Reach more customers and boost your sales. We handle the
                logistics, you focus on what you do best - selling quality
                products.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className="theme-btn-primary px-8 py-4 rounded-lg text-lg font-semibold transition shadow-lg inline-flex items-center justify-center space-x-2"
                  onClick={() => navigate("/register")}
                >
                  <span>Start Selling Today</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  className="theme-btn-secondary px-8 py-4 rounded-lg text-lg font-semibold transition inline-flex items-center justify-center space-x-2"
                  onClick={() => navigate("/login")}
                >
                  <span>Dealer Login</span>
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div>
                  <div className="text-3xl font-bold theme-text-secondary">
                    500+
                  </div>
                  <div className="text-gray-600 text-sm">Active Dealers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold theme-text-secondary">
                    10K+
                  </div>
                  <div className="text-gray-600 text-sm">Products Listed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold theme-text-secondary">
                    50K+
                  </div>
                  <div className="text-gray-600 text-sm">Happy Customers</div>
                </div>
              </div>
            </div>

            {/* Right Image/Illustration */}
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-10 -left-10 w-32 h-32 theme-decorative-1 rounded-full opacity-50"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 theme-decorative-2 rounded-full opacity-30"></div>

              {/* Main illustration area */}
              <div className="relative bg-white rounded-3xl shadow-2xl p-8">
                <div className="theme-primary-light-bg rounded-2xl text-center">
                  <img src={vocalforlocal} alt="" className="w-full h-80"/>
                </div>

                {/* Floating badges */}
                <div
                  className="absolute -top-6 -left-6 bg-white rounded-xl shadow-lg p-4 transform transition-transform duration-1000"
                  style={{ transform: `translateY(${floatingElements[0]}px)` }}
                >
                  <Star className="w-8 h-8 theme-primary-light mb-2" />
                  <div className="text-sm font-bold">Top Rated</div>
                </div>

                <div
                  className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-4 transform transition-transform duration-1000"
                  style={{ transform: `translateY(${floatingElements[1]}px)` }}
                >
                  <Zap className="w-8 h-8 theme-primary-light mb-2" />
                  <div className="text-sm font-bold">Fast Delivery</div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              viewBox="0 0 1440 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                fill="white"
              />
            </svg>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold theme-text-primary mb-4">
                Simple 3-Step Process
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Start selling online in minutes with our easy setup process
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connection lines */}
              <div className="hidden md:block absolute top-20 left-1/6 right-1/6 h-1 theme-decorative-1"></div>

              <div className="relative bg-gray-50 rounded-2xl p-8 text-center hover:shadow-xl transition transform hover:-translate-y-2">
                <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-xl shadow-md flex items-center justify-center">
                  <Users className="w-16 h-16 theme-primary-light" />
                </div>
                <h3 className="text-2xl font-bold mb-4 theme-text-primary">
                  Register as Dealer
                </h3>
                <p className="text-gray-600">
                  Quick registration with your business details. Get verified in
                  24 hours.
                </p>
              </div>

              <div className="relative bg-gray-50 rounded-2xl p-8 text-center hover:shadow-xl transition transform hover:-translate-y-2">
                <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-xl shadow-md flex items-center justify-center">
                  <Package className="w-16 h-16 theme-primary-light" />
                </div>
                <h3 className="text-2xl font-bold mb-4 theme-text-primary">
                  List Your Products
                </h3>
                <p className="text-gray-600">
                  Add products with images, descriptions, and pricing. Easy
                  dashboard interface.
                </p>
              </div>

              <div className="relative bg-gray-50 rounded-2xl p-8 text-center hover:shadow-xl transition transform hover:-translate-y-2">
                <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-xl shadow-md flex items-center justify-center">
                  <Truck className="w-16 h-16 theme-primary-light" />
                </div>
                <h3 className="text-2xl font-bold mb-4 theme-text-primary">
                  We Deliver for You
                </h3>
                <p className="text-gray-600">
                  Receive orders and relax. We pick up from you and deliver to
                  customers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section id="benefits" className="py-20 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold theme-text-primary mb-4">
                Why Dealers Choose LEAFKAART
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Everything you need to grow your business online
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <TrendingUp className="w-12 h-12" />,
                  title: "Increase Sales",
                  desc: "Reach thousands of online customers",
                },
                {
                  icon: <Truck className="w-12 h-12" />,
                  title: "Zero Logistics Hassle",
                  desc: "We handle all pickup and delivery",
                },
                {
                  icon: <Package className="w-12 h-12" />,
                  title: "Easy Product Management",
                  desc: "Simple dashboard to manage inventory",
                },
                {
                  icon: <Users className="w-12 h-12" />,
                  title: "Growing Customer Base",
                  desc: "Access our expanding network",
                },
                {
                  icon: <CheckCircle className="w-12 h-12" />,
                  title: "Real-time Notifications",
                  desc: "Get instant order alerts",
                },
                {
                  icon: <Star className="w-12 h-12" />,
                  title: "Build Your Brand",
                  desc: "Showcase your products professionally",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 hover:shadow-xl transition"
                >
                  <div className="w-16 h-16 theme-card-icon-bg rounded-xl flex items-center justify-center mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 theme-text-primary">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-10 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="theme-bg-dark rounded-3xl p-12 theme-text-light">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Everything You Need to Succeed
                </h2>
                <p className="text-xl opacity-90">
                  Powerful features designed for dealers
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  "No logistics worries - we handle transport",
                  "Easy product management dashboard",
                  "Get more orders from online customers",
                  "Focus on your business, we handle delivery",
                  "Simple registration process",
                  "Real-time order notifications",
                  "Secure payment processing",
                  "24/7 customer support",
                ].map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 bg-white bg-opacity-10 backdrop-blur rounded-xl p-4"
                  >
                    <CheckCircle className="w-6 h-6 flex-shrink-0" />
                    <p className="text-lg">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-6 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold theme-text-primary mb-2">
              Ready to Grow Your Business?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join hundreds of dealers who are already selling successfully on
              LEAFKAART
            </p>
            <button
              className="theme-btn-primary px-10 py-5 rounded-xl text-xl font-semibold transition shadow-lg inline-flex items-center space-x-3"
              onClick={() => navigate("/register")}
            >
              <span>Register Now - It's Free</span>
              <ArrowRight className="w-6 h-6" />
            </button>
            <p className="text-gray-500 mt-4">
              No credit card required • Get started in minutes
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div onClick={() => navigate("/")} className="cursor-pointer">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-12 h-10 rounded-lg flex items-center justify-center">
                    <Package className="w-10 h-10 theme-primary-lighter" />
                  </div>
                  <h1 className="text-xl font-bold theme-primary-lighter">
                    LEAFKAART
                  </h1>
                </div>
                <p className="text-gray-400">
                  Empowering dealers to grow their business online.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a
                      href="#benefits"
                      className="hover:text-amber-400 transition"
                    >
                      Benefits
                    </a>
                  </li>
                  <li>
                    <a
                      href="#how-it-works"
                      className="hover:text-amber-400 transition"
                    >
                      How It Works
                    </a>
                  </li>
                  <li>
                    <a
                      href="#features"
                      className="hover:text-amber-400 transition"
                    >
                      Features
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">For Dealers</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-amber-400 transition">
                      Register
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-amber-400 transition">
                      Login
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-amber-400 transition">
                      Support
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Contact</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>leafkaart.in@gmail.com</li>
                  <li>1800-LEAFKAART</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
              <p>© 2026 LEAFKAART. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default LandingPage;
