import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Book from "./pages/Book";
import Search from "./pages/Search";
import Hotels from "./pages/Hotels";
import Rooms from "./pages/Rooms";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book" element={<Book />} />
            <Route path="/search" element={<Search />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/rooms" element={<Rooms />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
