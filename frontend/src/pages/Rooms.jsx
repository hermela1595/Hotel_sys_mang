import { useState, useEffect } from "react";
import api from "../utils/api";
import {
  Bed,
  Users,
  DollarSign,
  Wifi,
  Plus,
  Edit3,
  Trash2,
  Search,
  Building2,
  Filter,
} from "lucide-react";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState("");

  const [formData, setFormData] = useState({
    hotel_id: "",
    room_number: "",
    room_type: "",
    price_per_night: "",
    capacity: "",
    amenities: "",
    description: "",
    is_available: true,
  });

  const [searchCriteria, setSearchCriteria] = useState({
    check_in: "",
    check_out: "",
    capacity: "",
    city: "",
  });

  useEffect(() => {
    fetchRooms();
    fetchHotels();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await api.get("/rooms");
      setRooms(response.data.rooms);
    } catch (error) {
      setError("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  const fetchHotels = async () => {
    try {
      const response = await api.get("/hotels");
      setHotels(response.data.hotels);
    } catch (error) {
      console.error("Failed to fetch hotels");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const roomData = {
        ...formData,
        price_per_night: parseFloat(formData.price_per_night),
        capacity: parseInt(formData.capacity),
        hotel_id: parseInt(formData.hotel_id),
      };

      if (editingRoom) {
        await api.put(`/rooms/${editingRoom.id}`, roomData);
      } else {
        await api.post("/rooms", roomData);
      }

      resetForm();
      fetchRooms();
    } catch (error) {
      setError(error.response?.data?.error || "Failed to save room");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      hotel_id: room.hotel_id.toString(),
      room_number: room.room_number,
      room_type: room.room_type,
      price_per_night: room.price_per_night.toString(),
      capacity: room.capacity.toString(),
      amenities: room.amenities || "",
      description: room.description || "",
      is_available: room.is_available,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      await api.delete(`/rooms/${id}`);
      fetchRooms();
    } catch (error) {
      setError("Failed to delete room");
    }
  };

  const handleSearchAvailable = async (e) => {
    e.preventDefault();

    if (!searchCriteria.check_in || !searchCriteria.check_out) {
      setError("Please enter check-in and check-out dates");
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(searchCriteria).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await api.get(`/rooms/search?${params}`);
      setRooms(response.data.rooms);
    } catch (error) {
      setError("Failed to search available rooms");
    } finally {
      setLoading(false);
    }
  };

  const filterRoomsByHotel = async (hotelId) => {
    if (!hotelId) {
      fetchRooms();
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/rooms/hotel/${hotelId}`);
      setRooms(response.data.rooms);
    } catch (error) {
      setError("Failed to filter rooms");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      hotel_id: "",
      room_number: "",
      room_type: "",
      price_per_night: "",
      capacity: "",
      amenities: "",
      description: "",
      is_available: true,
    });
    setEditingRoom(null);
    setShowForm(false);
  };

  const roomTypes = [
    "Standard",
    "Deluxe",
    "Suite",
    "Executive",
    "Family",
    "Ocean View",
    "Mountain View",
    "Beach Front",
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Room Management
          </h1>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {/* Available Room Search */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">
                Search Available Rooms
              </h3>
              <form
                onSubmit={handleSearchAvailable}
                className="grid grid-cols-1 md:grid-cols-5 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    value={searchCriteria.check_in}
                    onChange={(e) =>
                      setSearchCriteria({
                        ...searchCriteria,
                        check_in: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    value={searchCriteria.check_out}
                    onChange={(e) =>
                      setSearchCriteria({
                        ...searchCriteria,
                        check_out: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={searchCriteria.capacity}
                    onChange={(e) =>
                      setSearchCriteria({
                        ...searchCriteria,
                        capacity: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={searchCriteria.city}
                    onChange={(e) =>
                      setSearchCriteria({
                        ...searchCriteria,
                        city: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Any city"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2"
                  >
                    <Search className="h-4 w-4" />
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* Hotel Filter and Add Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Hotel
                </label>
                <select
                  value={selectedHotel}
                  onChange={(e) => {
                    setSelectedHotel(e.target.value);
                    filterRoomsByHotel(e.target.value);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Hotels</option>
                  {hotels.map((hotel) => (
                    <option key={hotel.id} value={hotel.id}>
                      {hotel.name} - {hotel.city}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Add Room
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Room Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingRoom ? "Edit Room" : "Add New Room"}
            </h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hotel *
                </label>
                <select
                  required
                  value={formData.hotel_id}
                  onChange={(e) =>
                    setFormData({ ...formData, hotel_id: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select a hotel</option>
                  {hotels.map((hotel) => (
                    <option key={hotel.id} value={hotel.id}>
                      {hotel.name} - {hotel.city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.room_number}
                  onChange={(e) =>
                    setFormData({ ...formData, room_number: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., 101, 2A, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Type *
                </label>
                <select
                  required
                  value={formData.room_type}
                  onChange={(e) =>
                    setFormData({ ...formData, room_type: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select room type</option>
                  {roomTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per Night ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.price_per_night}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price_per_night: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity (Guests) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_available"
                  checked={formData.is_available}
                  onChange={(e) =>
                    setFormData({ ...formData, is_available: e.target.checked })
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="is_available"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Room is available for booking
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amenities
                </label>
                <input
                  type="text"
                  value={formData.amenities}
                  onChange={(e) =>
                    setFormData({ ...formData, amenities: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., WiFi, TV, AC, Mini Bar, Balcony"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Brief description of the room..."
                />
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium"
                >
                  {loading
                    ? "Saving..."
                    : editingRoom
                    ? "Update Room"
                    : "Add Room"}
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

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && rooms.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading rooms...</p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <Bed className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No rooms found</p>
            </div>
          ) : (
            rooms.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Room {room.room_number}
                      </h3>
                      <p className="text-sm text-gray-600">{room.hotel_name}</p>
                      <p className="text-xs text-gray-500">
                        {room.city}, {room.country}
                      </p>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        room.is_available
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {room.is_available ? "Available" : "Occupied"}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Bed className="h-4 w-4" />
                      <span className="text-sm">{room.room_type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">
                        Capacity: {room.capacity} guests
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        ${room.price_per_night}/night
                      </span>
                    </div>
                  </div>

                  {room.amenities && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Amenities:</p>
                      <p className="text-sm text-gray-600">{room.amenities}</p>
                    </div>
                  )}

                  {room.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {room.description}
                    </p>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">ID: {room.id}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(room)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(room.id)}
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

export default Rooms;
