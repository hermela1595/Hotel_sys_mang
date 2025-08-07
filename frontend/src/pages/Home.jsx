import { Link } from "react-router-dom";
import { Calendar, Search, Star, CheckCircle } from "lucide-react";


const Home = () => {
  const features = [
    {
      icon: Calendar,
      title: "Easy Booking",
      description:
        "Simple and fast reservation process with flexible date selection.",
    },
    {
      icon: Search,
      title: "Quick Search",
      description:
        "Find your reservations instantly with our powerful search feature.",
    },
    {
      icon: Star,
      title: "Premium Service",
      description:
        "Experience exceptional hospitality and world-class amenities.",
    },
    {
      icon: CheckCircle,
      title: "Instant Confirmation",
      description: "Receive immediate booking confirmations via email and SMS.",
    },
  ];

  return (
    <div className="min-h-screen bbg">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Perfect Stay
              <span className="block text-primary-200">Awaits</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Discover exceptional hotels and create unforgettable memories.
              Book with confidence and enjoy premium hospitality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/book"
                className="bg-white text-primary-600 hover:bg-primary-50 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
              >
                Book Now
              </Link>
              <Link
                to="/search"
                className="border border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
              >
                Search Reservations
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose MK Hotel?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide a seamless booking experience with cutting-edge
              technology and personalized service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                10K+
              </div>
              <div className="text-gray-600 font-medium">Happy Guests</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                500+
              </div>
              <div className="text-gray-600 font-medium">Partner Hotels</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                50+
              </div>
              <div className="text-gray-600 font-medium">Cities</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                24/7
              </div>
              <div className="text-gray-600 font-medium">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us for their travel
            accommodations.
          </p>
          <Link
            to="/book"
            className="bg-white text-primary-600 hover:bg-primary-50 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 text-lg inline-block"
          >
            Book Your Stay Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
