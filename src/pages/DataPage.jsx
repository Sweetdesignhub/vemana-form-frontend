import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Download,
  RefreshCw,
  AlertCircle,
  Users,
  Mail,
  Eye,
  CheckCircle,
  X,
  MapPin,
} from "lucide-react";

function DataPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState({});
  const [actionStatus, setActionStatus] = useState({});
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState({
    name: "",
    message: "",
  });
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const API_BASE_URL = "http://localhost:5000";

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_BASE_URL}/api/data`);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch participant data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const exportToExcel = () => {
    if (data.length === 0) {
      alert("No participant data to export");
      return;
    }

    const exportData = data.map((item) => ({
      Name: item.name,
      Email: item.email,
      Phone: item.phone,
      Message: item.message,
      City: item.city || "N/A",
      State: item.state || "N/A",
      Country: item.country || "N/A",
      "Full Address": item.full_address || "N/A",
      Latitude: item.latitude || "N/A",
      Longitude: item.longitude || "N/A",
      "Certificate Sent": item.certificate_sent ? "Yes" : "No",
      "Certificate Sent Date": item.certificate_sent_at
        ? new Date(item.certificate_sent_at).toLocaleString()
        : "N/A",
      "Registration Date": new Date(item.created_at).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");

    const colWidths = [
      { wch: 20 }, // Name
      { wch: 30 }, // Email
      { wch: 15 }, // Phone
      { wch: 40 }, // Message
      { wch: 20 }, // City
      { wch: 20 }, // State
      { wch: 20 }, // Country
      { wch: 50 }, // Full Address
      { wch: 15 }, // Latitude
      { wch: 15 }, // Longitude
      { wch: 15 }, // Certificate Sent
      { wch: 20 }, // Certificate Sent Date
      { wch: 20 }, // Registration Date
    ];
    worksheet["!cols"] = colWidths;

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const timestamp = new Date().toISOString().split("T")[0];
    saveAs(blob, `yogi_vemana_jayanti_participants_${timestamp}.xlsx`);
  };

  const handleDownloadCertificate = async (participant) => {
    setActionLoading({
      ...actionLoading,
      [`download-${participant.id}`]: true,
    });
    setActionStatus({ ...actionStatus, [`download-${participant.id}`]: "" });

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/download-certificate/${participant.id}`,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const fileName = `YogiVemanaJayanti_Certificate_${participant.name.replace(
        /\s+/g,
        "_"
      )}.pdf`;
      saveAs(blob, fileName);

      setActionStatus({
        ...actionStatus,
        [`download-${participant.id}`]: {
          type: "success",
          message: "Certificate downloaded!",
        },
      });
    } catch (error) {
      console.error("Error downloading certificate:", error);
      setActionStatus({
        ...actionStatus,
        [`download-${participant.id}`]: {
          type: "error",
          message:
            error.response?.data?.error || "Failed to download certificate",
        },
      });
    } finally {
      setActionLoading({
        ...actionLoading,
        [`download-${participant.id}`]: false,
      });
      setTimeout(() => {
        setActionStatus({
          ...actionStatus,
          [`download-${participant.id}`]: "",
        });
      }, 3000);
    }
  };

  const handleSendCertificate = async (participant) => {
    if (!participant.email || participant.email.trim() === "") {
      setSelectedParticipant(null);
      setShowEmailModal(false);
      alert("This participant has no email address on record.");
      return;
    }

    setSelectedParticipant(participant);
    setShowEmailModal(true);

    setActionLoading({ ...actionLoading, [`email-${participant.id}`]: true });
    setActionStatus({ ...actionStatus, [`email-${participant.id}`]: "" });

    try {
      await axios.post(
        `${API_BASE_URL}/api/send-certificate/${participant.id}`
      );

      setActionStatus({
        ...actionStatus,
        [`email-${participant.id}`]: {
          type: "success",
          message: `Certificate sent to ${participant.email}!`,
        },
      });

      await fetchData();
    } catch (error) {
      console.error("Error sending certificate:", error);
      setActionStatus({
        ...actionStatus,
        [`email-${participant.id}`]: {
          type: "error",
          message: error.response?.data?.error || "Failed to send certificate",
        },
      });
    } finally {
      setActionLoading({
        ...actionLoading,
        [`email-${participant.id}`]: false,
      });
      setTimeout(() => {
        setActionStatus({ ...actionStatus, [`email-${participant.id}`]: "" });
      }, 5000);
    }
  };

  const handleViewMessage = (name, message) => {
    setSelectedMessage({ name, message });
    setShowMessageModal(true);
  };

  const handleViewLocation = (participant) => {
    setSelectedLocation(participant);
    setShowLocationModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      {/* Message Modal */}
      {showMessageModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
          onClick={() => setShowMessageModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                Message from {selectedMessage.name}
              </h3>
              <button
                onClick={() => setShowMessageModal(false)}
                className="text-white hover:bg-orange-700 hover:bg-opacity-50 cursor-pointer rounded-full p-2 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {selectedMessage.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Email Confirmation Modal */}
      {showEmailModal && selectedParticipant && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)",
          }}
          onClick={() => setShowEmailModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Send Certificate</h3>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-white hover:bg-purple-700 hover:bg-opacity-50 cursor-pointer rounded-full p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Do you want to send the certificate to{" "}
                <span className="font-semibold">
                  {selectedParticipant.email}
                </span>
                ?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleSendCertificate(selectedParticipant);
                    setShowEmailModal(false);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spiritual Quote */}
      <div className="mb-8 bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl p-6 shadow-lg border-2 border-orange-200">
        <div className="flex items-start">
          <div>
            <p className="text-sm text-gray-600">
              "For those who have acquired knowledge, the world is bright as
              day"
            </p>
          </div>
        </div>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 mb-8 border-t-4 border-orange-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-200 to-transparent rounded-bl-full opacity-30"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full mr-4 shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Registered Participants
              </h1>
              <p className="text-gray-600 mt-1">
                Souls gathered for spiritual enlightenment
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="bg-gradient-to-r from-gray-600 to-gray-700 text-white cursor-pointer px-5 py-3 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 flex items-center justify-center disabled:from-gray-400 disabled:to-gray-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
            >
              <RefreshCw
                className={`w-5 h-5 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            <button
              onClick={exportToExcel}
              disabled={data.length === 0}
              className="bg-gradient-to-r from-green-600 to-emerald-700 text-white cursor-pointer px-5 py-3 cursor-pointer rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-300 flex items-center justify-center disabled:from-gray-400 disabled:to-gray-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
            >
              <Download className="w-5 h-5 mr-2" />
              Export to Excel
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-gradient-to-r from-red-50 to-rose-50 text-red-800 p-5 rounded-xl flex items-start mb-6 shadow-md border-l-4 border-red-500">
          <AlertCircle className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-3xl shadow-2xl p-16 text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600 mb-4"></div>
          <p className="text-xl text-gray-600 font-medium">
            Loading participant data...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Please wait while we gather the information
          </p>
        </div>
      ) : data.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-2xl p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50 opacity-50"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-200 to-amber-300 rounded-full mb-6">
              <Users className="w-10 h-10 text-orange-700" />
            </div>
            <p className="text-gray-600 text-xl font-medium mb-2">
              No participants registered yet
            </p>
            <p className="text-gray-500">
              Be the first to register for this spiritual gathering!
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-t-4 border-orange-500">
          {/* Stats Bar */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b-2 border-orange-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <p className="text-sm font-semibold text-gray-700">
                  Total Registered Participants:{" "}
                  <span className="text-orange-600 text-lg ml-1">
                    {data.length}
                  </span>
                </p>
              </div>
              <p className="text-xs text-gray-600 hidden sm:block">
                Last updated: {new Date().toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-orange-200">
              <thead className="bg-gradient-to-r from-orange-600 to-amber-600">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Registration Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Certificate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-orange-100">
                {data.map((row, index) => (
                  <tr
                    key={row.id}
                    className="hover:bg-orange-50 transition-colors duration-200"
                    style={{
                      backgroundColor:
                        index % 2 === 0 ? "white" : "rgba(255, 247, 237, 0.3)",
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.email || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.phone || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {row.city || row.latitude ? (
                        <button
                          onClick={() => handleViewLocation(row)}
                          className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors duration-200 text-xs font-medium"
                        >
                          <MapPin className="w-3 h-3 mr-1.5" />
                          View
                        </button>
                      ) : (
                        <span className="text-gray-400">No location</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <button
                        onClick={() => handleViewMessage(row.name, row.message)}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors duration-200 text-xs font-medium"
                      >
                        <Eye className="w-3 h-3 mr-1.5" />
                        View
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(row.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex flex-col gap-2">
                        {/* Download Certificate Button */}
                        <button
                          onClick={() => handleDownloadCertificate(row)}
                          disabled={actionLoading[`download-${row.id}`]}
                          className="inline-flex items-center justify-center px-3 py-1.5 bg-green-600 text-white cursor-pointer rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:bg-gray-400 text-xs font-medium"
                        >
                          {actionLoading[`download-${row.id}`] ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent mr-1.5"></div>
                          ) : (
                            <Download className="w-3 h-3 mr-1.5" />
                          )}
                          Download
                        </button>

                        {/* Send Email Button */}
                        <button
                          onClick={() => handleSendCertificate(row)}
                          disabled={
                            !row.email ||
                            row.email.trim() === "" ||
                            actionLoading[`email-${row.id}`]
                          }
                          className={`inline-flex items-center justify-center px-3 py-1.5 cursor-pointer rounded-lg transition-colors duration-200 text-xs font-medium ${
                            row.certificate_sent
                              ? "bg-orange-600 hover:bg-orange-700 text-white"
                              : "bg-purple-600 hover:bg-purple-700 text-white"
                          } disabled:bg-gray-400`}
                        >
                          {actionLoading[`email-${row.id}`] ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent mr-1.5"></div>
                          ) : row.certificate_sent ? (
                            <CheckCircle className="w-3 h-3 mr-1.5" />
                          ) : (
                            <Mail className="w-3 h-3 mr-1.5" />
                          )}
                          {row.certificate_sent ? "Resend" : "Send"}
                        </button>

                        {/* Status Messages */}
                        {actionStatus[`download-${row.id}`] && (
                          <div
                            className={`text-xs ${
                              actionStatus[`download-${row.id}`].type ===
                              "success"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {actionStatus[`download-${row.id}`].message}
                          </div>
                        )}
                        {actionStatus[`email-${row.id}`] && (
                          <div
                            className={`text-xs ${
                              actionStatus[`email-${row.id}`].type === "success"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {actionStatus[`email-${row.id}`].message}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Location Modal */}
      {showLocationModal && selectedLocation && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
          onClick={() => setShowLocationModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className="w-6 h-6 mr-3 text-white" />
                <h3 className="text-xl font-bold text-white">
                  Location Details
                </h3>
              </div>
              <button
                onClick={() => setShowLocationModal(false)}
                className="text-white hover:bg-indigo-700 hover:bg-opacity-50 cursor-pointer rounded-full p-2 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="px-6 py-6 overflow-y-auto max-h-[calc(85vh-140px)] space-y-5">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border-l-4 border-indigo-500">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Participant Name
                </p>
                <p className="text-gray-800 font-medium text-lg">
                  {selectedLocation.name}
                </p>
              </div>

              {selectedLocation.city && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                      City
                    </p>
                    <p className="text-gray-800 font-medium">
                      {selectedLocation.city}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                      State
                    </p>
                    <p className="text-gray-800 font-medium">
                      {selectedLocation.state || "N/A"}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                      Country
                    </p>
                    <p className="text-gray-800 font-medium">
                      {selectedLocation.country || "N/A"}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                      Country Code
                    </p>
                    <p className="text-gray-800 font-medium uppercase">
                      {selectedLocation.country_code || "N/A"}
                    </p>
                  </div>
                </div>
              )}

              {selectedLocation.full_address && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                    Full Address
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedLocation.full_address}
                  </p>
                </div>
              )}

              {selectedLocation.latitude && selectedLocation.longitude && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                    GPS Coordinates
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <p className="text-xs text-gray-500 mb-1">Latitude</p>
                      <p className="text-gray-800 font-mono text-sm font-medium">
                        {selectedLocation.latitude}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <p className="text-xs text-gray-500 mb-1">Longitude</p>
                      <p className="text-gray-800 font-mono text-sm font-medium">
                        {selectedLocation.longitude}
                      </p>
                    </div>
                  </div>
                  {selectedLocation.location_accuracy && (
                    <div className="bg-white rounded-lg p-3 shadow-sm mb-3">
                      <p className="text-xs text-gray-500 mb-1">Accuracy</p>
                      <p className="text-gray-800 font-medium">
                        ±{Math.round(selectedLocation.location_accuracy)} meters
                      </p>
                    </div>
                  )}
                  <a
                    href={`https://www.google.com/maps?q=${selectedLocation.latitude},${selectedLocation.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Open in Google Maps
                  </a>
                </div>
              )}

              {selectedLocation.location_timestamp && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                    Location Captured At
                  </p>
                  <p className="text-gray-800 font-medium">
                    {new Date(
                      selectedLocation.location_timestamp
                    ).toLocaleString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Quote */}
      {data.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 italic">
            "Together we walk the path of enlightenment - {data.length} seekers
            united"
          </p>
        </div>
      )}
    </div>
  );
}

export default DataPage;
