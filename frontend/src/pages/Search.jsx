import { useState } from "react";
import api from "../utils/api";
import {
  Search as SearchIcon,
  Calendar,
  Mail,
  Phone,
  AlertCircle,
} from "lucide-react";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setSearched(false);

    try {
      const response = await api.get(
        `/reservations/search?query=${encodeURIComponent(query)}`
      );
      setResults(response.data.reservations);
      setSearched(true);
    } catch (error) {
      setError(
        error.response?.data?.error || "An error occurred while searching"
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "daily":
        return "bg-blue-100 text-blue-800";
      case "weekly":
        return "bg-green-100 text-green-800";
      case "monthly":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Search Reservations
          </h1>
          <p className="text-lg text-gray-600">
            Find reservations by email, phone, reservation ID, or date
          </p>
        </div>

        {/* Search Form */}
        <div className="card p-6 mb-8">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter email, phone, reservation ID, or date (YYYY-MM-DD)"
                  className="input-field pl-10"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className={`btn-primary px-8 ${
                loading || !query.trim() ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>

          <div className="mt-4 text-sm text-gray-600">
            <p className="font-medium mb-1">Search examples:</p>
            <ul className="space-y-1">
              <li>• Email: user@example.com</li>
              <li>• Phone: +1 555 123 4567</li>
              <li>• Reservation ID: 123e4567-e89b-12d3-a456-426614174000</li>
              <li>• Date: 2024-03-15</li>
            </ul>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center p-4 mb-6 bg-red-50 text-red-700 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Search Results */}
        {searched && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Search Results
              </h2>
              <span className="text-sm text-gray-600">
                {results.length} result{results.length !== 1 ? "s" : ""} found
              </span>
            </div>

            {results.length === 0 ? (
              <div className="card p-8 text-center">
                <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No reservations found
                </h3>
                <p className="text-gray-600">
                  Try searching with a different email, phone number,
                  reservation ID, or date.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((reservation) => (
                  <div key={reservation.id} className="card p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="space-y-3">
                        {/* Reservation ID */}
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Reservation ID
                          </span>
                          <p className="text-sm font-mono text-gray-900 break-all">
                            {reservation.id}
                          </p>
                        </div>

                        {/* Contact Info */}
                        <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-600">
                              {reservation.user.email}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-600">
                              {reservation.user.phone}
                            </span>
                          </div>
                        </div>

                        {/* Dates */}
                        <div className="flex items-center space-x-4">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {formatDate(reservation.check_in)} -{" "}
                            {formatDate(reservation.check_out)}
                          </span>
                        </div>

                        {/* Created Date */}
                        <div className="text-xs text-gray-500">
                          Booked on {formatDate(reservation.created_at)}
                        </div>
                      </div>

                      <div className="mt-4 lg:mt-0 lg:ml-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(
                            reservation.type
                          )}`}
                        >
                          {reservation.type.charAt(0).toUpperCase() +
                            reservation.type.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
