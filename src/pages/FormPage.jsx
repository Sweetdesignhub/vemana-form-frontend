import { useState } from "react";
import axios from "axios";
import {
  Send,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  MessageSquare,
} from "lucide-react";
import { MdEvent } from "react-icons/md";
import { useLocation } from "../context/LocationContext";

function FormPage() {
  const { location } = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Allow only digits and max 10 numbers
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, phone: numericValue });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    const hasEmail = formData.email.trim() !== "";
    const hasPhone = formData.phone.trim() !== "";

    // ❌ If neither email nor phone is provided
    if (!hasEmail && !hasPhone) {
      setStatus({
        type: "error",
        message: "Please provide either an email address or a phone number.",
      });
      return;
    }

    // ❌ If email is provided but invalid
    if (hasEmail && !emailRegex.test(formData.email)) {
      setStatus({
        type: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    // ❌ If phone is provided but invalid
    if (hasPhone && !phoneRegex.test(formData.phone)) {
      setStatus({
        type: "error",
        message: "Please enter a valid 10-digit phone number.",
      });
      return;
    }

    setLoading(true);

    try {
      // Prepare submission data with location
      const submissionData = {
        ...formData,
        location: location
          ? {
              latitude: location.latitude,
              longitude: location.longitude,
              accuracy: location.accuracy,
              city: location.city,
              state: location.state,
              country: location.country,
              countryCode: location.countryCode,
              fullAddress: location.fullAddress,
              timestamp: location.timestamp,
            }
          : null,
      };

      // await axios.post("https://vemana-form-backend-gqdxbfeugnckexbm.eastasia-01.azurewebsites.net/api/submit", submissionData);
      await axios.post(
        "https://vemana-form-backend-gqdxbfeugnckexbm.eastasia-01.azurewebsites.net/api/submit",
        submissionData
      );

      setStatus({
        type: "success",
        message:
          "Your registration has been received! May wisdom guide your path. 🙏",
      });

      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.response?.data?.error ||
          "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Spiritual Quote Card */}
      <div className="mb-8 bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl p-6 shadow-lg border-2 border-orange-200">
        <div className="flex items-start">
          <div>
            <p className="text-sm text-gray-600">
              "Knowledge is the supreme wealth among all treasures"
            </p>
            <p className="text-xs text-orange-700 mt-2 font-semibold">
              - Yogi Vemana
            </p>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-t-4 border-orange-500 relative overflow-hidden">
        {/* Decorative corner elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200 to-transparent rounded-bl-full opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-200 to-transparent rounded-tr-full opacity-50"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full mb-4 shadow-lg">
              <MdEvent className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-amber-800 mb-2">
              Event Registration
            </h2>
            <p className="text-gray-600">
              Join us in celebrating the legacy of Yogi Vemana
            </p>
          </div>

          {status.message && (
            <div
              className={`mb-6 p-5 rounded-xl flex items-start shadow-md ${
                status.type === "success"
                  ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-l-4 border-green-500"
                  : "bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-l-4 border-red-500"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" />
              )}
              <span className="font-medium">{status.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
              >
                <User className="w-4 h-4 mr-2 text-orange-600" />
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-gray-50 focus:bg-white group-hover:border-orange-300"
                placeholder="Enter your full name"
              />
            </div>

            <div className="group">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
              >
                <Mail className="w-4 h-4 mr-2 text-orange-600" />
                Email Address{" "}
                {formData.phone.trim() === "" && (
                  <span className="text-red-600 ml-1">*</span>
                )}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-gray-50 focus:bg-white group-hover:border-orange-300"
                placeholder="your.email@example.com"
              />
            </div>

            <div className="group">
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
              >
                <Phone className="w-4 h-4 mr-2 text-orange-600" />
                Phone Number{" "}
                {formData.email.trim() === "" && (
                  <span className="text-red-600 ml-1">*</span>
                )}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                inputMode="numeric"
                pattern="\d{10}"
                maxLength={10}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-gray-50 focus:bg-white group-hover:border-orange-300"
                placeholder="Enter 10-digit phone number"
              />
            </div>

            <div className="group">
              <label
                htmlFor="message"
                className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
              >
                <MessageSquare className="w-4 h-4 mr-2 text-orange-600" />
                Message / Expectations from the Event
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-gray-50 focus:bg-white group-hover:border-orange-300 resize-none"
                placeholder="Share your thoughts or what you hope to gain from this spiritual gathering... (Optional)"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 cursor-pointer text-white py-4 px-6 rounded-xl hover:from-orange-700 hover:via-amber-700 hover:to-orange-800 transition-all duration-300 flex items-center justify-center disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold text-lg"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  <span>Registering...</span>
                </div>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Complete Registration
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 italic">
              "May this spiritual journey enlighten your path"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormPage;
