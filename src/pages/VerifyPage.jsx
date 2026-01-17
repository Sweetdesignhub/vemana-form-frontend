import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";

function VerifyPage() {
  const { id } = useParams();
  const [verificationStatus, setVerificationStatus] = useState("loading");
  const [participant, setParticipant] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    verifycertificate();
  }, [id]);

  const verifyCertificate = async () => {
    try {
      const response = await axios.get(
        // `http://localhost:5000/api/verify/${id}`
        `https://vemana-form-backend-gqdxbfeugnckexbm.eastasia-01.azurewebsites.net/api/verify/${id}`
      );

      if (response.data.valid) {
        setVerificationStatus("valid");
        setParticipant(response.data.participant);
      } else {
        setVerificationStatus("invalid");
        setError(response.data.error || "Certificate not found");
      }
    } catch (err) {
      setVerificationStatus("invalid");
      setError(err.response?.data?.error || "Failed to verify certificate");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (verificationStatus === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md w-full">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600 mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Verifying Certificate
          </h2>
          <p className="text-gray-600">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Link
          to="/data"
          className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Participants
        </Link>

        {verificationStatus === "valid" ? (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-t-4 border-green-500">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Certificate Verified ✓
              </h1>
              <p className="text-green-100 text-lg">
                This is an authentic certificate
              </p>
            </div>

            {/* Certificate Details */}
            <div className="p-8 md:p-12">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-1 h-8 bg-orange-500 mr-3"></span>
                  Certificate Details
                </h2>
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border-2 border-orange-200">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full mr-4 flex-shrink-0">
                        <User className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">
                          Participant Name
                        </p>
                        <p className="text-xl font-bold text-gray-900">
                          {participant.name}
                        </p>
                      </div>
                    </div>

                    {participant.email && (
                      <div className="flex items-start">
                        <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full mr-4 flex-shrink-0">
                          <Mail className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 mb-1">
                            Email Address
                          </p>
                          <p className="text-lg font-medium text-gray-900">
                            {participant.email}
                          </p>
                        </div>
                      </div>
                    )}

                    {participant.phone && (
                      <div className="flex items-start">
                        <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full mr-4 flex-shrink-0">
                          <Phone className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 mb-1">
                            Phone Number
                          </p>
                          <p className="text-lg font-medium text-gray-900">
                            {participant.phone}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start">
                      <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full mr-4 flex-shrink-0">
                        <Calendar className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">Issue Date</p>
                        <p className="text-lg font-medium text-gray-900">
                          {formatDate(participant.issueDate)}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t-2 border-orange-200">
                      <p className="text-sm text-gray-600 mb-1">
                        Certificate ID
                      </p>
                      <p className="text-xl font-bold text-orange-600">
                        YVJ-{participant.id}-2026
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Info */}
              <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl p-6 border-2 border-orange-200">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Event Information
                </h3>
                <p className="text-gray-700 mb-2">
                  <strong>Event:</strong> Yogi Vemana Jayanti Celebration
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>Year:</strong> 2026
                </p>
                <div className="border-l-4 border-orange-500 pl-4 italic text-gray-600">
                  "Knowledge is the supreme wealth among all treasures"
                  <br />
                  <span className="text-sm font-semibold text-orange-700">
                    - Yogi Vemana
                  </span>
                </div>
              </div>

              {/* Verification Badge */}
              <div className="mt-8 text-center">
                <div className="inline-flex items-center bg-green-50 border-2 border-green-200 rounded-full px-6 py-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-semibold">
                    Verified on {new Date().toLocaleDateString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-t-4 border-red-500">
            {/* Error Header */}
            <div className="bg-gradient-to-r from-red-600 to-rose-700 p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Certificate Not Found
              </h1>
              <p className="text-red-100 text-lg">
                This certificate could not be verified
              </p>
            </div>

            {/* Error Details */}
            <div className="p-8 md:p-12">
              <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl p-6 border-2 border-red-200 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-red-800 mb-2">
                      Verification Failed
                    </h3>
                    <p className="text-red-700">
                      {error ||
                        "The certificate ID provided is invalid or does not exist in our records."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Please check the certificate ID and try again.
                </p>
                <p className="text-sm text-gray-500">
                  Certificate ID attempted: <strong>YVJ-{id}-2026</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 italic">
            For any queries, please contact the organizing committee
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyPage;
