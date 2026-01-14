import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import FormPage from "./pages/FormPage";
import DataPage from "./pages/DataPage";
import { Sparkles, BookOpen } from "lucide-react";
import { MdOutlinePeople } from "react-icons/md";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        {/* Decorative Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        {/* Header with Spiritual Theme */}
        <div className="relative">
          <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-3">
                  <Sparkles className="w-8 h-8 mr-2 animate-pulse" />
                  <h1 className="text-4xl md:text-5xl font-bold tracking-wide">
                    Yogi Vemana Jayanti
                  </h1>
                  <Sparkles className="w-8 h-8 ml-2 animate-pulse" />
                </div>
                <p className="text-sm text-orange-200 mt-2">
                  Celebrating the wisdom of the great Telugu philosopher and
                  poet
                </p>
              </div>

              <nav className="flex justify-center space-x-2">
                <Link
                  to="/"
                  className="px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-full hover:bg-opacity-30 transition-all duration-300 flex items-center text-gray-600 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Registration
                </Link>
                <Link
                  to="/data"
                  className="px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-full hover:bg-opacity-30 transition-all duration-300 flex items-center text-gray-600 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <MdOutlinePeople className="w-5 h-5 mr-2" />
                  Participants
                </Link>
              </nav>
            </div>
          </div>

          {/* Decorative wave */}
          <div className="relative">
            <svg
              className="w-full h-12 text-orange-600"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
        </div>

        <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Routes>
            <Route path="/" element={<FormPage />} />
            <Route path="/data" element={<DataPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="relative mt-20 bg-gradient-to-r from-orange-800 via-amber-800 to-orange-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-orange-200 mb-2">
              "Knowledge is the light that dispels darkness"
            </p>
            <p className="text-sm text-orange-300">
              © 2026 Yogi Vemana Jayanti Celebration
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
