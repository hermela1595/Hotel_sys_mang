import { useState, useEffect } from "react";
import api from "../utils/api";
import { 
  Building2, 
  MapPin, 
  Star, 
  Phone, 
  Mail, 
  Plus,
  Edit3,
  Trash2,
  Search
} from "lucide-react";

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    country: "",
    phone: "",
    email: "",
    stars: 3,
    description: ""
  });

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const response = await api.get("/hotels");
      setHotels(response.data.hotels);
    } catch (error) {
      setError("Failed to fetch hotels");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (editingHotel) {
        await api.put(`/hotels/${editingHotel.id}`, formData);
      } else {
        await api.post("/hotels", formData);
      }
      
      resetForm();
      fetchHotels();
    } catch (error) {
      setError(error.response?.data?.error || "Failed to save hotel");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (hotel) => {
    setEditingHotel(hotel);
    setFormData({
      name: hotel.name,
      address: hotel.address,
      city: hotel.city,
      country: hotel.country,
      phone: hotel.phone,
      email: hotel.email,
      stars: hotel.stars,
      description: hotel.description || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hotel?")) return;

    try {
      await api.delete(`/hotels/${id}`);
      fetchHotels();
    } catch (error) {
      setError("Failed to delete hotel");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchHotels();
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/hotels/search?query=${encodeURIComponent(searchQuery)}`);
      setHotels(response.data.hotels);
    } catch (error) {
      setError("Failed to search hotels");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      city: "",
      country: "",
      phone: "",
      email: "",
      stars: 3,
      description: ""
    });
    setEditingHotel(null);
    setShowForm(false);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Hotel Management</h1>
          
          {/* Search and Add Button */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search hotels by name, city, or country..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </form>
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Hotel
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Hotel Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingHotel ? "Edit Hotel" : "Add New Hotel"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hotel Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Star Rating
                </label>
                <select
                  value={formData.stars}
                  onChange={(e) => setFormData({ ...formData, stars: parseInt(e.target.value) })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Brief description of the hotel..."
                />
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium"
                >
                  {loading ? "Saving..." : editingHotel ? "Update Hotel" : "Add Hotel"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && hotels.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading hotels...</p>
            </div>
          ) : hotels.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hotels found</p>
            </div>
          ) : (
            hotels.map((hotel) => (
              <div key={hotel.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{hotel.name}</h3>
                    <div className="flex items-center gap-1">
                      {renderStars(hotel.stars)}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{hotel.city}, {hotel.country}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{hotel.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{hotel.email}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {hotel.description || "No description available"}
                  </p>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      ID: {hotel.id}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(hotel)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(hotel.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Hotels;
